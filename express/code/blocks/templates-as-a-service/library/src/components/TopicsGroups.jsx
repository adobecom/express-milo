import {
  ACTION_TYPES,
  useFormData,
  useFormDispatch,
} from '../utils/form-hooks';

export default function TopicsGroups() {
  const formData = useFormData();
  const formDispatch = useFormDispatch();
  return (
    <div className="flex flex-col items-start">
      {formData.topics.map((topic, i) => (
        <label key={i}>
          {i === 0 ? 'Topics:' : 'AND Topics:'}
          <input
            name="topics"
            type="text"
            value={topic}
            onChange={(e) =>
              formDispatch({
                type: ACTION_TYPES.TOPICS_UPDATE,
                payload: {
                  index: i,
                  value: e.target.value,
                },
              })
            }
          />

          {i !== 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                formDispatch({
                  type: ACTION_TYPES.TOPICS_REMOVE,
                  payload: {
                    index: i,
                  },
                });
              }}
            >
              REMOVE
            </button>
          )}

          {i === formData.topics.length - 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                formDispatch({
                  type: ACTION_TYPES.TOPICS_ADD,
                });
              }}
            >
              ADD
            </button>
          )}
        </label>
      ))}
    </div>
  );
}
