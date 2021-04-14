// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  debugger;
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    testAccess: currentUser && currentUser.access === 'testAccess',
  };
}
