import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

// Shared, public counter (Abacus — explicit CORS support, no auth needed).
// We keep two counters (plus/minus) instead of one, because decrementing
// a single Abacus counter requires an admin key. Displayed count = plus - minus.
//
// Important: after the initial load we never re-fetch these to "correct"
// the displayed number. Doing that caused a race condition — two rapid
// clicks fire overlapping network requests, and whichever one resolves
// last (not necessarily the most recent click) would overwrite the count
// with a stale value, making it flicker/revert. Instead, the local
// optimistic count is the single source of truth after mount; the network
// calls only persist the change for future visitors / page loads.
const NAMESPACE = "ugur-bdhm-portfolio-000bdhm";
const KEY_PLUS = "hero-likes-plus";
const KEY_MINUS = "hero-likes-minus";
const BASE = "https://abacus.jasoncameron.dev";
const STORAGE_KEY = "portfolio_liked_v2";

async function getCount(key) {
  const res = await fetch(`${BASE}/get/${NAMESPACE}/${key}`);
  if (!res.ok) return 0;
  const data = await res.json();
  return typeof data.value === "number" ? data.value : 0;
}

export default function LikeButton() {
  const [count, setCount] = useState(null);
  const [liked, setLiked] = useState(false);
  const [pop, setPop] = useState(0); // increments to retrigger the pop animation
  const [busy, setBusy] = useState(false);
  const requestId = useRef(0);
  // Once the user interacts, the initial "load the real count" fetch must
  // never be allowed to land afterwards and overwrite the optimistic count
  // (that's what caused the count to revert a second or so after clicking).
  const hasInteracted = useRef(false);

  useEffect(() => {
    let ignore = false;

    setLiked(localStorage.getItem(STORAGE_KEY) === "true");

    Promise.all([getCount(KEY_PLUS), getCount(KEY_MINUS)])
      .then(([plus, minus]) => {
        if (ignore || hasInteracted.current) return;
        setCount(Math.max(0, plus - minus));
      })
      .catch(() => {
        if (ignore || hasInteracted.current) return;
        setCount(0);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const toggleLike = () => {
    if (busy || count === null) return;

    hasInteracted.current = true;
    const myRequest = ++requestId.current;
    const next = !liked;

    // Optimistic, and final: this is the number that stays on screen.
    setLiked(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    setCount((c) => Math.max(0, c + (next ? 1 : -1)));
    setPop((p) => p + 1);
    setBusy(true);

    // Fire-and-persist: tell the server, but never use the response to
    // overwrite the visible count (avoids the stale-response race).
    fetch(`${BASE}/hit/${NAMESPACE}/${next ? KEY_PLUS : KEY_MINUS}`)
      .catch(() => {})
      .finally(() => {
        if (requestId.current === myRequest) setBusy(false);
      });
  };

  return (
    <button
      type="button"
      onClick={toggleLike}
      disabled={busy}
      aria-pressed={liked}
      aria-label={liked ? "Beğeniyi geri al" : "Beğen"}
      className={`group relative inline-flex items-center gap-2 px-5 py-3 rounded-full border font-medium transition-colors duration-300 ${
        busy ? "opacity-70 cursor-wait" : "cursor-pointer"
      } ${
        liked
          ? "border-red-500/60 text-red-500"
          : "border-border text-muted hover:border-text hover:text-text"
      }`}
    >
      <span className="relative flex items-center justify-center w-6 h-6">
        {/* soft ring pop, YouTube-style, behind the heart */}
        <AnimatePresence>
          {pop > 0 && (
            <motion.span
              key={pop}
              initial={{ opacity: 0.5, scale: 0.4 }}
              animate={{ opacity: 0, scale: 1.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`absolute inset-0 rounded-full ${
                liked ? "bg-red-500/40" : "bg-muted/30"
              }`}
            />
          )}
        </AnimatePresence>

        <motion.span
          key={`heart-${pop}`}
          animate={pop > 0 ? { scale: [1, 1.5, 0.85, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <Heart
            size={18}
            className="transition-colors duration-300"
            fill={liked ? "#ef4444" : "none"}
            stroke={liked ? "#ef4444" : "currentColor"}
          />
        </motion.span>

        {/* tiny burst particles, only on like (not on un-like) */}
        <AnimatePresence>
          {pop > 0 && liked && (
            <>
              {[...Array(6)].map((_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                const dx = Math.cos(angle) * 18;
                const dy = Math.sin(angle) * 18;
                return (
                  <motion.span
                    key={`${pop}-${i}`}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
                    animate={{ opacity: 0, x: dx, y: dy, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute w-1 h-1 rounded-full bg-red-500"
                    style={{ left: "50%", top: "50%" }}
                  />
                );
              })}
            </>
          )}
        </AnimatePresence>
      </span>

      <span className="font-mono text-sm tabular-nums">
        {count === null ? "…" : count}
      </span>
    </button>
  );
}
