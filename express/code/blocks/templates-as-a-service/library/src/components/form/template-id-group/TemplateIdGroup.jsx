import {
  ACTION_TYPES,
  useFormData,
  useFormDispatch,
} from '../../../utils/form-hooks';
import Label from '../Label';

function Row({ rowIndex, templateId, expandButton }) {
  const formDispatch = useFormDispatch();
  return (
    <Label>
      <input
        className="template-id-input"
        type="text"
        value={templateId}
        name={`template-manual-id-${rowIndex}`}
        onChange={(e) =>
          formDispatch({
            type: ACTION_TYPES.IDS_UPDATE,
            payload: {
              idsRow: rowIndex,
              value: e.target.value,
            },
          })
        }
      />
      <div className="flex gap-1">
        {rowIndex === 0  || <button
          onClick={(e) => {
            e.preventDefault();
            formDispatch({
              type: ACTION_TYPES.IDS_REMOVE,
              payload: {
                idsRow: rowIndex,
              },
            });
          }}
        >
          -
        </button>}
        {expandButton}
      </div>
    </Label>
  );
}

export default function TemplateIdGroups() {
  const formData = useFormData();
  const formDispatch = useFormDispatch();
  const { templateIds } = formData;
  const expandButton = (
    <button
      onClick={(e) => {
        e.preventDefault();
        formDispatch({
          type: ACTION_TYPES.IDS_ADD,
        });
      }}
    >
      ADD ID
    </button>
  );
  return (
    <div className="flex flex-col items-start">
      {templateIds.map((templateId, i) => (
        <Row
          key={i}
          rowIndex={i}
          templateId={templateId}
          expandButton={i === templateIds.length - 1 ? expandButton : null}
        />
      ))}
    </div>
  );
}
