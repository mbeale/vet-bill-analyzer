import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const PROCEDURE_NORMALIZATION_PROMPT = `You are a veterinary billing expert. Your task is to map fuzzy/informal vet service descriptions to standardized procedure keys.

Common procedure mappings:
- "DHPP 1yr", "DHPP vaccine", "4-in-1 vaccine" -> "vaccine_dhpp"
- "Rabies vaccine", "Rabies 1yr" -> "vaccine_rabies"
- "Dental cleaning", "Cleaning", "DENT CLEAN" -> "dental_cleaning_level_1"
- "Dental extraction", "Tooth extraction" -> "dental_extraction"
- "Spay", "Ovariohysterectomy" -> "spay"
- "Neuter", "Castration" -> "neuter"
- "ACL surgery", "ACL repair", "TPLO" -> "acl_surgery"
- "Ultrasound", "Abdominal ultrasound" -> "ultrasound"
- "X-ray", "Radiograph" -> "xray"
- "Exam", "Office visit", "Consultation" -> "office_exam"

For each line item, provide:
1. The standardized procedure_key
2. Whether it's medical (true/false) - exclude items like "Leash", "Boarding", "Toys"
3. The category (e.g., "vaccine", "surgery", "diagnostic", "exam", "supply")

Input: A list of veterinary service descriptions
Output: JSON array with normalized data

Be conservative - if you're unsure if something is a medical procedure, mark is_medical as false.`;

interface NormalizedProcedure {
  original_description: string;
  procedure_key: string;
  category: string;
  is_medical: boolean;
  confidence: number;
}

export async function normalizeProcedures(
  descriptions: string[]
): Promise<NormalizedProcedure[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const inputText = `${PROCEDURE_NORMALIZATION_PROMPT}\n\nService descriptions to normalize:\n${descriptions.map((d, i) => `${i + 1}. "${d}"`).join('\n')}\n\nProvide response as JSON array.`;

    const result = await model.generateContent(inputText);
    const response = result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON response from Gemini');
    }

    const normalized: NormalizedProcedure[] = JSON.parse(jsonMatch[0]);

    return normalized;
  } catch (error) {
    console.error('Error normalizing procedures:', error);
    throw error;
  }
}

export async function generateVerdictMessage(
  clinicName: string,
  totalAmount: number,
  medianPrice: number,
  percentageDifference: number,
  species: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Generate a brief, friendly verdict message for a vet bill analysis:
- Clinic: ${clinicName}
- Total: $${totalAmount.toFixed(2)}
- Regional Median: $${medianPrice.toFixed(2)}
- Difference: ${percentageDifference > 0 ? '+' : ''}${percentageDifference.toFixed(1)}%
- Pet Species: ${species}

If difference is:
- Within 10% below median: "Great deal!"
- Within 10% above median: "Fair market value"
- 10-30% above: "On the higher side"
- 30%+: "Significantly above regional average"

Keep it under 15 words and conversational.`;

    const result = await model.generateContent(prompt);
    const message = result.response.text();

    return message.trim();
  } catch (error) {
    console.error('Error generating verdict message:', error);
    return 'Unable to generate verdict message';
  }
}

export async function generateNegotiationScript(
  clinicName: string,
  flaggedItems: Array<{ description: string; price: number; medianPrice: number }>
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const itemsList = flaggedItems
      .map((item) => `- ${item.description}: $${item.price.toFixed(2)} (median: $${item.medianPrice.toFixed(2)})`)
      .join('\n');

    const prompt = `Create a brief, polite negotiation script for a pet owner to discuss overpriced items with their vet:

Vet Clinic: ${clinicName}
Overpriced items:
${itemsList}

Format: 2-3 sentences that are friendly but point out the pricing concern. Suggest comparing with regional averages.`;

    const result = await model.generateContent(prompt);
    const script = result.response.text();

    return script.trim();
  } catch (error) {
    console.error('Error generating negotiation script:', error);
    return 'Unable to generate negotiation script';
  }
}
