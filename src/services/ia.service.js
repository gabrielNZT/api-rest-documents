require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY não foi encontrada nas variáveis de ambiente.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });


const generateAnswer = async (userQuestion, documentContext) => {
  const prompt = `
    Você é um assistente especialista em análise de documentos. Sua tarefa é responder perguntas baseando-se **apenas** no conteúdo do documento fornecido. Seja direto e conciso.

    **Documento para análise:**
    ---
    ${documentContext}
    ---

    **Pergunta do usuário:**
    "${userQuestion}"

    Se a resposta não estiver contida no texto do documento, responda exatamente com: "A informação não foi encontrada no documento fornecido."
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Erro ao chamar a API do Gemini:', error);
    return 'Houve um erro ao processar sua pergunta com a IA.';
  }
};

module.exports = {
  generateAnswer,
};