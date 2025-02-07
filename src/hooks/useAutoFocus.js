import { useEffect } from 'react';

export function useAutoFocus(ref, shouldFocus) {
  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [shouldFocus, ref]);
}
