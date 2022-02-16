import {GqlClient} from "@/hooks";

// 1.进度数据解析
const alaysisProcessData = (sourceData: any) => {
  if (!sourceData) {
    return [];
  }

  const typeName = [
    {type: "storyplan", name: "需求"},
    {type: "designplan", name: "概设&计划"},
    {type: "devplan", name: "开发"},
    {type: "testplan", name: "测试"},
    {type: "releaseplan", name: "发布"},
    {type: "projectplan", name: "项目计划"}
  ];
  const result: any = [];
  typeName.forEach((Types: any, i: number) => {
    const newData = {
      title: "",
      milestone: Types.name,
      planStart: "",
      planEnd: "",
      actualStart: "",
      actualEnd: "",
      days: "",
      ratio: "",
      memo: "",
    };

    if (i === 0) {
      newData.title = "1.进度";
    }

    for (let index = 0; index < sourceData.length; index += 1) {
      const datas = sourceData[index];
      if (Types.type === datas.type) {
        newData.planStart = datas.planStart;
        newData.planEnd = datas.planEnd;
        newData.actualStart = datas.actualStart;
        newData.actualEnd = datas.actualEnd;
        newData.days = datas.days;
        newData.ratio = datas.ratio;
        newData.memo = datas.memo;

        break;
      }

    }
    result.push(newData);

  });

  return result;
};
const queryProcessData = async (client: GqlClient<object>, projectId: string) => {
  const {data} = await client.query(`
      {

          projectDeviation(pId:${Number(projectId)}){
            planStart
            planEnd
            actualStart
            actualEnd
            type
            days
            ratio
            memo
          }
      }
  `);

  return alaysisProcessData(data?.projectDeviation);
};

// 2.需求稳定性
const alaysisStoryStability = (sourceData: any) => {

  if (!sourceData) {
    return [];
  }

  const typeName = [
    {type: "devplan", name: "开发"},
    {type: "testplan", name: "测试"},
    {type: "releaseplan", name: "发布"},
    {type: "processcycle", name: "项目周期"},
  ];

  const result: any = [];
  typeName.forEach((Types: any, i: number) => {
    const newData = {
      title: "",
      stage: Types.name,
      planHours: "",
      stableHours: "",
      ratio: "",
    };

    if (i === 0) {
      newData.title = "2.需求稳定性";
    }

    for (let index = 0; index < sourceData.length; index += 1) {
      const datas = sourceData[index];
      if (Types.type === datas.kind) {
        newData.planHours = datas.planHours;
        newData.stableHours = datas.stableHours;
        newData.ratio = datas.ratio;
        break;
      }

    }
    result.push(newData);
  });

  return result;

};
const queryStoryStability = async (client: GqlClient<object>, projectId: string) => {
  const {data} = await client.query(`
      {
        storyStable(pId:${Number(projectId)}){
          kind
          planHours
          stableHours
          ratio
        }

      }
  `);

  return alaysisStoryStability(data?.storyStable);
};

// 3.阶段工作量
const alaysisStageWorkload = (sourceData: any) => {

  let stageWorkloadData = sourceData?.stageWorkload;
  if (!stageWorkloadData) {
    stageWorkloadData = [];
  }

  const typeName = [
    {type: "storyplan", name: "需求"},
    {type: "designplan", name: "概设&计划"},
    {type: "devplan", name: "开发"},
    {type: "testplan", name: "测试"},
    {type: "releaseplan", name: "发布"},
  ];

  const result: any = [];
  typeName.forEach((Types: any, i: number) => {
    const newData = {
      title: "",
      stage: Types.name,
      manpower: "",
      planHours: "",
      actualHours: "",
      planWorkload: "",
      actualWorkload: ""
    };

    if (i === 0) {
      newData.title = "3.阶段工作量（单位：人天）";
    }

    for (let index = 0; index < stageWorkloadData.length; index += 1) {
      const datas = stageWorkloadData[index];
      if (Types.type === datas.type) {
        newData.manpower = datas.manpower;
        newData.planHours = datas.planHours;
        newData.actualHours = datas.actualHours;
        newData.planWorkload = datas.planWorkload;
        newData.actualWorkload = datas.actualWorkload;
        break;
      }
    }
    result.push(newData);
  });

  const totalData = {
    title: "",
    stage: "合计",
    manpower: "",
    planHours: "",
    actualHours: "",
    planWorkload: "",
    actualWorkload: "",
  };
  if (sourceData.totalSW) {
    const total = sourceData.totalSW;
    totalData.manpower = total[0] === null ? "" : total[0].toString();
    totalData.planHours = total[1] === null ? "" : total[1].toString();
    totalData.actualHours = total[2] === null ? "" : total[2].toString();
    totalData.planWorkload = total[3] === null ? "" : total[3].toString();
    totalData.actualWorkload = total[4] === null ? "" : total[4].toString();
  }

  // 需要新增总计
  result.push(totalData);

  return result
};
const queryStageWorkload = async (client: GqlClient<object>, projectId: string) => {
  const {data} = await client.query(`
      {

          productWithWorkload(pId:${Number(projectId)}){
            planValue
            actualValue
            planRatio
            actualRatio
            stageWorkload{
              manpower
              planHours
              actualHours
              type
              planWorkload
              actualWorkload
              }
              totalSW
          }
      }
  `);

  return alaysisStageWorkload(data?.productWithWorkload);
};

