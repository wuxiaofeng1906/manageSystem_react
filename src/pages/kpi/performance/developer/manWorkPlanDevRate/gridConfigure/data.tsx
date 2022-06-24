/* region 数据获取和解析 */
import {GqlClient} from "@/hooks";
import {getParamsByType} from "@/publicMethods/timeMethods";
import {converseForAgGrid_manageWorkDeviRate} from "@/pages/kpi/performance/developer/devMethod/deptDataAnalyze";

export const queryManWorkDeviRate = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }

  const {data} = await client.query(`
      {
        devManagementAffairsDept(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
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
          users{
            userId
            userName
            kpi
            hired
            }
          }
        }

      }
  `);

  const datas = converseForAgGrid_manageWorkDeviRate(data?.devManagementAffairsDept);
  return datas;
};
/* endregion */
