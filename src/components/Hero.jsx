import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons/BrandIcons";
import LikeButton from "./LikeButton";

const roles = [
  "frontend developer.",
  "backend developer.",
  "problem solver.",
  "open-source contributor.",
];

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

export default function Hero() {
  const typed = useTypewriter(roles);

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center px-6 grid-bg"
    >
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
        className="relative max-w-4xl mx-auto w-full pt-24"
      >
        <motion.p
          variants={item}
          className="font-mono text-sm text-muted mb-6 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-text animate-pulse" />
          available for work
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display text-5xl sm:text-7xl font-medium leading-[1.05] tracking-tight text-gradient"
        >
          Hi, I'm Uğur.
          <br />
          I build things
          <br />
          for the web.
        </motion.h1>

        <motion.div
          variants={item}
          className="mt-8 font-mono text-lg sm:text-xl text-muted h-8"
        >
          <span className="text-text">{"> "}</span>
          {typed}
          <span className="inline-block w-[2px] h-5 bg-text ml-1 translate-y-0.5 animate-blink" />
        </motion.div>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-muted font-body leading-relaxed"
        >
          I work across the stack — building interfaces, servers, and the glue
          in between. Check out what I've been shipping below.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 bg-text text-bg font-medium px-6 py-3 rounded-full transition-transform duration-300 hover:scale-105"
          >
            View my work
            <ArrowDownRight
              size={18}
              className="transition-transform duration-300 group-hover:rotate-45"
            />
          </a>
          <LikeButton />
          <div className="flex items-center gap-3 text-muted">
            {[
              { icon: GithubIcon, href: "https://github.com/000bdhm" },
              { icon: LinkedinIcon, href: "https://www.linkedin.com/in/ugur-bdhm-554479377/" },
              { icon: Mail, href: "mailto:bdhm32@gmail.com" },
            ].map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-border rounded-full hover:border-text hover:text-text transition-colors duration-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-xs text-muted flex flex-col items-center gap-2"
      >
        scroll
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
