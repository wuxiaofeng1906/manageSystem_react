import { useCallback, useState } from 'react';

export default () => {
  const [tabsData, setTabData] = useState({ activeKey: '', panes: [] });

  // 设置Tab的数据
  const setTabsData = useCallback((activeKey: string, panes: any) => {
    setTabData({ activeKey, panes });
  }, []);

  return {
    tabsData,
    setTabsData,
  };
};
