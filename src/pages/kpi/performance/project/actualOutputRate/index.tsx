import React, {useEffect, useRef, useState} from 'react';
import {Modal, Button, Spin} from 'antd';
import IStaticAgTable, {IRuleData} from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
import {ModalFuncProps} from 'antd/lib/modal/Modal';
import {useGqlClient} from '@/hooks';
import {AgGridReact} from 'ag-grid-react';
import {initGridTable} from '@/utils/utils';
import {CellClickedEvent, GridApi} from 'ag-grid-community';
import {isEmpty, orderBy} from 'lodash';
import dayjs from 'dayjs';

// 项目实际产出率
const ruleData: IRuleData[] = [
  {
    title: '周期',
    child: ['按周月季年统计，执行-计划-计划灰度时间的’实际结束日期‘落在哪个周期'],
  },
  {
    title: '统计范围：（任务和bug）',
    child: ['各阶段规模标准预置'],
    table: {
      dataSource: [
        {
          scale: '规模取执行概况中的‘规模’值', standard: 5, stage: '需求',
          time: '规模*规模标准*8H', type: '特性'
        },
        {scale: '', standard: 5, stage: '概设', time: '5*10*8', type: '特性、自动化'},
        {scale: '', standard: 2, stage: '详设', time: '2*10*8', type: '特性'},
        {scale: '', standard: 10, stage: '开发', time: '10*10*8', type: '特性、sprint、emergency、stage-patch、自动化'},
        {scale: '', standard: 12, stage: '测试', time: '12*10*8', type: '特性、sprint、emergency、stage-patch、自动化'},
      ],
      column: [
        {
          dataIndex: 'scale',
          title: '规模',
          render: (v: string) => ({children: v, props: {rowSpan: v ? 5 : 0}}),
        },
        {dataIndex: 'standard', title: '规模标准（人天）'},
        {dataIndex: 'stage', title: '阶段'},
        {dataIndex: 'time', title: '阶段规模标准工时(H)'},
        {dataIndex: 'type', title: '适用项目类型'},
      ],
    },
  },
  {
    title: '计算公式',
    child: [
      '项目实际产出率 = SUM(项目总规模标准工时) / SUM(项目总实际消耗工时) *100',
      '各阶段实际产出率 = SUM(各阶段规模标准工时) / SUM(各阶段实际消耗工时) *100',
      '单个bug的实际消耗工时 = 该bug该人的消耗工时',
      'bug中的工时也要算到项目和阶段中'
    ],
  },
];

const ActualOutputRate: React.FC<any> = () => {
  const [activeItem, setActiveItem] = useState<{ visible: boolean; data: any }>({
    visible: false,
    data: null,
  });

  return (
    <div>
      <IStaticAgTable
        ruleData={ruleData}
        request={StatisticServices.actualRate}
        normalQuarter={true}
        unit={'%'}
        len={2}
        onClick={(p: CellClickedEvent) =>
          setActiveItem({
            visible: true,
            data: {
              dept: +p?.data.dept,
              range: p.data[`${p.column?.colId}range`],
              extra: p.data.extra || 0,
            },
          })
        }
      />
      <ActualDetailModal
        visible={activeItem.visible}
        data={activeItem.data}
        onCancel={() => setActiveItem({visible: false, data: null})}
      />
    </div>
  );
};

export default ActualOutputRate;

export const ActualDetailModal = (
  props: ModalFuncProps & { data: { dept: number; range: any } },
) => {
  const gqlClient = useGqlClient();
  const gridApi = useRef<GridApi>();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any[]>([]);

  const formatNum = (data: any, key: string, len = 2) => {
    const num = data[key]?.numerator;
    const den = data[key]?.denominator;
    if (!num || !den) return 0;
    return ((num / den) * 100).toFixed(len);
  };

  useEffect(() => {
    if (props.visible && !isEmpty(props.data)) {
      setLoading(true);
      try {
        StatisticServices.actualRateDetail({client: gqlClient, params: props.data}).then(
          (res: any) => {
            setDetail(
              orderBy(
                res?.map((it: any) => {
                  const stage = it.stageDatas;
                  return {
                    name: it.execName?.name,
                    time: it.closedAt ? dayjs(it.closedAt).format('YYYY-MM-DD') : '',
                    total: +((it.total?.kpi || 0) * 100).toFixed(2),
                    story: formatNum(stage, 'story'),
                    overview: formatNum(stage, 'overview'),
                    detail: formatNum(stage, 'detail'),
                    develop: formatNum(stage, 'develop'),
                    test: formatNum(stage, 'test'),
                  };
                }) ?? [],
                ['total'],
                'desc',
              ),
            );
            setLoading(false);
          },
        );
      } catch (e) {
        setLoading(false);
      }
    } else {
      setDetail([]);
    }
  }, [props.visible]);

  return (
    <Modal
      visible={props.visible}
      closable={false}
      width={1200}
      title={'项目-实际产出率明细'}
      destroyOnClose={true}
      footer={[
        <Button onClick={props?.onCancel} type={'primary'}>
          取消
        </Button>,
      ]}
    >
      <Spin spinning={loading} tip={'数据加载中，请稍等...'}>
        <div style={{height: 300, width: '100%'}}>
          <AgGridReact
            {...initGridTable({ref: gridApi, height: 32})}
            rowData={detail}
            columnDefs={[
              {headerName: '项目名称', field: 'name', minWidth: 220},
              {headerName: '关闭时间', field: 'time', minWidth: 120},
              {headerName: '实际产出率', field: 'total', minWidth: 120},
              {headerName: '需求阶段产出率', field: 'story', minWidth: 120},
              {headerName: '概设阶段产出率', field: 'overview', minWidth: 120},
              {headerName: '开发阶段产出率', field: 'develop', minWidth: 120},
              {headerName: '测试阶段产出率', field: 'test', minWidth: 120},
            ]}
          />
        </div>
      </Spin>
    </Modal>
  );
};
