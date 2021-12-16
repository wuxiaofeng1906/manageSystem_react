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
      }
  `);

  const datas = {
    process: alaysisProcessData(data?.projectDeviation),
    storyStability: alaysisStoryStability()
  };
  return datas;
};


export {queryDatas};
