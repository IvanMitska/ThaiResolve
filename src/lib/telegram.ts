// This file is for reference - Telegram integration runs on the server side (Edge Function)
// DO NOT use Telegram Bot Token on the client side

export interface TelegramMessage {
  service_type: string;
  name: string;
  messenger_type: string;
  messenger_contact: string;
  city: string;
  description: string;
  extra_fields?: Record<string, any>;
  lang: string;
}

export function formatTelegramMessage(data: TelegramMessage, serviceLabels: Record<string, string>): string {
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
        const formattedKey = formatFieldKey(key);
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
    year: 'numeric'
  });
  message += `\n🕔 ${timeStr} (ICT)`;

  return message;
}

function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

function formatFieldKey(key: string): string {
  const labels: Record<string, string> = {
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
  return labels[key] || key;
}
