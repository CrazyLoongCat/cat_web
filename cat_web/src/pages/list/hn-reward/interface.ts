export interface GoodsDescription {
  goodsId?: string;
  productName?: string;
  salesPrice?: number;
  count?:bigint;
}
export interface Monitor {
  id?: string;
  monitorPhone?: string;
  placedPhone?: string;
  placedAddressId?:string;
  placedNum?:string;
  placedOnceNum?:string;
  monitorGoodsId?:string;
  monitorGoodsName?:string;
  status?:string;
  inputTime?:string;
  updateTime?:string;
  remark?:string;
  monitorStatus?:string;
}
export interface CardBlockType {
  type: 'sell_hot' | 'skincare' | 'perfume' | 'colours';
  card: GoodsDescription;
  loading?: boolean;
  formVisible: boolean;
}

export interface searchParam {
  loginPhone?: string;
  id?: string;
  onSelect?;
}