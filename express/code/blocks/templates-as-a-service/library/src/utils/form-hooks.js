import { useContext, createContext } from 'react';
import { recipe2Form } from '../utils/recipe-form-utils.js';

export const DataContext = createContext(null);
export const DispatchContext = createContext(null);

export function useFormData() {
  return useContext(DataContext);
}

export function useFormDispatch() {
  return useContext(DispatchContext);
}

export const ACTION_TYPES = {
  UPDATE_RECIPE: 'UPDATE_RECIPE',
  UPDATE_FORM: 'UPDATE_FORM',
  TOPICS_ADD: 'TOPICS_ADD',
  TOPICS_UPDATE: 'TOPICS_UPDATE',
  TOPICS_REMOVE: 'TOPICS_REMOVE',
};

export function reducer(state, action) {
  const { type, payload } = action;
  const { field, value } = payload || {};
  if (type === ACTION_TYPES.UPDATE_RECIPE) {
    const form = recipe2Form(value);
    return form;
  } else if (type === ACTION_TYPES.UPDATE_FORM) {
    return { ...state, [field]: value };
  } else if (type === ACTION_TYPES.TOPICS_ADD) {
    return { ...state, topics: [...state.topics, ''] };
  } else if (type === ACTION_TYPES.TOPICS_REMOVE) {
    return {
      ...state,
      topics: state.topics.filter((_, i) => i !== payload.index),
    };
  } else if (type === ACTION_TYPES.TOPICS_UPDATE) {
    return {
      ...state,
      topics: state.topics.map((topic, i) =>
        i === payload.index ? payload.value : topic
      ),
    };
  }
  throw new Error(`Unhandled action type: ${type}`);
}
