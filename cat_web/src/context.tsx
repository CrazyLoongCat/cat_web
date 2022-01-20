import { createContext } from 'react';

export const GlobalContext = createContext<{
  lang?: string;
  setLang?: (value: string) => void;
}>({});

export const GlobalToken = createContext<{
  globalToken?: any;
  setGlobalToken?: (value: any) => void;
}>({});
