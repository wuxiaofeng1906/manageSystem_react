import { GqlClient } from '@/hooks';
import { getParamsByType } from '@/publicMethods/timeMethods';
import { converseForAgGrid_showDepts } from '@/pages/kpi/performance/testers/testMethod/deptDataAnalyze';

export const patchDeveloperServices = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) return [];
  const { data } = await client.query(`
      {
         data:devTestReleasePatchDept(kind: "${condition.typeFlag}", ends: ${condition.ends}, identity:DEVELOPER) {
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
  return converseForAgGrid_showDepts(data.data);
};

export const patchTesterServices = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) return [];
  const { data } = await client.query(`
      {
         data:devTestReleasePatchDept(kind: "${condition.typeFlag}", ends: ${condition.ends}, identity:DEVELOPER) {
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
  return converseForAgGrid_showDepts(data.data);
};
