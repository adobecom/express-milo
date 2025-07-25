import {
  ACTION_TYPES,
  useFormData,
  useFormDispatch,
} from '../../../utils/form-hooks';
import Label from '../Label';

function Row({ topicsGroup, rowIndex, expandButton }) {
  const formDispatch = useFormDispatch();
  return (
    <Label>
      {rowIndex === 0 ? 'Topics:' : 'AND Topics:'}
      {topicsGroup.map((topic, colIndex) => (
        <input
          className="topics-input"
          key={colIndex}
          type="text"
          value={topic}
          onChange={(e) =>
            formDispatch({
              type: ACTION_TYPES.TOPICS_UPDATE,
              payload: {
                topicsRow: rowIndex,
                topicsCol: colIndex,
                value: e.target.value,
              },
            })
          }
        />
      ))}
      <div className="flex gap-1">
        {(rowIndex === 0 && topicsGroup.length === 1) || <button
          onClick={(e) => {
            e.preventDefault();
            formDispatch({
              type: ACTION_TYPES.TOPICS_REMOVE,
              payload: {
                topicsRow: rowIndex,
              },
            });
          }}
        >
          -
        </button>}
        {topicsGroup.every(Boolean) && (
          <button
            onClick={(e) => {
              e.preventDefault();
              formDispatch({
                type: ACTION_TYPES.TOPICS_ADD,
                payload: { topicsRow: rowIndex },
              });
            }}
          >
            +
          </button>
        )}
        {expandButton}
      </div>
    </Label>
  );
}

export default function TopicsGroups() {
  const formData = useFormData();
  const formDispatch = useFormDispatch();
  const topics = formData.topics;
  const expandButton = (
    <button
      onClick={(e) => {
        e.preventDefault();
        formDispatch({
          type: ACTION_TYPES.TOPICS_EXPAND,
        });
      }}
    >
      AND
    </button>
  );
  return (
    <div className="flex flex-col items-start">
      {topics.map((_, i) => (
        <Row
          key={i}
          rowIndex={i}
          topicsGroup={topics[i]}
          expandButton={i === topics.length - 1 ? expandButton : null}
        />
      ))}
    </div>
  );
}
