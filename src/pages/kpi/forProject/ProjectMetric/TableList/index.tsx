/*
 * @Description: 数据列表
 * @Author: jieTan
 * @Date: 2021-11-22 10:55:42
 * @LastEditTime: 2021-12-21 09:04:57
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

/*  */
export default () => {
  /*  */
  const { gqlData, dynamicCols } = useModel('projectMetric');

  /*  */
  return (
    <div style={{ height: 'calc(100% - 210px)' }}>
      <div style={{ height: '100%' }} className="ag-theme-alpine">
        <div style={{ width: '100%', height: '100%' }}>
          <AgGridReact
            rowHeight={40}
            // domLayout="autoHeight"
            modules={[SetFilterModule as any]}
            frameworkComponents={{
              linkTo: LinkToCloumn,
              projStatus: ProjStatusColumn,
              duration: DurationColumn,
              numToFixed: NumberToFixedColumn,
            }}
            defaultColDef={{ resizable: true }}
            columnDefs={[TableMajorGroup, ...dynamicCols]}
            rowData={gqlData}
          />
        </div>
      </div>
    </div>
  );
};
