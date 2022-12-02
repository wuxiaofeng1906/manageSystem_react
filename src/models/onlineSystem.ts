import { useEffect, useState } from 'react';
import { OnlineSystemServices } from '@/services/onlineSystem';
import PreReleaseServices from '@/services/preRelease';
import { isEmpty } from 'lodash';

export default () => {
  const [globalState, setGlobalState] = useState({ locked: false, finished: false, step: 1 });
  const [basic, setBasic] = useState<any>();
  const [server, setServer] = useState<any[]>([]);
  const [api, setApi] = useState<any[]>([]);
  const [repair, setRepair] = useState<any>({ count: 0, page: 1, page_size: 20, data: [] });
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
    const res = await OnlineSystemServices.getServerApp(data);
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
    const res = await PreReleaseServices.environment();
    const sqlOrder = await OnlineSystemServices.sqlOrder();
    setEnvs(
      res?.map((it: any) => ({
        label: it.online_environment_name ?? '',
        value: it.online_environment_id,
        key: it.online_environment_id,
      })),
    );
    setSqlList(sqlOrder.map((it: any) => ({ label: it.label, value: it.id })));
  };
  useEffect(() => {
    if (location.pathname.includes('onlineSystem/prePublish') && isEmpty(envs)) {
      getSelectList();
    }
  }, [location.pathname]);

  return {
    globalState,
    envs,
    sqlList,
    basic,
    server,
    api,
    repair,
    serverConfirm,
    setGlobalState,
    getReleaseInfo,
    getRepairInfo,
    removeRelease,
    updateSealing,
    updateBasic,
    updateServerConfirm,
  };
};
