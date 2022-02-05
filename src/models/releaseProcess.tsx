import {useCallback, useState} from 'react';

export default () => {
  /* region 其他全局变量 */

  // 全局的被锁id
  const [lockedItem, setLockedItem] = useState('');
  const modifyLockedItem = useCallback((lockedString: string) => {
    setLockedItem(lockedString);
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
  });

  // 设置Tab的数据
  const modifyPreReleaseData = useCallback((data: any) => {
    setPreReleaseData(data);
  }, []);
  /* endregion */

  /* region 发布项数据 */
  const [releaseItem, setRelesaeItem] = useState({gridHight: "100px", gridData: []});
  const modifyRelesaeItem = useCallback((height: string, data: any) => {
    setRelesaeItem({gridHight: height, gridData: data});
  }, []);
  /* endregion  */

  /* region 发布接口数据 */
  const [upgradeApi, setUpgradeApi] = useState({gridHight: "100px", gridData: []});
  const modifyUpgradeApi = useCallback((height: string, data: any) => {
    setUpgradeApi({gridHight: height, gridData: data});
  }, []);
  /* endregion  */

  /* region 升级服务确认 */
  const [upgradeConfirm, setUpgradeConfirm] = useState({gridHight: "100px", gridData: []});
  const modifyUpgradeConfirm = useCallback((height: string, data: any) => {
    setUpgradeConfirm({gridHight: height, gridData: data});
  }, []);
  /* endregion  */
  return {
    lockedItem, modifyLockedItem, //被锁的id
    tabsData, setTabsData, // tabs
    processStatus, modifyProcessStatus, // 进度条
    preReleaseData, modifyPreReleaseData, // 预发布数据
    releaseItem, modifyRelesaeItem,// 发布项
    upgradeApi, modifyUpgradeApi, // 发布接口
    upgradeConfirm, modifyUpgradeConfirm // 升级服务确认
  };
};
