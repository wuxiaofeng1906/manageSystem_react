import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import Tab from './components/Tab';
import CheckProgress from './components/CheckProgress';
import { alalysisInitData } from './datas/dataAnalyze';
import { useRequest } from 'ahooks';
import { useModel } from '@@/plugin-model/useModel';
import { getCheckProcess } from './components/CheckProgress/axiosRequest';
import { showProgressData } from './components/CheckProgress/processAnalysis';

const PreRelease: React.FC<any> = () => {
  const initData: any = useRequest(() => alalysisInitData('', '')).data;

  //Tab标签数据显示
  const { setTabsData, modifyProcessStatus } = useModel('releaseProcess');

  const showPageInitData = async () => {
    if (initData) {
      // Tab数据
      const { tabPageInfo } = initData;
      setTabsData(tabPageInfo?.activeKey, tabPageInfo.panes);

      // 进度条数据
      const processData: any = await getCheckProcess(tabPageInfo?.activeKey);
      if (processData) {
        modifyProcessStatus(showProgressData(processData.data));
      }
    }
  };

  useEffect(() => {
    showPageInitData();
  }, [initData]);

  return (
    <PageContainer style={{ backgroundColor: 'white' }}>
      <Tab />
      <CheckProgress />
    </PageContainer>
  );
};

export default PreRelease;
