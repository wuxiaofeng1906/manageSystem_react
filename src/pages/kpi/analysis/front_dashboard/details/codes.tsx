import React, {useRef} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import {PageHeader} from 'antd';
import {history} from 'umi';
import {
  TimestampRender
} from '@/publicMethods/cellRenderer';

import {getHeight} from '@/publicMethods/pageSet';

// 定义列名
const colums = () => {
  const component = new Array();
  component.push(
    {
      headerName: '序号',
      maxWidth: 90,
      filter: false,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '提交ID',
      field: 'commit',
      minWidth: 300,
      cellRenderer: (params: any) => {
        return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://gitlab.q7link.com/front/front-theory/commit/${params.value}.html'>${params.value}</a>`;
      },
    },
    {
      headerName: '提交人',
      field: 'author',
      minWidth: 90,
    },
    {
      headerName: '描述',
      field: 'desc',
      minWidth: 300,
    },
    {
      headerName: '新增行',
      field: 'newlines',
      minWidth: 90,
    }, {
      headerName: "项目名",
      field: 'project',
      minWidth: 150,
    }, {
      headerName: "提交时间",
      field: 'authorAt',
      cellRenderer: TimestampRender,
      minWidth: 200,
    }
  );


  return component;
};


const queryDevelopViews = async (client: GqlClient<object>, params: any) => {

  const {data} = await client.query(`
      {
        dashFrontCodeLinkTo(kind:13,userId:"${params.userId}",start:"${params.start}",end:"${params.end}"){
         commit
        author
        authorAt
        project
        newlines
        desc
        }
      }
  `);

  return data?.dashFrontCodeLinkTo;
};


// 组件初始化
const CodeDetails: React.FC<any> = () => {

  /* 获取网页的项目id */
  const userData = {
    title: "",
    userName: "",
    userId: "",
    start: "",
    end: ""
  };

  const location = history.location.query;
  if (location !== undefined) {

    userData.title = location?.title === null ? "" : location?.title.toString();
    const nameArray = location.users === null ? ["", ""] : (location.users).toString().split(',');
    userData.userId = nameArray[0].toString().replace("[", "").trim();
    userData.userName = nameArray[1].toString().replace("]", "").trim();

    const timeArray = location.time === null ? ["", ""] : (location.time).toString().split(',');
    userData.start = timeArray[0].toString().replace("[", "").trim();
    userData.end = timeArray[1].toString().replace("]", "").trim();
  }

  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const gqlClient = useGqlClient();

  const {data, loading} = useRequest(() => queryDevelopViews(gqlClient, userData));

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  const routes = [
    {
      path: '',
      breadcrumbName: '前端dashboard',
    }, {
      path: '',
      breadcrumbName: '内容详情',
    }];

  return (
    <div style={{marginTop: "-20px"}}>

      <PageHeader
        ghost={false}
        title={`${userData.userName}-${userData.title}`}
        style={{height: "100px"}}
        breadcrumb={{routes}}
      />

      {/* ag-grid 表格定义 */}
      <div className="ag-theme-alpine" style={{height: getHeight(), width: '100%'}}>
        <AgGridReact
          columnDefs={colums()} // 定义列
          rowData={data} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            flex: 1,
            minWidth: 100,
            suppressMenu: true,
            cellStyle: {"line-height": "28px"},
          }}
          rowHeight={28}
          headerHeight={30}
          onGridReady={onGridReady}
        />

      </div>

    </div>
  );
};

export default CodeDetails;
