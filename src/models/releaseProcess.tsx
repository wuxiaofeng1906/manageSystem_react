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

  return {
    tabsData,
    setTabsData,
  };
};
