/* region 数据获取和解析 */

import {GqlClient} from "@/hooks";
import {getParamsByType} from "@/publicMethods/timeMethods";
import {converseForAgGrid_Convergency} from "@/pages/kpi/performance/testers/testMethod/deptDataAnalyze";

const queryBugRateConfigure = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }

  const {data} = await client.query(`
      {
         bugConvergenceTestDept(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
           total {
            dept
            deptName
            kpi
            }
            range {
              start
              end
            }
            datas {
              dept
              deptName
              kpi
              sideKpi{
                testKpi
                devkpi
              }
              parent {
                dept
                deptName
              }
            }
         }

      }
  `);
  const datas = converseForAgGrid_Convergency(data?.bugConvergenceTestDept);
  return datas;


};

/* endregion */


export {queryBugRateConfigure};
