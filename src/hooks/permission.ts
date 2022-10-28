import { useCallback } from 'react';
import { useModel } from 'umi';

const usePermission = () => {
  const [authority] = useModel('@@initialState', (init) => [
    init.initialState?.currentUser?.authority,
  ]);
  /*
   公告升级权限
   145,147,148，150，151 => 公告保存，公告查看，公告挂起，删除，新增
   */
  const announcePermission = useCallback(() => {
    const roles: number[] =
      authority?.flatMap((it: any) => (it?.parentId == 146 ? [+it.id] : [])) ?? [];
    return {
      edit: roles?.includes(145), // 保存权限
      push: roles?.includes(148), // 公告挂起
      check: roles?.includes(147), // 公告查看
      add: roles?.includes(151), // 新增公告
      delete: roles?.includes(150), // 删除
    };
  }, [authority]);

  const prePermission = useCallback(() => {
    const roles = authority?.flatMap((it: any) => (it?.parentId == 114 ? [+it.id] : [])) ?? [];
    return {
      delete: roles?.includes(152),
      preView: roles?.includes(153),
      preList: roles?.includes(154),
      historyList: roles?.includes(155),
      add: roles?.includes(156),
      save: roles?.includes(157),
      saveResult: roles?.includes(158),
    };
  }, [authority]);

  return { announcePermission, prePermission };
};
export default usePermission;
