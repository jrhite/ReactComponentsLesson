// LAYOUT: positions the logo and the user menu.
//
// PREDICT: does Header use `user` or `logout` itself,
// or does it only pass them along?

import type { User } from "../types";
import UserMenu from "./UserMenu";

interface HeaderProps {
  user: User | null;
  logout: () => void;
}

export default function Header({ user, logout }: HeaderProps) {
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
