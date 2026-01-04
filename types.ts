export enum WarrantType {
  CALL = 'ALIM',
  PUT = 'SATIM'
}

export interface Warrant {
  symbol: string;         // e.g., KRAAK
  issuer: string;         // e.g., IS YATIRIM
  underlying: string;     // e.g., KCHOL
  type: WarrantType;      
  strikePrice: number;    // Kullanım Fiyatı
  maturity: string;       // Vade
  price: number;          // Fiyat
  change: number;         // Günlük Değişim %
  delta: number;          // Duyarlılık
  gamma: number;
  theta: number;          // Zaman Değeri Kaybı
  vega: number;
  conversionRatio: number; // Çarpan / Dönüşüm Oranı
  effectiveLeverage: number; // Etkin Kaldıraç
  breakEven: number;      // Başabaş
  status: 'ITM' | 'OTM' | 'ATM'; // In/Out/At the money
}

export interface FilterState {
  underlying: string;
  issuer: string;
  type: string;
  search: string;
}