// 4.生产率
const alaysisProductRate = (sourceData: any) => {

  return [
    {
      title: "4.生产率",
      stage: "功能点",
      planValue: sourceData.planValue,
      actualValue: sourceData.actualValue
    }, {
      title: "",
      stage: "生产率(功能点/人天）",
      planValue: sourceData.planRatio,
      actualValue: sourceData.actualRatio
    }
  ];

};
const queryProductRateload = async (client: GqlClient<object>, projectId: string) => {
  const {data} = await client.query(`
      {

          productWithWorkload(pId:${Number(projectId)}){
            planValue
            actualValue
            planRatio
            actualRatio
            stageWorkload{
              manpower
              planHours
              actualHours
              type
              planWorkload
              actualWorkload
              }
              totalSW
          }
      }
  `);

  return alaysisProductRate(data?.productWithWorkload);
};

// 5评审和缺陷
const alaysisReviewDefect = (sourceData: any, totalData: any) => {

  if (!sourceData) {
    return [];
  }

  const typeName = ["需求预审", "需求评审", "UE预审", "UE评审", "UI预审", "UI评审", "概设评审", "详设评审", "用例评审", "CodeReview",
    "提测演示", "开发自测\\联调", "系统测试", "发布测试"];

  const result: any = [];

  typeName.forEach((Types: any, i: number) => {
    const newData = {
      title: "",
      kind: Types,
      cut: "",
      foundDN: "",
      weightDN: "",
      funcPoint: "",
      defectDensity: "",
      reviewHour: "",
      reviewRatio: ""
    };

    if (i === 0) {
      newData.title = "5.评审和缺陷";
    }
    for (let index = 0; index < sourceData.length; index += 1) {
      const datas = sourceData[index];
      if (Types === datas.kind) {
        newData.cut = datas.cut;
        if (!datas.cut) {  // 如果要裁剪，则不显示相应数据
          newData.foundDN = datas.foundDN;
          newData.weightDN = datas.weightDN;
          newData.funcPoint = datas.funcPoint;
          newData.defectDensity = datas.defectDensity;
          newData.reviewHour = datas.reviewHour;
          newData.reviewRatio = datas.reviewRatio;
        }
        break;
      }

    }
    result.push(newData);
  });

  if (!totalData || totalData.length === 0) {
    result.push({
      kind: "合计",
      foundDN: "",
      weightDN: "",
      funcPoint: "",
      defectDensity: ""
    });
  } else {
    let WD = "";
    if (totalData[1]) {
      WD = (totalData[1].toFixed(2)).toString();
    }

    let DD = "";
    if (totalData[3]) {
      DD = (totalData[3].toFixed(2)).toString()
    }
    result.push({
      kind: "合计",
      foundDN: totalData[0],
      weightDN: WD,
      funcPoint: totalData[2],
      defectDensity: DD
    });
  }

  return result;
};
const queryReviewDefect = async (client: GqlClient<object>, projectId: string) => {
  const {data} = await client.query(`
      {

          reviewDefect(pId:${Number(projectId)}){
            kind
            cut
            foundDN
            weightDN
            funcPoint
            defectDensity
            reviewHour
            reviewRatio
          }
          reviewDefectTotal(pId:${Number(projectId)})
      }
  `);

  return alaysisReviewDefect(data?.reviewDefect, data?.reviewDefectTotal);
};

