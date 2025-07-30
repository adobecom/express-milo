import { useReducer } from 'react';
import { initialFormData } from '../../utils/recipe-form-utils.js';
import {
  DataContext,
  DispatchContext,
  reducer,
} from '../../utils/form-hooks.js';
import FormInfoProvider from './FormInfoProvider';

export default function FormProvider({ children }) {
  const [form, dispatch] = useReducer(reducer, initialFormData);
  return (
    <DataContext value={form}>
      <FormInfoProvider>
        <DispatchContext value={dispatch}>{children}</DispatchContext>
      </FormInfoProvider>
    </DataContext>
  );
}
