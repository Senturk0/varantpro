import { Warrant, WarrantType } from '../types';

// Supported Issuers requested by the user
const ISSUERS = [
  'IS YATIRIM', 
  'INFO YATIRIM', 
  'AK YATIRIM'
];

// Reference Spot Prices (Approximate realistic values for simulation)
const SPOT_PRICES: Record<string, number> = {
  'AKBNK': 56.50, 'AKSEN': 32.10, 'ALARK': 108.4, 'ARCLK': 165.2, 
  'ASELS': 62.15, 'ASTOR': 94.50, 'BIMAS': 585.0, 'BRSAN': 620.5, 
  'DOAS': 285.0, 'EKGYO': 11.20, 'ENJSA': 64.30, 'ENKAI': 42.10, 
  'EREGL': 48.90, 'FROTO': 1150.0, 'GARAN': 118.6, 'GUBRF': 165.4, 
  'HEKTS': 14.20, 'ISCTR': 16.45, 'KCHOL': 235.6, 'KONTR': 210.0, 
  'KOZAL': 22.40, 'KRDMD': 28.60, 'ODAS': 8.90, 'OYAKC': 65.20, 
  'PETKM': 20.10, 'PGSUS': 1050.0, 'SAHOL': 98.50, 'SASA': 38.40, 
  'SISE': 45.60, 'TAVHL': 260.0, 'TCELL': 105.0, 'THYAO': 305.5, 
  'TOASO': 240.0, 'TUPRS': 175.8, 'VESTL': 85.40, 'YKBNK': 32.60, 
  'XU100': 9850.0, 'XU030': 10750.0
};

const MATURITIES = ['31.10.2024', '30.11.2024', '31.12.2024', '31.01.2025'];

const generateWarrantForStock = (underlying: string, spotPrice: number, issuer: string, type: WarrantType, index: number): Warrant => {
  // Generate a strike price around the spot price (0.8x to 1.2x)
  const moneynessFactor = 0.8 + (Math.random() * 0.4); 
  const strikePrice = Number((spotPrice * moneynessFactor).toFixed(2));
  
  // Determine ITM/OTM
  let status: 'ITM' | 'OTM' | 'ATM' = 'ATM';
  if (type === WarrantType.CALL) {
    status = spotPrice > strikePrice * 1.02 ? 'ITM' : (spotPrice < strikePrice * 0.98 ? 'OTM' : 'ATM');
  } else {
    status = spotPrice < strikePrice * 0.98 ? 'ITM' : (spotPrice > strikePrice * 1.02 ? 'OTM' : 'ATM');
  }

  // Calculate simulated price based on intrinsic value + time value
  const intrinsicValue = type === WarrantType.CALL 
    ? Math.max(0, spotPrice - strikePrice) 
    : Math.max(0, strikePrice - spotPrice);
  
  const conversionRatio = spotPrice > 1000 ? 0.001 : (spotPrice > 100 ? 0.01 : 0.1);
  const timeValue = (spotPrice * 0.05 * Math.random()) / 10; // Simplified time value
  const price = Number(((intrinsicValue * conversionRatio) + timeValue).toFixed(2));
  
  // Sanity check for price (min 0.01)
  const finalPrice = Math.max(0.01, price);

  // Greeks Simulation
  const deltaBase = type === WarrantType.CALL ? 0.5 : -0.5;
  const deltaAdjustment = status === 'ITM' ? 0.3 : (status === 'OTM' ? -0.3 : 0);
  const delta = Number((deltaBase + (Math.random() * 0.2 - 0.1) + deltaAdjustment).toFixed(2));
  
  // Leverage: (Spot * Delta) / (Price * Ratio) -> Simplified approximation
  let leverage = Math.abs((spotPrice * Math.abs(delta) * conversionRatio) / finalPrice);
  leverage = Math.min(leverage, 50); // Cap at 50x

  // Symbol Generation (Issuer specific logic simulation)
  // IS: I, AK: A, INFO: F (Simulated prefix)
  const issuerPrefix = issuer === 'IS YATIRIM' ? 'I' : (issuer === 'AK YATIRIM' ? 'A' : 'F');
  const typeChar = type === WarrantType.CALL ? 'A' : 'P';
  const randomSuffix = Math.random().toString(36).substring(2, 4).toUpperCase();
  const symbol = `${underlying.substring(0, 2)}${issuerPrefix}${typeChar}${randomSuffix}`.toUpperCase();

  return {
    symbol,
    issuer,
    underlying,
    type,
    strikePrice,
    maturity: MATURITIES[Math.floor(Math.random() * MATURITIES.length)],
    price: finalPrice,
    change: Number(((Math.random() * 10) - 5).toFixed(2)),
    delta,
    gamma: Number((Math.random() * 0.05).toFixed(3)),
    theta: Number((-Math.random() * 0.02).toFixed(3)),
    vega: Number((Math.random() * 0.1).toFixed(3)),
    conversionRatio,
    effectiveLeverage: Number(leverage.toFixed(1)),
    breakEven: Number((strikePrice + (finalPrice / conversionRatio)).toFixed(2)),
    status
  };
};

export const getWarrants = (count: number = 0): Warrant[] => {
  // Ignore count param, we generate full market set
  const allWarrants: Warrant[] = [];
  let idCounter = 0;

  // Generate dense dataset: For every stock, every issuer, create Calls and Puts
  Object.entries(SPOT_PRICES).forEach(([underlying, spotPrice]) => {
    ISSUERS.forEach(issuer => {
      // Create 3 Calls and 3 Puts for each combination to simulate different strikes/maturities
      for (let i = 0; i < 3; i++) {
        allWarrants.push(generateWarrantForStock(underlying, spotPrice, issuer, WarrantType.CALL, idCounter++));
        allWarrants.push(generateWarrantForStock(underlying, spotPrice, issuer, WarrantType.PUT, idCounter++));
      }
    });
  });

  return allWarrants; // Returns approx ~650 warrants
};