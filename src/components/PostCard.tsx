// PRESENTATIONAL: one post's layout, repeated for every post.
//
// PROPS ARE RIGHT HERE: `post` is a good prop. Every card shows a different
// post, so the parent has to say which one. That also means PostCard can show
// a post anywhere: the feed, search results, or a test with fake data.
//
// PROBLEM: it also needs `user`, only to decide which buttons to show.
// `user` is the same for every card. That's a sign it belongs in context.

import type { Post, User } from "../types";
import Avatar from "./Avatar";
import Button from "./Button";
import Tag from "./Tag";

interface PostCardProps {
  post: Post;
  user: User;
}

export default function PostCard({ post, user }: PostCardProps) {
  const canEdit = user.role === "editor" || user.role === "admin";
  const canDelete = user.role === "admin";

  return (
    <article className="post-card">
      <div className="post-top">
        <Avatar name={post.author} />
        <div>
          <h3>{post.title}</h3>
          <span className="muted small">
            {post.author} · {post.date}
          </span>
        </div>
      </div>

      <p>{post.excerpt}</p>

      <div className="post-foot">
        <div className="tags">
          {post.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div className="actions">
          {canEdit && <Button>Edit</Button>}
          {canDelete && <Button variant="danger">Delete</Button>}
        </div>
      </div>
    </article>
  );
}
