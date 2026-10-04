// LAYOUT: picks which screen to show. It no longer owns the user
// or passes anything down: each component asks useAuth() for what it needs.

import { useAuth } from "./auth/AuthContext.jsx";
import Header from "./components/Header.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
import PostList from "./components/PostList.jsx";
import ProfileCard from "./components/ProfileCard.jsx";

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
