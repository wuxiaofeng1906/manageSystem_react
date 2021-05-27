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
  numberRenderToCurrentStage,
  numberRenderToZentaoSeverity,
  numberRenderToZentaoStatus,
  linkToZentaoPage
} from '@/publicMethods/cellRenderer';

import {getHeight} from '@/publicMethods/pageSet';


// 定义列名
const colums = () => {
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
      headerName: '当前阶段',
      field: 'stage',
      cellRenderer: numberRenderToCurrentStage,
    },
    {
      headerName: '对应测试',
      field: 'tester',
    },
    {
      headerName: '禅道类型',
      field: 'category',

    },
    {
      headerName: '禅道编号',
      field: 'ztNo',
      cellRenderer: linkToZentaoPage,
    },
    {
      headerName: '标题内容',
      field: 'title',
    },
    {
      headerName: '严重程度',
      field: 'severity',
      cellRenderer: numberRenderToZentaoSeverity,
    },
    {
      headerName: '优先级',
      field: 'priority',
    },
    {
      headerName: '所属模块',
      field: 'moduleName',
    },
    {
      headerName: '禅道状态',
      field: 'ztStatus',
      cellRenderer: numberRenderToZentaoStatus,
    },
    {
      headerName: '相关需求数',
      field: 'relatedStories',
    },
    {
      headerName: '相关任务数',
      field: 'relatedTasks',
    },
    {
      headerName: '指派给',
      field: 'assignedTo',
    },
    {
      headerName: '由谁解决',
      field: 'resolvedBy',
    },
    {
      headerName: '由谁关闭',
      field: 'closedBy',
    },
    {
      headerName: '激活时长',
      field: 'activeDuration',
    },
    {
      headerName: '解决时长',
      field: 'solveDuration',
    },
    {
      headerName: '回验时长',
      field: 'verifyDuration',
    },
    {
      headerName: '关闭时长',
      field: 'closedDuration',
    }
  );

  return component;
};

const addNewAttributes = (source: any) => {
  debugger;
  const result = [];

  const {data} = source[0];
  if (data !== null) {
    for (let index = 0; index < data.length; index += 1) {
      const details = data[index];
      details["category"] = "bug";
      result.push(details);
    }
  }

  return result;
};

// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, params: any) => {
  debugger;
  const {data} = await client.query(`
      {
       dashSingleItem(project:${params.prjId},kindName:"${params.kind}",itemName:"${params.itemName}") {
        name
        data{
           id
          stage
          tester
          ztNo
          title
          severity
          priority
          moduleName
          ztStatus
          relatedStories
          relatedTasks
          relatedBugs
          assignedTo
          resolvedBy
          closedBy
          activeDuration
          solveDuration
          verifyDuration
          closedDuration
        }
      }
      }
  `);

  return addNewAttributes(data?.dashSingleItem);
};


// 组件初始化
const BugDetails: React.FC<any> = () => {
  /* 获取网页的项目id */
  const projectInfo = {
    prjId: "",
    prjNames: "",
    prjKind: "bug",
    itemName: ""
  };

  const location = history.location.query;
  if (location !== undefined && location.projectid !== null) {
    projectInfo.prjId = location.projectid.toString();
    projectInfo.prjNames = location.project === null ? '' : location.project.toString();
    projectInfo.itemName = location.item === null ? '' : location.item.toString();
  }

  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() => queryDevelopViews(gqlClient, projectInfo));

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
      breadcrumbName: 'sprint 工作台',
    }, {
      path: '',
      breadcrumbName: '内容详情',
    }];

  return (
    <div style={{marginTop: "-20px"}}>

      <PageHeader
        ghost={false}
        title={projectInfo.prjNames}
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
          }}
          autoGroupColumnDef={{
            minWidth: 100,
          }}
          onGridReady={onGridReady}
        />

      </div>

    </div>
  );
};

export default BugDetails;
