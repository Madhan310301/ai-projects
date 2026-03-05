import { useEffect, useRef } from 'react';

export function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const addHoverClass = () => cursor.classList.add('hovering');
    const removeHoverClass = () => cursor.classList.remove('hovering');

    window.addEventListener('mousemove', moveCursor);

    // Add interactions for clickable elements
    const clickables = document.querySelectorAll('a, button, input, textarea, [role="button"]');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', addHoverClass);
      el.addEventListener('mouseleave', removeHoverClass);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      clickables.forEach(el => {
        el.removeEventListener('mouseenter', addHoverClass);
        el.removeEventListener('mouseleave', removeHoverClass);
      });
    };
  }, []);

  return cursorRef;
}
