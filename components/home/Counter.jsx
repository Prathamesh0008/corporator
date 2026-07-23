"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function Counter({ value, suffix = "", prefix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    let started = false;

    const runCounter = () => {
      if (started) return;
      started = true;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplayValue(value);
        return;
      }

      const duration = 1600;
      const startTime = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(value * eased));
        if (progress < 1) frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runCounter();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    if (counterRef.current) observer.observe(counterRef.current);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  const formatted = useMemo(() => {
    const normalized = displayValue.toLocaleString();
    return `${prefix}${normalized}${suffix}`;
  }, [displayValue, prefix, suffix]);

  return <span ref={counterRef}>{formatted}</span>;
}
