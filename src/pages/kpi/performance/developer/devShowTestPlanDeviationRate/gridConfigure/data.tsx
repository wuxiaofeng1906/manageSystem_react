/* region 数据获取和解析 */
import {GqlClient} from "@/hooks";
import {getParamsByType} from "@/publicMethods/timeMethods";
import {converseForAgGrid_projectPlanDevition} from "@/pages/kpi/performance/developer/devMethod/deptDataAnalyze";

export const queryDevDefectExcRate = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }
  // 开发-提测计划偏差率
  const {data} = await client.query(`
      {
          devShowcasePlanDept(kind: "${condition.typeFlag}", ends: ${condition.ends})  {
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

  const datas = converseForAgGrid_projectPlanDevition(data?.devShowcasePlanDept);
  return datas;
};
/* endregion */
