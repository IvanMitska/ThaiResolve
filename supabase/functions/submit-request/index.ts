// Supabase Edge Function for handling form submissions
// Deploy with: supabase functions deploy submit-request

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID') || '';

const serviceLabels: Record<string, string> = {
  fraud: 'Мошенничество',
  rental: 'Арендные споры',
  accident: 'ДТП и страховые',
  police: 'Проблемы с полицией',
  medical: 'Медицинские споры',
  business: 'Бизнес-конфликты',
};

const fieldLabels: Record<string, string> = {
  fraud_type: 'Тип',
  amount: 'Сумма',
  currency: 'Валюта',
  has_evidence: 'Есть доказательства',
  property_type: 'Тип объекта',
  deposit_amount: 'Сумма депозита',
  has_contract: 'Есть договор',
  accident_date: 'Дата ДТП',
  has_police_report: 'Есть протокол',
  has_insurance: 'Есть страховка',
  insurance_company: 'Страховая',
  situation_type: 'Тип ситуации',
  event_date: 'Дата события',
  has_protocol: 'Есть протокол',
  clinic_name: 'Клиника',
  dispute_amount: 'Сумма спора',
  has_documents: 'Есть документы',
  business_sphere: 'Сфера бизнеса',
};

// Rate limiting map (in-memory, resets on function cold start)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

function formatTelegramMessage(data: any): string {
  const serviceLabel = serviceLabels[data.service_type] || data.service_type;
  const messengerLabel = data.messenger_type.charAt(0).toUpperCase() + data.messenger_type.slice(1);

  let message = `🆘 *Новая заявка*\n\n`;
  message += `📋 *Тип:* ${serviceLabel}\n`;
  message += `👤 *Имя:* ${escapeMarkdown(data.name)}\n`;
  message += `💬 *${messengerLabel}:* ${escapeMarkdown(data.messenger_contact)}\n`;
  message += `📍 *Город:* ${data.city}\n\n`;
  message += `📝 *Описание:*\n${escapeMarkdown(data.description)}\n`;

  if (data.extra_fields && Object.keys(data.extra_fields).length > 0) {
    message += `\n📎 *Детали:*\n`;
    for (const [key, value] of Object.entries(data.extra_fields)) {
      if (value !== undefined && value !== null && value !== '') {
        const formattedKey = fieldLabels[key] || key;
        const formattedValue = typeof value === 'boolean'
          ? (value ? 'Да' : 'Нет')
          : String(value);
        message += `• ${formattedKey}: ${escapeMarkdown(formattedValue)}\n`;
      }
    }
  }

  const now = new Date();
  const timeStr = now.toLocaleString('ru-RU', {
    timeZone: 'Asia/Bangkok',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  message += `\n🕔 ${timeStr} (ICT)`;
  message += `\n🌐 Язык: ${data.lang === 'ru' ? 'Русский' : 'English'}`;

  return message;
}

async function sendTelegramMessage(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram credentials not configured');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Telegram API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Telegram send error:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ success: false, error: 'rate_limit_exceeded' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const data = await req.json();

    // Basic validation
    if (!data.name || !data.service_type || !data.messenger_type || !data.messenger_contact || !data.city || !data.description) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert into database
    const { data: request, error: dbError } = await supabase
      .from('requests')
      .insert({
        service_type: data.service_type,
        name: data.name,
        messenger_type: data.messenger_type,
        messenger_contact: data.messenger_contact,
        city: data.city,
        description: data.description,
        extra_fields: data.extra_fields || {},
        file_urls: data.file_urls || [],
        lang: data.lang || 'ru',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ success: false, error: 'Database error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Send Telegram notification
    const telegramMessage = formatTelegramMessage(data);
    await sendTelegramMessage(telegramMessage);

    return new Response(
      JSON.stringify({ success: true, id: request.id }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
