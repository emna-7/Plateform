// Types pour les objets Excel/PDF et autres données
export interface ExcelRow {
  liquidity?: number | null;
  debt?: number | null;
  roe?: number | null;
  [key: string]: any;
}

export interface FinancialData {
  liquidity: number | null;
  debt: number | null;
  roe: number | null;
  [key: string]: any;
}

export interface MissionData {
  contacts: string[];
  risks: string[];
  recommendations: string[];
  [key: string]: any;
}

// Helper pour normaliser les valeurs null/undefined
export function normalizeValue<T>(value: T | null | undefined, defaultValue: T): T {
  return value ?? defaultValue;
}

// Helper pour normaliser les objets avec propriétés optionnelles
export function normalizeObject<T extends Record<string, any>>(
  obj: Partial<T>,
  defaults: T
): T {
  const result = { ...defaults };
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key] ?? defaults[key];
    }
  }
  return result;
}
