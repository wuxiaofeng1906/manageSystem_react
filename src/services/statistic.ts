import type { GqlClient } from '@/hooks';
import { getParamsByType } from '@/publicMethods/timeMethods';
import { formatTreeData } from '@/utils/utils';
import { IStaticBy } from '@/hooks/statistic';

export interface IStatisticQuery {
  client: GqlClient<object>;
  params: IStaticBy;
  identity?: string;
  showDenominator?: boolean;
}
interface StaticOther {
  client: GqlClient<object>;
  params: { kind: number; ends: string };
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
    return { data: formatTreeData({ origin: data.data }), loading };
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
    return { data: formatTreeData({ origin: data.data }), loading };
  },

  // 线上反馈平均上线时长
  async onlineTime({ client, params }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:testOnlineFeedbackAvgonlineDept(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
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
    return { data: formatTreeData({ origin: data.data, percent: 86400, isMulti: false }), loading };
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
    return { data: formatTreeData({ origin: data.data }), loading };
  },

  async humanEffect({ client, params, identity, showDenominator }: IStatisticQuery) {
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
    return { data: formatTreeData({ origin: data.data, showDenominator }), loading };
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
    return { data: formatTreeData({ origin: data.data }), loading };
  },

  // 测试 - 累计千行bug率 3个 identity: TEST、OWN、REFER
  async newPeriodBugThousTestDept({ client, params, identity }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:newPeriodBugThousTestDept(kind: "${condition.typeFlag}", ends: ${condition.ends},thous:${identity}) {
          total{
              dept
              deptName
              kpi
            }
          range{
            start
            end
          }
          code
          datas{
            dept
            deptName
            parent{
              dept
              deptName
              kpi
            }
            kpi
            users{
              userId
              userName
              kpi
            }
          }
        }
      }
  `);
    return { data: formatTreeData({ origin: data.data }), loading };
  },

  // 开发- 累计千行bug率 2个 identity:ALL,EXCLUDE_ONLINE
  async bugThousPeriodDept({ client, params, identity }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:bugThousPeriodDept(kind: "${condition.typeFlag}", ends: ${condition.ends},thous:${identity}) {
          total{
              dept
              deptName
              kpi
            }
          range{
            start
            end
          }
          side{
              front
              backend
          }
          datas{
            dept
            deptName
            parent{
              dept
              deptName
            }
            side{
              front
              backend
            }
            kpi
            users{
              userId
              userName
              kpi
              tech
            }
          }
        }
      }
  `);
    return { data: formatTreeData({ origin: data.data, showSide: true }), loading };
  },
  // 轮次测试P0+P1占比
  async roundsTestRate({ client, params }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:testRoundP0P1ScoreDept(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
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
    return { data: formatTreeData({ origin: data.data }), loading };
  },

  // 已发布需求平均关闭时长
  async averageShutdownDuration({ client, params }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:releStoryAvgClosedDura(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
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
    return { data: formatTreeData({ origin: data.data }), loading };
  },

  // 已发布未关闭需求数
  async publishedAndUnclosedNumber({ client, params }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:releStoryClosedNum(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
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
    return { data: formatTreeData({ origin: data.data }), loading };
  },

  // 班车超范围bug数
  async sprintOverRangeBug({ client, params }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:sprintOverRangeBugNum(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
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
    return { data: formatTreeData({ origin: data.data }), loading };
  },
  async closeNormativeRequired({ client, params }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:abnormallyClosedStoryNum(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
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
    return { data: formatTreeData({ origin: data.data }), loading };
  },

  // 阻塞测试工作量
  async blockingTestWorkload({ client, params }: IStatisticQuery) {
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
    return { data: formatTreeData({ origin: data.data }), loading };
  },
  // 阻塞次数
  async blockingTimes({ client, params }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:devBlockTimesDept(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
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
    return { data: formatTreeData({ origin: data.data }), loading };
  },

  // 产品上线后引入emergency
  async onlineEmergency({ client, params }: StaticOther) {
    const { data } = await client.query(`
      {
         data:onlineEmerProportion(kind: "${params.kind}", ends: ${params.ends}) {
          range{
            start
            end
          }
          datas{
            date
            count
            recordNum
          }
        }
      }
  `);
    return { data: data.data };
  },
  //灰度千行bug率
  async grayThousBugRate({ client, params }: StaticOther) {
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
  // 服务 -交付吞吐量
  async deliverThroughput({ client, params }: StaticOther) {
    const { data } = await client.query(`
      {
         data:deliverThroughput(kind: "${params.kind}", ends: ${params.ends}) {
          range{
            start
            end
          }
          datas{
            date
            kpi
          }
        }
      }
  `);
    return { data: data.data };
  },
};
export default StatisticServices;
