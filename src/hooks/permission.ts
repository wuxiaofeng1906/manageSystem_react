import { useModel } from 'umi';
import { useCallback } from 'react';

const usePermission = () => {
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);

  /*
   公告升级权限
   145,147,148，150，151 => 公告保存，公告查看，公告挂起，删除，新增
   */
  const announcePermission = useCallback(() => {
    const roles = user?.authority?.filter((it: any) => it?.parentId == 146)?.map((o: any) => o.id);
    return {
      edit: roles?.includes(145), // 保存权限
      push: roles?.includes(148), // 公告挂起
      check: roles?.includes(147), // 公告查看
      add: roles?.includes(151), // 新增公告
      delete: roles?.includes(150), // 删除
    };
  }, [JSON.stringify(user)]);

  return { announcePermission };
};
export default usePermission;
