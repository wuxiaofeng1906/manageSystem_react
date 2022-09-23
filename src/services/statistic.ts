import type { GqlClient } from '@/hooks';
import { getParamsByType } from '@/publicMethods/timeMethods';
import { formatTreeData } from '@/utils/utils';
import { IStaticBy } from '@/hooks/statistic';

export interface IStatisticQuery {
  client: GqlClient<object>;
  params: IStaticBy;
  identity?: string;
}
const StatisticServices = {
  // patch
  async patch({ client, params, identity }: IStatisticQuery) {
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
  async feedback({ client, params, identity }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:devTestOnlineFeedbackAvgrespDept(kind: "${condition.typeFlag}", ends: ${condition.ends},identity:${identity}) {
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

  async productScale({ client, params, identity }: IStatisticQuery) {
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

  async humanEffect({ client, params, identity }: IStatisticQuery) {
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

  async shuttleDelay({ client, params, identity }: IStatisticQuery) {
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

  // 阻塞测试工作量
  async blockingTestWorkload({ client, params, identity }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:devBlockWorkloadDept(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
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
  // 阻塞次数
  async blockingTimes({ client, params, identity }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:blockingTimes(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
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

  // 产品上线后引入emergency
  async onlineEmergency({
    client,
    params,
  }: {
    client: GqlClient<object>;
    params: { kind: number; ends: string };
  }) {
    const { data } = await client.query(`
      {
         data:onlineEmerProportion(kind: "${params.kind}", ends: ${params.ends}) {
          range{
            start
            end
          }
          datas{
            date
            storyNum
            recordNum
          }
        }
      }
  `);
    return { data: data.data };
  },
  //灰度千行bug率
  async grayThousBugRate({
    client,
    params,
  }: {
    client: GqlClient<object>;
    params: { kind: number; ends: string };
  }) {
    const { data } = await client.query(`
      {
         data:stageThousBugRate(kind: "${params.kind}", ends: ${params.ends}) {
          range{
            start
            end
          }
          datas{
            date
            numerator
            denominator
          }
        }
      }
  `);
    return { data: data.data };
  },
};
export default StatisticServices;
