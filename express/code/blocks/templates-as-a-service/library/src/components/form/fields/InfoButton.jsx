import { memo } from 'react';
import { useInfo } from '../../../utils/form-hooks';

function InfoButton({ fieldName, content }) {
  const { activeInfo, showInfo } = useInfo();
  return (
    <>
      <button
        type="button"
        className="info-button"
        aria-label={`Show information for ${fieldName}`}
        onClick={() => showInfo(fieldName)}
      >
        ？
      </button>
      {activeInfo === fieldName && (
        <div className="info-content" tabIndex="0">
          <small>{content}</small>
        </div>
      )}
    </>
  );
}

export default memo(InfoButton);
