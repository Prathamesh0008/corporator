"use client";

import { useEffect, useMemo, useState } from "react";

export default function Counter({ value, suffix = "", prefix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplayValue(value);
      return undefined;
    }

    let frame = 0;
    const duration = 900;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplayValue(Math.round(value * progress));
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  const formatted = useMemo(() => {
    const normalized = displayValue.toLocaleString();
    return `${prefix}${normalized}${suffix}`;
  }, [displayValue, prefix, suffix]);

  return <span>{formatted}</span>;
}
