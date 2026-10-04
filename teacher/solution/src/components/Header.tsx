// LAYOUT: positions the logo and the user menu. No props, no data:
// a header redesign touches only this file.

import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="header">
      <a href="/" className="logo">
        <span className="logo-mark" />
        Team Blog
      </a>
      <UserMenu />
    </header>
  );
}
