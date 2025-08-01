import { useContext, createContext } from 'react';
import { recipe2Form } from '../utils/recipe-form-utils.js';

export const DataContext = createContext(null);
export const DispatchContext = createContext(null);

export const InfoContext = createContext(null);

export function useFormData() {
  return useContext(DataContext);
}

export function useFormDispatch() {
  return useContext(DispatchContext);
}

export function useInfo() {
  return useContext(InfoContext);
}

export const ACTION_TYPES = {
  UPDATE_RECIPE: 'UPDATE_RECIPE',
  UPDATE_FORM: 'UPDATE_FORM',
  TOPICS_ADD: 'TOPICS_ADD',
  TOPICS_UPDATE: 'TOPICS_UPDATE',
  TOPICS_REMOVE: 'TOPICS_REMOVE',
  TOPICS_EXPAND: 'TOPICS_EXPAND',
};

export function reducer(state, action) {
  const { type, payload } = action;
  const { field, value, topicsRow, topicsCol } = payload || {};

  switch (type) {
    case ACTION_TYPES.UPDATE_RECIPE: {
      return recipe2Form(value);
    }
    case ACTION_TYPES.UPDATE_FORM: {
      return { ...state, [field]: value };
    }
    case ACTION_TYPES.TOPICS_ADD: {
      const clonedTopics = structuredClone(state.topics);
      clonedTopics[topicsRow].push('');
      return { ...state, topics: clonedTopics };
    }
    case ACTION_TYPES.TOPICS_REMOVE: {
      const clonedTopics = structuredClone(state.topics);
      clonedTopics[topicsRow].pop();
      clonedTopics[topicsRow].length || clonedTopics.splice(topicsRow, 1);
      return {
        ...state,
        topics: clonedTopics,
      };
    }
    case ACTION_TYPES.TOPICS_UPDATE: {
      const clonedTopics = structuredClone(state.topics);
      clonedTopics[topicsRow][topicsCol] = value;
      return {
        ...state,
        topics: clonedTopics,
      };
    }
    case ACTION_TYPES.TOPICS_EXPAND: {
      return {
        ...state,
        topics: [...state.topics, ['']],
      };
    }
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
}
