import {
  html as htmlFn,
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from '../vendor/htm-preact.js';

const html = htmlFn;

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
