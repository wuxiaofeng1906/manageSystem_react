import {GqlClient} from "@/hooks";

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
    process: alaysisProcessData(data?.projectDeviation)
  };
  return datas;
};


export {queryDatas};
