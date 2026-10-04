// LOGIC (no UI of its own): shows its children only when the signed-in
// user has a permission. The components around it don't need `user` at all.
//
//   <Can permission="posts:delete">
//     <Button variant="danger">Delete</Button>
//   </Can>
//
// Try typing permission="posts:destroy": TypeScript rejects it,
// because Permission only allows the five names in AuthContext.tsx.

import type { ReactNode } from "react";
import { useAuth, type Permission } from "./AuthContext";

interface CanProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function Can({ permission, children, fallback = null }: CanProps) {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? children : fallback;
}
