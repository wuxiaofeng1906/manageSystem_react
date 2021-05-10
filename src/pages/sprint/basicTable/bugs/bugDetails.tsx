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
  numberRenderToZentaoType,
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
      cellRenderer: numberRenderToZentaoType,
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
      field: 'finishedBy',
    },
    {
      headerName: '由谁关闭',
      field: 'closedBy',
    },
    {
      headerName: '激活时长',
      field: 'activeTime',
    },
    {
      headerName: '解决时长',
      field: 'resolveTime',
    },
    {
      headerName: '回验时长',
      field: 'vertifyTime',
    },
    {
      headerName: '关闭时长',
      field: 'closeTime',
    }
  );

  return component;
};

// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, params: any) => {
  const {data} = await client.query(`
      {
         proDetail(project:${params}){
            id
            stage
            tester
            category
            ztNo
            title
            severity
            priority
            moduleName
            ztStatus
            assignedTo
            finishedBy
            closedBy
            hotUpdate
            dataUpdate
            interUpdate
            presetData
            testCheck
            scopeLimit
            publishEnv
            uedName
            uedEnvCheck
            uedOnlineCheck
            memo
            source
            feedback
            expectTest
            submitTest
            activeDuration
            solveDuration
            verifyDuration
            closedDuration
            relatedBugs
            relatedTasks
            relatedStories
          }
      }
  `);
  return data?.proDetail;
};


// 组件初始化
const BugDetails: React.FC<any> = () => {
  /* 获取网页的项目id */
  const projectInfo = {
    prjId: "",
    prjNames: "",
    prjKind: ""
  };

  const location = history.location.query;
  if (location !== undefined && location.projectid !== null) {
    projectInfo.prjId = location.projectid.toString();
    projectInfo.prjNames = location.project === null ? '' : location.project.toString();
    projectInfo.prjKind = location.kind === null ? '' : location.kind.toString();

  }

  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() => queryDevelopViews(gqlClient, projectInfo.prjId));
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
