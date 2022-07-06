import React, { useState } from 'react';
import { useGqlClient } from '@/hooks/index';
import { omit } from 'lodash';
import {
  getMonthWeek,
  getTwelveMonthTime,
  getFourQuarterTime,
  getYearsTime,
  getWeeksRange,
} from '@/publicMethods/timeMethods';
import { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import { converseForAgGrid_showDepts } from '@/pages/kpi/performance/developer/devMethod/deptDataAnalyze';

// 统计
export type IStaticBy = 'year' | 'quarter' | 'month' | 'week';

export const useStatistic = () => {
  const gqlClient = useGqlClient();
  const [columns, setColumns] = useState<(ColDef | ColGroupDef)[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);

  const handleStaticBy = async (request: Function, type: IStaticBy = 'week') => {
    renderColumn(type);
    const data: any = await request(gqlClient, type);
    const result = converseForAgGrid_showDepts(data?.data);
    setRowData(result);
  };

  const cellRenderer = (params: any) => {
    const node = params.data;
    if (params.value) {
      const result = params.value;
      return `<span style="font-weight: ${node?.isDept ? 'bold' : 'initial'}"> ${result}</span>`;
    }
    return `<span style="font-weight: ${node?.isDept ? 'bold' : 'silver'}"> 0</span>`;
  };

  // column
  const renderColumn = (type: IStaticBy) => {
    const component: (ColDef | ColGroupDef)[] = new Array();
    const typeMap = {
      year: getYearsTime,
      quarter: getFourQuarterTime,
      month: getTwelveMonthTime,
    };
    const ranges = typeMap[type]?.();
    const weekRanges = getWeeksRange(8);
    const data = type == 'week' ? weekRanges : ranges;
    for (let index = 0; index < data?.length; index += 1) {
      if (type == 'week') {
        const starttime = data[index].from;
        const weekName = getMonthWeek(starttime);
        component.push({
          headerName: weekName,
          field: starttime?.toString(),
          colId: starttime?.toString(),
          cellRenderer,
          minWidth: 100,
        });
      } else
        component.push(
          omit(
            {
              cellRenderer,
              headerName: data[index].title,
              field: data[index].start?.toString(),
              colId: data[index].start?.toString(),
              minWidth: type == 'month' ? 110 : 100,
            },
            type == 'month' ? [] : ['minWidth'],
          ),
        );
    }
    setColumns(component);
  };

  return { handleStaticBy, columns, rowData };
};
