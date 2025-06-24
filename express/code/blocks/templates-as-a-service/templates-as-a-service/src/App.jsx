import './App.css';
import Recipe from './components/Recipe';
import Form from './components/Form';
import Debug from './components/Debug';
import Results from './components/Results';

function App() {
  return (
    <>
      <div>
        <Recipe />
        <Form />
      </div>
      <div>
        <Debug />
        <Results />
      </div>
    </>
  );
}

export default App;
