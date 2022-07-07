import React, { useState } from 'react';
import { useGqlClient } from '@/hooks/index';
import { isNumber } from 'lodash';
import {
  getMonthWeek,
  getTwelveMonthTime,
  getFourQuarterTime,
  getYearsTime,
  getWeeksRange,
} from '@/publicMethods/timeMethods';
import { ColDef, ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';

// 统计
export type IStaticBy = 'year' | 'quarter' | 'month' | 'week';

export const useStatistic = () => {
  const gqlClient = useGqlClient();
  const [columns, setColumns] = useState<(ColDef | ColGroupDef)[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);

  const handleStaticBy = async (request: Function, type: IStaticBy = 'week', showSplit = false) => {
    renderColumn(type, showSplit);
    const data: any = await request(gqlClient, type);
    setRowData(data);
  };

  const cellRenderer = (params: any, showSplit = false) => {
    const node = params.data;
    const result = params.value;
    const currentTime = params.column?.colId;
    const numerator = node[`${currentTime}_numerator`] ?? 0; // 分子
    const denominator = node[`${currentTime}_denominator`] ?? 0; // 分母
    const weight = node?.isDept ? 'bold' : 'initial';
    const data = isNumber(result) && result ? result.toFixed(2) : 0;
    if (isNumber(result)) {
      if (showSplit)
        return `<span>
                <label style="font-weight: ${weight}">${data}</label>
                <label style="color: gray"> (${numerator},${denominator})</label>
            </span>`;
      return `<span style="font-weight: ${weight}">${data}</span>`;
    }
    return `<span style="font-weight: ${weight};color: ${
      node?.isDept ? 'initial' : 'silver'
    }"> 0</span>`;
  };

  // column
  const renderColumn = (type: IStaticBy, showSplit = false) => {
    const component: (ColDef | ColGroupDef)[] = new Array();
    const typeMap = {
      year: getYearsTime,
      quarter: getFourQuarterTime,
      month: getTwelveMonthTime,
    };
    const ranges = typeMap[type]?.();
    const weekRanges = getWeeksRange(8);
    const data = type == 'week' ? weekRanges?.reverse() : ranges;
    for (let index = 0; index < data?.length; index += 1) {
      if (type == 'week') {
        const startTime = data[index].from;
        const weekName = getMonthWeek(startTime);
        component.push({
          headerName: weekName,
          field: startTime?.toString(),
          cellRenderer: (p) => cellRenderer(p, showSplit),
          minWidth: 100,
        });
      } else
        component.push(
          Object.assign(
            {
              cellRenderer: (p: any) => cellRenderer(p, showSplit),
              headerName: data[index].title,
              field: data[index].start?.toString(),
            },
            type == 'month' ? { minWidth: 110 } : {},
          ),
        );
    }
    setColumns(component);
  };
  return { handleStaticBy, columns, rowData };
};
