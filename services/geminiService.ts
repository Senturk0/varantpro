import { GoogleGenAI } from "@google/genai";
import { Warrant } from "../types";

// Vite projelerinde ortam değişkenlerine 'import.meta.env' ile erişilir.
// Değişken adının başına 'VITE_' eklemek zorunludur.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI(API_KEY || '');

export const analyzeWarrant = async (warrant: Warrant): Promise<string> => {
  if (!API_KEY) {
    return "API Anahtarı bulunamadı. Lütfen Vercel üzerinden VITE_GEMINI_API_KEY değişkenini tanımlayın.";
  }

  try {
    const prompt = `
      Sen profesyonel bir Borsa İstanbul türev araçlar uzmanısın.
      Aşağıdaki varant verilerini analiz et ve yatırımcı için kısa, profesyonel bir risk ve fırsat değerlendirmesi yap.
      
      Varant Bilgileri:
      Sembol: ${warrant.symbol}
      Dayanak Varlık: ${warrant.underlying}
      Tip: ${warrant.type}
      Fiyat: ${warrant.price} TL
      Kullanım Fiyatı: ${warrant.strikePrice}
      Vade: ${warrant.maturity}
      Çarpan: ${warrant.conversionRatio}
      Delta: ${warrant.delta}
      Etkin Kaldıraç: ${warrant.effectiveLeverage}
      Teta (Zaman Aşımı): ${warrant.theta}
      Durum: ${warrant.status}

      Lütfen şu başlıklara değin:
      1. Varantın teknik yapısı (Moneyness ve Vade durumu).
      2. Risk profili (Kaldıraç ve Yunanlar üzerinden).
      3. Hangi piyasa beklentisine (Yükseliş/Düşüş/Yatay) uygun olduğu.
      
      Yanıtı Türkçe ver, markdown formatı kullanma, sade text olsun.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster simple analysis
      }
    });

    return response.text || "Analiz oluşturulamadı.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Şu anda yapay zeka analizi hizmetine ulaşılamıyor.";
  }
};
