import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import type { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Button, Drawer, Table } from 'antd';
import {
  ScheduleTwoTone,
  CalendarTwoTone,
  ProfileTwoTone,
  QuestionCircleTwoTone,
  AppstoreTwoTone,
  FundTwoTone,
} from '@ant-design/icons';
import { getHeight } from '@/publicMethods/pageSet';
import type { IStaticBy, IIdentity, Period } from '@/hooks/statistic';
import { useStatistic } from '@/hooks/statistic';
import { isEmpty, isString } from 'lodash';
import type { ColumnsType } from 'antd/lib/table/interface';
import type { IStatisticQuery } from '@/services/statistic';
import { ColDef } from 'ag-grid-community/dist/lib/entities/colDef';
import { initGridTable } from '@/utils/utils';

interface IStatic {
  request: (data: IStatisticQuery) => void;
  showDenominator?: boolean; // 以分子、分母展示
  showHalfYear?: boolean; // 按半年
  ruleData: IRuleData[];
  identity?: IIdentity;
  len?: number;
  unit?: string;
  initFilter?: IStaticBy[];
  columnDefs?: any[];
  period?: Period;
  formatColumn?: boolean;
  columnTypes?: { [key: string]: ColDef };
  treeData?: Boolean;
}

type INode = string | React.ReactNode;
export interface IRuleData {
  title: INode;
  child: INode[];
  table?: { dataSource: any[]; column: ColumnsType<any> }; // 支持antd table
}
const condition: { icon: React.ReactNode; title: string; type: IStaticBy }[] = [
  { icon: <ProfileTwoTone />, title: '按天', type: 'day' },
  { icon: <ProfileTwoTone />, title: '按周', type: 'week' },
  { icon: <CalendarTwoTone />, title: '按月', type: 'month' },
  { icon: <ScheduleTwoTone />, title: '按季', type: 'quarter' },
  { icon: <FundTwoTone />, title: '按半年', type: 'halfYear' },
  { icon: <AppstoreTwoTone />, title: '按年', type: 'year' },
];
const IStaticPerformance: React.FC<IStatic> = ({
  request,
  ruleData,
  identity,
  showDenominator = false,
  showHalfYear = false,
  len,
  unit = '%',
  initFilter,
  columnDefs,
  period,
  formatColumn = true,
  treeData = true,
  columnTypes,
}) => {
  const gridApi = useRef<GridApi>();
  const { handleStaticBy, columns, rowData, loading } = useStatistic();
  const [visible, setVisible] = useState(false);

  // 表格的屏幕大小自适应
  const [gridHeight, setGridHeight] = useState(getHeight());

  window.onresize = function () {
    setGridHeight(getHeight());
    gridApi.current?.sizeColumnsToFit();
  };

  const changeStaticBy = async (type: IStaticBy) => {
    await handleStaticBy({ request, type, identity, showDenominator, len, period, formatColumn });
  };

  useEffect(() => {
    changeStaticBy('quarter');
  }, []);

  useEffect(() => {
    if (gridApi.current) {
      if (loading) gridApi.current.showLoadingOverlay();
      else gridApi.current.hideOverlay();
    }
  }, [loading]);

  const opsMemo = useMemo(
    () =>
      treeData
        ? {
            treeData: true,
            groupDefaultExpanded: -1,
            getDataPath: (source: any) => source.Group,
            autoGroupColumnDef: {
              minWidth: 280,
              headerName: '部门-人员',
              cellRendererParams: { suppressCount: true },
              pinned: 'left',
              suppressMenu: false,
            },
          }
        : {},
    [treeData],
  );

  return (
    <PageContainer>
      <div style={{ background: 'white' }}>
        <ConditionHeader initFilter={initFilter} onChange={changeStaticBy} />
        <label style={{ fontWeight: 'bold' }}>(统计单位：{unit})</label>
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
      <div className="ag-theme-alpine" style={{ height: gridHeight, width: '100%' }}>
        {isEmpty(columns) ? (
          <div />
        ) : (
          <AgGridReact
            {...opsMemo}
            columnDefs={columnDefs ?? columns}
            rowData={rowData}
            animateRows={true}
            columnTypes={columnTypes}
            {...initGridTable({ ref: gridApi, height: 32 })}
          />
        )}
      </div>
      <IDrawer visible={visible} setVisible={(v) => setVisible(v)} ruleData={ruleData} />
    </PageContainer>
  );
};

export default IStaticPerformance;

export const IDrawer = ({
  visible,
  setVisible,
  ruleData,
}: {
  visible: boolean;
  setVisible: (v: boolean) => void;
  ruleData: IRuleData[];
}) => {
  return (
    <Drawer
      title={<label style={{ fontWeight: 'bold', fontSize: 20 }}>计算规则</label>}
      placement="right"
      width={300}
      closable={false}
      onClose={() => setVisible(false)}
      visible={visible}
    >
      {ruleData.map((it, i) => (
        <div key={i}>
          {isString(it.title)
            ? it.title && <p style={{ fontWeight: 'bold' }}>{`${i + 1}.${it.title}:`}</p>
            : it.title}
          {it.child?.map((v) =>
            isString(v) ? (
              <p key={v} style={{ textIndent: '2em', margin: '5px 0' }}>{`${v};`}</p>
            ) : (
              v
            ),
          )}
          {!isEmpty(it.table) && (
            <Table
              style={{ wordBreak: 'keep-all' }}
              dataSource={it.table?.dataSource}
              columns={it.table?.column}
              pagination={false}
              scroll={{ x: 300 }}
              bordered
            />
          )}
        </div>
      ))}
    </Drawer>
  );
};
export const ConditionHeader = ({
  initFilter = ['week', 'month', 'quarter', 'year'],
  onChange,
}: {
  initFilter?: IStaticBy[];
  onChange: (type: IStaticBy) => void;
}) => {
  return (
    <>
      {condition.map((it) => {
        return (
          <Button
            type="text"
            style={{ color: 'black' }}
            icon={it.icon}
            size={'large'}
            hidden={!initFilter?.includes(it.type)}
            onClick={() => onChange(it.type)}
          >
            {`${it.title}统计`}
          </Button>
        );
      })}
    </>
  );
};
