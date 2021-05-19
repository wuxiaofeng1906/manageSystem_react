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
      headerName: '相关task数',
      field: 'relatedTasks',
    },
    {
      headerName: '相关bug数',
      field: 'relatedBugs',
    },
    {
      headerName: '指派给',
      field: 'assignedTo',
    },
    {
      headerName: '由谁完成',
      field: 'finishedBy',
    },
    {
      headerName: '由谁关闭',
      field: 'closedBy',
    },
    {
      headerName: '计划提测时间',
      field: 'expectTest',
    }
  );

  return component;
};


const addNewAttributes = (source: any) => {
  const result = [];
  console.log("原始数据");
  const {data} = source[0];
  for (let index = 0; index < data.length; index += 1) {
    const details = data[index];
    details["category"] = "需求";
    result.push(details);
  }
  return result;
};

// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, params: any) => {
  const {data} = await client.query(`
      {
       dashSingleItem(project:${params.prjId},kindName:${params.kind}",itemName:${params.item}") {
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
          relatedTasks
          relatedBugs
          assignedTo
          finishedBy
          closedBy
          expectTest
        }
      }
      }
  `);

  return addNewAttributes(data?.dashSingleItem);
};


// 组件初始化
const StoryDetails: React.FC<any> = () => {
  /* 获取网页的项目id */
  const projectInfo = {
    prjId: "",
    prjNames: "",
    prjKind: "story",
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

export default StoryDetails;
