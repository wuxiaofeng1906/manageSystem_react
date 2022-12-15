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
      delete: roles?.includes(159), // 移除
      refreshCheck: roles?.includes(160), // 检查刷新
      refreshOnline: roles?.includes(161), // 项目与服务刷新
      branchLock: roles?.includes(162), // 锁定分支
      branchUnlock: roles?.includes(163), // 取消锁定分支
      storyList: roles?.includes(164), // 需求列表
      serverConfirm: roles?.includes(165), // 服务确认
      hotUpdate: roles?.includes(166), // 是否可热更
      baseInfo: roles?.includes(167), // 修改基础信息
      checkStatus: roles?.includes(168), // 修改检查忽略状态
      paramSetting: roles?.includes(169), // 检查参数设置
      multiCheck: roles?.includes(170), // 批量检查
      preLock: roles?.includes(171), // 封版、取消封版
      pushMessage: roles?.includes(172), // 一键推送检查失败信息
      orderSave: roles?.includes(173), // 工单保存
      orderPublish: roles?.includes(174), // 工单标记发布结果
      cancelPublish: roles?.includes(175), // 取消发布
    };
  }, [authority]);

  return { announcePermission, prePermission, onlineSystemPermission };
};
export default usePermission;
