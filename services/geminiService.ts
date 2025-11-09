
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. OCR functionality will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const extractInfoFromImage = async (imageFile: File): Promise<{
  fullName: string;
  cpf: string;
  dateOfBirth: string;
}> => {
  if (!API_KEY) {
    throw new Error("API_KEY for Gemini is not configured.");
  }

  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
          parts: [
              imagePart,
              { text: `Extraia o nome completo, CPF e data de nascimento da imagem.
              Responda com um objeto JSON com as chaves: "fullName", "cpf", e "dateOfBirth".
              Formate o CPF como XXX.XXX.XXX-XX e a data de nascimento como AAAA-MM-DD.` }
          ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                fullName: { type: Type.STRING },
                cpf: { type: Type.STRING },
                dateOfBirth: { type: Type.STRING }
            }
        }
      }
    });

    const text = result.text.trim();
    return JSON.parse(text);

  } catch (error) {
    console.error("Error extracting info from image:", error);
    throw new Error("Não foi possível extrair as informações da imagem. Verifique o console para mais detalhes.");
  }
};
