import { useReducer } from 'react';
import { initialFormData } from '../utils/recipe-form-utils.js';
import { DataContext, DispatchContext, reducer } from '../utils/form-hooks.js';


export function FormProvider({ children }) {
  const [form, dispatch] = useReducer(reducer, initialFormData);
  return (
    <DataContext value={form}>
      <DispatchContext value={dispatch}>{children}</DispatchContext>
    </DataContext>
  );
}
