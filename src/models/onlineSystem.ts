import {useEffect, useState} from 'react';
import {OnlineSystemServices} from '@/services/onlineSystem';
import PreReleaseServices from '@/services/preRelease';
import {isEmpty} from 'lodash';

export type LogType =
  | 'online_system_manage_release_basic' // 上线系统发布过程单基础信息
  | 'online_system_manage_release' // 需求列表
  | 'online_system_manage_release_project_app' // 上线系统应用服务
  | 'online_system_manage_rd_repair' // 工单-升级接口
  | 'online_system_manage_release_data' // 上线系统数据修复
  | 'online_system_manage_check_detail'; // 检查详情

export default () => {
  const [globalState, setGlobalState] = useState({
    locked: false,
    finished: false,
    step: 1,
  });
  const [draft, setDraft] = useState(true);
  const [basic, setBasic] = useState<any>();
  const [server, setServer] = useState<any[]>([]);
  const [api, setApi] = useState<any[]>([]);
  const [repair, setRepair] = useState<any>({count: 0, page: 1, page_size: 20, data: []});
  // 运维工单数据
  const [devOpsOrderInfo, setDevOpsOrderInfo] = useState<any[]>([]);
  const [serverConfirm, setServerConfirm] = useState<any[]>([]);
  const [envs, setEnvs] = useState<any[]>([]);
  const [sqlList, setSqlList] = useState<any[]>([]);

  const getReleaseInfo = async (data: any, refreshData: any = null) => {
    if (refreshData) {
      await OnlineSystemServices.refreshProjectInfo(refreshData);
    }
    if (data) {
      await Promise.all([
        getBasicInfo(data),
        getServerApp(data),
        getUpgradeInfo(data),
        getRepairInfo(data),
        getServerConfirm(data),
      ]);
    }
  };

  const getRepairInfo = async (data: any, page = 1, size = 20) => {
    const res = await OnlineSystemServices.getRepairInfo({
      release_num: data?.release_num,
      page,
      page_size: size,
    });
    setRepair(res);
  };
  const getServerApp = async (data: any) => {
    const res = await OnlineSystemServices.getServerApp({...data, onlyappr: true});
    setServer(res);
  };
  const getBasicInfo = async (data: any) => {
    const res = await OnlineSystemServices.getBasicInfo(data);
    setBasic(res);
  };
  const getUpgradeInfo = async (data: any) => {
    const res = await OnlineSystemServices.getUpgradeInfo(data);
    setApi(res);
  };
  // 运维工单信息
  const getDevOpsOrderInfo = async (data: any) => {
    const res = await OnlineSystemServices.getDevOpsOrderInfo(data);
    // 有数据放到数组中，没数据就用空数组
    // (Object.keys(res)).length ? setDevOpsOrderInfo([{...res}]) : setDevOpsOrderInfo([]);
    setDevOpsOrderInfo((Object.keys(res)).length ? [{...res}] : []);
  };

  const getServerConfirm = async (data: any) => {
    const res = await OnlineSystemServices.getServerConfirm(data);
    setServerConfirm(res);
  };

  // 移除
  const removeRelease = async (data: any, type: 'server' | 'api' | 'repair', refreshData: any) => {
    let request = OnlineSystemServices.removeServerApp;
    let refreshRequest = getServerApp;
    if (type == 'api') {
      request = OnlineSystemServices.removeUpgradeInfo;
      refreshRequest = getUpgradeInfo;
    }
    if (type == 'repair') {
      request = OnlineSystemServices.removeRepaireInfo;
      refreshRequest = getRepairInfo;
    }
    await request(data);
    await refreshRequest(refreshData);
  };
  // 修改封版状态
  const updateSealing = async (data: any, refreshData: any) => {
    await OnlineSystemServices.updateServerApp(data);
    await getServerApp(refreshData);
    await getServerConfirm(refreshData);
  };
  const updateBasic = async (data: any, refreshData: any) => {
    await OnlineSystemServices.updateBasicInfo(data);
    await getBasicInfo(refreshData);
  };
  const updateServerConfirm = async (data: any, refreshData: any) => {
    await OnlineSystemServices.updateServerConfirm(data);
    await getServerConfirm(refreshData);
  };

  const getSelectList = async () => {
    const sqlOrder = await OnlineSystemServices.sqlOrder();
    setSqlList(sqlOrder.map((it: any) => ({label: it.label, value: it.id})));
  };
  useEffect(() => {
    if (
      (location.pathname.includes('onlineSystem/prePublish') ||
        location.pathname.includes('onlineSystem/releaseProcess')) &&
      isEmpty(sqlList)
    ) {
      getSelectList();
    }
  }, [location.pathname]);

  const getLogInfo = (data: { release_num: string; options_model: LogType }) =>
    OnlineSystemServices.getLog(data);

  return {
    globalState,
    sqlList,
    basic,
    server,
    api,
    repair,
    devOpsOrderInfo,
    serverConfirm,
    draft,
    setDraft,
    setGlobalState,
    getReleaseInfo,
    getRepairInfo,
    getDevOpsOrderInfo,
    getServerConfirm,
    getLogInfo,
    removeRelease,
    updateSealing,
    updateBasic,
    updateServerConfirm,
  };
};
