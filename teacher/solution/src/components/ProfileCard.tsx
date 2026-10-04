// FEATURE (connected): this one file shows both tools side by side.
//
// CONTEXT IS RIGHT HERE: ProfileCard is always about the signed-in user,
// the same user every component sees, so it reads useAuth() directly.
//
// PROPS ARE RIGHT HERE: it then passes a plain `name` down to Avatar, because
// Avatar should show ANY name: you here, a post's author on a PostCard.

import { useAuth } from "../auth/AuthContext";
import Avatar from "./Avatar";

export default function ProfileCard() {
  const { user } = useAuth(); // context: the same for everyone

  // user is `User | null` in context. App only shows this card when
  // someone is signed in, but TypeScript can't know that, so check.
  if (!user) return null;

  return (
    <aside className="profile-card">
      <div className="profile-top">
        {/* prop: whose name to show */}
        <Avatar name={user.name} size="lg" />
        <div>
          <strong>{user.name}</strong>
          <div className="muted small">{user.email}</div>
        </div>
      </div>
      <span className="role-pill">{user.role}</span>
    </aside>
  );
}
