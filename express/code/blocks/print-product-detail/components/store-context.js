import { createContext, useContext } from '../vendor/htm-preact.js';

export const StoreContext = createContext(null);

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error('useStore must be used within a StoreContext provider');
  }
  return value;
}

