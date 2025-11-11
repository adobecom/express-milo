import {
  h,
  render,
  Component,
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
import htm from './htm/index.js';

const html = htm.bind(h);

export {
  html,
  render,
  Component,
  createContext,
  createRef,
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
