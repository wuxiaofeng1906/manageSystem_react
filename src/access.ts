// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const {currentUser} = initialState || {};
  return {
    sysAdmin: currentUser && currentUser.access === 'superGroup',
    spAdmin: currentUser && (currentUser.access === 'superGroup' || currentUser.access === 'projectListMG'),
    devCenter: currentUser && currentUser.access !== 'service',
  };
}
