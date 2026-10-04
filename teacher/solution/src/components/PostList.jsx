// FEATURE: loads the posts and renders one PostCard per post.
// It no longer receives `user`: the only thing it used it for was a
// permission check, and <Can> handles that now.

import { useEffect, useState } from "react";
import Can from "../auth/Can.jsx";
import Button from "./Button.jsx";
import PostCard from "./PostCard.jsx";
import { fetchPosts } from "../data/fakeApi.js";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  return (
    <main className="post-list">
      <div className="page-head">
        <h2>Team posts</h2>
        <Can
          permission="posts:write"
          fallback={<span className="muted small">Read-only access</span>}
        >
          <Button variant="primary">+ New post</Button>
        </Can>
      </div>

      {loading ? (
        <p className="muted">Loading posts…</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </main>
  );
}
