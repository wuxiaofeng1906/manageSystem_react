import {GqlClient} from "@/hooks";

/* region  阶段工作量 */
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
      actualWorkload: "",
      stageRatio: "",
      description: "",

    };

    if (i === 0) {
      newData.title = "阶段工作量（单位：人天）";
      newData["rowSpan"] = 6;
    }

    for (let index = 0; index < stageWorkloadData.length; index += 1) {
      const datas = stageWorkloadData[index];
      if (Types.type === datas.type) {
        newData.manpower = datas.manpower;
        newData.planHours = datas.planHours;
        newData.actualHours = datas.actualHours;
        newData.planWorkload = datas.planWorkload;
        newData.actualWorkload = datas.actualWorkload;
        newData.stageRatio = datas.stageRatio;
        newData.description = datas.description
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
    stageRatio: "",
    description: ""
  };

  if (sourceData.totalSW) {
    const total = sourceData.totalSW;
    totalData.manpower = total[0] === null ? "" : total[0].toString();
    totalData.planHours = total[1] === null ? "" : total[1].toString();
    totalData.actualHours = total[2] === null ? "" : total[2].toString();
    totalData.planWorkload = total[3] === null ? "" : total[3].toString();
    totalData.actualWorkload = total[4] === null ? "" : total[4].toString();
    totalData.stageRatio = total[5] === null ? "" : total[5].toString();
    totalData.description = sourceData.description;
  }

  // 需要新增总计
  result.push(totalData);

  return result
};

// 阶段工作量
const queryStageWorkload = async (client: GqlClient<object>, projectId: string) => {
  const {data} = await client.query(`
      {

          productWithWorkload(pId:${Number(projectId)}){
            stageWorkload{
              manpower
              planHours
              actualHours
              type
              planWorkload
              actualWorkload
              stageRatio
              description
              }
              description
              totalSW
          }
      }
  `);

  return alaysisStageWorkload(data?.productWithWorkload);
};

/* endregion  阶段工作量 */

