/* region 数据获取和解析 */
import {GqlClient} from "@/hooks";
import {getParamsByType} from "@/publicMethods/timeMethods";
import {converseFormatForAgGrid} from "@/pages/kpi/performance/developer/devMethod/deptDataAnalyze";

export const queryDevDefectExcRate = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }

  const {data} = await client.query(`
      {
          bugThousDept(kind: "${condition.typeFlag}", ends: ${condition.ends}, thous:ALL) {
            total {
              dept
              deptName
              kpi
            }
            range {
              start
              end
            }
            side {
              both
              front
              backend
            }
            datas {
              dept
              deptName
              kpi
              side {
                both
                front
                backend
              }
              parent {
                dept
                deptName
              }
              users {
                userId
                userName
                kpi
                tech
              }
            }
          }
      }
  `);

  const datas = converseFormatForAgGrid(data?.bugThousDept);
  return datas;
};
/* endregion */
