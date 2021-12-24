import {GqlClient} from "@/hooks";

// 1.进度数据解析
const alaysisProcessData = (sourceData: any) => {
  if (!sourceData) {
    return [];
  }
  const typeName = {
    storyplan: "需求",
    designplan: "概设&计划",
    devplan: "开发",
    testplan: "测试",
    releaseplan: "发布",
    projectplan: "项目计划"
  };
  const result: any = [];

  sourceData.forEach((ele: any, index: number) => {
    const newObject = ele;
    const chineseName = typeName[ele["type"]];
    newObject.milestone = chineseName;
    if (index === 0) {
      newObject.title = "1.进度";
    } else {
      newObject.title = "";
    }
    result.push(newObject);
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
}

// 2.需求稳定性
const alaysisStoryStability = () => {
  return [{
    title: "2.需求稳定性",
    stage: "开发阶段",
    planTime: "",
    updateTime: "",
    updateRate: ""
  }, {
    title: "",
    stage: "测试阶段",
    planTime: "",
    updateTime: "",
    updateRate: ""
  }, {
    title: "",
    stage: "发布阶段",
    planTime: "",
    updateTime: "",
    updateRate: ""
  }, {
    title: "",
    stage: "项目周期",
    planTime: "",
    updateTime: "",
    updateRate: ""
  }]

};
const queryStoryStability = async (client: GqlClient<object>, projectId: string) => {
  // const {data} = await client.query(`
  //     {
  //
  //
  //     }
  // `);

  return alaysisStoryStability();
}

// 3.阶段工作量
const alaysisStageWorkload = (sourceData: any) => {

  if (!sourceData?.stageWorkload) {
    return [];
  }

  const stageWorkloadData = sourceData?.stageWorkload;
  if (!stageWorkloadData) {
    return [];
  }

  const typeName = {
    storyplan: "需求",
    designplan: "概设&计划",
    devplan: "开发",
    testplan: "测试",
    releaseplan: "发布",
    projectplan: "项目计划"
  };

  const result: any = [];
  stageWorkloadData.forEach((ele: any, index: number) => {
    const types = ele["type"];
    if (types) {
      const newObject = ele;
      const chineseName = typeName[types];
      if (chineseName !== "项目计划") {  // 这个数据是没有项目计划的
        newObject.stage = chineseName;
        if (index === 0) {
          newObject.title = "3.阶段工作量（单位：人天）";
        } else {
          newObject.title = "";
        }
        result.push(newObject);
      }
    }
  });

  if (sourceData.totalSW) {
    const total = sourceData.totalSW;
    // 需要新增总计
    result.push({
      title: "",
      stage: "合计",
      manpower: Math.abs(total[0]),
      manpowerFlag: Number(total[0]) > 0 ? "false" : "true",
      planHours: total[1],
      planHoursFlag: Number(total[1]) > 0 ? "false" : "true",
      actualHours: total[2],
      actualHoursFlag: Number(total[2]) > 0 ? "false" : "true",
      planWorkload: total[3],
      actualWorkload: total[4],
    });
  }


  return result
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

}

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

  return {
    stageWorkload: alaysisStageWorkload(data?.productWithWorkload),
    productRate: alaysisProductRate(data?.productWithWorkload)
  };
}


// 5评审和缺陷
const alaysisReviewDefect = (sourceData: any) => {
  if (!sourceData) {
    return [];
  }

  const total = {
    foundDN: 0,
    weightDN: 0,
    funcPoint: 0
  }

  const result: any = [
    {
      title: "5.评审和缺陷",
      kind: "需求预审",
    },
    {
      kind: "需求评审",
    },
    {
      kind: "UE评审",
    },
    {
      kind: "概设评审",
    },
    {
      kind: "详设评审",
    },
    {
      kind: "用例评审",
    },
    {
      kind: "CodeReview",
    },
    {
      kind: "提测演示",
    },
    {
      kind: "集成测试",
    },
    {
      kind: "系统测试",
    },
    {
      kind: "发布测试",
    }

  ];
  sourceData.forEach((ele: any) => {
    const newObject = ele;
    switch (newObject.kind) {
      case "需求预审":
        newObject.title = "5.评审和缺陷";
        result[0] = newObject
        break;
      case "需求评审":
        result[1] = newObject
        break;
      case "UE评审":
        result[2] = newObject
        break;
      case "概设评审":
        result[3] = newObject
        break;
      case "详设评审":
        result[4] = newObject
        break;
      case "用例评审":
        result[5] = newObject
        break;
      case "CodeReview":
        result[6] = newObject
        break;
      case "提测演示":
        result[7] = newObject
        break;
      case "集成测试":
        result[8] = newObject
        break;
      case "系统测试":
        result[9] = newObject
        break;
      case "发布测试":
        result[10] = newObject
        break;
      default:
        break;
    }

    // 合计的计算
    total.foundDN += newObject.foundDN;
    total.weightDN += newObject.weightDN;
    total.funcPoint = newObject.funcPoint;
  });

  result.push({
    kind: "合计",
    foundDN: total.foundDN,  // ①-⑪求和
    weightDN: total.weightDN,  // ①-⑪求和
    funcPoint: total.funcPoint,  // 跟上面的功能点值一样
    defectDensity: total.weightDN / total.funcPoint // 总计的加权有效缺陷数/总计的功能点。
  })
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
      }
  `);

  return alaysisReviewDefect(data?.reviewDefect);
}


// 6 7 过程质量补充数据和服务
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
    title: "7.服务",
    module: "及时交付",
    cut: null,
    kind: " 一次发布成功率",
    baseline: "-",
    realValue: ""
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
          }
      }
  `);
  return alaysisProcessQuality(data?.processQuality);
}


// 数据查询
const queryDatas = async (client: GqlClient<object>, projectId: string) => {

  const datas = {
    process: await queryProcessData(client, projectId),  // 1.速度
    storyStability: await queryStoryStability(client, projectId), // 2.需求稳定性
    stageWorkload: (await queryStageWorkload(client, projectId)).stageWorkload, // 3.阶段工作量
    productRate: (await queryStageWorkload(client, projectId)).productRate, // 4.生产率
    reviewDefect: await queryReviewDefect(client, projectId),  // 5.评审和缺陷
    processQuality: await queryProcessQuality(client, projectId) // 6 过程质量补充数据和服务
  };
  return datas;
};


export {queryDatas, queryReviewDefect, queryStageWorkload};
