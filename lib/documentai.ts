import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { ExtractionResult } from './types';

const client = new DocumentProcessorServiceClient();

async function extractTextFromDocument(
  fileBuffer: Buffer,
  mimeType: string
): Promise<string> {
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const processorId = process.env.GOOGLE_CLOUD_PROCESSOR_ID;
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us';

    if (!projectId || !processorId) {
      throw new Error('Missing Google Cloud configuration');
    }

    const name = client.processorPath(projectId, location, processorId);

    const request = {
      name,
      rawDocument: {
        content: fileBuffer,
        mimeType,
      },
    };

    const [result] = await client.processDocument(request as any);
    const { document } = result;

    if (!document) {
      throw new Error('No document received from processor');
    }

    // Extract text from the document
    const text = document.text || '';
    return text;
  } catch (error) {
    console.error('Error extracting text from document:', error);
    throw error;
  }
}

async function extractEntitiesFromOcr(ocrText: string): Promise<{
  clinicName?: string;
  clinicZip?: string;
  dateOfService?: string;
  species?: string;
  weight?: number;
  total?: number;
  lineItems: Array<{
    description: string;
    price: number;
    quantity: number;
  }>;
}> {
  // Parse OCR text to extract structured data
  const lines = ocrText.split('\n');

  const entities: any = {
    lineItems: [],
  };

  let total: number | null = null;
  const lineItemRegex = /^(.+?)\s+(\d+\.?\d*)\s*(?:x\s*(\d+))?$/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Look for total
    if (trimmed.toLowerCase().includes('total') || trimmed.startsWith('$')) {
      const priceMatch = trimmed.match(/\$?([\d,]+\.?\d*)/);
      if (priceMatch) {
        total = parseFloat(priceMatch[1].replace(/,/g, ''));
      }
    }

    // Look for zip code
    if (/^\d{5}(-\d{4})?$/.test(trimmed)) {
      entities.clinicZip = trimmed.substring(0, 5);
    }

    // Try to parse as line item
    const match = trimmed.match(lineItemRegex);
    if (match) {
      const [, description, price, quantity] = match;
      if (price && !isNaN(parseFloat(price))) {
        entities.lineItems.push({
          description: description.trim(),
          price: parseFloat(price),
          quantity: quantity ? parseInt(quantity) : 1,
        });
      }
    }
  }

  if (total) {
    entities.total = total;
  }

  return entities;
}

export async function processReceipt(
  fileBuffer: Buffer,
  mimeType: string
): Promise<ExtractionResult> {
  try {
    // Extract text from document
    const ocrText = await extractTextFromDocument(fileBuffer, mimeType);

    // Extract entities from OCR text
    const entities = await extractEntitiesFromOcr(ocrText);

    // Build extraction result
    const result: ExtractionResult = {
      clinic_name: entities.clinicName || 'Unknown Clinic',
      clinic_zip: entities.clinicZip,
      date_of_service: entities.dateOfService,
      species: entities.species as 'dog' | 'cat' | 'other' | undefined,
      weight_lbs: entities.weight,
      total_amount: entities.total || 0,
      line_items: entities.lineItems,
      raw_ocr_text: ocrText,
    };

    return result;
  } catch (error) {
    console.error('Error processing receipt:', error);
    throw error;
  }
}
