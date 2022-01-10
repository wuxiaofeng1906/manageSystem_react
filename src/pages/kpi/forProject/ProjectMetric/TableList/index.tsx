/*
 * @Description: 数据列表
 * @Author: jieTan
 * @Date: 2021-11-22 10:55:42
 * @LastEditTime: 2022-01-10 02:15:14
 * @LastEditors: jieTan
 * @LastModify:
 */

import './index.css';
import { AgGridReact } from 'ag-grid-react';
import { useModel } from 'umi';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { TableMajorGroup } from './definitions/columns';
import LinkToCloumn from './renders/LinkToCloumn';
import ProjStatusColumn from './renders/ProjStatusColumn';
import NumberToFixedColumn from './renders/NumberToFixedColumn';
import DurationColumn from './renders/DurationColumn';
import { Spin } from 'antd';
import { useEffect } from 'react';

/*  */
export default () => {
  /*  */
  const { gqlData, dynamicCols, loading, setLoading } = useModel('projectMetric');
  const tableRowHeight = 32; // grid的行高
  const innerHeight = window.innerHeight - 248; // grid的固定高度

  useEffect(() => {
    setLoading(false);
  }, [gqlData]);

  /*  */
  return (
    <Spin tip="数据加载中..." spinning={loading} style={{ height: innerHeight }}>
      <div style={{ height: innerHeight }} className="ag-theme-alpine">
        <div style={{ width: '100%', height: '100%' }}>
          <AgGridReact
            className="myGrid"
            rowHeight={tableRowHeight}
            headerHeight={tableRowHeight + 2}
            modules={[SetFilterModule as any]}
            frameworkComponents={{
              linkTo: LinkToCloumn,
              projStatus: ProjStatusColumn,
              duration: DurationColumn,
              numToFixed: NumberToFixedColumn,
            }}
            defaultColDef={{ resizable: true }}
            // stopEditingWhenCellsLoseFocus={true}
            columnDefs={[TableMajorGroup, ...dynamicCols]}
            rowData={gqlData}
          />
        </div>
      </div>
    </Spin>
    // {/* <Button onClick={() => setLoading((prev: boolean) => !prev)}>123</Button> */}
  );
};
