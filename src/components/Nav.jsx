import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const links = [
  { href: "#skills", label: "skills" },
  { href: "#projects", label: "projects" },
  { href: "#contact", label: "contact" },
];

export default function Nav() {
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-border/60 backdrop-blur-md bg-bg/70"
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-mono text-sm tracking-tight">
          <span className="text-muted">$</span> ugur
        </Link>
        <ul className="hidden sm:flex items-center gap-8 font-mono text-sm text-muted">
          {links.map((l) =>
            onHome ? (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative transition-colors hover:text-text group"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-text transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ) : (
              <li key={l.href}>
                <Link
                  to={`/${l.href}`}
                  className="relative transition-colors hover:text-text group"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-text transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            )
          )}
        </ul>
        {onHome ? (
          <a
            href="#contact"
            className="text-sm font-medium border border-border px-4 py-1.5 rounded-full hover:bg-text hover:text-bg transition-colors duration-300"
          >
            Say hi
          </a>
        ) : (
          <Link
            to="/#contact"
            className="text-sm font-medium border border-border px-4 py-1.5 rounded-full hover:bg-text hover:text-bg transition-colors duration-300"
          >
            Say hi
          </Link>
        )}
      </nav>
    </motion.header>
  );
}
