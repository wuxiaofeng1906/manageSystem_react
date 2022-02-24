/*
 * @Description: 数据列表
 * @Author: jieTan
 * @Date: 2021-11-22 10:55:42
 * @LastEditTime: 2022-02-24 03:16:29
 * @LastEditors: jieTan
 * @LastModify:
 */

import './index.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import { useModel } from 'umi';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { TableMajorGroup } from './definitions/columns';
import LinkToCloumn from './renders/LinkToCloumn';
import ProjStatusColumn from './renders/ProjStatusColumn';
import NumberToFixedColumn from './renders/NumberToFixedColumn';
import DurationColumn from './renders/DurationColumn';
import { Spin } from 'antd';
import { useEffect, useRef } from 'react';
import ManualEntryColumn from './renders/ManualEntryColumn';
import ProjLinkZtCloumn from './renders/special/ProjLinkZtCloumn';
import { useMount } from 'ahooks';

/*  */
export default () => {
  /*  */
  const { gqlData, dynamicCols, loading, setLoading, gridHeight, setGridApi, setGridRef } =
    useModel('projectMetric');
  const innerHeight = window.innerHeight - 248; // grid的固定高度

  const _gridRef: any = useRef();

  useEffect(() => {
    setLoading(false);
  }, [gqlData]);

  useMount(() => {
    setGridRef(_gridRef);
  });

  /*  */
  return (
    <Spin tip="数据加载中..." spinning={loading} style={{ height: innerHeight }}>
      <div style={{ height: innerHeight }} className="ag-theme-alpine">
        <div style={{ width: '100%', height: '100%' }}>
          <AgGridReact
            ref={_gridRef}
            className="myGrid"
            headerHeight={gridHeight.row + 2}
            modules={[SetFilterModule as any]}
            frameworkComponents={{
              linkTo: LinkToCloumn,
              projLinkZt: ProjLinkZtCloumn,
              projStatus: ProjStatusColumn,
              duration: DurationColumn,
              numToFixed: NumberToFixedColumn,
              manualEntry: ManualEntryColumn,
            }}
            defaultColDef={{ resizable: true }}
            stopEditingWhenCellsLoseFocus={true}
            columnDefs={[TableMajorGroup, ...dynamicCols]}
            rowData={gqlData}
            onGridReady={(params: any) => setGridApi(params.api)}
            getRowHeight={() => gridHeight.row}
            animateRows={true}
          />
        </div>
      </div>
    </Spin>
  );
};
