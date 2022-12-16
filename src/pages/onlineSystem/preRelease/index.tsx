import React, { useEffect, useRef } from 'react';
import { Spin, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import Tab from './components/Tab';
import CheckProgress from './components/CheckProgress';
import PreReleaseProject from './components/PreReleaseProject';
import UpgradeService from './components/UpgradeService';
import DataRepaireReview from './components/DataRepaireReview';
import OnlineBranch from './components/OnlineBranch';
import CorrespondingWorkOrder from './components/CorrespondingWorkOrder';
import DeleteRow from './components/DeleteRow';
import { alalysisInitData } from './datas/dataAnalyze';
import { useRequest } from 'ahooks';
import { useModel } from '@@/plugin-model/useModel';
import { getCheckProcess } from './components/CheckProgress/axiosRequest';
import { showProgressData } from './components/CheckProgress/processAnalysis';
import { deleteLockStatus, getAllLockedData } from './lock/rowLock';
import { getGridRowsHeight } from './components/gridHeight';
import { showReleasedId } from './components/UpgradeService/idDeal/dataDeal';
import { getNewPageNumber } from './components/Tab/axiosRequest';
import { history } from 'umi';
import { errorMessage } from '@/publicMethods/showMessages';
import { isEmpty } from 'lodash';

let currentKey: any;
let currentPanes: any;
const PreRelease: React.FC<any> = () => {
  // Tab标签数据显示
  const {
    modifyOperteStatus,
    tabsData,
    setTabsData,
    processStatus,
    globalLoading,
    modifyProcessStatus,
    modifyPreReleaseData,
    lockedItem,
    setRelesaeItem,
    setUpgradeApi,
    setUpgradeConfirm,
    modifyReleasedID,
    setDataReview,
    setDataReviewConfirm,
    setOnlineBranch,
    setCorrespOrder,
    modifyAllLockedArray,
    setGlobalLoading,
    operteStatus,
  } = useModel('releaseProcess');

  // 用于定时任务显示数据，定时任务useEffect中渲染了一次。不能实时更新
  currentKey = tabsData.activeKey;
  currentPanes = tabsData.panes;

  // 获取当前链接是否有携带预发布编号（就是区分是否从历史记录跳转过来的），
  const location = history.location.query;
  // 无 releasedNum参数跳转只列表页
  if (!location?.releasedNum) {
    history.replace('/onDutyAndRelease/releaseProcess');
    return <div />;
  }
  let releasedNumStr = '';
  let releaseHistory = 'false'; // 默认为未发布
  if (JSON.stringify(location) !== '{}' && location) {
    releasedNumStr = location?.releasedNum === null ? '' : (location?.releasedNum).toString();
    if (location?.history) {
      releaseHistory = (location?.history).toString();
    }
  } else {
    modifyOperteStatus(false);
  }
  // 查询数据
  const { data, loading } = useRequest(() => alalysisInitData('', releasedNumStr));

  // 显示无数据界面
  const showNoneDataPage = async (resetPartProcess = {}) => {
    // tab 页面
    let releaseNum = currentKey;
    if (releaseNum === '') {
      // 如果当前key为空，则获取
      const newNum = await getNewPageNumber();
      releaseNum = newNum.data?.ready_release_num;
    }
    const panesArray: any = [{ title: `${releaseNum}灰度预发布`, content: '', key: releaseNum }];
    currentKey = releaseNum;
    currentPanes = panesArray;
    setTabsData(releaseNum, panesArray);

    // 进度条
    modifyProcessStatus({
      ...processStatus,
      ...resetPartProcess,
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
      release_type: '1',
      release_way: '1',
      plan_release_time: undefined,
      edit_user_name: '',
      edit_time: '',
      pro_id: '',
      ignoreZentaoList: '2',
      checkListStatus: '',
      release_cluster: 'tenant',
    });

    //  发布项
    setRelesaeItem({ gridHight: '100px', gridData: [] });
    // 一键部署ID展示
    modifyReleasedID([]);
    //  发布接口
    setUpgradeApi({ gridHight: '100px', gridData: [] });
    //  发布服务确认
    setUpgradeConfirm({ gridHight: '100px', gridData: [] });
    // 数据修复
    // @ts-ignore
    setDataReview({ gridHight: '100px', gridData: [{}] });
    // 数据修复确认
    setDataReviewConfirm({ gridHight: '100px', gridData: [] });

    // 上线分支
    // @ts-ignore
    setOnlineBranch({ gridHight: '100px', gridData: [{}] });

    //   对应工单
    setCorrespOrder({ gridHight: '100px', gridData: [] });
  };

  // 显示有数据界面
  const showPageInitData = async (
    initData: any,
    initShow: boolean = false,
    isAutoRefresh = false,
  ) => {
    if (initData === undefined) {
      return;
    }
    if (releasedNumStr) {
      currentKey = releasedNumStr;
    }
    if (initData?.errmessage) {
      // 出现异常情况时候，提醒错误，不更新界面。
      setGlobalLoading(false);
      errorMessage(initData?.errmessage.toString());
      return;
    }
    // 自动刷新时无数据不更新数据
    if (isEmpty(initData)) {
      // 初始化的时候无数据再显示，自动刷新无数据不更新界面
      if (initShow) {
        // 无数据重置自动化检查
        showNoneDataPage({ autoCheckResult: '' });
      }
      return;
    }

    // Tab数据
    const { tabPageInfo } = initData;
    if (initShow) {
      if (!currentKey) return history.replace('/onDutyAndRelease/releaseProcess');
      // 针对路径无releaseNum时，全量获取所有tab
      if (releaseHistory === 'false' && !currentKey) {
        // 通过链接跳转到固定Tab
        const source: any = await alalysisInitData('tabPageInfo');
        const tabsInfomation: any = source?.tabPageInfo;
        setTabsData(tabPageInfo?.activeKey, tabsInfomation?.panes);
      } else {
        setTabsData(tabPageInfo?.activeKey, tabPageInfo?.panes);
      }
    } else {
      setTabsData(tabPageInfo?.activeKey, currentPanes);
    }
    // 进度条数据
    const processData: any = await getCheckProcess(tabPageInfo?.activeKey);
    if (processData) {
      // 根据发布结果判定是否可以进行修改
      modifyOperteStatus(processData.data?.release_result !== '9');
      modifyProcessStatus(await showProgressData(processData.data));
    }

    // 当前界面被锁住的ID
    const lockedData = await getAllLockedData(tabPageInfo?.activeKey);
    modifyAllLockedArray(lockedData.data);
    // 预发布项目
    const preReleaseProject = initData?.preProject;

    // 忽略自动刷新step1
    if (!isAutoRefresh) {
      modifyPreReleaseData(preReleaseProject);
    }

    //  发布项
    const releaseItem = initData?.upService_releaseItem;
    setRelesaeItem({ gridHight: getGridRowsHeight(releaseItem), gridData: releaseItem });
    // 一键部署ID展示
    const ids = await showReleasedId(initData?.deployment_id);
    modifyReleasedID(ids);
    //  发布接口
    const releaseApi = initData?.upService_interface;
    setUpgradeApi({ gridHight: getGridRowsHeight(releaseApi), gridData: releaseApi });
    //  发布服务确认
    const releaseConfirm = initData?.upService_confirm;
    setUpgradeConfirm({ gridHight: getGridRowsHeight(releaseConfirm), gridData: releaseConfirm });
    // 数据修复
    const dataRepaire = initData?.reviewData_repaire;
    // if (!dataRepaire || dataRepaire.length === 0) {
    //   dataRepaire = [{}];
    // }
    // const dataRepaire = (initData?.reviewData_repaire).length === 0 ? [{}] : initData?.reviewData_repaire;

    setDataReview({ gridHight: getGridRowsHeight(dataRepaire), gridData: dataRepaire });
    // 数据修复确认
    const dataRepaireConfirm = initData?.reviewData_confirm;
    setDataReviewConfirm({
      gridHight: getGridRowsHeight(dataRepaireConfirm),
      gridData: dataRepaireConfirm,
    });

    // 上线分支
    const onlineBranchDatas = initData?.onlineBranch;
    setOnlineBranch({
      gridHight: getGridRowsHeight(onlineBranchDatas, true),
      gridData: onlineBranchDatas,
    });

    //   对应工单
    const correspondOrderData = initData?.correspondOrder;
    setCorrespOrder({
      gridHight: getGridRowsHeight(correspondOrderData),
      gridData: correspondOrderData,
    });
  };

  useEffect(() => {
    currentKey = '';
    currentPanes = [];
    modifyOperteStatus(false);
    showPageInitData(data, true);
  }, [data, loading]);

  useEffect(() => {
    Modal?.destroyAll?.();
  }, []);

  const interValRef: any = useRef(); // 定时任务数据id保存
  // 定时任务
  useEffect(() => {
    if (operteStatus && !currentKey) {
      clearInterval(interValRef.current);
      return;
    }
    if (!interValRef.current) {
      const id = setInterval(async () => {
        if (lockedItem === '' && releaseHistory === 'false') {
          // 是历史记录查询则不需要进行刷新
          const datas = await alalysisInitData('', currentKey);
          showPageInitData(datas, false, true);
        }
      }, 30 * 1000);

      interValRef.current = id;
    }
    return () => clearInterval(interValRef.current);
  }, [operteStatus]);

  /* region 释放锁 */
  // 刷新释放正锁住的锁
  window.onbeforeunload = () => {
    deleteLockStatus(lockedItem);
  };

  // 窗口关闭释放锁
  window.onunload = () => {
    currentKey = '';
    currentPanes = [];
    modifyOperteStatus(false);
    deleteLockStatus(lockedItem);
  };

  // 页面报错时释放锁
  window.addEventListener(
    'error',
    () => {
      if (window.location.pathname == '/onDutyAndRelease/preRelease') {
        console.log('error', window.location.pathname);
        deleteLockStatus(lockedItem);
      }
    },
    true,
  );

  /* endregion */

  return (
    <PageContainer style={{ backgroundColor: 'white' }} title={'非积压发布'}>
      <Spin spinning={loading || globalLoading} tip={'数据加载中...'}>
        <Tab />
        <CheckProgress
          refreshPage={async () => {
            setTabsData('', []);
            setGlobalLoading(true);
            const datas = await alalysisInitData('', location?.releasedNum as string);
            showPageInitData(datas, true);
            setGlobalLoading(false);
          }}
        />
        <PreReleaseProject />
        <OnlineBranch />
        <DataRepaireReview />
        <UpgradeService />
        <CorrespondingWorkOrder />
        <DeleteRow />
      </Spin>
    </PageContainer>
  );
};

export default PreRelease;