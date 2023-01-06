// 自动化单元测试覆盖率
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { ConditionHeader, IDrawer, IRuleData } from '@/components/IStaticAgTable';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { PageContainer } from '@ant-design/pro-layout';
import { useGqlClient } from '@/hooks';
import { CellClickedEvent, GridApi } from 'ag-grid-community';
import StatisticServices from '@/services/statistic';
import { IStaticBy } from '@/hooks/statistic';
import { isEmpty, intersection, difference, isEqual, uniqBy } from 'lodash';
import { RowGroupOpenedEvent } from 'ag-grid-community/dist/lib/events';
import { initGridTable } from '@/utils/utils';
import WrapperKpi from '@/components/wrapperKpi';

const ruleData: IRuleData[] = [
  {
    title: '上线日期统计',
    child: [
      '从发布过程获取正式发布的发布日期，排除掉只涉及emergency或stage-patch的项目（如果是sprint+特性项目+stage-patch，不要排除）',
    ],
  },
  {
    title: '分子统计范围：（上线后2个工作日客服顾问反馈问题）',
    child: [
      'bug创建日期在发布日期后2个工作日内(若发布当天为工作日，要含发布当天），举例：发布日期为2022-08-11，则取需求创建日期为2022-08-11至2022-08-12的',
      'bug创建人为顾问/客服',
      'bug的解决方案排除‘不是问题’',
    ],
  },
  {
    title: '统计人员',
    child: [
      'bug转需求的，任务状态是`未开始,进行中`取任务的指派给是测试的（多个测试人员，都要分别算1个)',
      'bug未转需求的，bug状态是`激活`取指派给是测试的（因为指派给会经常变，始终要取最新的），bug状态是`已解决`的取解决人是测试的',
    ],
  },
  {
    title: '分母统计范围：（上线前1个月客服顾问反馈问题）',
    child: [
      '从客户服务记录表获取数据customer_service',
      'SUM(发布日期前1个月的数据)  ',
      '举例：发布日期为2022-08-11，则取biz_date 在2022-07-10 至 2022-08-10的数据',
    ],
  },
  {
    title: '计算规则',
    child: [
      '产品上线后emergency占比 = 上线后2个工作日客服顾问反馈给开发的需求或BUG数 / (AVG(上线前1个月客服顾问反馈问题)*2)*100%',
    ],
  },
];
let exec: string[] = [];
export default () => {
  const client = useGqlClient();
  const gridRef = useRef<GridApi>();
  const [category, setCategory] = useState<IStaticBy>('month');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState<any[]>([]);
  const [gridHeight, setGridHeight] = useState(window.innerHeight - 250);

  window.onresize = function () {
    setGridHeight(window.innerHeight - 250);
    gridRef.current?.sizeColumnsToFit();
  };

  const getTableSource = async () => {
    setLoading(true);
    try {
      const { data } = await StatisticServices.autoTestCoverageUnit({ client, params: category });

      gridRef.current?.setColumnDefs([
        { field: 'branch', headerName: '分支', pinned: 'left' },
        ...data.column,
      ]);
      setRowData(data?.rowData);
      exec = data?.project;
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getProjectApps = async (param: RowGroupOpenedEvent) => {
    if (
      isEmpty(param.data) ||
      !param.expanded ||
      !param.data?.isProject ||
      intersection(param.data.Group, exec)?.length == 0
    )
      return;
    setLoading(true);
    exec = difference(exec, param.data.Group);
    let ranges: string[] = [];
    let runtime: string[] = [];
    let apps: any[] = [];
    let Group: any[] = param.data?.Group;
    Object.entries(param.data ?? {})?.forEach(([k, v]) => {
      if (k.startsWith('execution') && v) {
        runtime.push(v);
        ranges.push(k?.replaceAll('execution', ''));
      }
    });
    const res = await StatisticServices.autoTestCoverageServer({
      client,
      params: { runtimes: runtime || [], branchName: param.data.branch },
    });
    ranges?.forEach((range) => {
      res?.forEach((it: any) => {
        it.datas?.forEach((data: any) => {
          const tech = data.tech;
          if (!isEmpty(tech)) {
            Group.push(tech.name == '2' ? '后端' : '前端');
            apps.push({
              Group: Group,
              branch: it?.branch,
              isDept: false,
              [`branCove${range}`]:
                ((tech?.branchCover?.numerator || 0) / (tech?.branchCover?.denominator || 0)) * 100,
              [`execution${range}`]: it?.runtime,
              [`instCove${range}`]:
                ((tech?.instCover?.numerator || 0) / (tech?.instCover?.denominator || 0)) * 100,
            });
          }

          data.datas?.forEach((app: any) => {
            apps.push({
              Group: [...Group, app.name],
              branch: it?.branch,
              isDept: false,
              [`branCove${range}`]:
                ((app?.branchCover?.numerator || 0) / (app?.branchCover?.denominator || 0)) * 100,
              [`execution${range}`]: it?.runtime,
              [`instCove${range}`]:
                ((app?.instCover?.numerator || 0) / (app?.instCover?.denominator || 0)) * 100,
            });
          });
        });
      });
    });
    const parent = [...param.data.Group]?.slice(0, param.data.Group?.length - 1);
    setRowData(
      uniqBy(
        [
          ...rowData.filter((it) => !isEqual(it.Group, [...parent, ''])),
          { ...param.data, Group: parent },
          ...apps,
        ],
        'Group',
      ),
    );
    setLoading(false);
  };

  useEffect(() => {
    if (gridRef.current) {
      if (loading) gridRef.current.showLoadingOverlay();
      else gridRef.current.hideOverlay();
    }
  }, [loading]);

  useEffect(() => {
    getTableSource();
  }, [category]);

  return (
    <PageContainer>
      <div style={{ background: 'white' }}>
        <ConditionHeader onChange={(v) => setCategory(v)} />
        <label style={{ fontWeight: 'bold' }}>(统计单位：%)</label>
        <Button
          type="text"
          style={{ color: '#1890FF', float: 'right' }}
          icon={<QuestionCircleTwoTone />}
          size={'large'}
          onClick={() => setVisible(true)}
        >
          计算规则
        </Button>
      </div>
      <div className={'ag-theme-alpine'} style={{ width: '100%', height: gridHeight }}>
        <AgGridReact
          {...initGridTable({ ref: gridRef, height: 32 })}
          rowData={rowData}
          pivotMode={true}
          suppressAggFuncInHeader={true}
          onRowGroupOpened={getProjectApps}
          autoGroupColumnDef={{
            minWidth: 260,
            maxWidth: 350,
            headerName: '部门-项目',
            cellRendererParams: { suppressCount: true },
            pinned: 'left',
            suppressMenu: false,
          }}
          frameworkComponents={{
            wrapperkpi: (p: CellClickedEvent) => WrapperKpi({ params: p, len: 2 }),
          }}
          treeData={true}
          groupDefaultExpanded={-1}
          isGroupOpenByDefault={(params) => !exec.includes(params.key)}
          getDataPath={(source: any) => source.Group}
        />
      </div>
      <IDrawer visible={visible} setVisible={(v) => setVisible(v)} ruleData={ruleData} />
    </PageContainer>
  );
};
