// FEATURE: a summary of the signed-in user, next to the posts.

import Avatar from "./Avatar.jsx";

export default function ProfileCard({ user }) {
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
