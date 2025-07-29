import { useState, useRef, useEffect, useCallback } from 'react';
import { InfoContext } from '../../utils/form-hooks';

function useInfoTimer() {
  const [activeInfo, setActiveInfo] = useState(null);
  const timerRef = useRef(null);

  const showInfo = useCallback((fieldName) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveInfo(fieldName);
    timerRef.current = setTimeout(() => setActiveInfo(null), 5000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return [activeInfo, showInfo];
}

export default function FormInfoProvider({ children }) {
  const [activeInfo, showInfo] = useInfoTimer();
  return (
    <InfoContext value={{ activeInfo, showInfo }}>
      {children}
    </InfoContext>
  );
}
