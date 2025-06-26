import { useState } from 'react';
import { initialFormData } from '../utils/recipe-form-utils.js';

export default function useFormState() {
  const [formData, setFormData] = useState(initialFormData);

  return { formData, setFormData };
}
