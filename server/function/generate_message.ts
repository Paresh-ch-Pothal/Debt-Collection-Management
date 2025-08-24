import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize client with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

/**
 * Generate a polite debt reminder message using Gemini AI
 * @param name - Name of the person
 * @param debtAmount - Debt amount (number)
 * @returns Generated message (string)
 */
export async function generateDebtMessage(name: string, debtAmount: number): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate a polite and professional reminder message to ${name}, 
    letting them know that they owe ₹${debtAmount}. 
    The tone should be friendly but clear, and encourage timely repayment.`;

    const result = await model.generateContent(prompt);

    // Extract plain text
    const message = result.response.text();

    return message;
  } catch (error) {
    console.error("Error generating debt message:", error);
    throw new Error("Failed to generate debt message");
  }
}
