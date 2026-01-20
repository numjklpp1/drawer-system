
export interface CabinetModel {
  id: string;
  name: string;
  // UD 系列
  udLarge: number;
  udMedium: number;
  udSmall: number;
  udP: number
  // AD 系列
  adLarge: number;
  adSmall: number;
  adP: number;
  // CD 系列
  cdLarge: number;
  cdSmall: number;
}

export interface SelectedItem extends CabinetModel {
  instanceId: string;
  quantity: number;
}

export interface DrawerTotals {
  udLarge: number;
  udMedium: number;
  udSmall: number;
  adLarge: number;
  adSmall: number;
  cdLarge: number;
  cdSmall: number;
  udP:number;
  adP:number;
}
