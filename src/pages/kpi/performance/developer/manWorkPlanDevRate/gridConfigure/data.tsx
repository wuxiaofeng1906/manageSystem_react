/* region 数据获取和解析 */
import {GqlClient} from "@/hooks";
import {getParamsByType} from "@/publicMethods/timeMethods";
import {converseForAgGrid_projectPlanDevition} from "@/pages/kpi/performance/developer/devMethod/deptDataAnalyze";

export const queryManWorkDeviRate = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }

  // devBiasProportionDept(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
  const {data} = await client.query(`
      {


      }
  `);

  const datas = converseForAgGrid_projectPlanDevition(data?.devBiasProportionDept);
  return datas;
};
/* endregion */
