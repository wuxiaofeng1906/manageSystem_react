import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import IStaticAgTable, { IRuleData } from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
import { ModalFuncProps } from 'antd/lib/modal/Modal';
import { useGqlClient } from '@/hooks';
import { AgGridReact } from 'ag-grid-react';
import { initGridTable } from '@/utils/utils';
import { CellClickedEvent, GridApi } from 'ag-grid-community';
import { isEmpty, orderBy } from 'lodash';
import dayjs from 'dayjs';

// 项目实际产出率
const ruleData: IRuleData[] = [
  {
    title: '周期',
    child: ['按周月季年统计，执行关闭日期落在哪个周期'],
  },
  {
    title: '统计范围',
    child: ['各阶段规模标准预置'],
    table: {
      dataSource: [
        {
          scale: '规模取执行概况中的‘规模’值',
          standard: 5,
          stage: '需求',
          time: '规模*规模标准*8H',
        },
        { scale: '', standard: 5, stage: '概设', time: '5*10*8' },
        { scale: '', standard: 2, stage: '详设', time: '2*10*8' },
        { scale: '', standard: 10, stage: '开发', time: '10*10*8' },
        { scale: '', standard: 12, stage: '测试', time: '12*10*8' },
      ],
      column: [
        {
          dataIndex: 'scale',
          title: '规模',
          render: (v: string) => ({ children: v, props: { rowSpan: v ? 5 : 0 } }),
        },
        { dataIndex: 'standard', title: '规模标准' },
        { dataIndex: 'stage', title: '阶段' },
        { dataIndex: 'time', title: '阶段规模标准工时(H)' },
      ],
    },
  },
  {
    title: '',
    child: [
      <div style={{ marginTop: 10 }}>
        各阶段自然消耗工时
        <a href={'https://shimo.im/docs/B1Aw1eVreRfZvXqm#anchor-dhHB'} target={'_blank'}>
          取值规则
        </a>
      </div>,
    ],
  },
  {
    title: '',
    child: [
      <div style={{ marginBottom: 10 }}>
        各阶段实际工时
        <a href={'https://shimo.im/sheets/1d3aVdBVEmS6mrqg/MODOC'} target={'_blank'}>
          取值规则
        </a>
      </div>,
    ],
    table: {
      dataSource: [
        { title: 'T1', factor: '0.6' },
        { title: 'T2', factor: '0.8' },
        { title: 'T3', factor: '1.0' },
        { title: 'T4', factor: '1.2' },
        { title: 'T5', factor: '1.4' },
        { title: 'T6', factor: '1.6' },
        { title: 'T7', factor: '1.8' },
        { title: 'T8以上', factor: '2.0' },
      ],
      column: [
        { dataIndex: 'title', title: '职级' },
        { dataIndex: 'factor', title: '能力系数' },
      ],
    },
  },
  {
    title: '计算公式',
    child: [
      '项目实际产出率 = SUM(项目总规模标准工时) / SUM(项目总实际工时) *100',
      '各阶段实际产出率 = SUM(各阶段规模标准工时) / SUM(各阶段实际工时) *100',
      '单个任务的实际工时 = 该任务消耗工时*该任务的完成人的职级能力系数',
      '单个bug的实际工时 = 该bug该人的消耗工时*该解决或关闭人的职级能力系数',
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
        onCancel={() => setActiveItem({ visible: false, data: null })}
      />
    </div>
  );
};

export default ActualOutputRate;

const ActualDetailModal = (props: ModalFuncProps & { data: { dept: number; range: any } }) => {
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
        StatisticServices.actualRateDetail({ client: gqlClient, params: props.data }).then(
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
    }
  }, [props.visible]);

  return (
    <Modal
      visible={props.visible}
      closable={false}
      title={'项目-实际产出率明细'}
      footer={[
        <Button onClick={props?.onCancel} type={'primary'}>
          取消
        </Button>,
      ]}
      width={1200}
    >
      <Spin spinning={loading} tip={'数据加载中，请稍等...'}>
        <div style={{ height: 300, width: '100%' }}>
          <AgGridReact
            {...initGridTable({ ref: gridApi, height: 32 })}
            rowData={detail}
            columnDefs={[
              { headerName: '项目名称', field: 'name', minWidth: 220 },
              { headerName: '关闭时间', field: 'time', minWidth: 120 },
              { headerName: '实际产出率', field: 'total', minWidth: 120 },
              { headerName: '需求阶段产出率', field: 'story', minWidth: 120 },
              { headerName: '概设阶段产出率', field: 'overview', minWidth: 120 },
              { headerName: '开发阶段产出率', field: 'develop', minWidth: 120 },
              { headerName: '测试阶段产出率', field: 'test', minWidth: 120 },
            ]}
          />
        </div>
      </Spin>
    </Modal>
  );
};
