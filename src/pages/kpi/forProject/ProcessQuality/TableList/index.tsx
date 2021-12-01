/*
 * @Description: 数据列表
 * @Author: jieTan
 * @Date: 2021-11-22 10:55:42
 * @LastEditTime: 2021-12-01 17:27:57
 * @LastEditors: jieTan
 * @LastModify:
 */

import './index.css';
import { AgGridReact } from 'ag-grid-react';
import { useGqlClient } from '@/hooks';
import { useRequest } from 'ahooks';
import { ProcessQualityCols, TableMajorCols } from './definitions/columns';
import IdWithNameColumn from './renders/IdWithNameColumn';
import BugReOpenColumn from './renders/BugReOpenColumn';
import BugFlybackDuraColumn from './renders/BugFlybackDuraColumn';
import { GQL_PARAMS, queryGQL } from '../../gql.query';
import mygql from './mygql';
import { GRAPHQL_QUERY } from '@/namespaces';
import { useModel } from 'umi';
import { mockData } from './mock';
import { useState } from 'react';
import { Button } from 'antd';

// /*  */
// const queryGQL = async (client: GqlClient<object>, params: any) => {
// const { data } = await client.query(`
//     {
//       projectKpi{
//         project{
//           id
//           name
//           start
//           end
//         }
//         user{
//           id
//           name
//         }
//         dept{
//           id
//           name
//         }
//         projectQuality{
//           reopenRatio
//           bugFlybackDura
//         }
//       }
//     }
// `);

//   return data?.projectKpi;
// };

/*  */
export default () => {
  /*  */
  const { gqlData, setGqlData } = useModel('processQuality');

  // /*  */
  // const gqlClient = useGqlClient(); // 必须提前初始化该对象
  // const params: GQL_PARAMS = { func: GRAPHQL_QUERY['PROJECT_KPI'] };
  // const { data } = useRequest(async () => {
  //   const rets = await queryGQL(gqlClient, mygql, params);
  //   setGqlData(rets);
  //   return rets;
  // });

  //
  const [gridApi, setGridApi] = useState(null);

  const onGridReady = async (params: any) => {
    setGridApi(params.api);
    //
    setGqlData(mockData);
  };

  const theClick = () => {
    (gridApi as any).setQuickFilter('4');
    console.log(1);
  };

  /*  */
  return (
    <div className="ag-theme-material" style={{ height: 960 }}>
      <Button onClick={theClick}>demo</Button>
      <AgGridReact
        frameworkComponents={{
          idWithName: IdWithNameColumn,
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
