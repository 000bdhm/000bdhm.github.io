const GITHUB_USER = "000bdhm";
const API_BASE = "https://api.github.com";

async function ghFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`GitHub API error ${res.status} on ${path}`);
  }
  return res.json();
}

// All non-forked, non-archived repos, most recently updated first.
export async function fetchRepos() {
  const repos = await ghFetch(`/users/${GITHUB_USER}/repos?sort=updated&per_page=100`);
  if (!repos) return [];
  return repos
    .filter((r) => !r.fork)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

export async function fetchRepo(name) {
  return ghFetch(`/repos/${GITHUB_USER}/${name}`);
}

export async function fetchLanguages(name) {
  const langs = await ghFetch(`/repos/${GITHUB_USER}/${name}/languages`);
  return langs ? Object.keys(langs) : [];
}

export async function fetchReadme(name, branch = "main") {
  const data = await ghFetch(`/repos/${GITHUB_USER}/${name}/readme`);
  if (!data || !data.content) return null;
  try {
    // content is base64, possibly with newlines
    const decoded = decodeURIComponent(
      atob(data.content.replace(/\n/g, ""))
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    // README markdown often uses relative image/link paths (e.g. "assets/photo-1.png")
    // that only resolve on github.com. Rewrite them to absolute raw.githubusercontent.com
    // URLs so images and links work when rendered on this site.
    const rawBase = `https://raw.githubusercontent.com/${GITHUB_USER}/${name}/${branch}/`;
    const blobBase = `https://github.com/${GITHUB_USER}/${name}/blob/${branch}/`;

    const rewriteRelative = (url) => {
      if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:") || url.startsWith("#")) {
        return url;
      }
      return url.replace(/^\.\//, "");
    };

    const rewritten = decoded
      // markdown images: ![alt](path)
      .replace(/(!\[[^\]]*\]\()([^)]+)(\))/g, (m, pre, url, post) => {
        if (/^(https?:)?\/\//i.test(url)) return m;
        return `${pre}${rawBase}${rewriteRelative(url)}${post}`;
      })
      // markdown links: [text](path) (not images)
      .replace(/([^!]\[[^\]]*\]\()([^)]+)(\))/g, (m, pre, url, post) => {
        if (/^(https?:)?\/\//i.test(url)) return m;
        return `${pre}${blobBase}${rewriteRelative(url)}${post}`;
      })
      // raw <img src="path">
      .replace(/(<img[^>]+src=["'])([^"']+)(["'])/gi, (m, pre, url, post) => {
        if (/^(https?:)?\/\//i.test(url)) return m;
        return `${pre}${rawBase}${rewriteRelative(url)}${post}`;
      });

    return rewritten;
  } catch {
    return null;
  }
}

// Looks for common screenshot folders (assets/, screenshots/, images/, .github/assets/)
// and grabs any image file in them - no naming convention required.
export async function fetchAssetImages(name, branch = "main") {
  const candidateDirs = ["assets", "screenshots", "images", ".github/assets"];

  for (const dir of candidateDirs) {
    const contents = await ghFetch(`/repos/${GITHUB_USER}/${name}/contents/${dir}?ref=${branch}`);
    if (!contents || !Array.isArray(contents)) continue;

    const images = contents
      .filter((f) => f.type === "file" && /\.(png|jpe?g|webp|gif)$/i.test(f.name))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
      .map((f) => ({ name: f.name, url: f.download_url }));

    if (images.length > 0) return images;
  }

  return [];
}
