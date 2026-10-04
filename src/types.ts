// Shapes of the data the app passes around.
// Hover over `user` or `post` anywhere in VS Code to see these.

export type Role = "viewer" | "editor" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Post {
  id: number;
  author: string;
  date: string;
  title: string;
  excerpt: string;
  tags: string[];
}
