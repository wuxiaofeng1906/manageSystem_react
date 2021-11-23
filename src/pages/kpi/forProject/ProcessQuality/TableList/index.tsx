/*
 * @Description: 数据列表
 * @Author: jieTan
 * @Date: 2021-11-22 10:55:42
 * @LastEditTime: 2021-11-23 14:30:40
 * @LastEditors: jieTan
 * @LastModify:
 */

import { useGqlClient } from '@/hooks';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { useRequest } from 'ahooks';
import { GQL_PARAMS, queryGQL } from '../../gql.query';
//
import './index.css';
import mygql from './mygql';



export default () => {
  /*  */
  const numberWidth = 48;
  const ratioWidth = 64;
  // 
  // const [rowData, setRowData] = useState([]);
  // 

  const gqlClient = useGqlClient();
  const params: GQL_PARAMS = { func: "projectKpi", params: { start: "2021-11-20", projIds: [445, 674, 675, 676] } }

  const { data, loading } = useRequest(async () => await queryGQL(gqlClient, mygql, params))

  console.log(loading);


  /*  */

  /*  */
  return (
    <div className="ag-theme-material" style={{ height: 200 }}>
      <AgGridReact rowData={data}>
        <AgGridColumn headerName="序号" field="order" />
        <AgGridColumn headerName="项目名称" field="stage" />
        <AgGridColumn headerName="所属部门" field="tester" />
        <AgGridColumn headerName="代码量" field="codes" />
        <AgGridColumn headerName="Bug数" field="bugNumber" />
        <AgGridColumn headerName="千行Bug率" field="thouslineRatio" />
        <AgGridColumn headerName="单元覆盖率" field="unitCover" />
        <AgGridColumn headerName="ReOpen率" field="reopenRatio" />
        <AgGridColumn headerName="解决时长" field="bugResolveDura" />
        <AgGridColumn headerName="有效Bug率" field="effectiveBugRatio" />
        <AgGridColumn headerName="回归时长" field="bugFlybackDura" />
        <AgGridColumn headerName="用例数" field="caseNumber" />
        <AgGridColumn headerName="自动化测试覆盖率" field="autoCoverRatio" />
      </AgGridReact>
    </div>
  );
};
