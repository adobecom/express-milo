import './App.css';
if (import.meta.env.DEV) {
  import('./dev-styles.css');
}
import Recipe from './components/Recipe';
import Form from './components/Form';
import Support from './components/Support';
import Results from './components/Results';
import useFormState from './hooks/useFormState';
import { form2Recipe, recipe2Form } from './utils/recipe-form-utils';

function App() {
  const { formData, setFormData } = useFormState();
  const onFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const onRecipeChange = (recipe) => {
    const form = recipe2Form(recipe);
    setFormData(form);
  };

  const recipe = form2Recipe(formData);

  return (
    <div className="app-container m-auto">
      <h1>Templates as a Service (TaaS)</h1>
      <div className="flex gap-1">
        <div className="left-container flex flex-col gap-1">
          <Recipe recipe={recipe} onRecipeChange={onRecipeChange} />
          <Form formData={formData} onFormChange={onFormChange} />
        </div>
        <div className="right-container flex flex-col gap-1">
          <Support recipe={recipe} />
          <Results recipe={recipe} />
        </div>
      </div>
    </div>
  );
}

export default App;
