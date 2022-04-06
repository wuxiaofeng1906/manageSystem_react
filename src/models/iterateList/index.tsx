import {useCallback, useState} from 'react';

export default () => {


  /* region tab 数据 */
  const [tabsInfo, setTabsInfo] = useState({activeKey: '需求基线'});

  // 设置Tab的数据
  const setTabsData = useCallback((activeKey: string) => {
    setTabsInfo({activeKey});
  }, []);

  /* endregion */


  return {
    tabsInfo, setTabsData, // tabs
  };
};
