/*
 * @Description: 数据列表
 * @Author: jieTan
 * @Date: 2021-11-22 10:55:42
 * @LastEditTime: 2021-12-13 10:10:02
 * @LastEditors: jieTan
 * @LastModify:
 */

import './index.css';
import { AgGridReact } from 'ag-grid-react';
import { useModel } from 'umi';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { TableMajorCols } from './definitions/columns';
import LinkToCloumn from './renders/LinkToCloumn';
import ProjStatusColumn from './renders/ProjStatusColumn';
import BugReOpenColumn from './renders/BugReOpenColumn';
import BugFlybackDuraColumn from './renders/BugFlybackDuraColumn';
import KpiCheckBox from './KpiCheckBox';
import NumberToFixedColumn from './renders/NumberToFixedColumn';

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
            reopenRatio: BugReOpenColumn,
            bugFlybackDura: BugFlybackDuraColumn,
            projStatus: ProjStatusColumn,
            numToFixed: NumberToFixedColumn,
          }}
          columnDefs={[...TableMajorCols, ...dynamicCols]}
          rowData={gqlData}
        />
      </div>
    </>
  );
};
