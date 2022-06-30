import {useCallback, useState} from 'react';

export default () => {
  /* region 其他全局变量 */

  // 当前被锁id（正在编辑的）
  const [lockedItem, setLockedItem] = useState('');
  const modifyLockedItem = useCallback((lockedString: string) => {
    setLockedItem(lockedString);
  }, []);

  // 界面所有被锁的ID
  const [allLockedArray, setAllLockedArray] = useState([]);
  const modifyAllLockedArray = useCallback((lockedArray: any) => {
    setAllLockedArray(lockedArray);
  }, []);

  // 全局的一键部署ID数据,已发布的一键部署ID，用于保存查询条件，其中包含service等属性
  const [releasedID, setReleasedID] = useState({
    oraID: [],
    queryId: [],
  });
  const modifyReleasedID = useCallback((oraID: any, queryId: any) => {
    setReleasedID({oraID, queryId});
  }, []);


  // 控件是否可用
  const [operteStatus, setOperteStatus] = useState(false);
  const modifyOperteStatus = useCallback((values: boolean) => {
    setOperteStatus(values);
  }, []);

  /* endregion */

  /* region tab 数据 */
  const [tabsData, setTabData] = useState({activeKey: '', panes: []});

  // 设置Tab的数据
  const setTabsData = useCallback((activeKey: string, panes: any) => {
    setTabData({activeKey, panes});
  }, []);

  /* endregion */

  /* region 进度条的显示和设置 */
  const [processStatus, setProcessStatus] = useState({
    // 进度条相关数据和颜色
    releaseProject: 'Gainsboro', // #2BF541
    upgradeService: 'Gainsboro',
    dataReview: 'Gainsboro',
    onliineCheck: 'Gainsboro',
    releaseResult: '9',
    processPercent: 0,
    autoCheckResult: null
  });

  // 设置Tab的数据
  const modifyProcessStatus = useCallback((processData: any) => {
    setProcessStatus(processData);
  }, []);
  /* endregion  */

  /* region 预发布项目数据 */
  const [preReleaseData, setPreReleaseData] = useState({
    projectId: '',
    release_type: '',
    release_way: '',
    plan_release_time: '',
    edit_user_name: '',
    edit_time: '',
    pro_id: '',
    ignoreZentaoList: '',
    checkListStatus: '',
    relateDutyName: ''
  });

  // 设置Tab的数据
  const modifyPreReleaseData = useCallback((data: any) => {
    setPreReleaseData(data);
  }, []);
  /* endregion */

  /* region 表格行数据的删除 */
  const [delModal, setDelModal] = useState({
    // 列表数据删除弹窗
    shown: false,
    type: -1,
    datas: {},
  });

  /* endregion */

  /* region step 2 升级服务 */
  // 发布项数据
  const [releaseItem, setRelesaeItem] = useState({gridHight: "100px", gridData: []});
  // 发布接口数据
  const [upgradeApi, setUpgradeApi] = useState({gridHight: "100px", gridData: []});
  // 升级服务确认
  const [upgradeConfirm, setUpgradeConfirm] = useState({gridHight: "100px", gridData: []});
  /* endregion  */

  /* region step 3 数据修复review */
  // review数据
  const [dataReview, setDataReview] = useState({gridHight: "100px", gridData: []});
  // review数据确认
  const [dataReviewConfirm, setDataReviewConfirm] = useState({gridHight: "100px", gridData: []});
  /* endregion  */

  /* region step 4  上线分支 */
  const [onlineBranch, setOnlineBranch] = useState({gridHight: "100px", gridData: []});
  /* endregion  */

  /* region step 5  对应工单 */
  const [correspOrder, setCorrespOrder] = useState({gridHight: "100px", gridData: []});
  /* endregion  */

  return {
    operteStatus, modifyOperteStatus, // 页面中按钮是否可用
    lockedItem, modifyLockedItem, // 当前被锁的id
    allLockedArray, modifyAllLockedArray, // 所有被锁的ID
    releasedID, modifyReleasedID, // 已选中的一键部署ID
    tabsData, setTabsData, // tabs
    processStatus, modifyProcessStatus, // 进度条
    delModal, setDelModal, // 行数据的删除
    preReleaseData, modifyPreReleaseData, // 预发布数据
    releaseItem, setRelesaeItem,// 发布项
    upgradeApi, setUpgradeApi, // 发布接口
    upgradeConfirm, setUpgradeConfirm,// 升级服务确认
    dataReview, setDataReview, // review 数据
    dataReviewConfirm, setDataReviewConfirm, // review 确认
    onlineBranch, setOnlineBranch, // 上线分支
    correspOrder, setCorrespOrder // 对应工单
  };
};
