// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  const auth = JSON.parse(localStorage.getItem('userLogins') ?? '{}')?.authority ?? [];
  return {
    sysAdmin: currentUser && currentUser.access === 'superGroup',
    spAdmin:
      currentUser &&
      (currentUser.access === 'superGroup' || currentUser.access === 'projectListMG'),
    devCenter: currentUser && currentUser.access !== 'service',
    // 上线前检查：超级管理员、开发经理/总监、开发人员组、测试人员组、测试经理 拥有权限
    onlineCheck:
      currentUser &&
      (currentUser.access === 'superGroup' ||
        currentUser.access === 'devManageGroup' ||
        currentUser.access === 'devGroup' ||
        currentUser.access === 'testGroup' ||
        currentUser.access === 'projectListMG' ||
        currentUser.access === 'frontManager'),
    // sonar扫描：超级管理员、开发经理/总监、开发人员组
    sonarCheck:
      currentUser &&
      (currentUser.access === 'superGroup' ||
        currentUser.access === 'devManageGroup' ||
        currentUser.access === 'devGroup' ||
        currentUser.access === 'frontManager'),
    frontManager:
      currentUser && (currentUser.access === 'superGroup' || currentUser.access === 'frontManager'),
    // 值班名单： 超级管理员、开发经理/总监、前端管理人员
    dutyManager:
      currentUser?.access &&
      ['superGroup', 'devManageGroup', 'frontManager', 'projectListMG'].includes(
        currentUser.access,
      ),
    // 勾选了预发布或发布历史权限
    releaseProcessPage:
      (auth?.length > 0 ? auth : currentUser?.authority || [])?.filter((it) =>
        [154, 155].includes(it.id),
      )?.length > 0,
  };
}
