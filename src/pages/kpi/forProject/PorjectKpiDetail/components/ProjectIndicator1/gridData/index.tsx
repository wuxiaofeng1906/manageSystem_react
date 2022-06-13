import {GqlClient} from "@/hooks";

/* region  项目质量 */
const alaysisPrjQuaData = (sourceData: any) => {

  let prjQualityData: any = [];
  if (sourceData && sourceData.length > 0) {
    prjQualityData = sourceData;
  }

  const typeName = [
    {type: "1", name: "前端"},
    {type: "2", name: "后端"},
    {type: "", name: "项目"},
  ];

  const result: any = [];
  typeName.forEach((Types: any, i: number) => {
    const newData = {
      detail_title: "",
      tech: Types.name,
    };

    if (i === 0) {
      newData.detail_title = "项目质量";
      newData["rowSpan"] = 3;
    }

    for (let index = 0; index < prjQualityData.length; index += 1) {
      const datas = prjQualityData[index];
      if (Types.type === datas.tech) {
        // 汇总
        newData["total_bug"] = datas.commonTotal; // Bug总数
        newData["effective_bug"] = datas.effectiveTotal; // 有效Bug数
        newData["weighted_effective_bug"] = datas.weightTotal; // 加权有效Bug数
        newData["code_count"] = Math.abs(datas.codes); // 代码量:如果是被修改过的，则为负数
        newData["code_changed"] = (datas.codes).toString().includes("-"); // 代码量是否为负数
        newData["effective_bug_rate"] = (datas.effectiveTotal / datas.codes * 1000).toFixed(2); // 有效千行bug率：有效Bug数/代码行
        newData["weighted_effective_bug_rate"] = (datas.weightTotal / datas.codes * 1000).toFixed(2); // 加权有效千行bug率：加权有效Bug数/代码行

        // 有效Bug数
        newData["effective_p0"] = datas.effectiveNums?.P0;
        newData["effective_p1"] = datas.effectiveNums?.P1;
        newData["effective_p2"] = datas.effectiveNums?.P2;
        newData["effective_p3"] = datas.effectiveNums?.P3;
        // Bug总数
        newData["total_p0"] = datas.commonNums?.P0;
        newData["total_p1"] = datas.commonNums?.P1;
        newData["total_p2"] = datas.commonNums?.P2;
        newData["total_p3"] = datas.commonNums?.P3;
        break;
      }
    }
    result.push(newData);
  });


  return result
};

// 项目质量
const queryProjectQualityload = async (client: GqlClient<object>, projectId: string) => {
  const {data} = await client.query(`
      {

        pkQuality(zpId:${Number(projectId)}){
            tech
            commonNums{
              P0
              P1
              P2
              P3
            }
            effectiveNums{
              P0
              P1
              P2
              P3
            }
            commonTotal
            effectiveTotal
            weightTotal
            codes
          }
      }
  `);

  return alaysisPrjQuaData(data?.pkQuality);
};

/* endregion  项目质量 */


export {queryProjectQualityload}
