import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useRequest } from 'ahooks';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { GqlClient, useGqlClient } from '@/hooks';
import moment from 'moment';
import { getWeeksRange, getMonthWeek } from '@/publicMethods/timeMethods'; // 引用 publicMethods/timeMethods中的方法

type FormStoreType = {
  dateRange?: [string, string];
  deptId?: number;
};

const colums = () => {
  const component = new Array();
  component.push(
    {
      headerName: '组名',
      field: 'user.dept.name',
      showRowGroup: 'dept',
      rowGroup: true,
      hide: true,
    },
    {
      headerName: '姓名',
      field: 'user.realname',
    },
  );

  const weekRanges = getWeeksRange(4);
  for (let index = weekRanges.length - 1; index >= 0; index -= 1) {
    const starttime = weekRanges[index].from;
    // const endtime = weekRanges[index].to;
    const weekName = getMonthWeek(starttime);
    component.push({
      headerName: weekName,
      children: [
        {
          headerName: '结构覆盖率',
          field: 'resolveBugView.count',
          cellRenderer: coverageCellRenderer,
        },
        {
          headerName: '分支覆盖率',
          field: 'activeBugView.count',
          cellRenderer: coverageCellRenderer,
        },
      ],
    });
  }

  return component;
};

// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, value: FormStoreType = {}) => {
  let from = 0;
  let to = 0;
  const { dateRange, deptId = 0 } = value;

  if (!dateRange) {
    from = moment().startOf('month').valueOf();
    to = moment().endOf('month').valueOf();
  } else {
    from = moment(dateRange[0]).valueOf();
    to = moment(dateRange[1]).valueOf();
  }

  const rangeArgs = `dateRange: { from: ${from}, to: ${to} }`;

  const { data } = await client.query(`
       {
          developerView(deptIds: [${deptId}]) {
            user {
              id
              account
              realname
              pinyin
              dept {
                id
                name
              }
            }
            activeBugView(${rangeArgs}) {
              count
              sprintCount
              hotfixCount
            }
            resolveBugView(${rangeArgs}) {
              count
              sprintCount
              hotfixCount
            }
          }
      }
    `);

  return data?.developerView;
};

// 表格代码渲染
function coverageCellRenderer(params: any) {
  let values: number = 0;
  if (params.value === '' || params.value == null) {
    values = 400;
  } else {
    values = params.value;
  }
  if (values === 400) {
    return ` <span style="color: dodgerblue">  ${values} </span> `;
  }
  return values.toString();
}

const TableList: React.FC<any> = () => {
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const { data, loading } = useRequest((value: FormStoreType) =>
    queryDevelopViews(gqlClient, value),
  );
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  return (
    <PageContainer>
      <div className="ag-theme-alpine" style={{ height: 700, width: '100%' }}>
        <AgGridReact
          columnDefs={colums()} // 定义列
          rowData={data} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            // floatingFilter: true,
            filter: true,
            flex: 1,
            minWidth: 100,
          }}
          autoGroupColumnDef={{
            minWidth: 100,
          }}
          groupDefaultExpanded={9} // 展开分组
          suppressDragLeaveHidesColumns // 取消分组时，例如单击删除区域中某一列上的“ x” ，该列将不可见
          suppressMakeColumnVisibleAfterUnGroup // 如果用户在移动列时不小心将列移出了网格，但并不打算将其隐藏，那么这就很方便。
          rowGroupPanelShow="always"
          onGridReady={onGridReady}
        ></AgGridReact>
      </div>
    </PageContainer>
  );
};

export default TableList;
