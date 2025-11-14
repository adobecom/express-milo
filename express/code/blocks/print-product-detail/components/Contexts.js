import { html, createContext, useContext, useMemo, useSyncExternalStore, useEffect, useState } from '../../../scripts/vendors/htm-preact.js';

export const StoreContext = createContext(null);

export function StoreProvider({ children, sdkStore }) {
  const state = useSyncExternalStore(
    sdkStore.subscribe.bind(sdkStore),
    sdkStore.getSnapshot.bind(sdkStore),
  );

  // No need to wrap actions - the SDK handles subscription notifications automatically
  const actions = useMemo(() => ({
    fetchProduct: sdkStore.fetchProduct.bind(sdkStore),
    fetchSizeChart: sdkStore.fetchSizeChart.bind(sdkStore),
    selectOption: sdkStore.selectOption.bind(sdkStore),
    selectQuantity: sdkStore.selectQuantity.bind(sdkStore),
    selectRealview: sdkStore.selectRealview.bind(sdkStore),
  }), [sdkStore]);

  const value = useMemo(() => ({
    state,
    actions,
    env: sdkStore.env,
    sdk: sdkStore,
  }), [state, actions, sdkStore]);

  return html`
    <${StoreContext.Provider} value=${value}>
      ${children}
    </${StoreContext.Provider}>
  `;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return value;
}

const DrawerContext = createContext(null);

export function DrawerProvider({ children }) {
  const [drawerState, setDrawerState] = useState({ open: false, type: null, payload: null });

  const value = useMemo(() => ({
    state: drawerState,
    openDrawer: (nextState) => {
      setDrawerState({ open: true, ...nextState });
      document.body.classList.add('disable-scroll');
    },
    closeDrawer: () => {
      setDrawerState({ open: false, type: null, payload: null });
      document.body.classList.remove('disable-scroll');
    },
  }), [drawerState]);

  useEffect(() => () => {
    document.body.classList.remove('disable-scroll');
  }, []);

  return html`
    <${DrawerContext.Provider} value=${value}>
      ${children}
    </${DrawerContext.Provider}>
  `;
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return ctx;
}
