// FEATURE: a summary of the signed-in user, next to the posts.

import type { User } from "../types";
import Avatar from "./Avatar";

interface ProfileCardProps {
  user: User;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <aside className="profile-card">
      <div className="profile-top">
        {/* PROPS ARE RIGHT HERE: Avatar gets a plain name, not the whole user */}
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
