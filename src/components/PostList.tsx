// FEATURE: loads the posts and renders one PostCard per post.
// It owns the post data because it's the only component that needs the whole list.
//
// PREDICT: PostList receives `user`. What does it actually use it for?

import { useEffect, useState } from "react";
import { fetchPosts } from "../data/fakeApi";
import type { Post, User } from "../types";
import Button from "./Button";
import PostCard from "./PostCard";

interface PostListProps {
  user: User;
}

export default function PostList({ user }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const canWrite = user.role === "editor" || user.role === "admin";

  return (
    <main className="post-list">
      <div className="page-head">
        <h2>Team posts</h2>
        {canWrite ? (
          <Button variant="primary">+ New post</Button>
        ) : (
          <span className="muted small">Read-only access</span>
        )}
      </div>

      {loading ? (
        <p className="muted">Loading posts…</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} user={user} />)
      )}
    </main>
  );
}
