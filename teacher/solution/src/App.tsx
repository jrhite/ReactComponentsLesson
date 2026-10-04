// LAYOUT: picks which screen to show. It no longer owns the user
// or passes anything down: each component asks useAuth() for what it needs.

import { useAuth } from "./auth/AuthContext";
import Header from "./components/Header";
import LoginScreen from "./components/LoginScreen";
import PostList from "./components/PostList";
import ProfileCard from "./components/ProfileCard";

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      {user ? (
        <div className="page">
          <PostList />
          <ProfileCard />
        </div>
      ) : (
        <LoginScreen />
      )}
    </>
  );
}
