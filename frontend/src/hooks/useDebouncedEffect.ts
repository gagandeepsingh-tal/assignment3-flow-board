import { EffectCallback, DependencyList, useEffect, useRef } from "react";

export function useDebouncedEffect(effect: EffectCallback, deps: DependencyList, delayMs = 150): void {
  const cleanupRef = useRef<ReturnType<EffectCallback> | void>();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      cleanupRef.current = effect();
    }, delayMs);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (typeof cleanupRef.current === "function") {
        cleanupRef.current();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}


