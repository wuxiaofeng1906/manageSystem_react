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
  const onlineSystemPermission = useCallback(() => {
    const roles = authority?.flatMap((it: any) => (it?.parentId == 114 ? [+it.id] : [])) ?? [];
    return {
      delete: roles?.includes(152), // 移除
      refresh: roles?.includes(152), // 刷新
      branchLock: roles?.includes(153), // 锁定分支
      branchUnlock: roles?.includes(154), // 取消锁定分支
      storyList: roles?.includes(155), // 需求列表
      serverConfirm: roles?.includes(156), // 服务确认
      hotUpdate: roles?.includes(157), // 是否可热更
      baseInfo: roles?.includes(158), // 修改基础信息
      checkStatus: roles?.includes(158), // 检查状态
      paramSetting: roles?.includes(158), // 检查参数设置
      multiCheck: roles?.includes(158), // 批量检查
      preLock: roles?.includes(158), // 封版
      pushMessage: roles?.includes(158), // 一键推送检查失败信息
      orderSave: roles?.includes(158), // 工单保存
      orderPublish: roles?.includes(158), // 工单发布
    };
  }, [authority]);

  return { announcePermission, prePermission, onlineSystemPermission };
};
export default usePermission;
