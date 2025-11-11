import { html, createContext, useContext, useState, useEffect, useMemo } from '../vendor/htm-preact.js';

export const StoreContext = createContext(null);

export function StoreProvider({ children, sdkStore }) {
  const [state, setState] = useState(sdkStore.getSnapshot());

  useEffect(() => {
    // Subscribe to SDK store changes and update local state
    const unsubscribe = sdkStore.subscribe(() => {
      setState(sdkStore.getSnapshot());
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [sdkStore]);

  // Wrap actions to trigger state updates
  const actions = useMemo(() => {
    const call = (fn) => async (...args) => {
      try {
        return await fn(...args);
      } finally {
        setState(sdkStore.getSnapshot());
      }
    };

    return {
      fetchProduct: call(sdkStore.fetchProduct.bind(sdkStore)),
      fetchSizeChart: call(sdkStore.fetchSizeChart.bind(sdkStore)),
      selectOption: call(sdkStore.selectOption.bind(sdkStore)),
      selectQuantity: call(sdkStore.selectQuantity.bind(sdkStore)),
      selectRealview: call(sdkStore.selectRealview.bind(sdkStore)),
    };
  }, [sdkStore]);

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
