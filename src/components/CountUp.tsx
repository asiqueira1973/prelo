import { useEffect, useRef, useState } from 'react';

type CountUpProps = {
  value: number;
  duration?: number;
};

// Número que "roda" até o valor final. Respeita quem pediu menos movimento
// no sistema: nesse caso mostra o valor direto.
export default function CountUp({ value, duration = 900 }: CountUpProps) {
  const [shown, setShown] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(value);
      fromRef.current = value;
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(from + (value - from) * eased);
      setShown(current);
      fromRef.current = current;
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <span className="tabular-nums">{shown.toLocaleString('pt-BR')}</span>;
}
