/* region 数据获取和解析 */

import {GqlClient} from "@/hooks";
import {getParamsByType} from "@/publicMethods/timeMethods";
import {converseForAgGrid_Convergency} from "@/pages/kpi/performance/testers/testMethod/deptDataAnalyze";

const queryPalnDeviationRate = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }
  // bugConvergenceTestDept(kind: "${condition.typeFlag}", ends: ${condition.ends}) {

  const {data} = await client.query(`
      {


      }
  `);
  const datas = converseForAgGrid_Convergency(data?.bugConvergenceTestDept);
  return datas;


};

/* endregion */


export {queryPalnDeviationRate};
