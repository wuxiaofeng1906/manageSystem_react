/*
 * @Description: 数据列表
 * @Author: jieTan
 * @Date: 2021-11-22 10:55:42
 * @LastEditTime: 2021-12-20 06:36:44
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
import KpiCheckBox from './KpiCheckBox';
import NumberToFixedColumn from './renders/NumberToFixedColumn';
import DurationColumn from './renders/DurationColumn';

/*  */
export default () => {
  /*  */
  const { gqlData, dynamicCols } = useModel('projectMetric');

  /*  */
  return (
    <>
      <KpiCheckBox />
      <div className="ag-theme-material" style={{ height: 800 }}>
        <AgGridReact
          modules={[SetFilterModule as any]}
          frameworkComponents={{
            linkTo: LinkToCloumn,
            projStatus: ProjStatusColumn,
            duration:DurationColumn,
            numToFixed: NumberToFixedColumn,
          }}
          defaultColDef={{ resizable: true }}
          columnDefs={[TableMajorGroup, ...dynamicCols]}
          rowData={gqlData}
        />
      </div>
    </>
  );
};
