/*
 * @Description: 数据列表
 * @Author: jieTan
 * @Date: 2021-11-22 10:55:42
 * @LastEditTime: 2021-11-29 17:40:14
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

  /*  */
  const gqlClient = useGqlClient(); // 必须提前初始化该对象
  const params: GQL_PARAMS = { func: GRAPHQL_QUERY['PROJECT_KPI'] };
  const { data } = { data: [] }; //useRequest(() => queryGQL(gqlClient, mygql, params));

  /*  */
  return (
    <div className="ag-theme-material" style={{ height: 960 }}>
      <AgGridReact
        frameworkComponents={{
          idWithName: IdWithNameColumn,
          reopenRatio: BugReOpenColumn,
          bugFlybackDura: BugFlybackDuraColumn,
        }}
        columnDefs={[TableMajorCols, ProcessQualityCols]}
        rowData={data}
      />
    </div>
  );
};
