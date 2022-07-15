import { GqlClient } from '@/hooks';
import { getParamsByType } from '@/publicMethods/timeMethods';
import { formatTreeData } from '@/utils/utils';

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
    return { data: formatTreeData(data.data), loading };
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
    return { data: formatTreeData(data.data), loading };
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
    return { data: formatTreeData(data.data), loading };
  },

  async humanEffect(client: GqlClient<object>, params: string, identity: string) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:devTestStaffEfficiencyDept(kind: "${condition.typeFlag}", ends: ${condition.ends},identity:${identity}) {
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
    return { data: formatTreeData(data.data), loading };
  },

  async shuttleDelay(client: GqlClient<object>, params: string, identity: string) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:devTestDelayStoryDept(kind: "${condition.typeFlag}", ends: ${condition.ends},identity:${identity}) {
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
    return { data: formatTreeData(data.data), loading };
  },
};
export default StatisticServices;
