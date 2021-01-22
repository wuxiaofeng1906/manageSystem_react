import React, { useRef } from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {QueryFilter, ProFormDateRangePicker, ProFormSelect} from '@ant-design/pro-form';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useRequest } from 'ahooks';
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {GqlClient, useGqlClient, useQuery} from "@/hooks";
import moment from "moment";
import {getRanges, thisWeekValue} from "@/utils/data-range-picker.util";

type FormStoreType = {
  dateRange?: [string, string];
  deptId?: number;
}

const queryDevelopViews = async (client: GqlClient<object>, value: FormStoreType = {}) => {
  let from = 0; let to = 0;
  const { dateRange, deptId = 0 } = value;

  if (! dateRange) {
    from = moment().startOf('month').valueOf();
    to = moment().endOf('month').valueOf();
  } else {
    from = moment(dateRange[0]).valueOf();
    to = moment(dateRange[1]).valueOf();
  }

  const rangeArgs = `dateRange: { from: ${from}, to: ${to} }`
  // const query = new GqlQueryBuilder('developerView', { deptIds: [deptId]})
  //   .find()

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

const DataFilter = ( { refresh }: { refresh: any }) => {
  const { data: {depts = []} = {} } = useQuery(`
{
  depts {
    id
    name
    path
    grade
    order
  }
}
  `)

  const deptOptions = depts.map( (x: any) => ({
    value: x.id,
    label: x.name,
  }));

  deptOptions.unshift({
    value: 0,
    label: '全部',
  })

  return (
    <QueryFilter defaultCollapsed onFinish={(values) => {
      console.log('query values', values);
      return refresh(values);
    }}>
      <ProFormDateRangePicker
        name="dateRange"
        label="发生区间"
        initialValue={thisWeekValue()}
        allowClear={false}
        fieldProps={{
          ranges: getRanges(),
        } as any}
      />
      <ProFormSelect
        name="deptId"
        label="部门/开发组"
        initialValue={deptOptions[0].value}
        allowClear={false}
        options={deptOptions}
      />
    </QueryFilter>
  )
}

const TableList: React.FC<any> = () => {
  const gridApi = useRef<GridApi>();
  const gqlClient  = useGqlClient();
  const { data, run, loading } = useRequest((value: FormStoreType) => queryDevelopViews(gqlClient, value))
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApi.current) {
    if (loading)
      gridApi.current.showLoadingOverlay()
    else
      gridApi.current.hideOverlay()
  }

  return (
    <PageContainer>
      <DataFilter refresh={run}/>

      <div className="ag-theme-alpine"
           style={ {height: 700, width: '100%' } }
      >
        <AgGridReact
          rowData={data}
          defaultColDef={{
            resizable: true,
            sortable: true,
            floatingFilter: true,
            filter: true,
            flex: 1,
            minWidth: 150,
          }}
          autoGroupColumnDef={{
            minWidth: 200,
          }}
          suppressDragLeaveHidesColumns
          suppressMakeColumnVisibleAfterUnGroup
          rowGroupPanelShow='always'
          onGridReady={onGridReady}
        >
          <AgGridColumn field="user.dept.name" headerName="部门" enableRowGroup />
          <AgGridColumn field="user.account"/>
          <AgGridColumn field="user.realname"/>
          <AgGridColumn field="user.pinyin"/>
          <AgGridColumn headerName='activeBugs'>
            <AgGridColumn field="activeBugView.count" type="numericColumn"/>
            <AgGridColumn field="activeBugView.hotfixCount" type="numericColumn"/>
            <AgGridColumn field="activeBugView.sprinCount" type="numericColumn"/>
          </AgGridColumn>
          <AgGridColumn headerName='resolveBugs'>
            <AgGridColumn field="resolveBugView.count" type="numericColumn"/>
            <AgGridColumn field="resolveBugView.hotfixCount" type="numericColumn"/>
            <AgGridColumn field="resolveBugView.sprinCount" type="numericColumn"/>
          </AgGridColumn>
        </AgGridReact>
      </div>
    </PageContainer>
  )
}

export default TableList;
