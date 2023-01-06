import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import type { CellClickedEvent, GridApi } from 'ag-grid-community';
import { Button, Drawer, Table } from 'antd';
import {
  ScheduleTwoTone,
  CalendarTwoTone,
  ProfileTwoTone,
  QuestionCircleTwoTone,
  AppstoreTwoTone,
  FundTwoTone,
} from '@ant-design/icons';
import type { IStaticBy, IIdentity, Period } from '@/hooks/statistic';
import { useStatistic } from '@/hooks/statistic';
import { isEmpty, isString } from 'lodash';
import type { ColumnsType } from 'antd/lib/table/interface';
import type { IStatisticQuery } from '@/services/statistic';
import { ColDef } from 'ag-grid-community/dist/lib/entities/colDef';
import { initGridTable } from '@/utils/utils';
import WrapperKpi from '@/components/wrapperKpi';

interface IStatic {
  request: (data: IStatisticQuery) => void;
  showDenominator?: boolean; // 以分子、分母展示
  ruleData: IRuleData[]; // 规则描述
  identity?: IIdentity; // 接口参数类型
  period?: Period; // 接口参数类型
  len?: number; // 保留小数位数
  unit?: string; // 指标单位
  initFilter?: IStaticBy[]; // 查询方式
  columnDefs?: any[]; // 列
  defaultColumn?: boolean; // 以默认列方式展示
  columnTypes?: { [key: string]: ColDef }; // 自定义列类型的对象映射
  treeData?: boolean; // 是否为树形结构
  normalQuarter?: boolean; // 正常季度显示
  onClick?: (data: any) => void; // 事件
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
// 指标表格组件
const IStaticAgTable: React.FC<IStatic> = ({
  initFilter,
  request,
  ruleData,
  len,
  identity,
  period,
  columnDefs,
  columnTypes,
  unit = '%',
  showDenominator = false,
  defaultColumn = true,
  treeData = true,
  normalQuarter = false,
  onClick,
}) => {
  const gridApi = useRef<GridApi>();
  const { handleStaticBy, columns, rowData, loading } = useStatistic();
  const [visible, setVisible] = useState(false);

  const [gridHeight, setGridHeight] = useState(window.innerHeight - 230);

  window.onresize = function () {
    setGridHeight(window.innerHeight - 230);
    gridApi.current?.sizeColumnsToFit();
  };

  const changeStaticBy = async (type: IStaticBy) => {
    await handleStaticBy({
      request,
      type,
      identity,
      showDenominator,
      len,
      period,
      defaultColumn,
      normalQuarter,
      onClick,
    });
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
      <div style={{ height: gridHeight, width: '100%' }}>
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
            frameworkComponents={{
              wrapperkpi: (p: CellClickedEvent) =>
                WrapperKpi({ params: p, showSplit: showDenominator, len, onClick }),
            }}
          />
        )}
      </div>
      <IDrawer visible={visible} setVisible={(v) => setVisible(v)} ruleData={ruleData} />
    </PageContainer>
  );
};

export default IStaticAgTable;

// 规则
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

// 查询方式
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
            key={it.type}
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
