import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DISCORD_ID = "834351934495260673";

const STATUS_COLOR = {
  online: "#3BA55D",
  idle: "#FAA61A",
  dnd: "#ED4245",
  offline: "#747F8D",
};

const STATUS_LABEL = {
  online: "online",
  idle: "idle",
  dnd: "do not disturb",
  offline: "offline",
};

function getAvatarUrl(data) {
  if (!data?.discord_user) return null;
  const { id, avatar } = data.discord_user;
  if (!avatar) return null;
  const ext = avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${id}/${avatar}.${ext}?size=128`;
}

function getActivityIcon(activity) {
  if (!activity?.application_id || !activity?.assets?.large_image) return null;
  const img = activity.assets.large_image;
  if (img.startsWith("mp:")) {
    return `https://media.discordapp.net/${img.replace("mp:", "")}`;
  }
  return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
}

function elapsed(start) {
  if (!start) return null;
  const diff = Date.now() - start;
  if (diff < 0) return null;
  const s = Math.floor(diff / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function DiscordCard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchPresence() {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();
        if (!cancelled) {
          if (json?.success) {
            setData(json.data);
            setError(false);
          } else {
            setError(true);
          }
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    fetchPresence();
    const poll = setInterval(fetchPresence, 15000);
    const clock = setInterval(() => setTick((t) => t + 1), 1000);

    return () => {
      cancelled = true;
      clearInterval(poll);
      clearInterval(clock);
    };
  }, []);

  if (error) return null;
  if (!data) return null;

  const status = data.discord_status || "offline";
  const user = data.discord_user;
  const displayName = user?.global_name || user?.username;
  const avatarUrl = getAvatarUrl(data);

  const spotify = data.spotify;
  // type 0 = "Playing" (covers games AND custom RPC apps like VS Code, IntelliJ, etc).
  // Don't require application_id — some RPC integrations omit it.
  const rpcActivity = data.activities?.find((a) => a.type === 0);
  const customStatus = data.activities?.find((a) => a.type === 4);
  const activityIcon = spotify?.album_art_url || getActivityIcon(rpcActivity);
  const activityLabel = spotify
    ? "listening to spotify"
    : rpcActivity
    ? "playing"
    : null;
  const activityTitle = spotify
    ? spotify.song
    : rpcActivity?.name?.replace(/\s*with Medal\s*$/i, "");
  const activitySub = spotify
    ? spotify.artist
    : (rpcActivity?.details || rpcActivity?.state)
        ?.replace(/\s*with Medal\s*$/i, "")
        ?.replace(/^Clipping\s+/i, "");

  const activityTimeLabel = spotify
    ? null
    : elapsed(rpcActivity?.timestamps?.start);

  return (
    <motion.a
      href="https://discord.com/users/834351934495260673"
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group flex items-center gap-3 border border-border rounded-2xl px-4 py-3 bg-surface/60 backdrop-blur-sm hover:border-text/40 transition-colors duration-300 max-w-sm"
    >
      <div className="relative shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-11 h-11 rounded-full border border-border"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-border" />
        )}
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-surface"
          style={{ backgroundColor: STATUS_COLOR[status] }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm text-text truncate">{displayName}</p>
          <span className="font-mono text-[10px] text-muted uppercase tracking-wide">
            {STATUS_LABEL[status]}
          </span>
        </div>

        {customStatus?.state && (
          <p className="mt-1 text-xs text-muted/90 truncate">
            {customStatus.state}
          </p>
        )}

        {activityTitle ? (
          <div className="mt-1 flex items-start gap-2 min-w-0">
            {activityIcon && (
              <img
                src={activityIcon}
                alt=""
                className="w-6 h-6 rounded shrink-0 object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs text-muted leading-snug break-words">
                {activityLabel} — <span className="text-text/90">{activityTitle}</span>
              </p>
              {activitySub && (
                <p className="text-[11px] text-muted/70 truncate">
                  {activitySub}
                  {activityTimeLabel ? ` · ${activityTimeLabel}` : ""}
                </p>
              )}
            </div>
          </div>
        ) : !customStatus?.state ? (
          <p className="mt-1 text-xs text-muted">doing pretty much nothing</p>
        ) : null}
      </div>
    </motion.a>
  );
}