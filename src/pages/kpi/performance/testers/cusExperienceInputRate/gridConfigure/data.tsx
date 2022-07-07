/* region 数据获取和解析 */
import {GqlClient} from "@/hooks";
import {getParamsByType} from "@/publicMethods/timeMethods";
import {converseForAgGrid_cusInputRate} from "../../testMethod/deptDataAnalyze";

export const queryCustomExpInputRate = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }

  const {data} = await client.query(`
      {
         devTestConsumerUseoptimizeDept(kind: "${condition.typeFlag}", ends: ${condition.ends}, identity:TESTER) {
          total{
            dept
            deptName
            kpi
            sideKpi{
              numerator
              denominator
            }
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
            sideKpi{
              numerator
              denominator
            }
            users{
              userId
              userName
              kpi
              hired
              sideKpi{
                numerator
                denominator
              }
            }
          }
        }

      }
  `);

  const datas = converseForAgGrid_cusInputRate(data?.devTestConsumerUseoptimizeDept);
  return datas;
};
/* endregion */