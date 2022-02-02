import { useState } from 'react';

export default () => {
  const [tabsData, setTabsData] = useState({ activeKey: '', panes: [] });

  return {
    tabsData,
    setTabsData,
  };
};
