import { useState } from 'react';

export default function Recipe({ recipe, onRecipeChange }) {
  const [showCopied, setShowCopied] = useState(false);

  const copyRecipe = () => {
    navigator.clipboard.writeText(recipe);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="border-grey rounded p-1">
      <h2>Recipe to Form:</h2>
      <textarea
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        value={recipe}
        onChange={(e) => onRecipeChange(e.target.value)}
      />
      <div className="copy-button-container">
        <button onClick={copyRecipe}>Copy</button>
        {showCopied && <p className="copied">Copied to clipboard!</p>}
      </div>
    </div>
  );
}
