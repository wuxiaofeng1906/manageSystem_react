import { GqlClient } from '@/hooks';
import { getParamsByType } from '@/publicMethods/timeMethods';
import {
  converseForAgGrid_showDepts,
  converseForAgGrid_cusInputRate,
} from '@/pages/kpi/performance/testers/testMethod/deptDataAnalyze';

const StatisticServices = {
  // patch
  async patchDeveloper(client: GqlClient<object>, params: string) {
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
  },
  async patchTester(client: GqlClient<object>, params: string) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data } = await client.query(`
      {
         data:devTestReleasePatchDept(kind: "${condition.typeFlag}", ends: ${condition.ends}, identity:TESTER) {
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
  },
  // feedback
  async feedbackTester(client: GqlClient<object>, params: string) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data } = await client.query(`
      {
         data:testOnlineFeedbackAvgonlineDept(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
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
          }
        }
      }
  `);
    return converseForAgGrid_cusInputRate(data.data);
  },
};
export default StatisticServices;
