import { supabase } from './supabase';

const BUCKET_NAME = 'receipts';

export async function uploadReceipt(file: File, userId: string): Promise<{
  path: string;
  url: string;
} | null> {
  try {
    const fileName = `${userId}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return {
      path: data.path,
      url: publicUrl,
    };
  } catch (error) {
    console.error('Error uploading receipt:', error);
    return null;
  }
}

export async function deleteReceipt(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting receipt:', error);
    return false;
  }
}

export async function getReceiptUrl(filePath: string): Promise<string | null> {
  try {
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error getting receipt URL:', error);
    return null;
  }
}
