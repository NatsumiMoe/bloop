import { useEffect } from 'react';

export function useShortcuts(list) {
  useEffect(() => {
    const handlers = list.map(({ key, fn }) => {
      function handler(e) {
        switch (e.target.tagName.toLowerCase()) {
          case 'input':
          case 'textarea':
            return;
          default:
            if (e.isComposing || e.keyCode === 229) return;
            if (e.code === key) {
              e.preventDefault();
              e.stopPropagation();
              fn();
            }
        }
      }
      document.addEventListener('keydown', handler);
      return handler;
    });

    function cleanUp() {
      handlers.forEach((handler) => {
        document.removeEventListener('keydown', handler);
      });
    }

    return cleanUp;
  }, [list]);
}
