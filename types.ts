
export interface CabinetModel {
  id: string;
  name: string;
  // UD 系列 (理想櫃)
  udL: number;
  udM: number;
  udS: number;
  udP: number;
  udF: number;
  // AD 系列
  adL: number;
  adS: number;
  adP: number;
  // CT 系列
  ctL: number;
  // CB 系列
  cbL: number;
  cbS: number;
}

export interface SelectedItem extends CabinetModel {
  instanceId: string;
  quantity: number;
}

export interface DrawerTotals {
  udL: number;
  udM: number;
  udS: number;
  udP: number;
  udF: number;
  adL: number;
  adS: number;
  adP: number;
  ctL: number;
  cbL: number;
  cbS: number;
}
