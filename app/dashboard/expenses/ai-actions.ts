'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function scanReceiptAction(base64Image: string, mimeType: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY")
      return { error: "API key is missing. Check your .env file." }
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `
      Analyze this receipt/bill/payment screenshot. Extract the following information and return ONLY a valid JSON object. Do not include markdown formatting or backticks.
      {
        "amount": number (the total final amount paid. Just the number. Return null if not found),
        "date": string (YYYY-MM-DD format. Return null if not found),
        "description": string (name of merchant or app. Max 50 chars. Return null if not found)
      }
    `

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    }

    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const text = response.text()

    console.log("GEMINI RAW RESPONSE:", text)

    // Bulletproof JSON extraction: Find the first { and the last }
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    
    if (!jsonMatch) {
      throw new Error("Could not find JSON in the AI response.")
    }

    const parsedData = JSON.parse(jsonMatch[0])
    
    return { success: true, data: parsedData }
  } catch (error: any) {
    console.error("AI Scan Detailed Error:", error.message || error)
    return { error: "Failed to read the receipt. Please try again." }
  }
}