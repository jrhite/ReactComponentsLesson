// LAYOUT: positions the logo and the user menu.
//
// PREDICT: does Header use `user` or `logout` itself,
// or does it only pass them along?

import UserMenu from "./UserMenu.jsx";

export default function Header({ user, logout }) {
  return (
    <header className="header">
      <a href="/" className="logo">
        <span className="logo-mark" />
        Team Blog
      </a>
      <UserMenu user={user} logout={logout} />
    </header>
  );
}
