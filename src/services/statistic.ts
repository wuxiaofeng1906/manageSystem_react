import type { GqlClient } from '@/hooks';
import { getParamsByType } from '@/publicMethods/timeMethods';
import { formatAutoTestCover, formatPivotMode, formatTreeData } from '@/utils/utils';
import { IIdentity, IStaticBy, Period } from '@/hooks/statistic';

export interface IStatisticQuery {
  client: GqlClient<object>;
  params: IStaticBy;
  identity?: IIdentity;
  showDenominator?: boolean;
  period?: Period;
}
interface StaticOther {
  client: GqlClient<object>;
  params: { kind: number; ends: string };
  identity?: 'DEVELOPER' | 'TESTER';
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
    return { data: formatTreeData({ origin: data.data, isTest: identity == 'TESTER' }), loading };
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
    return { data: formatTreeData({ origin: data.data, isTest: identity == 'TESTER' }), loading };
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
    return {
      data: formatTreeData({ origin: data.data, percent: 86400, isMulti: false, isTest: true }),
      loading,
    };
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
    return { data: formatTreeData({ origin: data.data, isTest: identity == 'TESTER' }), loading };
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
    return {
      data: formatTreeData({ origin: data.data, showDenominator, isTest: identity == 'TESTER' }),
      loading,
    };
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
    return { data: formatTreeData({ origin: data.data, isTest: identity == 'TESTER' }), loading };
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
    return { data: formatTreeData({ origin: data.data, isTest: true }), loading };
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
    return { data: formatTreeData({ origin: data.data, isTest: true }), loading };
  },
  // 线上p0p1占比 (6个指标)
  async roundsP0P1TestRate({ client, params, identity, period }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:testBugP0P1PropDept(kind: "${condition.typeFlag}", ends: ${condition.ends},thous:${identity},period:"${period}") {
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
            kpi
            parent{
              dept
              deptName
            }
           sideKpi{
            numerator
            denominator
            }
          }
        }
      }
  `);
    return { data: formatTreeData({ origin: data.data, isTest: true }), loading };
  },

  // 运维 -系统可用，修复，可用时间
  async operationsAvgAvailable({ client, params }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data } = await client.query(`
      {
         data:devopsSeveralSysKpis(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
        category
        datas{
          range{
            start
            end
          }
        depts{
          dept
          deptName
          kpi
          side{
            numerator
            denominator
          }
        }
      }
    }
  }
  `);
    return { data: data.data };
  },

  // 运维 - 响应时长
  async operationsAvgRespTime({ client, params }: IStatisticQuery) {
    const condition = getParamsByType(params);
    const { data } = await client.query(`
      {
         data:devopsAvgRespDura(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
          maxsize
          datas{
            range{
            start
            end
          }
          datas{
            cluster
            duration
          }
      }
    }
  }
  `);
    return { data: data.data };
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
  // 计划平均延期次数
  async planedDelayAverageNum({ client, params }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:planAvDelayCount(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
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
  // 任务平均延期次数
  async taskCumulativeDelayNum({ client, params }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:taskCumulativeDelayNum(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
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
  async convergenceBugRate({ client, params }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:bugConvUpToPeriodTestDept(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
              total {
                dept
                deptName
                kpi
              }
              range {
                start
                end
              }
              datas {
                dept
                deptName
                kpi
                sideKpi {
                  testKpi
                  devkpi
                }
                parent {
                  dept
                  deptName
                }
              }
            }
      }
  `);
    return { data: formatTreeData({ origin: data.data, isTest: true }), loading };
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
            days
            kpi
          }
        }
      }
  `);
    return { data: data.data };
  },

  async onlineTestOnlineEmergency({ client, params, identity }: StaticOther) {
    const { data } = await client.query(`
      {
         data:devTestOnlineEmerPropOwner(kind: "${params.kind}", ends: ${params.ends},identity:${identity}) {
            range{
              start
              end
            }
            datas{
              total{
                dept
                kpi
              }
              range{
                start
                end
              }
              datas{
                dept
                deptName
                kpi
                parent{
                  dept
                  deptName
                }
              }
            }
          }
      }
  `);
    return { data: formatPivotMode(data.data, params.kind) };
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

  // 任务计划偏差率
  async taskScheduleRate({ client, params, identity }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:devTestPlanDeviationRateDept(kind: "${condition.typeFlag}", ends: ${condition.ends},identity:${identity}) {
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
            kpi
            parent{
              dept
              deptName
            }
            users {
              userId
              userName
              kpi
              hired
            }
          }
        }
      }
  `);
    return { data: formatTreeData({ origin: data.data, isTest: identity == 'TESTER' }), loading };
  },

  // 自动化单元测试覆盖率
  async autoTestCoverageUnit({ client, params }: IStatisticQuery) {
    const condition = getParamsByType(params);
    const { data } = await client.query(`
      {
       data:autoTestCoverPropRuntimeE(ends:${condition.ends}, kind:"${condition.typeFlag}") {
          range{
            start
            end
          }
          datas{
            dept
            deptName
            parent
            instCover{
              numerator
              denominator
            }
            branchCover{
              numerator
              denominator
            }
            tech {
              name
              instCover {
                numerator
                denominator
              }
              branchCover {
                numerator
                denominator
              }
            }
            execution{
              name
              branch
              instCover{
                numerator
                denominator
              }
              branchCover{
                numerator
                denominator
              }
            }
          }
        }
      }
    `);
    console.log(formatAutoTestCover(data.data, condition.typeFlag));
    return { data: data.data };
  },

  // 自动化发现BUG数
  async autoDiscoveryBugCount({ client, params }: IStatisticQuery) {
    const condition = getParamsByType(params);
    if (condition.typeFlag === 0) return [];
    const { data, loading } = await client.query(`
      {
         data:testAtuoFoundBugDept(kind: "${condition.typeFlag}", ends: ${condition.ends}) {
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
            kpi
            parent{
              dept
              deptName
              kpi
            }
            users {
              userId
              userName
              kpi
              hired
            }
          }
        }
      }
  `);
    return {
      data: formatTreeData({ origin: data.data, isTest: true }),
      loading,
    };
  },
};
export default StatisticServices;
