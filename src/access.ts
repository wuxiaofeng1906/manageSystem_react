// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const {currentUser} = initialState || {};
  return {
    sysAdmin: currentUser && currentUser.access === 'sys_admin',
    spAdmin: currentUser && (currentUser.access === 'sys_admin' || currentUser.access === 'sprint_admin'),
  };
}
