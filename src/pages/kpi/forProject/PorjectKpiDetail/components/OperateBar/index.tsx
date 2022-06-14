import React from 'react';
import {Button, message, Select} from 'antd';
import {useModel} from "@@/plugin-model/useModel";
import {ExportOutlined, QuestionCircleTwoTone} from "@ant-design/icons";
import "./indexStyle.css";
import {exportToExcel} from "../../export";
import {
  queryProcessQuality,
  queryProductRateload, queryReviewDefect, queryServices,
  queryStageWorkload
} from "@/pages/kpi/forProject/PorjectKpiDetail/components/ProjectIndicator2/gridData";
import {useGqlClient} from "@/hooks";
import {
  queryProcessData,
  queryStoryStability
} from "@/pages/kpi/forProject/PorjectKpiDetail/components/ProjectIndicator3/gridData";
import {refreshProject} from "./data/axiosRequest";
import {errorMessage} from "@/publicMethods/showMessages";
import {queryProjectQualityload} from "@/pages/kpi/forProject/PorjectKpiDetail/components/ProjectIndicator1/gridData";


const {Option} = Select;

const OperateBar: React.FC<any> = (props: any) => {
  const {
    setRefreshState, prjQualityData, testData, currentTab,
    setPrjQualityData, settestData, setDevUserData, setTestUserData,
    stageWorkloadData, setStageWorkloadData, productCapacityData, setProductCapacityData,
    reviewDefectData, setReviewDefectData, processQualityData, setProcessQualityData,
    serviceData, setServiceData, milesProcessData, setMilesProcessData,
    setPivotalTimeData, storyStabilityData, setStoryStabilityData, setBugPercentPData
  } = useModel('projectIndex.index');

  const projectId = props.id;
  const gqlClient = useGqlClient();


  // 更新数据
  const updateCurrentTabsData = async () => {

    if (currentTab === "target_1") {

      console.log("tab1")
    } else if (currentTab === "target_2") {
      const stageData = await queryStageWorkload(gqlClient, projectId);
      setStageWorkloadData({
        ...stageWorkloadData,
        data: stageData,
        height: stageData.length * 32 + stageWorkloadData.basicHeight
      });
      const pdCapacityData: any = await queryProductRateload(gqlClient, projectId);
      setProductCapacityData({
        ...productCapacityData,
        data: pdCapacityData,
        height: pdCapacityData.length * 32 + productCapacityData.basicHeight
      });
      const defectData = await queryReviewDefect(gqlClient, projectId);
      setReviewDefectData({
        ...reviewDefectData,
        data: defectData,
        height: defectData.length * 32 + reviewDefectData.basicHeight
      });
      const processQuaData: any = await queryProcessQuality(gqlClient, projectId);
      setProcessQualityData({
        ...processQualityData,
        data: processQuaData,
        height: processQuaData.length * 32 + processQualityData.basicHeight
      });
      const serviceDatas: any = await queryServices(gqlClient, projectId);
      setServiceData({
        ...serviceData,
        data: serviceDatas,
        height: serviceDatas.length * 32 + serviceData.basicHeight
      });
    } else if (currentTab === "target_3") {
      const processData = await queryProcessData(gqlClient, projectId);
      setMilesProcessData({
        ...milesProcessData,
        data: processData,
        height: processData.length * 32 + milesProcessData.basicHeight
      });
      const storyStbData = await queryStoryStability(gqlClient, projectId);
      setStoryStabilityData({
        ...storyStabilityData,
        data: storyStbData,
        height: storyStbData.length * 32 + storyStabilityData.basicHeight
      });
    }
  }

  // 数据刷新
  const refreshGrid = async (params: any) => {

    setRefreshState(true);
    let refreshResult: any;
    if (params === "target_1") {
      console.log("刷新tab1");
    } else if (params === "target_2") {
      console.log("刷新tab2");
    } else if (params === "target_3") {
      console.log("刷新tab3");
    } else { // 全部
      refreshResult = await refreshProject(projectId);
    }

    if (refreshResult && refreshResult.flag) {
      // 只更新当前tab的数据
      await updateCurrentTabsData();
    } else {
      // errorMessage(refreshResult.errorMessage);
    }
    setRefreshState(false);
  };

  // 导出数据
  const exportAllExcell = async () => {
    // 需要获取数据，不能用存在state中的数据（在未点击其中一个Tab之前就去导出，state中没有相关Tab中的数据）
    const indicatorData = [
      {
        prjQualityData: await queryProjectQualityload(gqlClient, projectId),
        // testData: testData.data
      },
      {
        stageWorkData: await queryStageWorkload(gqlClient, projectId),
        productCapacityData: await queryProductRateload(gqlClient, projectId),
        reviewDefectData: await queryReviewDefect(gqlClient, projectId),
        processQualityData: await queryProcessQuality(gqlClient, projectId),
        serviceData: await queryServices(gqlClient, projectId)
      },
      {
        milesProcessData: await queryProcessData(gqlClient, projectId),
        storyStabilityData: await queryStoryStability(gqlClient, projectId)
      }];

    exportToExcel(indicatorData, props.name);
  };
  return (
    <div className="operateDiv">
      <label>刷新:</label>
      <Select style={{width: 120, marginLeft: 10}} size={"small"} onChange={refreshGrid}>
        <Option value="target_1">度量指标1</Option>
        <Option value="target_2">度量指标2</Option>
        <Option value="target_3">度量指标3</Option>
        <Option value="all">全部</Option>
      </Select>

      {/* <Button type="text" icon={<ReloadOutlined/>} onClick={refreshGrid} size={'large'}
      >刷新</Button> */}
      <Button type="text" icon={<ExportOutlined/>} onClick={exportAllExcell} size={'middle'}
      >导出</Button>
      <Button type="text" style={{color: '#1890FF'}}
              icon={<QuestionCircleTwoTone/>} size={'middle'}>
        <a href={"https://shimo.im/docs/gO3oxWKg6yFwL0qD"} target={"_blank"} style={{marginLeft: 5}}>计算规则</a>
      </Button>
    </div>
  );
};

export default OperateBar;
