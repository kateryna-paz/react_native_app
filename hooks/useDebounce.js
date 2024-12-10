import { useRef } from "react";

export const useDebounce = (callback, delay) => {
  const timer = useRef(null);

  const debounce = (...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debounce;
};
