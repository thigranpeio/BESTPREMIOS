import { GoogleGenAI } from "@google/genai";
import { Sale } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateSalesReport = async (sales: Sale[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "O recurso de IA está desativado porque a chave da API não foi configurada.";
  }

  const salesDataString = sales
    .map(s => `- Data: ${s.data}, Vendedor: ${s.vendedorNome}, Loja: ${s.loja}, Lente: ${s.lente}, Tratamento: ${s.tratamento}, Status: ${s.status}, Prêmio: ${s.premio ? `R$${s.premio.toFixed(2)}` : 'N/A'}`)
    .join('\n');

  const prompt = `
    Você é um analista de vendas sênior. Analise os seguintes dados de vendas de uma ótica e forneça um relatório conciso em português.

    O relatório deve incluir:
    1.  Um resumo geral do desempenho.
    2.  As lentes e tratamentos mais vendidos.
    3.  O vendedor com o melhor desempenho (maior número de vendas e maior valor em prêmios).
    4.  Análise sobre o desempenho por loja.
    5.  Análise sobre os prêmios concedidos.
    6.  Qualquer tendência ou insight interessante que você possa identificar.

    Use formatação de markdown para o relatório.

    Dados de Vendas:
    ${salesDataString}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating sales report with Gemini:", error);
    return "Ocorreu um erro ao gerar o relatório de IA. Por favor, tente novamente mais tarde.";
  }
};