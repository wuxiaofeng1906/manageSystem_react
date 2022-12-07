import React from 'react';
import IStaticPerformance, { IRuleData } from '@/components/IStaticPerformance';
import StatisticServices from '@/services/statistic';
import {isEmpty} from "lodash";
import {AgGridReact} from "ag-grid-react";
// 累计线上千行bug率 -p0p1占比
const ruleData: IRuleData[] = [
  {
    title: '统计周期',
    child: ['按周月季年统计，按事件开始日期归属周期（zt_feedback.realStarted)'],
  },
  {
    title: '统计范围',
    child: ['故障持续时间取值zt_feedback.Duration'],
  },
  {
    title: '计算公式',
    child: ['运维-系统平均可用时间 = 1-(SUM(故障持续时间) / (24*60*统计周期自然日))*100'],
  },
];
const SystemAvailable: React.FC<any> = () => {
  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>

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
          pivotMode={true}
          columnDefs={columnDefs ?? columns}
          rowData={rowData}
          rowHeight={32}
          headerHeight={35}
          onGridReady={onGridReady}
          treeData={true}
          animateRows={true}
          groupDefaultExpanded={-1}
          getDataPath={(source: any) => {
            return source.Group;
          }}
        />
      )}
    </div>
  );
};

export default SystemAvailable;
