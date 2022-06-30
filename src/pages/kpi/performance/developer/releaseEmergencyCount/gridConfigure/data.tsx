/* region 数据获取和解析 */
import {GqlClient} from "@/hooks";
import {getParamsByType} from "@/publicMethods/timeMethods";
import {converseForAgGrid_showDepts} from "@/pages/kpi/performance/developer/devMethod/deptDataAnalyze";

export const queryEmergencyCounts = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }

  const {data} = await client.query(`
      {
         devTestReleaseEmergencyDept(kind: "${condition.typeFlag}", ends: ${condition.ends}, identity:DEVELOPER) {
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

  const datas = converseForAgGrid_showDepts(data?.devTestReleaseEmergencyDept);
  return datas;
};
/* endregion */
