/*
 * @Description: 数据列表
 * @Author: jieTan
 * @Date: 2021-11-22 10:55:42
 * @LastEditTime: 2021-12-09 11:44:01
 * @LastEditors: jieTan
 * @LastModify:
 */

import './index.css';
import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useGqlClient } from '@/hooks';
import { useModel } from 'umi';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { TableMajorCols, ProcessQualityCols } from './definitions/columns';
import LinkToCloumn from './renders/LinkToCloumn';
import ProjStatusColumn from './renders/ProjStatusColumn';
import BugReOpenColumn from './renders/BugReOpenColumn';
import BugFlybackDuraColumn from './renders/BugFlybackDuraColumn';
import { GQL_PARAMS } from '@/namespaces';
import { projectKpiGql, queryGQL } from '@/pages/gqls';

/*  */
export default () => {
  /*  */
  const gqlClient = useGqlClient();
  const { gqlData, setGqlData, setGridApi } = useModel('processQuality');
  const [pqCols, setPqCols] = useState([]);

  const onGridReady = async (ag: any) => {
    setGridApi(ag.api);
    //
    const _params: GQL_PARAMS = { func: 'projectKpi' };
    const ret = await queryGQL(gqlClient, projectKpiGql, _params);
    setGqlData(ret);
  };
  /*  */
  const pqOnClock = async () => {
    //
    if (pqCols.length === 0) {
      const _params: GQL_PARAMS = { func: 'projectKpi', params: { kpis: ['processQuality'] } };
      const ret = await queryGQL(gqlClient, projectKpiGql, _params);
      setGqlData(ret);
      setPqCols(ProcessQualityCols as never[]);
    } else setPqCols([]);
  };

  /*  */
  return (
    <>
      <button onClick={pqOnClock}>xxx指标</button>
      <div className="ag-theme-material" style={{ height: 800 }}>
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
