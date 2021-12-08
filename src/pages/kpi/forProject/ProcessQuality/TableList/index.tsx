/*
 * @Description: 数据列表
 * @Author: jieTan
 * @Date: 2021-11-22 10:55:42
 * @LastEditTime: 2021-12-08 17:36:44
 * @LastEditors: jieTan
 * @LastModify:
 */

import './index.css';
import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import BugReOpenColumn from './renders/BugReOpenColumn';
import BugFlybackDuraColumn from './renders/BugFlybackDuraColumn';
import { useModel } from 'umi';
import { mockData } from './mock';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { TableMajorCols, ProcessQualityCols } from './definitions/columns';
import LinkToCloumn from './renders/LinkToCloumn';
import ProjStatusColumn from './renders/ProjStatusColumn';

/*  */
export default () => {
  /*  */
  const { gqlData, setGqlData, setGridApi } = useModel('processQuality');
  const [pqCols, setPqCols] = useState([]);

  const onGridReady = async (params: any) => {
    setGridApi(params.api);
    //
    setGqlData(mockData as never[]);
  };

  /*  */
  return (
    <>
      <button onClick={() => setPqCols(pqCols.length === 0 ? (ProcessQualityCols as never[]) : [])}>
        xxx指标
      </button>
      <div className="ag-theme-material" style={{ height: 960 }}>
        <AgGridReact
          modules={[SetFilterModule]}
          frameworkComponents={{
            linkTo: LinkToCloumn,
            reopenRatio: BugReOpenColumn,
            bugFlybackDura: BugFlybackDuraColumn,
            projStatus: ProjStatusColumn,
          }}
          columnDefs={[...TableMajorCols, ...pqCols]}
          rowData={gqlData}
          onGridReady={onGridReady}
        />
      </div>
    </>
  );
};
