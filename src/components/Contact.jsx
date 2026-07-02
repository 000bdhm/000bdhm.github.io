import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons/BrandIcons";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative py-32 px-6 border-t border-border grid-bg"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-sm text-muted mb-4"
        >
          03. contact
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl sm:text-6xl font-medium tracking-tight mb-6 text-gradient"
        >
          Let's build something.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted max-w-md mx-auto mb-10 font-body"
        >
          I'm currently open to new opportunities. Whether you have a
          question or just want to say hi, my inbox is always open.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          href="mailto:bdhm32@gmail.com"
          className="group inline-flex items-center gap-2 bg-text text-bg font-medium px-8 py-4 rounded-full text-lg transition-transform duration-300 hover:scale-105"
        >
          bdhm32@gmail.com
          <ArrowUpRight
            size={20}
            className="transition-transform duration-300 group-hover:rotate-45"
          />
        </motion.a>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-4 mt-14"
        >
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
              className="w-11 h-11 flex items-center justify-center border border-border rounded-full text-muted hover:border-text hover:text-text transition-colors duration-300"
            >
              <Icon size={18} />
            </a>
          ))}
        </motion.div>
      </div>

      <footer className="mt-32 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-muted max-w-6xl mx-auto">
        <span>© {new Date().getFullYear()} Uğur. Built with React & Framer Motion.</span>
        <a href="#top" className="hover:text-text transition-colors">
          back to top ↑
        </a>
      </footer>
    </section>
  );
}
