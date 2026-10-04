// PRESENTATIONAL: one post's layout. It only needs `post` now,
// so it works in the feed, in search results, or in a test with fake data.
// <Can> decides which buttons appear.

import Can from "../auth/Can.jsx";
import Avatar from "./Avatar.jsx";
import Button from "./Button.jsx";
import Tag from "./Tag.jsx";

export default function PostCard({ post }) {
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
          <Can permission="posts:write">
            <Button>Edit</Button>
          </Can>
          <Can permission="posts:delete">
            <Button variant="danger">Delete</Button>
          </Can>
        </div>
      </div>
    </article>
  );
}
