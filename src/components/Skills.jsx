import { motion } from "framer-motion";

const skillGroups = [
  {
    label: "frontend",
    items: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Framer Motion"],
  },
  {
    label: "backend",
    items: ["Node.js", "Python", "PostgreSQL", "REST / GraphQL", "Docker"],
  },
  {
    label: "tools",
    items: ["Git", "Figma", "Vite", "CI/CD", "Linux"],
  },
];

const marqueeRow = skillGroups.flatMap((g) => g.items);

export default function Skills() {
  return (
    <section id="skills" className="relative py-32 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-sm text-muted mb-4"
        >
          01. skills
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl sm:text-5xl font-medium tracking-tight mb-16"
        >
          Tools I reach for.
        </motion.h2>

        <div className="grid sm:grid-cols-3 gap-10 mb-16">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-xs text-muted mb-4 uppercase tracking-widest">
                {group.label}
              </p>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="font-body text-lg text-text/90 pb-2 border-b border-border/60"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-hidden py-6 border-t border-b border-border">
        <div className="flex w-max animate-marquee">
          {[...marqueeRow, ...marqueeRow].map((item, i) => (
            <span
              key={i}
              className="font-mono text-sm text-muted mx-6 whitespace-nowrap"
            >
              {item} <span className="text-border mx-6">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
