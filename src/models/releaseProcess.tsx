import { useCallback, useState } from 'react';

export default () => {
  /* region 其他全局变量 */

  /* endregion */

  /* region tab 数据 */
  const [tabsData, setTabData] = useState({ activeKey: '', panes: [] });

  // 设置Tab的数据
  const setTabsData = useCallback((activeKey: string, panes: any) => {
    setTabData({ activeKey, panes });
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
  return {
    // tabs
    tabsData,
    setTabsData,
    // 进度条
    processStatus,
    modifyProcessStatus,
  };
};
