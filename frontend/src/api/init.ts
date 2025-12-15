import { api } from "./client";

interface CafeCustomization {
  id: string;

  // Отношение к Cafe
  cafe: InitResponse["cafe"];
  cafeId: string;

 
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  themeMode?: 'LIGHT' | 'DARK' | null; // обычно такие значения, можно расширить


  logoUrl?: string | null;
  backgroundImageUrl?: string | null;
  layoutConfig?: Record<string, unknown> | null;

  
  showPopularSection: boolean;
  showCategoriesAsTabs: boolean;

  
  language?: string | null; // по умолчанию "ua"
  currency?: string | null; // по умолчанию "UAH"


  tipsEnabled: boolean;
  tipsPresets?: Record<string, unknown> | null;
  minOrderAmount?: number | null;


  paymentMethods?: Record<string, unknown> | null;
  bookingEnabled: boolean;
  deliveryZonesConfig?: Record<string, unknown> | null;
  workingHoursConfig?: Record<string, unknown> | null;


  createdAt: Date;
  updatedAt: Date;
}


export interface InitResponse {
  cafe: {
    id: string;
    name: string;
      settings: CafeCustomization | null;
  };
  user: {
    id: string;
    telegramId?: string;
    name?: string;
  } | null;
  role: "OWNER" | "MANAGER" | "STAFF" | "CLIENT";
}

export async function initCafe(cafeSlug: string | null) {
  const { data } = await api.post<InitResponse>("/api/init", {
    cafeSlug,
  });

  return data;
}
