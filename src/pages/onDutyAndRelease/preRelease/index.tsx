import React, {useEffect} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import Tab from './components/Tab';
import CheckProgress from './components/CheckProgress';
import PreReleaseProject from './components/PreReleaseProject';
import UpgradeService from "./components/UpgradeService";
import DataRepaireReview from "./components/DataRepaireReview";
import OnlineBranch from "./components/OnlineBranch";
import CorrespondingWorkOrder from "./components/CorrespondingWorkOrder";
import {alalysisInitData} from './datas/dataAnalyze';
import {useRequest} from 'ahooks';
import {useModel} from '@@/plugin-model/useModel';
import {getCheckProcess} from './components/CheckProgress/axiosRequest';
import {showProgressData} from './components/CheckProgress/processAnalysis';
import {deleteLockStatus} from "./lock/rowLock";
import {getGridHeight} from './components/gridHeight';
import {showReleasedId} from "./components/UpgradeService/idDeal/dataDeal";

const PreRelease: React.FC<any> = () => {
  const initData: any = useRequest(() => alalysisInitData('', '')).data;

  //Tab标签数据显示
  const {
    setTabsData, modifyProcessStatus, modifyPreReleaseData, lockedItem,
    setRelesaeItem, setUpgradeApi, setUpgradeConfirm, modifyReleasedID,
    setDataReview, setDataReviewConfirm, setCorrespOrder
  } = useModel('releaseProcess');


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


      //  发布项
      const releaseItem = initData?.upService_releaseItem;
      setRelesaeItem({gridHight: getGridHeight(releaseItem.length).toString(), gridData: releaseItem});
      // 一键部署ID展示
      const ids = await showReleasedId(releaseItem);
      modifyReleasedID(ids.showIdArray, ids.queryIdArray);
      //  发布接口
      const releaseApi = initData?.upService_interface;
      setUpgradeApi({gridHight: getGridHeight(releaseApi.length).toString(), gridData: releaseApi});
      //  发布服务确认
      const releaseConfirm = initData?.upService_confirm;
      setUpgradeConfirm({gridHight: getGridHeight(releaseConfirm.length).toString(), gridData: releaseConfirm});
      // 数据修复
      const dataRepaire = initData?.reviewData_repaire;
      setDataReview({gridHight: getGridHeight(dataRepaire.length).toString(), gridData: dataRepaire});
      //数据修复确认
      const dataRepaireConfirm = initData?.reviewData_confirm;
      setDataReviewConfirm({
        gridHight: getGridHeight(dataRepaireConfirm.length).toString(),
        gridData: dataRepaireConfirm
      });


      //   对应工单
      const correspondOrderData = initData?.correspondOrder;

      setCorrespOrder({
        gridHight: getGridHeight(correspondOrderData.length).toString(),
        gridData: correspondOrderData
      });
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
      <DataRepaireReview/>
      <OnlineBranch/>
      <CorrespondingWorkOrder/>
    </PageContainer>
  );
};

export default PreRelease;
