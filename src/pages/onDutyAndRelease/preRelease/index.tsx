import React, {useEffect, useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import Tab from './components/Tab';
import CheckProgress from './components/CheckProgress';
import PreReleaseProject from './components/PreReleaseProject';
import UpgradeService from "./components/UpgradeService";
import DataRepaireReview from "./components/DataRepaireReview";
import OnlineBranch from "./components/OnlineBranch";
import CorrespondingWorkOrder from "./components/CorrespondingWorkOrder";
import DeleteRow from "./components/DeleteRow";
import {alalysisInitData} from './datas/dataAnalyze';
import {useRequest} from 'ahooks';
import {useModel} from '@@/plugin-model/useModel';
import {getCheckProcess} from './components/CheckProgress/axiosRequest';
import {showProgressData} from './components/CheckProgress/processAnalysis';
import {deleteLockStatus, getAllLockedData} from "./lock/rowLock";
import {getGridHeight} from './components/gridHeight';
import {showReleasedId} from "./components/UpgradeService/idDeal/dataDeal";
import {getNewPageNumber} from './components/Tab/axiosRequest';

const PreRelease: React.FC<any> = () => {
  const {data, loading} = useRequest(() => alalysisInitData('', ''));

  // Tab标签数据显示
  const {
    tabsData, setTabsData, modifyProcessStatus, modifyPreReleaseData, lockedItem, allLockedArray,
    setRelesaeItem, setUpgradeApi, setUpgradeConfirm, modifyReleasedID,
    setDataReview, setDataReviewConfirm, setOnlineBranch, setCorrespOrder,
    modifyAllLockedArray
  } = useModel('releaseProcess');

  const showNoneDataPage = async () => {

    // tab 页面
    const newNum = await getNewPageNumber();
    const releaseNum = newNum.data?.ready_release_num;
    const panesArray: any = [
      {
        title: `${releaseNum}灰度预发布`,
        content: '',
        key: releaseNum,
      },
    ];
    setTabsData(releaseNum, panesArray);

    // 进度条
    modifyProcessStatus({
      // 进度条相关数据和颜色
      releaseProject: 'Gainsboro', // #2BF541
      upgradeService: 'Gainsboro',
      dataReview: 'Gainsboro',
      onliineCheck: 'Gainsboro',
      releaseResult: '9',
      processPercent: 0,
    });

    // 预发布项目
    modifyPreReleaseData({
      projectId: undefined,
      release_type: '',
      release_way: '',
      plan_release_time: undefined,
      edit_user_name: '',
      edit_time: '',
      pro_id: '',
    });

    //  发布项
    setRelesaeItem({gridHight: "100px", gridData: []});
    // 一键部署ID展示
    modifyReleasedID([], []);
    //  发布接口
    setUpgradeApi({gridHight: "100px", gridData: []});
    //  发布服务确认
    setUpgradeConfirm({gridHight: "100px", gridData: []});
    // 数据修复
    setDataReview({gridHight: "100px", gridData: []});
    // 数据修复确认
    setDataReviewConfirm({gridHight: "100px", gridData: []});

    // 上线分支
    setOnlineBranch({gridHight: "100px", gridData: [{}]});

    //   对应工单
    setCorrespOrder({gridHight: "100px", gridData: []});
  };

  const showPageInitData = async (initData: any, initShow: boolean) => {
    if (!initData || JSON.stringify(initData) === '{}') {
      showNoneDataPage();
      return;
    }


    // Tab数据
    const {tabPageInfo} = initData;
    if (initShow) {
      setTabsData(tabPageInfo?.activeKey, tabPageInfo.panes);

    } else {
      setTabsData(tabPageInfo?.activeKey, tabsData.panes);

    }
    // 进度条数据
    const processData: any = await getCheckProcess(tabPageInfo?.activeKey);
    if (processData) {
      modifyProcessStatus(showProgressData(processData.data));
    }
    // 当前界面被锁住的ID
    const lockedData = await getAllLockedData(tabPageInfo?.activeKey);
    modifyAllLockedArray(lockedData.data);
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
    // 数据修复确认
    const dataRepaireConfirm = initData?.reviewData_confirm;
    setDataReviewConfirm({
      gridHight: getGridHeight(dataRepaireConfirm.length).toString(),
      gridData: dataRepaireConfirm
    });

    // 上线分支
    const onlineBranchDatas = initData?.onlineBranch;
    setOnlineBranch({
      gridHight: getGridHeight(onlineBranchDatas.length, true).toString(),
      gridData: onlineBranchDatas
    });

    //   对应工单
    const correspondOrderData = initData?.correspondOrder;
    setCorrespOrder({
      gridHight: getGridHeight(correspondOrderData.length).toString(),
      gridData: correspondOrderData
    });

  };
  // showPageInitData(data, true);
  useEffect(() => {
    showPageInitData(data, true);
  }, [data, loading]);
  //
  // const interValRef: any = useRef(); // 定时任务数据id保存
  // console.log("tabsData", tabsData);
  // 定时任务
  // useEffect(() => {
  //   if (!interValRef.current) {
  //     console.log('interValRef.current', interValRef.current);
  //     let count = 0;
  //     const id = setInterval(async () => {
  //       // console.log("lockedItem", lockedItem);
  //       count += 1;
  //       console.log(`刷新次数${count},定时任务id${id}`);
  //       // if (lockedItem === "") {  // 只有在没被锁定的时候才动态加载
  //       // 刷新
  //       console.log("tabsData.activeKey", tabsData.activeKey);
  //       const datas = await alalysisInitData('', tabsData.activeKey);
  //       showPageInitData(datas, false);
  //       // }
  //
  //     }, 30 * 1000);
  //
  //     interValRef.current = id;
  //   }
  //
  //   return () => clearInterval(interValRef.current);
  // }, []);

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
      <DeleteRow/>
    </PageContainer>
  );
};

export default PreRelease;
