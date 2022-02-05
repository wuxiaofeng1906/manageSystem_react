import React, {useEffect} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import Tab from './components/Tab';
import CheckProgress from './components/CheckProgress';
import PreReleaseProject from './components/PreReleaseProject';
import UpgradeService from "./components/UpgradeService";
import {alalysisInitData} from './datas/dataAnalyze';
import {useRequest} from 'ahooks';
import {useModel} from '@@/plugin-model/useModel';
import {getCheckProcess} from './components/CheckProgress/axiosRequest';
import {showProgressData} from './components/CheckProgress/processAnalysis';
import {deleteLockStatus} from "@/pages/onDutyAndRelease/preRelease_bck/supplementFile/lock/rowLock";

const PreRelease: React.FC<any> = () => {
  const initData: any = useRequest(() => alalysisInitData('', '')).data;

  //Tab标签数据显示
  const {setTabsData, modifyProcessStatus, modifyPreReleaseData, lockedItem} = useModel('releaseProcess');

  const showPageInitData = async () => {
    if (initData) {
      // Tab数据
      const {tabPageInfo} = initData;
      setTabsData(tabPageInfo?.activeKey, tabPageInfo.panes);
      // 进度条数据
      const processData: any = await getCheckProcess(tabPageInfo?.activeKey);
      if (processData) {
        modifyProcessStatus(showProgressData(processData.data));
      }
      // 预发布项目
      const preReleaseProject = initData?.preProject;
      modifyPreReleaseData(preReleaseProject);
    }
  };

  useEffect(() => {
    showPageInitData();
  }, [initData]);

  /* region 释放锁 */
  // 刷新释放正锁住的锁
  window.onbeforeunload = () => {
    deleteLockStatus(lockedItem);

  };

  // 窗口关闭释放锁
  window.onunload = () => {
    deleteLockStatus(lockedItem);

  };

  // 页面报错时释放锁
  window.addEventListener('error', () => {
      deleteLockStatus(lockedItem);
    }, true,
  );

  /* endregion */

  return (
    <PageContainer style={{backgroundColor: 'white'}}>
      <Tab/>
      <CheckProgress/>
      <PreReleaseProject/>
      <UpgradeService/>
    </PageContainer>
  );
};

export default PreRelease;
