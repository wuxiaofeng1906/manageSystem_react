import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import {getHeight} from '@/publicMethods/pageSet';
import {history} from 'umi';


// 定义列名
const colums = () => {
  const component = new Array();
  component.push(
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 50,
      pinned: 'left',
    },
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
      field: 'stage',
    },
    {
      headerName: '标题内容',
      field: 'stage',
    }, {
      headerName: '严重程度',
      field: 'stage',
    }, {
      headerName: '优先级',
      field: 'stage',
    }, {
      headerName: '所属模块',
      field: 'stage',
    }, {
      headerName: '禅道状态',
      field: 'stage',
    }, {
      headerName: '激活时长',
      field: 'stage',
    },
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

          }
      }
  `);
  return data?.proDetail;
};


// 组件初始化
const BugNoAssignList: React.FC<any> = () => {
  /* 获取bug id */
  let prjId: string = '';
  let prjNames: string = '';
  const location = history.location.query;
  if (location !== undefined && location.projectid !== null) {
    prjId = location.projectid.toString();
    prjNames = location.project === null ? '' : location.project.toString();
  }

  console.log(prjNames);


  /* region  表格相关事件 */
  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() => queryDevelopViews(gqlClient, prjId));
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  /* endregion */


  return (
    <PageContainer>

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
          rowSelection={'multiple'} // 设置多行选中
          groupDefaultExpanded={9} // 展开分组
          onGridReady={onGridReady}
        >

        </AgGridReact>
      </div>

    </PageContainer>
  );
};
export default BugNoAssignList;
