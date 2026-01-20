
import { CabinetModel } from './types';

/**
 * ============================================================
 * 🛠️ 產品資料設定區 (USER CONFIGURATION)
 * ============================================================
 * 💡 [標註] 您可以在這裡定義每個產品包含的各系列抽屜數量：
 * UD: 大(udLarge), 中(udMedium), 小(udSmall)
 * AD: 大(adLarge), 小(adSmall)
 * CD: 大(cdLarge), 小(cdSmall)
 * ============================================================
 */
export const CABINET_MODELS: CabinetModel[] = [
  { 
    id: 'UD2', 
    name: 'UD2', 
    udLarge: 2, udMedium: 0, udSmall: 0, udP: 0, // UD 系列
    adLarge: 0, adSmall: 0,adP: 0,             // AD 系列
    cdLarge: 0, cdSmall: 0              // CD 系列
  },
  { 
    id: 'UD3', 
    name: 'UD3', 
    udLarge: 3, udMedium: 0, udSmall: 0, udP: 0, 
    adLarge: 0, adSmall: 0,adP: 0,             
    cdLarge: 0, cdSmall: 0              
  },
  { 
    id: 'UC2)', 
    name: 'UC2', 
    udLarge: 1, udMedium: 0, udSmall: 0, udP: 1, 
    adLarge: 0, adSmall: 0,adP: 0,             
    cdLarge: 0, cdSmall: 0              
  },
  { 
    id: 'UC3', 
    name: 'UC3', 
    udLarge: 2, udMedium: 0, udSmall: 0, udP: 1, 
    adLarge: 0, adSmall: 0,adP: 0,             
    cdLarge: 0, cdSmall: 0              
  },
  { 
    id: 'UP2', 
    name: 'UP2', 
    udLarge: 0, udMedium: 0, udSmall: 0, udP: 2, 
    adLarge: 0, adSmall: 0,adP: 0,             
    cdLarge: 0, cdSmall: 0              
  },
  { 
    id: 'UP3', 
    name: 'UP3', 
    udLarge: 0, udMedium: 0, udSmall: 0, udP: 3, 
    adLarge: 0, adSmall: 0,adP: 0,             
    cdLarge: 0, cdSmall: 0              
  },
  { 
    id: 'AD2', 
    name: 'AD2', 
    udLarge: 0, udMedium: 0, udSmall: 0, udP: 0, 
    adLarge: 2, adSmall: 0,adP: 0,             
    cdLarge: 0, cdSmall: 0              
  },
  { 
    id: 'AD3', 
    name: 'AD3', 
    udLarge: 0, udMedium: 0, udSmall: 0, udP: 0, 
    adLarge: 3, adSmall: 0,adP: 0,             
    cdLarge: 0, cdSmall: 0              
  },
  // 💡 [標註] 新增產品時請遵循此格式
];

export const APP_THEME = {
  primary: 'blue-600',
  secondary: 'slate-700',
  accent: 'indigo-500',
};
