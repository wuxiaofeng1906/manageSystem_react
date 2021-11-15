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
  numberRenderToZentaoSeverity,
  numberRenderToZentaoStatus,
  TimestampRender
} from '@/publicMethods/cellRenderer';

import {getHeight} from '@/publicMethods/pageSet';

// 定义列名
const colums = (title: string) => {
  const component = new Array();
  component.push(
    {
      headerName: '序号',
      maxWidth: 80,
      filter: false,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '禅道编号',
      field: 'ztNo',
      maxWidth: 110,
      cellRenderer: (params: any) => {
        return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://zentao.77hub.com/zentao/bug-view-${params.value}.html'>${params.value}</a>`;
      },
    },
    {
      headerName: '标题内容',
      field: 'title',
      width: 250,
    },
    {
      headerName: '严重程度',
      field: 'severity',
      cellRenderer: numberRenderToZentaoSeverity,
      maxWidth: 110,
    },
    {
      headerName: '优先级',
      field: 'pri',
      maxWidth: 100,
    },
    {
      headerName: '禅道状态',
      field: 'status',
      cellRenderer: numberRenderToZentaoStatus,
      maxWidth: 110,
    },
    {
      headerName: '指派给',
      field: 'assignedTo',
      maxWidth: 110,
    }
  );

  if (title === "Bug响应时长" || title === "请求平均等待时长") {
    component.push({
      headerName: "响应时长",
      field: 'duration',
      maxWidth: 120,
      cellRenderer: (params: any) => {
        const duration = (Number(params.value) / 3600).toFixed(2);
        return duration;

      }
    });
  }

  component.push({
    headerName: "创建时间",
    field: 'openedAt',
    cellRenderer: TimestampRender,
    maxWidth: 200,
  })

  return component;
};


const queryDevelopViews = async (client: GqlClient<object>, params: any) => {

  const flag = {
    "Bug响应时长": 1,
    "Bug响应数": 2,
    "对外请求未响应数": 7,
    "修复Bug数": 10,
    "请求平均等待时长": "12"
  }

  // let type = 0;
  // if (params.title === "Bug响应时长") {
  //   type = 1;
  // } else if (params.title === "Bug响应数") {
  //   type = 2;
  // } else if (params.title === "对外请求未响应数") {
  //   type = 7;
  // } else if (params.title === "修复Bug数") {
  //   type = 10;
  // } else if (params.title === "请求平均等待时长") {
  //   type = 12;
  // }

  const {data} = await client.query(`
      {
        dashFrontLinkTo(kind:${flag[params.title]},userId:"${params.userId}",start:"${params.start}",end:"${params.end}"){
          ztNo
          title
          severity
          pri
          status
          openedAt
          assignedTo
          duration
        }
      }
  `);

  return data?.dashFrontLinkTo;
};


// 组件初始化
const BugDetails: React.FC<any> = () => {
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
          columnDefs={colums(userData.title)} // 定义列
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

export default BugDetails;
