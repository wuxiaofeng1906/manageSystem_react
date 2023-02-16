import React, {useEffect, useRef, useState} from 'react';
import {ConditionHeader, IDrawer, IRuleData} from '@/components/IStaticAgTable';
import StatisticServices from '@/services/statistic';
import {PageContainer} from '@ant-design/pro-layout';
import {Button, Spin} from 'antd';
import {QuestionCircleTwoTone} from '@ant-design/icons';
import {AgGridReact} from 'ag-grid-react';
import {GridApi} from 'ag-grid-community';
import {IStaticBy, useStatistic} from '@/hooks/statistic';
import {useGqlClient} from '@/hooks';
import {isEmpty} from 'lodash';
import {initGridTable} from '@/utils/utils';

// 运维 系统可用性
const ruleData: IRuleData[] = [
  {
    title: '统计周期',
    child: ['按周月季年统计，按事件开始日期归属周期（zt_feedback.realStarted)'],
  },
  {
    title: '统计范围',
    child: [
      <div>
        <strong style={{color: '#1890ff'}}>系统可用性：</strong>
        故障持续时间取值zt_feedback.Duration
      </div>,
      <div>
        <strong style={{color: '#1890ff'}}>系统平均可用时间：</strong>
        <span>离上次事件事件取值zt_feedback.lastfailure</span>
        <br/>
        <span>周期故障数取该周期的反馈条数，且创建人是运维</span>
      </div>,
      <div>
        <strong style={{color: '#1890ff'}}>系统平均修复时间：</strong>
        <span>故障恢复时间取值zt_feedback.Recover</span>
        <br/>
        <span>周期故障数取该周期的反馈条数</span>
      </div>,
    ],
  },
  {
    title: '计算公式',
    child: [
      <div>
        <strong style={{color: '#1890ff'}}>系统可用性：</strong>运维-系统平均可用时间 =
        1-(SUM(故障持续时间) / (24*60*统计周期自然日))*100
      </div>,
      <div>
        <strong style={{color: '#1890ff'}}>系统平均可用时间：</strong>运维-系统平均可用时间 =
        (SUM(离上次事件时间)/60/24) / SUM(周期故障数)
      </div>,
      <div>
        <strong style={{color: '#1890ff'}}>系统平均修复时间：</strong>运维-系统平均修复时间 =
        SUM(故障恢复时间) / SUM(周期故障数)
      </div>,
    ],
  },
];
const tabs = {
  ability: '系统可用性',
  avgusable: '系统平均可用时间',
  avgrepair: '系统平均修复时间',
};
const SystemAvailable: React.FC<any> = () => {
  const gqlClient = useGqlClient();
  const {renderColumn, columns} = useStatistic();
  const gridRef = useRef<GridApi>();
  const [category, setCategory] = useState<IStaticBy>('quarter');
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState<any[]>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    renderColumn({type: category});
    getDetail();
  }, [category]);

  const getDetail = async () => {
    setLoading(true);
    try {
      // @ts-ignore
      const {data} = await StatisticServices.operationsAvgAvailable({
        client: gqlClient,
        params: category,
      });
      let formatData: any;
      data?.forEach((it: any) => {
        let data: any;
        it.datas?.forEach((o: any) => {
          // avgusable 不再乘以100（以前的需求）
          const kpi = o.depts?.kpi;
          data = {
            ...data,
            // [o.range.start]: o.depts?.kpi * (it.category == 'avgusable' ? 1 : 100),
            [o.range.start]: kpi.toString().indexOf(".") > -1 ? kpi.toFixed(2) : kpi
          };
        });
        formatData = {...formatData, [it.category]: data};
      });
      setGridData(formatData);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Spin spinning={loading} tip={'数据加载中...'}>
        <div style={{background: 'white', minHeight: '530px'}}>
          <ConditionHeader onChange={(v) => setCategory(v)}/>
          <Button
            type="text"
            style={{color: '#1890FF', float: 'right'}}
            icon={<QuestionCircleTwoTone/>}
            size={'large'}
            onClick={() => setVisible(true)}
          >
            计算规则
          </Button>
          {Object.entries(tabs).map(([k, v]) => {
            return (
              <div style={{padding: '0 16px'}}>
                <h4 style={{margin: '10px 0'}}>
                  {v} (统计单位：{k == 'avgusable' ? '天' : k === "avgrepair" ? 'm' : '%'})
                </h4>
                <div className={'ag-theme-alpine'} style={{width: '100%', height: 100}}>
                  <AgGridReact
                    {...initGridTable({ref: gridRef, height: 32})}
                    rowData={isEmpty(gridData?.[k]) ? [] : [gridData?.[k]]}
                    columnDefs={columns}
                  />
                </div>
              </div>
            );
          })}
          <IDrawer visible={visible} setVisible={(v) => setVisible(v)} ruleData={ruleData}/>
        </div>
      </Spin>
    </PageContainer>
  );
};

export default SystemAvailable;
