/* region 数据获取和解析 */
import {GqlClient} from "@/hooks";
import {getParamsByType} from "@/publicMethods/timeMethods";
import {converseForAgGrid_defectRate} from "@/pages/kpi/performance/developer/devMethod/deptDataAnalyze";

export const queryDevDefectExcRate = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }

  const {data} = await client.query(`
      {
          devDefectRepairDept(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
            total {
              dept
              deptName
              kpi
              sideKpi{
                testKpi
                devkpi
              }
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

  const datas = converseForAgGrid_defectRate(data?.devDefectRepairDept);
  return datas;
};
/* endregion */
