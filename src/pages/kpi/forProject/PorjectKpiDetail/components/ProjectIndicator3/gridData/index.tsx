import {GqlClient} from "@/hooks";

/* region 里程碑进度 */
const alaysisProcessData = (sourceData: any) => {
  let ora_datas: any = [];
  if (sourceData) {
    ora_datas = sourceData;
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
      description: "",
    };

    if (i === 0) {
      newData.title = "里程碑进度";
      newData["rowSpan"] = 6;
    }

    for (let index = 0; index < ora_datas.length; index += 1) {
      const datas = ora_datas[index];
      if (Types.type === datas.type) {
        newData.planStart = datas.planStart;
        newData.planEnd = datas.planEnd;
        newData.actualStart = datas.actualStart;
        newData.actualEnd = datas.actualEnd;
        newData.days = datas.days;
        newData.ratio = datas.ratio;
        newData.description = datas.description;

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
            description
          }
      }
  `);

  return alaysisProcessData(data?.projectDeviation);
};
/* endregion 里程碑进度 */

/* region 需求稳定性 */
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
      description: ""
    };

    if (i === 0) {
      newData.title = "需求稳定性";
      newData["rowSpan"] = 4;
    }

    for (let index = 0; index < sourceData.length; index += 1) {
      const datas = sourceData[index];
      if (Types.type === datas.kind) {
        newData.planHours = datas.planHours;
        newData.stableHours = datas.stableHours;
        newData.ratio = datas.ratio;
        newData.description = datas.description;
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
          description
        }

      }
  `);

  return alaysisStoryStability(data?.storyStable);
};

/* endregion 需求稳定性 */

export {queryProcessData, queryStoryStability}