// 6 过程质量补充数据
const alaysisProcessQuality = (sourceData: any) => {

  if (!sourceData) {
    return [];
  }

  const result = [{
    title: "6 过程质量补充数据",
    module: "开发",
    cut: sourceData.reopenRatio?.cut,
    kind: "Reopen率",
    baseline: "-",
    realValue: sourceData.reopenRatio?.actualValue
  }, {
    title: "",
    module: "",
    cut: sourceData.frontUnitCover?.cut,
    kind: "前端单元测试覆盖率",
    baseline: "-",
    realValue: sourceData.frontUnitCover?.actualValue
  }, {
    title: "",
    module: "",
    cut: sourceData.backUnitCover?.cut,
    kind: "后端单元测试覆盖率",
    baseline: "-",
    realValue: sourceData.backUnitCover?.actualValue
  }, {
    title: "",
    module: "",
    cut: sourceData.bugResolvedDura?.cut,
    kind: "Bug解决时长",
    baseline: "-",
    realValue: sourceData.bugResolvedDura?.actualValue
  }, {
    title: "",
    module: "测试",
    cut: sourceData.bugFlybackDura?.cut,
    kind: "Bug回归时长",
    baseline: "-",
    realValue: sourceData.bugFlybackDura?.actualValue
  }, {
    title: "",
    module: "",
    cut: sourceData.weightedLegacyDefect?.cut,
    kind: "加权遗留缺陷",
    baseline: "-",
    realValue: sourceData.weightedLegacyDefect?.actualValue,
  }, {
    title: "",
    module: "",
    cut: sourceData.weightedLegacyDI?.cut,
    kind: "加权遗留缺陷密度",
    baseline: "-",
    realValue: sourceData.weightedLegacyDI?.actualValue,
  }, {
    title: "",
    module: "质量",
    cut: "度量值",
    kind: "提测通过次数",
    baseline: "提测次数",
    realValue: "一次提测通过率",
    memo:"说明"
  }, {
    title: "",
    module: "",
    cut: "一次提测通过率",
    kind: sourceData.carryTestPass?.succN === undefined ? "" : sourceData.carryTestPass?.succN,
    baseline: sourceData.carryTestPass?.totalN === undefined ? "" : sourceData.carryTestPass?.totalN,
    realValue: sourceData.carryTestPass?.ratio === undefined ? "" : sourceData.carryTestPass?.ratio,
  }];

  return result;
};
const queryProcessQuality = async (client: GqlClient<object>, projectId: string) => {
  const {data} = await client.query(`
      {

          processQuality(pId:${Number(projectId)}){
            reopenRatio {
              actualValue
              baseline
              cut
            }
            bugFlybackDura {
              actualValue
              baseline
              cut
            }
            bugResolvedDura {
              actualValue
              baseline
              cut
            }
            weightedLegacyDefect {
              actualValue
              baseline
              cut
            }
            weightedLegacyDI {
              actualValue
              baseline
              cut
            }
            frontUnitCover {
              actualValue
              baseline
              cut
            }
            backUnitCover {
              actualValue
              baseline
              cut
            }
             carryTestPass{
              succN
              totalN
              ratio
            }
          }
      }
  `);
  return alaysisProcessQuality(data?.processQuality);
};

// 7 服务
const alaysisService = (sourceData: any) => {

  if (!sourceData || sourceData.length === 0) {
    return [{
      title: "7.服务",
      module: "及时交付",
      item: "一次发布成功率",
      succN: "",
      totalN: "",
      ratio: ""
    }];
  }

  const datas = sourceData[0];
  const result = [{
    title: "7.服务",
    module: "及时交付",
    item: "一次发布成功率",
    succN: datas.succN,
    totalN: datas.totalN,
    ratio: datas.ratio
  }];

  return result;
};
const queryServices = async (client: GqlClient<object>, projectId: string) => {
  const {data} = await client.query(`
      {
          serviceAbout(pId:${Number(projectId)}){
            kind
            succN
            totalN
            ratio
          }
      }
  `);
  return alaysisService(data?.serviceAbout);
};
export {
  queryProcessData,
  queryStoryStability,
  queryStageWorkload,
  queryReviewDefect,
  queryProductRateload,
  queryProcessQuality,
  queryServices
};
