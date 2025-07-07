import './App.css';
if (import.meta.env.DEV) {
  import('./dev-styles.css');
}
import Recipe from './components/Recipe';
import Form from './components/Form';
import Support from './components/Support';
import Results from './components/Results';
import { FormProvider } from './components/FormProvider';

function App() {
  return (
    <FormProvider>
      <div className="app-container m-auto">
        <h1>Templates as a Service (TaaS)</h1>
        <div className="flex flex-wrap gap-1">
          <div className="left-container flex flex-col gap-1">
            <Recipe/>
            <Form />
          </div>
          <div className="right-container flex flex-col gap-1">
            <Support />
            <Results />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

export default App;
