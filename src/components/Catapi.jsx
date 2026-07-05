import { useState, useEffect, useCallback } from "react";

const API_BASE = "https://catapi-lac.vercel.app";

export default function Catapi() {
  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCat = useCallback(() => {
    setLoading(true);
    const img = new Image();
    img.onload = () => {
      setSrc(img.src);
      setLoading(false);
    };
    img.onerror = () => setLoading(false);
    img.src = `${API_BASE}/catapi?raw&cb=${Date.now()}`;
  }, []);

  useEffect(() => {
    loadCat();
  }, [loadCat]);

  useEffect(() => {
    const handler = (e) => {
      if (e.code === "Space" && document.activeElement?.tagName !== "BUTTON") {
        e.preventDefault();
        loadCat();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [loadCat]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-5 py-8">
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #ffffff08 1px, transparent 1px), linear-gradient(to bottom, #ffffff08 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }}
      />
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.07), transparent 70%)" }}
      />

      <div className="relative flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="font-mono text-xs text-[#8A8A8A] tracking-wide">live · random cat api</span>
      </div>

      <h1 className="relative font-['Space_Grotesk'] font-medium text-[clamp(2.2rem,7vw,3rem)] tracking-tight leading-tight bg-gradient-to-b from-white to-[#999] bg-clip-text text-transparent mb-2 text-center">
        catapi.
      </h1>

      <p className="relative text-[#8A8A8A] text-center max-w-[26rem] mb-8 leading-relaxed">
        A tiny serverless endpoint that returns a fresh, random cat gif on every request — built for Discord webhooks, embeds, or just staring at cats.
      </p>

      <div className="relative w-[min(92vw,420px)] bg-[#111] border border-[#1F1F1F] rounded-2xl p-5 animate-[rise_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#1F1F1F] flex items-center justify-center">
          {loading && (
            <div className="absolute w-6 h-6 rounded-full border-2 border-[#1F1F1F] border-t-white animate-spin" />
          )}
          {src && (
            <img
              src={src}
              alt="a random cat gif"
              className={`w-full h-full object-cover block transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
            />
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={loadCat}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white text-[#0A0A0A] border-none rounded-full font-medium text-sm cursor-pointer transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            New cat
          </button>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#1F1F1F] font-mono text-[0.72rem] text-[#8A8A8A]">
          <span>press <kbd className="bg-[#0A0A0A] border border-[#1F1F1F] rounded px-1.5 py-0.5 text-[0.72rem] text-[#8A8A8A]">space</kbd> for a new cat</span>
          <a href="https://github.com/000bdhm/catapi" target="_blank" rel="noopener noreferrer" className="text-[#8A8A8A] no-underline border border-[#1F1F1F] rounded-full px-2.5 py-1 transition-colors hover:text-white hover:border-white">
            source ↗
          </a>
        </div>
      </div>

      <style>{`
        @keyframes rise {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </main>
  );
}