/* region 产能 */
const alaysisProductRate = (sourceData: any) => {

  return [
    {
      title: "产能",
      stage: "功能点",
      planValue: sourceData.planValue,
      actualValue: sourceData.actualValue,
      description: sourceData.fpDescription,
      rowSpan: 2.5
    }, {
      title: "",
      stage: "生产率(功能点/人天）",
      planValue: sourceData.currentRatio,
      actualValue: sourceData.actualRatio,
      description: sourceData.raDescription
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
            currentRatio
            actualRatio
            fpDescription
            raDescription
          }
      }
  `);

  return alaysisProductRate(data?.productWithWorkload);
};
/* endregion 产能 */

/* region 评审缺陷问题 */
const dealExpleAndCodereview = (sourceData: any) => {

  const dtExample = [{
    title: "",
    kind: "用例评审",
    cut: "是否裁剪",
    foundDN: "发现问题数",
    weightDN: "加权有效问题数",
    funcPoint: "功能点",
    defectDensity: "加权有效问题率",
    reviewHour: "评审用时",
    reviewRatio: "评审效率",
    description: "说明"
  }, {
    title: "",
    kind: "用例评审2",
    cut: "",
    foundDN: "",
    weightDN: "",
    funcPoint: "",
    defectDensity: "",
    reviewHour: "",
    reviewRatio: "",
    description: ""
  }];
  const dtCodereview = [{
    title: "",
    kind: "CodeReview",
    cut: "是否裁剪",
    foundDN: "发现缺陷数",
    weightDN: "加权有效缺陷数",
    funcPoint: "代码量",
    defectDensity: "加权有效缺陷密度",
    reviewHour: "评审用时",
    reviewRatio: "评审效率",
    description: "说明"
  }, {
    title: "",
    kind: "codereview",
    cut: "",
    foundDN: "",
    weightDN: "",
    funcPoint: "",
    defectDensity: "",
    reviewHour: "",
    reviewRatio: "",
    description: ""
  }];
  //   单独处理用例评审 和 CodeReview数据
  ["用例评审", "CodeReview"].forEach((item: any) => {
    for (let index = 0; index < sourceData.length; index += 1) {
      const ele = sourceData[index];
      if (item === ele.kind) {
        if (ele.kind === "用例评审") {
          if (!ele.cut) {
            dtExample[1].foundDN = ele.foundDN;
            dtExample[1].weightDN = ele.weightDN;
            dtExample[1].funcPoint = ele.funcPoint;
            dtExample[1].defectDensity = ele.defectDensity;
            dtExample[1].reviewHour = ele.reviewHour;
            dtExample[1].reviewRatio = ele.reviewRatio;
            dtExample[1].description = ele.description;
          }
          dtExample[1].title = "";
          dtExample[1].kind = "用例评审2";
          dtExample[1].cut = ele.cut;

        } else if (ele.kind === "CodeReview") {
          if (!ele.cut) {
            dtCodereview[1].foundDN = ele.foundDN;
            dtCodereview[1].weightDN = ele.weightDN;
            dtCodereview[1].funcPoint = ele.funcPoint;
            dtCodereview[1].defectDensity = ele.defectDensity;
            dtCodereview[1].reviewHour = ele.reviewHour;
            dtCodereview[1].reviewRatio = ele.reviewRatio;
            dtCodereview[1].description = ele.description;
          }
          dtCodereview[1].title = "";
          dtCodereview[1].kind = "codereview";
          dtCodereview[1].cut = ele.cut;

        }
      }
    }
  });

  return dtExample.concat(dtCodereview);
};

const alaysisReviewDefect = (sourceData: any, totalData: any) => {

  let dts: any = []
  if (sourceData) {
    dts = sourceData;
  }

  const typeName = ["需求预审", "需求评审", "UE预审", "UE评审", "UI预审", "UI评审", "概设评审", "详设评审", "提测演示", "开发自测/联调", "系统测试", "发布测试"];
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
      reviewRatio: "",
      description: ""
    };

    if (i === 0) {
      newData.title = "评审缺陷问题";
      newData["rowSpan"] = 16;
    }
    for (let index = 0; index < dts.length; index += 1) {
      const datas = dts[index];
      if (Types === datas.kind) {
        newData.cut = datas.cut;
        newData.description = datas.description;
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


  // console.log("totalData", totalData);
  // 暂时不显示合计数据，但是代码保留
  // if (!totalData || totalData.length === 0) {
  //   result.push({
  //     kind: "合计",
  //     foundDN: "",
  //     weightDN: "",
  //     funcPoint: "",
  //     defectDensity: ""
  //   });
  // } else {
  //   let WD = "";
  //   if (totalData[1]) {
  //     WD = (totalData[1].toFixed(2)).toString();
  //   }
  //
  //   let DD = "";
  //   if (totalData[3]) {
  //     DD = (totalData[3].toFixed(2)).toString()
  //   }
  //   result.push({
  //     kind: "合计",
  //     foundDN: totalData[0],
  //     weightDN: WD,
  //     funcPoint: totalData[2],
  //     defectDensity: DD
  //   });
  // }

  // 拼接数据分析和codereview数据
  return result.concat(dealExpleAndCodereview(dts));
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
            description
          }
          reviewDefectTotal(pId:${Number(projectId)})
      }
  `);

  return alaysisReviewDefect(data?.reviewDefect, data?.reviewDefectTotal);
};

/* endregion 评审缺陷问题 */

