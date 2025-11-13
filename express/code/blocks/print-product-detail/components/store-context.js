import { html, createContext, useContext, useMemo, useSyncExternalStore } from '../../../scripts/vendors/htm-preact.js';

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
    hasState: state !== undefined,
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
