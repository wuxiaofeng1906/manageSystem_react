import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import Tab from './components/Tab';
import { alalysisInitData } from './datas/dataAnalyze';
import { useRequest } from 'ahooks';
import { useModel } from '@@/plugin-model/useModel';

const PreRelease: React.FC<any> = () => {
  const initData: any = useRequest(() => alalysisInitData('', '')).data;

  //Tab标签数据显示
  const { setTabsData } = useModel('releaseProcess');

  useEffect(() => {
    if (initData) {
      const { tabPageInfo } = initData;
      setTabsData(tabPageInfo?.activeKey, tabPageInfo.panes);
    }
  }, [initData]);

  return (
    <PageContainer>
      <Tab />
    </PageContainer>
  );
};

export default PreRelease;
