import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { marked } from "marked";
import { ArrowLeft, ArrowUpRight, Star, GitFork, ExternalLink } from "lucide-react";
import { fetchRepo, fetchLanguages, fetchAssetImages, fetchReadme } from "../lib/github";

export default function ProjectDetail() {
  const { repo: repoName } = useParams();
  const [repo, setRepo] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [images, setImages] = useState([]);
  const [readme, setReadme] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notfound | error

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;

    fetchRepo(repoName)
      .then(async (data) => {
        if (cancelled) return;
        if (!data) {
          setStatus("notfound");
          return;
        }
        setRepo(data);
        setStatus("ready");

        const branch = data.default_branch || "main";
        const [langs, imgs, md] = await Promise.all([
          fetchLanguages(repoName).catch(() => []),
          fetchAssetImages(repoName, branch).catch(() => []),
          fetchReadme(repoName, branch).catch(() => null),
        ]);
        if (cancelled) return;
        setLanguages(langs);
        setImages(imgs);
        setReadme(md);
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [repoName]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="font-mono text-sm text-muted">Loading project…</p>
      </main>
    );
  }

  if (status === "notfound" || status === "error") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 gap-6 text-center">
        <p className="font-mono text-sm text-muted">
          {status === "notfound" ? "Couldn't find that repo." : "Something went wrong loading this repo."}
        </p>
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 font-mono text-sm border border-border rounded-full px-5 py-2 hover:border-text hover:text-text transition-colors"
        >
          <ArrowLeft size={16} /> back to projects
        </Link>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-6 pt-32 pb-32 grid-bg">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-text transition-colors mb-10"
          >
            <ArrowLeft size={16} /> back to projects
          </Link>

          <h1 className="font-display text-4xl sm:text-6xl font-medium tracking-tight text-gradient mb-4">
            {repo.name}
          </h1>

          {repo.description && (
            <p className="text-muted font-body text-lg leading-relaxed max-w-2xl mb-8">
              {repo.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-10">
            {languages.map((lang) => (
              <span
                key={lang}
                className="font-mono text-xs border border-border rounded-full px-3 py-1 text-muted"
              >
                {lang}
              </span>
            ))}
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

          <div className="flex flex-wrap items-center gap-4 mb-16">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 bg-text text-bg font-medium px-6 py-3 rounded-full transition-transform duration-300 hover:scale-105"
            >
              View on GitHub
              <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:rotate-45" />
            </a>
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm border border-border rounded-full px-5 py-3 hover:border-text hover:text-text transition-colors"
              >
                Live site <ExternalLink size={14} />
              </a>
            )}
          </div>

          {images.length > 0 && (
            <div className="mb-16">
              <p className="font-mono text-xs text-muted mb-4 uppercase tracking-widest">
                screenshots
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {images.map((img) => (
                  <a
                    key={img.name}
                    href={img.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl overflow-hidden border border-border bg-surface"
                  >
                    <img
                      src={img.url}
                      alt={`${repo.name} screenshot`}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {readme && (
            <div>
              <p className="font-mono text-xs text-muted mb-4 uppercase tracking-widest">
                readme
              </p>
              <div
                className="readme-content font-body text-sm text-text/80 leading-relaxed bg-surface border border-border rounded-2xl p-6 sm:p-8 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: marked.parse(readme) }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
