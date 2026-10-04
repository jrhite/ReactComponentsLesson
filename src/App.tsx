// LAYOUT: lays out the page. Right now it ALSO owns the signed-in user,
// so it has to hand `user` and `logout` to everything below it.
//
// LESSON GOAL: move the user into an AuthProvider (src/auth/AuthContext.tsx)
// so components can ask for it with useAuth() instead of receiving props.

import { useState } from "react";
import Header from "./components/Header";
import LoginScreen from "./components/LoginScreen";
import PostList from "./components/PostList";
import ProfileCard from "./components/ProfileCard";
import { fakeLogin } from "./data/fakeApi";
import type { Role, User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  async function login(role: Role) {
    setLoading(true);
    try {
      setUser(await fakeLogin(role));
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
  }

  return (
    <>
      <Header user={user} logout={logout} />
      {user ? (
        <div className="page">
          <PostList user={user} />
          <ProfileCard user={user} />
        </div>
      ) : (
        <LoginScreen login={login} loading={loading} />
      )}
    </>
  );
}
