/* region 数据获取和解析 */

import {GqlClient} from "@/hooks";
import {getParamsByType} from "@/publicMethods/timeMethods";
import {converseForAgGrid_planDevition} from "@/pages/kpi/performance/testers/testMethod/deptDataAnalyze";

const queryPalnDeviationRate = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }
  // bugConvergenceTestDept(kind: "${condition.typeFlag}", ends: ${condition.ends}) {

  const {data} = await client.query(`
      {
        biasProportionTestDept(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
          total{
            dept
            deptName
            kpi
          }
          range{
            start
            end
          }
          datas{
            dept
            deptName
            parent{
              dept
              deptName
            }
            kpi
          }
        }

      }
  `);

  const datas = converseForAgGrid_planDevition(data?.biasProportionTestDept);
  return datas;


};

/* endregion */


export {queryPalnDeviationRate};
