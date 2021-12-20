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

  const total = {
    total_manpower: 0,
    total_planHours: 0,
    total_actualHours: 0,
    releaseplan_manpower: 0, // 发布投入人数
  }


  const result: any = [];
  stageWorkloadData.forEach((ele: any, index: number) => {
    const newObject = ele;
    const chineseName = typeName[ele["type"]];
    if (chineseName !== "项目计划") {  // 这个数据是没有项目计划的
      newObject.stage = chineseName;
      if (index === 0) {
        newObject.title = "3.阶段工作量（单位：人天）";
      } else {
        newObject.title = "";
      }

      result.push(newObject);

      //   计算总计数据
      total.total_manpower = Number(newObject.manpower) + total.total_manpower;
      total.total_planHours = Number(newObject.planHours) + total.total_planHours;
      total.total_actualHours = Number(newObject.actualHours) + total.total_actualHours;
      if (chineseName === "发布") {
        total.total_manpower = newObject.manpower;
      }
    }
  });

  // 需要新增总计

  result.push({
    title: "",
    stage: "总计",
    manpower: "",
    planHours: total.total_planHours,
    actualHours: total.total_actualHours,
    planWorkload: total.total_manpower * (total.total_planHours / 8),  // 投入人数*（预计工时（汇总①-⑤）/8）
    actualWorkload: total.total_manpower * (total.total_actualHours / 8)  // 发布投入人数*（实际工时（汇总①-⑤）/8）
  });

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

const alaysisReviewDefect = (sourceData: any) => {
  if (!sourceData) {
    return [];
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


  });

  result.push({
    kind: "合计",
  })
  return result;

};

const queryDatas = async (client: GqlClient<object>, projectId: string) => {

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
          }

          reviewDefect(pId:${Number(projectId)}){
            kind
            cut
            foundDN
            weightDN
            funcPoint
            defectDensity
            defectHour
            defectRatio
          }
      }
  `);

  const datas = {
    process: alaysisProcessData(data?.projectDeviation),  // 1.速度
    storyStability: alaysisStoryStability(), // 2.需求稳定性
    stageWorkload: alaysisStageWorkload(data?.productWithWorkload), // 3.阶段工作量
    productRate: alaysisProductRate(data?.productWithWorkload), // 4.生产率
    reviewDefect: alaysisReviewDefect(data?.reviewDefect)
  };
  return datas;
};


export {queryDatas};
