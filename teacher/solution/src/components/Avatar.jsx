// PRESENTATIONAL: shows initials for ANY name it's given.
// It takes a name as a prop instead of reading the signed-in user,
// so it works in the header, on every post, and on the profile card.

const COLORS = ["#6366f1", "#0ea5e9", "#d946ef", "#f59e0b", "#10b981", "#ef4444"];

function colorFor(name) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

export default function Avatar({ name, size = "sm" }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span className={`avatar avatar-${size}`} style={{ background: colorFor(name) }} aria-label={name}>
      {initials}
    </span>
  );
}
