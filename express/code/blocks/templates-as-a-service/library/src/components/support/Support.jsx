import { recipe2ApiQuery } from '../../../../../../scripts/template-utils.js';
import { form2Recipe } from '../../utils/recipe-form-utils.js';
import { useFormData } from '../../utils/form-hooks.js';

export default function Support() {
  const formData = useFormData();
  const { url, headers, backupQuery } = recipe2ApiQuery(form2Recipe(formData));
  const backupInfo = !backupQuery ? null : (
    <div className='pt-1'>
      <div>
        <code>Backup URL: {backupQuery.url}</code>
      </div>
      <div>
        <code>
          Backup Headers: {JSON.stringify(backupQuery.headers, null, 2)}
        </code>
      </div>
    </div>
  );
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
      <div className="support--code">
        <div>
          <div>
            <code>URL: {url}</code>
          </div>
          <div>
            <code>headers: {JSON.stringify(headers, null, 2)}</code>
          </div>
        </div>
        {backupInfo}
      </div>
    </div>
  );
}
