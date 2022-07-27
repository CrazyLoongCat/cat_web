
export interface searchParam {
  type: 'all' | 'prepay' | 'delivery' | 'receive' | 'refund';
  phone?
  onSelect?: (values: Record<string, any>) => void;
}