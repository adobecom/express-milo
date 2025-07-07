import { recipe2ApiQuery } from '../../../../../scripts/template-utils.js';
import { form2Recipe } from '../utils/recipe-form-utils';
import { useFormData } from '../utils/form-hooks.js';

export default function Support() {
  const formData = useFormData();
  const { url, headers } = recipe2ApiQuery(form2Recipe(formData));
  return (
    <div className="border-grey rounded p-1">
      <h2>Support</h2>
      <p>
        Authoring questions, copy the <strong>recipe (left)</strong> and ask in{' '}
        <a href="https://adobe.enterprise.slack.com/archives/C04UH0M1CRG">
          #express-dev-core
        </a>
        .
      </p>
      <p>
        API/Content Tagging questions, copy the url and headers below and ask in{' '}
        <a href="https://adobe.enterprise.slack.com/archives/C01KV8N5EPR">
          #express-content-clients
        </a>
        .
      </p>
      <div className='support--code'>
        <div>
          <code>url: {url}</code>
        </div>
        <div>
          <code>headers: {JSON.stringify(headers, null, 2)}</code>
        </div>
      </div>
    </div>
  );
}
