import { useState } from 'react';
import { OnlineSystemServices } from '@/services/onlineSystem';

export default () => {
  const [globalState, setGlobalState] = useState({ locked: false, finished: false, step: 2 });
  const [releaseInfo, setReleaseInfo] = useState<{
    basicInfo: any;
    serverApp: any[];
    upgradeInfo: any[];
    repairInfo: { pages: any; data: any[] };
    serverConfirm: any[];
  }>({
    basicInfo: [],
    serverApp: [],
    upgradeInfo: [],
    repairInfo: { pages: null, data: [] },
    serverConfirm: [],
  });

  const getReleaseInfo = (data: any) => {
    if (data) {
      getBasicInfo(data);
      getServerApp(data);
      getUpgradeInfo(data);
      getRepairInfo(data);
      getServerConfirm(data);
    }
  };

  const getRepairInfo = async (data: any, page = 1, size = 20) => {
    const res = await OnlineSystemServices.getRepairInfo({
      release_num: data?.release_num,
      page,
      page_size: size,
    });
    setReleaseInfo({ ...releaseInfo, repairInfo: res });
  };

  const getServerApp = async (data: any) => {
    const res = await OnlineSystemServices.getServerApp(data);
    setReleaseInfo({ ...releaseInfo, serverApp: res ?? [] });
  };
  const getBasicInfo = async (data: any) => {
    const res = await OnlineSystemServices.getBasicInfo(data);
    setReleaseInfo({ ...releaseInfo, basicInfo: res });
  };
  const getUpgradeInfo = async (data: any) => {
    const res = await OnlineSystemServices.getUpgradeInfo(data);
    setReleaseInfo({ ...releaseInfo, upgradeInfo: res });
  };
  const getServerConfirm = async (data: any) => {
    const res = await OnlineSystemServices.getServerConfirm(data);
    setReleaseInfo({ ...releaseInfo, serverConfirm: res });
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
  };

  return {
    globalState,
    releaseInfo,
    setGlobalState,
    getReleaseInfo,
    getRepairInfo,
    removeRelease,
    updateSealing,
  };
};
