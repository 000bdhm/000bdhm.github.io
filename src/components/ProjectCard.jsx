import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Star, GitFork } from "lucide-react";

export default function ProjectCard({ repo, index }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative block rounded-2xl border border-border overflow-hidden bg-surface"
      style={{
        backgroundImage: `radial-gradient(400px circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.06), transparent 60%)`,
      }}
    >
      <Link to={`/projects/${repo.name}`} className="p-8 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <span className="font-mono text-xs text-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          <ArrowUpRight
            size={20}
            className="text-muted transition-all duration-300 group-hover:text-text group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </div>

        <h3 className="font-display text-2xl font-medium mb-3 tracking-tight">
          {repo.name}
        </h3>
        <p className="text-muted font-body leading-relaxed mb-8 flex-1">
          {repo.description || "No description yet."}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {repo.language && (
            <span className="font-mono text-xs border border-border rounded-full px-3 py-1 text-muted">
              {repo.language}
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span className="font-mono text-xs border border-border rounded-full px-3 py-1 text-muted flex items-center gap-1">
              <Star size={11} /> {repo.stargazers_count}
            </span>
          )}
          {repo.forks_count > 0 && (
            <span className="font-mono text-xs border border-border rounded-full px-3 py-1 text-muted flex items-center gap-1">
              <GitFork size={11} /> {repo.forks_count}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
