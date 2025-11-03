import {
  h as preactH,
  render,
  Component,
  Fragment,
  createContext,
  createRef,
} from './preact/dist/preact.module.js';
import {
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  useContext,
  useDebugValue,
  useErrorBoundary,
  useId,
} from './preact/hooks/dist/hooks.module.js';
import {
  signal,
  computed,
  effect,
  batch,
} from './preact-signals/signals.module.js';
import htm from './htm/index.js';

function instrumentedH(type, props, ...children) {
  if (typeof type === 'undefined' || type === null) {
    // eslint-disable-next-line no-console
    console.error('htm-preact: encountered empty tag type', {
      type,
      props,
      children,
      stack: new Error().stack,
    });
  }

  if (typeof type === 'string' && type.trim() === '') {
    return preactH(Fragment, props, ...children);
  }

  return preactH(type, props, ...children);
}

Object.getOwnPropertyNames(preactH).forEach((key) => {
  if (key === 'length' || key === 'name' || key === 'prototype') {
    return;
  }
  const descriptor = Object.getOwnPropertyDescriptor(preactH, key);
  try {
    Object.defineProperty(instrumentedH, key, descriptor);
  } catch {
    instrumentedH[key] = preactH[key];
  }
});

instrumentedH.Fragment = Fragment;
if ('jsx' in preactH) {
  instrumentedH.jsx = preactH.jsx;
}
if ('jsxs' in preactH) {
  instrumentedH.jsxs = preactH.jsxs;
}
if ('jsxDEV' in preactH) {
  instrumentedH.jsxDEV = preactH.jsxDEV;
}

const html = htm.bind(instrumentedH);

export {
  instrumentedH as h,
  html,
  render,
  Component,
  Fragment,
  createContext,
  createRef,
  signal,
  computed,
  effect,
  batch,
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  useContext,
  useDebugValue,
  useErrorBoundary,
  useId,
};

