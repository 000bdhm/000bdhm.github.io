import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { fetchRepos } from "../lib/github";

export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    fetchRepos()
      .then((data) => {
        if (cancelled) return;
        setRepos(data);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="projects" className="relative py-32 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-sm text-muted mb-4"
        >
          02. projects
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl sm:text-5xl font-medium tracking-tight mb-16"
        >
          Things I've built.
        </motion.h2>

        {status === "loading" && (
          <p className="font-mono text-sm text-muted">Loading repos from GitHub…</p>
        )}

        {status === "error" && (
          <p className="font-mono text-sm text-muted">
            Couldn't load repos right now (GitHub API rate limit is likely). Refresh in a bit,
            or see them directly on{" "}
            <a
              href="https://github.com/000bdhm"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-text"
            >
              GitHub
            </a>
            .
          </p>
        )}

        {status === "ready" && repos.length === 0 && (
          <p className="font-mono text-sm text-muted">No public repos found yet.</p>
        )}

        {status === "ready" && repos.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6">
            {repos.map((repo, i) => (
              <ProjectCard key={repo.id} repo={repo} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
