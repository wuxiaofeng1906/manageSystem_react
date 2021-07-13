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
  linkToZentaoPage,
  numberRenderToZentaoStatusForRed,
  stageForLineThrough,
  numRenderForSevAndpriForLine,
  numberRenderToZentaoType,
  numberRenderToCurrentStage, timestampChanges

} from '@/publicMethods/cellRenderer';

import {getHeight} from '@/publicMethods/pageSet';

const getColums = () => {

  const component: any = [
    {
      headerName: '序号',
      maxWidth: 80,
      filter: false,
      pinned: 'left',
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '禅道类型',
      field: 'category',
      cellRenderer: numberRenderToZentaoType,
      minWidth: 70,
    },
    {
      headerName: '编号',
      field: 'ztNo',
      cellRenderer: linkToZentaoPage,
      minWidth: 90,
    },
    {
      headerName: '所属项目',
      field: 'project',
    },
    {
      headerName: '当前阶段',
      field: 'stage',
      cellRenderer: numberRenderToCurrentStage
    },
    {
      headerName: '相关测试',
      field: 'tester',
      minWidth: 80,
      tooltipField: "tester",
      suppressMenu: false
    },

    {
      headerName: '标题内容',
      field: 'title',
      minWidth: 350,
      cellRenderer: stageForLineThrough,
      tooltipField: "title"
    },
    {
      headerName: '严重等级',
      field: 'severity',
      cellRenderer: numRenderForSevAndpriForLine,
      minWidth: 90,
    },

    {
      headerName: '所属模块',
      field: 'moduleName',
      minWidth: 100,
      cellRenderer: stageForLineThrough,
      tooltipField: "moduleName"
    },
    {
      headerName: '当前状态',
      field: 'ztStatus',
      cellRenderer: numberRenderToZentaoStatusForRed,
      minWidth: 80,
    },

    {
      headerName: '指派给',
      field: 'assignedTo',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
      tooltipField: "assignedTo",
      suppressMenu: false,

    },
    {
      headerName: '解决/完成人',
      field: 'finishedBy',
      minWidth: 80,
      cellRenderer: stageForLineThrough,
      tooltipField: "finishedBy",
      suppressMenu: false,

    },
    {
      headerName: '反馈人',
      field: 'feedback',
      cellRenderer: stageForLineThrough,
      suppressMenu: false,
    },
    {
      headerName: '截止日期',
      field: 'deadline',
      cellRenderer: timestampChanges,
    },
  ];

  return component;
};

const addNewAttributes = (source: any, category: string) => {

  const result = [];

  if (source !== null) {
    for (let index = 0; index < source.length; index += 1) {
      const details = source[index];
      details["category"] = category;
      result.push(details);
    }
  }

  return result;
};
// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, params: any) => {
  const {data} = await client.query(`
      {
          relatedNums(category:"${params.category}",ztNo:${params.ztNo},relatedType:"${params.relatedType}",needQuery:${params.needQuery}){
          id
          project
          stage
          tester
          ztNo
          title
          severity
          priority
          moduleName
          ztStatus
          assignedTo
          finishedBy
          feedback
          deadline
        }
      }
  `);

  return addNewAttributes(data?.relatedNums, params.relatedType);
};

// 组件初始化
const DtDetailsList: React.FC<any> = () => {

    /* 获取网页的项目id */
    const paramsInfo: any = {
      category: "",
      ztNo: 0,
      relatedType: "",
      needQuery: false,
    };

    debugger;
    const location = history.location.query;
    if (location) {
      paramsInfo.category = location.kind;
      paramsInfo.ztNo = location.ztNo;
      paramsInfo.relatedType = location.relatedType;
      if (Number(location.count) > 0) {
        paramsInfo.needQuery = true;
      }
    }

    const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
    const gqlClient = useGqlClient();
    const {data, loading} = useRequest(() => queryDevelopViews(gqlClient, paramsInfo));

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
        breadcrumbName: '详情信息',
      }];

    return (
      <div style={{marginTop: "-20px"}}>

        <PageHeader
          ghost={false}
          title={`${numberRenderToZentaoType({value: paramsInfo.category})} ${paramsInfo.ztNo}`}
          style={{height: "100px"}}
          breadcrumb={{routes}}
        />


        {/* ag-grid 表格定义 */}
        <div className="ag-theme-alpine" style={{height: getHeight(), width: '100%', marginTop: "9px"}}>
          <AgGridReact
            columnDefs={getColums()} // 定义列
            rowData={data} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              flex: 1,
              minWidth: 100,
              suppressMenu: true,
              cellStyle: {"line-height": "30px"},
            }}

            autoGroupColumnDef={{
              minWidth: 100,
            }}
            rowHeight={32}
            headerHeight={35}
            groupDefaultExpanded={9} // 展开分组
            onGridReady={onGridReady}

          />

        </div>
      </div>
    );
  }
;
export default DtDetailsList;
