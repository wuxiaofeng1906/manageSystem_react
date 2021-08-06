import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useRequest } from 'ahooks';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { GqlClient, useGqlClient } from '@/hooks';
import { getParamsByType } from '@/publicMethods/timeMethods';
import { getHeight } from '@/publicMethods/pageSet';

/* region 动态定义列 */
const compColums = [
  {
    headerName: '研发中心',
    field: 'devCenter',
    rowGroup: true,
    hide: true,
  },
  {
    headerName: '所属部门',
    field: 'dept',
    rowGroup: true,
    hide: true,
  },
  {
    headerName: '组名',
    field: 'group',
    rowGroup: true,
    hide: true,
  },
  {
    headerName: '所属端',
    field: 'module',
    rowGroup: true,
    hide: true,
  },
  {
    headerName: '姓名',
    field: 'username',
  },
];

/* endregion */

/* region 数据处理 */

const queryBugResolutionCount = async (client: GqlClient<object>, params: string) => {
  const condition = getParamsByType(params);
  if (condition.typeFlag === 0) {
    return [];
  }
  const { data } = await client.query(`
      {

        avgCodeDept(kind:"${condition.typeFlag}",ends:${condition.ends}) {
          total {
            dept
            deptName
            kpi
          }
          range {
            start
            end
          }
          side{
            both
            front
            backend
          }
          datas {
            dept
            deptName
            kpi
            parent {
              dept
              deptName
            }
            side{
              both
              front
              backend
            }
            users {
              userId
              userName
              kpi
              tech
            }
          }
        }
      }
  `);

  return data?.avgCodeDept;
};

/* endregion */

const CodeTableList: React.FC<any> = () => {
  /* region ag-grid */
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const { data, loading } = useRequest(() => queryBugResolutionCount(gqlClient, 'quarter'));
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  // 表格的屏幕大小自适应
  const [gridHeight, setGridHeight] = useState(getHeight());
  window.onresize = function () {
    // console.log("新高度：", getHeight());
    setGridHeight(getHeight());
    gridApi.current?.sizeColumnsToFit();
  };

  /* endregion */

  return (
    <PageContainer>
      <div className="ag-theme-alpine" style={{ height: gridHeight, width: '100%' }}>
        <AgGridReact
          columnDefs={compColums} // 定义列
          rowData={data} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            flex: 1,
            cellStyle: { 'margin-top': '-5px' },
          }}
          autoGroupColumnDef={{
            minWidth: 250,
            // sort: 'asc'
          }}
          groupDefaultExpanded={9} // 展开分组
          suppressAggFuncInHeader={true} // 不显示标题聚合函数的标识
          rowHeight={32}
          headerHeight={35}
          // pivotColumnGroupTotals={'always'}
          // groupHideOpenParents={true}  // 组和人名同一列

          // rowGroupPanelShow={'always'}  可以拖拽列到上面
          onGridReady={onGridReady}
          suppressScrollOnNewData={false}
        ></AgGridReact>
      </div>
    </PageContainer>
  );
};

export default CodeTableList;
