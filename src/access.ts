// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const {currentUser} = initialState || {};

  return {
    sysAdmin: currentUser && currentUser.access === 'superGroup',
    spAdmin: currentUser && (currentUser.access === 'superGroup' || currentUser.access === 'projectListMG'),
    devCenter: currentUser && currentUser.access !== 'service',
    // 上线前检查：超级管理员、开发经理/总监、开发人员组、测试人员组、测试经理 拥有权限
    onlineCheck: currentUser && (currentUser.access === 'superGroup' || currentUser.access === 'devManageGroup' ||
      currentUser.access === 'devGroup' || currentUser.access === 'testGroup' || currentUser.access === 'projectListMG'
      || currentUser.access === 'frontManager'),
    // sonar扫描：超级管理员、开发经理/总监、开发人员组
    sonarCheck: currentUser && (currentUser.access === 'superGroup' || currentUser.access === 'devManageGroup' ||
      currentUser.access === 'devGroup' || currentUser.access === 'frontManager'),
    frontManager: currentUser && (currentUser.access === 'superGroup' || currentUser.access === 'frontManager')
  };
}
