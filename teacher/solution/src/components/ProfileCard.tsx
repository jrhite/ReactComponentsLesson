// FEATURE (connected): always about the signed-in user, so it reads
// useAuth() directly. It still passes a plain name down to Avatar.

import { useAuth } from "../auth/AuthContext";
import Avatar from "./Avatar";

export default function ProfileCard() {
  const { user } = useAuth();

  // user is `User | null` in context. App only shows this card when
  // someone is signed in, but TypeScript can't know that, so check.
  if (!user) return null;

  return (
    <aside className="profile-card">
      <div className="profile-top">
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
