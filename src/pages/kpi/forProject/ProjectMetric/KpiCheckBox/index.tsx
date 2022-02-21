/*
 * @Description: 按需加载项目指标数据
 * @Author: jieTan
 * @Date: 2021-12-08 17:53:12
 * @LastEditTime: 2022-02-21 10:16:03
 * @LastEditors: jieTan
 * @LastModify:
 */
import { Checkbox, Divider } from 'antd';
import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import {
  GQL_PARAMS,
  PROJ_METRIC as PM,
  PK_SEARCH_INTERVAL,
  MOMENT_FORMAT,
  PK_SHOW_DEFAULT_DATE,
  PK_EXCLUDE_DEMO_NAME,
} from '@/namespaces';
import {
  ProcessDeviationGroup,
  ProcessQualityGroup,
  ReviewDefectGroup,
  ScaleProductivityGroup,
  ServiceAboutGroup,
  StageWorkloadGroup,
  StoryStableGroup,
} from '../TableList/definitions/columns';
import { projectKpiGql, queryGQL } from '@/pages/gqls';
import { useGqlClient } from '@/hooks';
import moment from 'moment';
import { history as myHistory } from 'umi';
import { useUnmount } from 'ahooks';

const CheckboxGroup = Checkbox.Group;
// checkbox框的文本值
const plainOptions = (() => {
  const rets: string[] = [];
  Object.values(PM)?.map((item) => (item['show'] === undefined ? rets.push(item.zh) : ''));
  return rets;
})();

export default () => {
  /*  */
  const gqlClient = useGqlClient();
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const { setGqlData, setDynamicCols, setLoading, setPkGqlParmas, pkGqlParmas } =
    useModel('projectMetric');

  /*  */
  const onChange = (list: any) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
    // 自定义
  };

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? (plainOptions as never[]) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  /**
   * @description - 按需加载指标数据
   * @author JieTan
   * @date 2021/12/10 09:12:26
   */
  const loadOnDemand = async () => {
    // 获取当前选中的指标项 => FIMXE：抽离出去
    const loadColumns = [];
    const kpiItems: string[] = [];
    for (const kp of checkedList) {
      switch (kp) {
        // 过程质量
        case PM.processQuality.zh:
          loadColumns.push(ProcessQualityGroup);
          kpiItems.push(PM.processQuality.en);
          break;
        // 进度偏差率
        case PM.progressDeviation.zh:
          loadColumns.push(ProcessDeviationGroup);
          kpiItems.push(PM.progressDeviation.en);
          break;
        // 阶段工作量
        case PM.stageWorkload.zh:
          loadColumns.push(StageWorkloadGroup);
          kpiItems.push(PM.stageWorkload.en);
          break;
        // 生产率&规模
        case PM.scaleProductivity.zh:
          loadColumns.push(ScaleProductivityGroup);
          kpiItems.push(PM.scaleProductivity.en);
          break;
        // 评审和缺陷
        case PM.reviewDefect.zh:
          loadColumns.push(ReviewDefectGroup);
          kpiItems.push(PM.reviewDefect.en);
          break;
        // 需求稳定性
        case PM.storyStable.zh:
          loadColumns.push(StoryStableGroup);
          kpiItems.push(PM.storyStable.en);
          break;
        // 服务
        case PM.serviceAbout.zh:
          loadColumns.push(ServiceAboutGroup);
          kpiItems.push(PM.serviceAbout.en);
          break;

        default:
          break;
      }
    }

    // gql查询数据
    const tmpParams = { kpis: kpiItems };
    // 判定是否需要默认的筛选时间
    if (PK_SHOW_DEFAULT_DATE)
      Object.assign(tmpParams, {
        dates: {
          start: moment()
            .subtract(PK_SEARCH_INTERVAL.value, PK_SEARCH_INTERVAL.unit as any)
            .format(MOMENT_FORMAT.date),
        }, // 构建默认查询参数 - 带查询时间
      });
    //
    const newParams: any = pkGqlParmas ? { ...(pkGqlParmas as any), kpis: kpiItems } : tmpParams;
    setPkGqlParmas(newParams);
    const _params: GQL_PARAMS = { func: 'projectKpi', params: newParams };
    // **************************************************
    // 绑定预演数据
    if (!(myHistory as any).location.query[PK_EXCLUDE_DEMO_NAME])
      Object.assign(_params.params, { demo: true });
    // **************************************************
    const ret = await queryGQL(gqlClient, projectKpiGql, _params);

    // 更改当前gird的数据源
    setGqlData(ret);
    setDynamicCols(loadColumns as never[]);
  };

  //
  useEffect(() => {
    // 选中指标变化事时，更改数据源
    setLoading(true);
    loadOnDemand();
    //
  }, [checkedList]);

  // 卸载前,清空查询参数
  useUnmount(() => {
    setPkGqlParmas(null);
  });

  /*  */
  return (
    <div style={{ marginLeft: 10 }}>
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        全选
      </Checkbox>
      <Divider type="vertical" />
      <CheckboxGroup
        style={{ marginLeft: 8 }}
        options={plainOptions}
        value={checkedList}
        onChange={onChange}
      />
    </div>
  );
};
