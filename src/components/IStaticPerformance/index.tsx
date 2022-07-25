import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Button, Drawer, Table } from 'antd';
import {
  ScheduleTwoTone,
  CalendarTwoTone,
  ProfileTwoTone,
  QuestionCircleTwoTone,
  AppstoreTwoTone,
} from '@ant-design/icons';
import { getHeight } from '@/publicMethods/pageSet';
import { IStaticBy, useStatistic, IIdentity } from '@/hooks/statistic';
import { isEmpty, isString } from 'lodash';
import { ColumnsType } from 'antd/lib/table/interface';
import { IStatisticQuery } from '@/services/statistic';

interface IStatic {
  request: (data: IStatisticQuery) => void;
  showDenominator?: boolean; // 以分子、分母展示
  ruleData: IRuleData[];
  identity?: IIdentity;
}

type INode = string | React.ReactNode;
export interface IRuleData {
  title: INode;
  child: Array<INode>;
  table?: { dataSource: any[]; column: ColumnsType<any> }; // 支持antd table
}
const IStaticPerformance: React.FC<IStatic> = ({
  request,
  ruleData,
  identity,
  showDenominator = false,
}) => {
  const gridApi = useRef<GridApi>();
  const { handleStaticBy, columns, rowData, loading } = useStatistic();
  const [visible, setVisible] = useState(false);

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  // 表格的屏幕大小自适应
  const [gridHeight, setGridHeight] = useState(getHeight());

  window.onresize = function () {
    setGridHeight(getHeight());
    gridApi.current?.sizeColumnsToFit();
  };

  const changeStaticBy = async (type: IStaticBy) => {
    await handleStaticBy({ request, type, identity, showDenominator });
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

  return (
    <PageContainer>
      <div style={{ background: 'white' }}>
        <Button
          type="text"
          style={{ color: 'black' }}
          icon={<ProfileTwoTone />}
          size={'large'}
          onClick={() => changeStaticBy('week')}
        >
          按周统计
        </Button>
        <Button
          type="text"
          style={{ color: 'black' }}
          icon={<CalendarTwoTone />}
          size={'large'}
          onClick={() => changeStaticBy('month')}
        >
          按月统计
        </Button>
        <Button
          type="text"
          style={{ color: 'black' }}
          icon={<ScheduleTwoTone />}
          size={'large'}
          onClick={() => changeStaticBy('quarter')}
        >
          按季统计
        </Button>
        <Button
          type="text"
          style={{ color: 'black' }}
          icon={<AppstoreTwoTone />}
          size={'large'}
          onClick={() => changeStaticBy('year')}
        >
          按年统计
        </Button>
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
      <div className="ag-theme-alpine" style={{ height: gridHeight, width: '100%' }}>
        {isEmpty(columns) ? (
          <div />
        ) : (
          <AgGridReact
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              flex: 1,
              suppressMenu: true,
            }}
            autoGroupColumnDef={{
              minWidth: 280,
              headerName: '部门-人员',
              cellRendererParams: { suppressCount: true },
              pinned: 'left',
              suppressMenu: false,
            }}
            columnDefs={columns}
            rowData={rowData}
            rowHeight={32}
            headerHeight={35}
            onGridReady={onGridReady}
            treeData={true}
            animateRows={true}
            groupDefaultExpanded={-1}
            getDataPath={(source: any) => source.Group}
          />
        )}
      </div>
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
              isString(v) ? <p style={{ textIndent: '2em', margin: '5px 0' }}>{`${v};`}</p> : v,
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
    </PageContainer>
  );
};

export default IStaticPerformance;
