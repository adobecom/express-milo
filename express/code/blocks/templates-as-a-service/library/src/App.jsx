import './App.css';
if (import.meta.env.DEV) {
  import('./dev-styles.css');
}
import { ErrorBoundary, FormProvider } from './components/providers';
import { Recipe, Form, Support, QueryResults } from './components';

function App() {
  return (
    <ErrorBoundary>
      <FormProvider>
        <div className="app-container m-auto">
          <h1>Templates as a Service (TaaS)</h1>
          <div className="flex flex-wrap gap-1">
            <div className="left-container flex flex-col gap-1">
              <Recipe />
              <Form />
            </div>
            <div className="right-container flex flex-col gap-1">
              <Support />
              <QueryResults />
            </div>
          </div>
        </div>
      </FormProvider>
    </ErrorBoundary>
  );
}

export default App;
