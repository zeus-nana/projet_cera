import { useEffect, useRef } from 'react';

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        // Ignore les clics dans le menu de react-select
        if (ref.current && !ref.current.contains(e.target) && !e.target.closest('.react-select__menu')) {
          handler();
        }
      }

      document.addEventListener('click', handleClick, listenCapturing);

      return () => document.removeEventListener('click', handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return ref;
}
