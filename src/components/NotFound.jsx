import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function useTypewriter(words, speed = 60, pause = 1400) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index % words.length];
    let timeout;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), speed);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), speed / 2);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setIndex((i) => i + 1);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, index, words, speed, pause]);

  return text;
}

const lines = [
  "route not found.",
  "page went missing.",
  "404 not 200.",
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { y: 24, opacity: 0, filter: "blur(6px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function NotFound() {
  const typed = useTypewriter(lines);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 grid-bg">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.08), transparent 70%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-4xl mx-auto w-full text-center"
      >
        <motion.p
          variants={item}
          className="font-mono text-sm text-muted mb-6 flex items-center justify-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-text animate-pulse" />
          error thrown
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display text-7xl sm:text-9xl font-medium leading-[1.05] tracking-tight text-gradient"
        >
          404
        </motion.h1>

        <motion.div
          variants={item}
          className="mt-8 font-mono text-lg sm:text-xl text-muted h-8 flex items-center justify-center"
        >
          <span className="text-text">{"> "}</span>
          {typed}
          <span className="inline-block w-[2px] h-5 bg-text ml-1 translate-y-0.5 animate-blink" />
        </motion.div>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl mx-auto text-muted font-body leading-relaxed"
        >
          The page you're looking for doesn't exist, moved, or never shipped.
          Let's get you back on track.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2 bg-text text-bg font-medium px-6 py-3 rounded-full transition-transform duration-300 hover:scale-105"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to home
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
