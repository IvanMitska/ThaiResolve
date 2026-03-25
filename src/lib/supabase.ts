import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadFile(file: File, requestId: string): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${requestId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('request-files')
    .upload(fileName, file);

  if (error) {
    console.error('File upload error:', error);
    return null;
  }

  const { data } = supabase.storage
    .from('request-files')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function submitRequest(data: any, files: File[]): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // First, insert the request to get the ID
    const { data: request, error: insertError } = await supabase
      .from('requests')
      .insert({
        service_type: data.service_type,
        name: data.name,
        messenger_type: data.messenger_type,
        messenger_contact: data.messenger_contact,
        city: data.city,
        description: data.description,
        extra_fields: data.extra_fields || {},
        lang: data.lang,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Upload files if any
    const fileUrls: string[] = [];
    for (const file of files) {
      const url = await uploadFile(file, request.id);
      if (url) {
        fileUrls.push(url);
      }
    }

    // Update request with file URLs
    if (fileUrls.length > 0) {
      await supabase
        .from('requests')
        .update({ file_urls: fileUrls })
        .eq('id', request.id);
    }

    return { success: true, id: request.id };
  } catch (error: any) {
    console.error('Submit request error:', error);
    return { success: false, error: error.message };
  }
}