/* region 过程质量 */
const alaysisProcessQuality = (sourceData: any) => {

  if (!sourceData) {
    return [{
      title: "过程质量补充数据",
      module: "开发",
      cut: "",
      kind: "Reopen率",
      baseline: "-",
      realValue: "",
      description: "",
      rowSpan: 10
    }, {
      title: "",
      module: "",
      cut: "",
      kind: "前端单元测试覆盖率",
      baseline: "-",
      realValue: "",
      description: ""

    }, {
      title: "",
      module: "",
      cut: "",
      kind: "后端单元测试覆盖率",
      baseline: "-",
      realValue: "",
      description: ""

    }, {
      title: "",
      module: "",
      cut: "",
      kind: "Bug解决时长",
      baseline: "-",
      realValue: "",
      description: ""
    }, {
      title: "",
      module: "测试",
      cut: "",
      kind: "Bug回归时长",
      baseline: "-",
      realValue: "",
      description: ""

    }, {
      title: "",
      module: "",
      cut: "",
      kind: "加权遗留缺陷",
      baseline: "-",
      realValue: "",
      description: ""

    }, {
      title: "",
      module: "",
      cut: "",
      kind: "加权遗留缺陷密度",
      baseline: "-",
      realValue: "",
      description: ""
    }, {
      title: "",
      module: "质量",
      cut: "度量值",
      kind: "提测通过次数",
      baseline: "提测次数",
      realValue: "一次提测通过率",
      description: "说明"
    }, {
      title: "",
      module: "",
      cut: "一次提测通过率",
      kind: "",
      baseline: "",
      realValue: "",
      description: ""
    }];
  }

  const result = [{
    title: "过程质量补充数据",
    module: "开发",
    cut: sourceData.reopenRatio?.cut,
    kind: "Reopen率",
    baseline: "-",
    realValue: sourceData.reopenRatio?.actualValue,
    description: sourceData.reopenRatio?.description,
    rowSpan: 9.6
  }, {
    title: "",
    module: "",
    cut: sourceData.frontUnitCover?.cut,
    kind: "前端单元测试覆盖率",
    baseline: "-",
    realValue: sourceData.frontUnitCover?.actualValue,
    description: sourceData.frontUnitCover?.description

  }, {
    title: "",
    module: "",
    cut: sourceData.backUnitCover?.cut,
    kind: "后端单元测试覆盖率",
    baseline: "-",
    realValue: sourceData.backUnitCover?.actualValue,
    description: sourceData.backUnitCover?.description

  }, {
    title: "",
    module: "",
    cut: sourceData.bugResolvedDura?.cut,
    kind: "Bug解决时长",
    baseline: "-",
    realValue: sourceData.bugResolvedDura?.actualValue,
    description: sourceData.bugResolvedDura?.description
  }, {
    title: "",
    module: "测试",
    cut: sourceData.bugFlybackDura?.cut,
    kind: "Bug回归时长",
    baseline: "-",
    realValue: sourceData.bugFlybackDura?.actualValue,
    description: sourceData.bugFlybackDura?.description

  }, {
    title: "",
    module: "",
    cut: sourceData.weightedLegacyDefect?.cut,
    kind: "加权遗留缺陷",
    baseline: "-",
    realValue: sourceData.weightedLegacyDefect?.actualValue,
    description: sourceData.weightedLegacyDefect?.description

  }, {
    title: "",
    module: "",
    cut: sourceData.weightedLegacyDI?.cut,
    kind: "加权遗留缺陷密度",
    baseline: "-",
    realValue: sourceData.weightedLegacyDI?.actualValue,
    description: sourceData.weightedLegacyDI?.description
  }, {
    title: "",
    module: "质量",
    cut: "度量值",
    kind: "提测通过次数",
    baseline: "提测次数",
    realValue: "一次提测通过率",
    description: "说明"
  }, {
    title: "",
    module: "",
    cut: "一次提测通过率",
    kind: sourceData.carryTestPass?.succN === undefined ? "" : sourceData.carryTestPass?.succN,
    baseline: sourceData.carryTestPass?.totalN === undefined ? "" : sourceData.carryTestPass?.totalN,
    realValue: sourceData.carryTestPass?.ratio === undefined ? "" : sourceData.carryTestPass?.ratio,
    description: sourceData.carryTestPass?.description
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
              description
            }
            bugFlybackDura {
              actualValue
              baseline
              cut
              description
            }
            bugResolvedDura {
              actualValue
              baseline
              cut
              description
            }
            weightedLegacyDefect {
              actualValue
              baseline
              cut
              description
            }
            weightedLegacyDI {
              actualValue
              baseline
              cut
              description
            }
            frontUnitCover {
              actualValue
              baseline
              cut
              description
            }
            backUnitCover {
              actualValue
              baseline
              cut
              description
            }
             carryTestPass{
              succN
              totalN
              ratio
              description
            }
          }
      }
  `);
  return alaysisProcessQuality(data?.processQuality);
};
/* endregion 过程质量 */

/* region 服务 */
const alaysisService = (sourceData: any) => {

  if (!sourceData || sourceData.length === 0) {
    return [{
      title: "服务",
      module: "及时交付",
      item: "一次发布成功率",
      succN: "",
      totalN: "",
      ratio: "",
      description: ""
    }];
  }

  const datas = sourceData[0];
  const result = [{
    title: "服务",
    module: "及时交付",
    item: "一次发布成功率",
    succN: datas.succN,
    totalN: datas.totalN,
    ratio: datas.ratio,
    description: datas.description
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
            description
          }
      }
  `);
  return alaysisService(data?.serviceAbout);
};
/* endregion 服务 */

export {queryStageWorkload, queryProductRateload, queryReviewDefect, queryProcessQuality, queryServices}
