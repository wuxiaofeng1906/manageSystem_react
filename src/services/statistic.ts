import { GqlClient } from '@/hooks';
import { getParamsByType } from '@/publicMethods/timeMethods';
import {
  converseForAgGrid_showDepts,
  converseForAgGrid_cusInputRate,
} from '@/pages/kpi/performance/testers/testMethod/deptDataAnalyze';

const StatisticServices = {
  // patch
  async patch(client: GqlClient<object>, params: string, identity: string) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:devTestReleasePatchDept(kind: "${condition.typeFlag}", ends: ${condition.ends}, identity:${identity}) {
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
    return { data: converseForAgGrid_showDepts(data.data), loading };
  },
  // feedback
  async feedbackTester(client: GqlClient<object>, params: string) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
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
    return { data: converseForAgGrid_cusInputRate(data.data), loading };
  },

  async productScale(client: GqlClient<object>, params: string, identity: string) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:devTestProductionScaleDept(kind: "${condition.typeFlag}", ends: ${condition.ends},identity:${identity}) {
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
    return { data: converseForAgGrid_showDepts(data.data), loading };
  },
};
export default StatisticServices;
