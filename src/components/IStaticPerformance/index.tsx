import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Button, Drawer } from 'antd';
import {
  ScheduleTwoTone,
  CalendarTwoTone,
  ProfileTwoTone,
  QuestionCircleTwoTone,
  AppstoreTwoTone,
} from '@ant-design/icons';
import { getHeight } from '@/publicMethods/pageSet';
import { IStaticBy, useStatistic } from '@/hooks/statistic';
import { GqlClient } from '@/hooks';
import { isEmpty } from 'lodash';

interface IStatic {
  request: (client: GqlClient<object>, params: any) => void;
  showSplit?: boolean; // 以分子、分母展示
  ruleData: {
    range: string[];
    expression: string[];
  };
}
const IStaticPerformance: React.FC<IStatic> = ({ request, ruleData, showSplit = false }) => {
  const gridApi = useRef<GridApi>();
  const { handleStaticBy, columns, rowData } = useStatistic();
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
    await handleStaticBy(request, type, showSplit);
  };
  useEffect(() => {
    changeStaticBy('quarter');
  }, []);
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
        <p>1.取值范围：</p>
        {ruleData.range?.map((v) => (
          <p style={{ textIndent: '2em' }}>{`${v};`}</p>
        ))}
        <p>2.计算公式：</p>
        {ruleData.expression?.map((v) => (
          <p style={{ textIndent: '2em' }}>{`${v};`}</p>
        ))}
      </Drawer>
    </PageContainer>
  );
};

export default IStaticPerformance;
