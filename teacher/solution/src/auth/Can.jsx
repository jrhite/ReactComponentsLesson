// LOGIC (no UI of its own): shows its children only when the signed-in
// user has a permission. The components around it don't need `user` at all.
//
//   <Can permission="posts:delete">
//     <Button variant="danger">Delete</Button>
//   </Can>

import { useAuth } from "./AuthContext.jsx";

export default function Can({ permission, children, fallback = null }) {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? children : fallback;
}
