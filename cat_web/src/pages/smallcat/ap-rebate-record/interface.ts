
export interface searchParam {
  rebateStatus: ''|'0' | '1' | '2' | '3' ;
  phone?
  onSelect?: (values: Record<string, any>) => void;
}