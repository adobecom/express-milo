import { recipe2ApiQuery } from '../../../../../scripts/template-utils.js';

export default function Support({ recipe }) {
  const { url, headers } = recipe2ApiQuery(recipe);
  return (
    <div className="border-grey rounded p-1">
      <h2>Support</h2>
      <p>
        For Authoring questions, copy the recipe and ask in{' '}
        <a href="https://adobe.enterprise.slack.com/archives/C04UH0M1CRG">
          #express-dev-core
        </a>
        .
      </p>
      <p>
        For API questions, copy the url and headers below and ask in{' '}
        <a href="https://adobe.enterprise.slack.com/archives/C01KV8N5EPR">
          #express-content-clients
        </a>
        .
      </p>
      <code>url: {url}</code>
      <code>headers: {JSON.stringify(headers, null, 2)}</code>
    </div>
  );
}
