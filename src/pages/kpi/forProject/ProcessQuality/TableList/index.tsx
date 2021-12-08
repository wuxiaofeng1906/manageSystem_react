/*
 * @Description: 数据列表
 * @Author: jieTan
 * @Date: 2021-11-22 10:55:42
 * @LastEditTime: 2021-12-03 12:44:49
 * @LastEditors: jieTan
 * @LastModify:
 */

import './index.css';
import { AgGridReact } from 'ag-grid-react';
import BugReOpenColumn from './renders/BugReOpenColumn';
import BugFlybackDuraColumn from './renders/BugFlybackDuraColumn';
import { useModel } from 'umi';
import { mockData } from './mock';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { TableMajorCols, ProcessQualityCols } from './definitions/columns';
import LinkToCloumn from './renders/LinkToCloumn';



/*  */
export default () => {
  /*  */
  const { gqlData, setGqlData, setGridApi } = useModel('processQuality');

  const onGridReady = async (params: any) => {
    setGridApi(params.api);
    //
    setGqlData(mockData as never[]);
  };

  /*  */
  return (
    <div className="ag-theme-material" style={{ height: 960 }}>
      <AgGridReact
        modules={[SetFilterModule]}
        frameworkComponents={{
          linkTo: LinkToCloumn,
          reopenRatio: BugReOpenColumn,
          bugFlybackDura: BugFlybackDuraColumn,
        }}
        columnDefs={[TableMajorCols, ProcessQualityCols]}
        rowData={gqlData}
        onGridReady={onGridReady}
      />
    </div>
  );
};
