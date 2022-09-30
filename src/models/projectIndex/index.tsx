import {useCallback, useState} from "react";

export default () => {
  /* region  公共state */
  const [browserHeight, setBrowserHeight] = useState(document.body.clientHeight - 140);
  const [refreshState, setRefreshState] = useState(false);
  const [currentTab, setCurrentTab] = useState("target_1");
  /* endregion */

  /* region 表格数据 */
  // 项目质量
  const [prjQualityData, setPrjQualityData] = useState({
    data: [],
    height: 250,
    basicHeight: 100
  });

  // 测试数据
  const [testData, settestData] = useState({
    data: [],
    height: 250,
    basicHeight: 100
  });

  // 开发人员数据
  const [devUserData, setDevUserData] = useState({
    data: [],
    height: 250,
    basicHeight: 150
  });

  // 测试人员数据
  const [testUserData, setTestUserData] = useState({
    data: [],
    height: 250,
    basicHeight: 100
  });

  // 阶段工作量
  const [stageWorkloadData, setStageWorkloadData] = useState({
    data: [],
    height: 250,
    basicHeight: 60,
  });
  // 产能
  const [productCapacityData, setProductCapacityData] = useState({
    data: [],
    height: 250,
    basicHeight: 70,
  });

  // 评审缺陷问题
  const [reviewDefectData, setReviewDefectData] = useState({
    data: [],
    height: 250,
    basicHeight: 60
  });

  // 过程质量补充数据
  const [processQualityData, setProcessQualityData] = useState({
    data: [],
    height: 250,
    basicHeight: 80
  });

  // 服务
  const [serviceData, setServiceData] = useState({
    data: [],
    height: 250,
    basicHeight: 80
  });

  // 里程碑进度
  const [milesProcessData, setMilesProcessData] = useState({
    data: [],
    height: 250,
    basicHeight: 60
  });
  // 关键活动时间点
  const [pivotalTimeData, setPivotalTimeData] = useState({
    data: [],
    height: 250,
    basicHeight: 80
  });
  // 需求稳定性
  const [storyStabilityData, setStoryStabilityData] = useState({
    data: [],
    height: 250,
    basicHeight: 60
  });
  // Bug模块所占比
  const [bugPercentPData, setBugPercentPData] = useState({
    data: []
  });
  /* endregion 表格数据 */

  return {
    browserHeight, setBrowserHeight, // 浏览器窗口高度
    refreshState, setRefreshState, // 数据刷新状态
    currentTab, setCurrentTab, // 当前tab是哪个

    prjQualityData, setPrjQualityData, // 项目质量的数据和表格高度
    testData, settestData,// 测试数据
    devUserData, setDevUserData, // 开发人员数据
    testUserData, setTestUserData, // 测试人员数据

    stageWorkloadData, setStageWorkloadData, // 阶段工作量
    productCapacityData, setProductCapacityData, // 产能
    reviewDefectData, setReviewDefectData, // 评审和缺陷
    processQualityData, setProcessQualityData, // 过程质量
    serviceData, setServiceData, // 服务

    milesProcessData, setMilesProcessData, // 里程碑进度
    pivotalTimeData, setPivotalTimeData, // 关键活动时间点
    storyStabilityData, setStoryStabilityData, // 需求稳定性
    bugPercentPData, setBugPercentPData, // Bug模块占比

  }
};
