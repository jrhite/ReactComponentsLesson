// FEATURE: the avatar button and its dropdown.
// `open` is local state: only this component cares whether the menu is open.

import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar.jsx";

export default function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the menu on a click outside it, or on Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return <span className="muted">Not signed in</span>;

  return (
    <div ref={menuRef} className="user-menu">
      <button
        type="button"
        className="avatar-button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar name={user.name} />
      </button>

      {open && (
        <div role="menu" className="dropdown">
          <div className="dropdown-head">
            <strong>{user.name}</strong>
            <span className="muted small">{user.email}</span>
          </div>
          <button type="button" role="menuitem" className="menu-item">Profile</button>
          {/* PROBLEM: role names are checked by hand, all over the app */}
          {user.role !== "viewer" && (
            <button type="button" role="menuitem" className="menu-item">Settings</button>
          )}
          {user.role === "admin" && (
            <button type="button" role="menuitem" className="menu-item">Manage users</button>
          )}
          <button type="button" role="menuitem" className="menu-item" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
