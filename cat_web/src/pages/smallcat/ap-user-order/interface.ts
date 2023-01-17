
export interface searchParam {
  checkStatus: ''|'0' | '1' | '2' | '3' | '4'|'5';
  phone?
  onSelect?: (values: Record<string, any>) => void;
}