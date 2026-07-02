import { useEffect, useRef } from "react";

// Signature element: a soft radial spotlight that follows the cursor,
// revealing the grid pattern underneath it — ties the "developer grid"
// motif to an interactive, alive feeling without using any color.
export default function Spotlight() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let raf = null;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          if (el) {
            el.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 40%)`;
          }
          raf = null;
        });
      }
    };

    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      aria-hidden="true"
    />
  );
}
