// PRESENTATIONAL: shows initials for ANY name it's given.
//
// PROPS ARE RIGHT HERE: Avatar takes `name` as a prop instead of reading the
// signed-in user from context. That's what lets the same component show you
// in the header AND a post's author on every PostCard.

const COLORS = ["#6366f1", "#0ea5e9", "#d946ef", "#f59e0b", "#10b981", "#ef4444"];

function colorFor(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

interface AvatarProps {
  name: string;
  size?: "sm" | "lg";
}

export default function Avatar({ name, size = "sm" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={`avatar avatar-${size}`}
      style={{ background: colorFor(name) }}
      aria-label={name}
    >
      {initials}
    </span>
  );
}
