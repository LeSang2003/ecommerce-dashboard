import { useEffect, useState } from "react";

function CountUp({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);

      // 👉 easeOut (mượt hơn linear)
      const ease = 1 - Math.pow(1 - progress, 3);

      const current = Math.floor(ease * value);

      setDisplay(current);

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{display.toLocaleString("vi-VN")}</span>;
}

export default CountUp;
