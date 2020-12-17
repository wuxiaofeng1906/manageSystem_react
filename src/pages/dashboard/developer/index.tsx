// import { Button, message, Input, Drawer } from 'antd';
import React, { useRef } from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {QueryFilter, ProFormText, ProFormDatePicker, ProFormDateRangePicker, ProFormSelect} from '@ant-design/pro-form';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { useRequest } from 'ahooks';
import {ApolloClient, gql} from '@apollo/client';

// import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
// import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import {GridApi, GridReadyEvent} from "ag-grid-community";
import {useApolloClient} from "@/hooks";
import moment from "moment";

const queryUsers =async (client: ApolloClient<object>, value: FormStoreType = {}) => {
  let from = ""; let to = "";
  const { dateRange, deptId = 0 } = value;

  if (! dateRange) {
    from = moment().startOf('month').valueOf().toString();
    to = moment().endOf('month').valueOf().toString();
  } else {
    from = moment(dateRange[0]).valueOf().toString();
    to = moment(dateRange[1]).valueOf().toString();
  }

  if (deptId !== undefined) {

  }

  const rangeArgs = `from: "${from}", to: "${to}"`

  const { data } = await client.query({
    query: gql`
query {
  developerView(deptIds: [${deptId}]) {
    user {
      id
      account
      realname
      pinyin
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
    `
  });

  return data?.developerView;
};

type FormStoreType = {
  dateRange?: [string, string];
  deptId?: number;
}

const DataFilter = ( { refresh }: { refresh: any }) => {
  return (
    <QueryFilter defaultCollapsed onFinish={(values) => {
      console.log('query values', values);
      return refresh(values);
    }}>
      <ProFormDateRangePicker
        name="rangeDate"
        label="发生区间"
        initialValue={[moment().startOf('month'), moment().endOf('month')]}
        allowClear={false}
        fieldProps={{
          ranges: {
            '今天': [moment(), moment()],
            '本月': [moment().startOf('month'), moment().endOf('month')],
          }
        } as any}
      />
      <ProFormSelect
        name="deptId"
        label="部门/开发组"
        initialValue={0}
        allowClear={false}
        options={[
          {
            value: 0,
            label: '全部'
          },
          {
            value: 21,
            label: '产品研发部'
          },
          {
            value: 20,
            label: '前端平台研发部'
          },
          {
            value: 29,
            label: '1组收付合同'
          },
          {
            value: 30,
            label: '2组项目预算'
          },

        ]}
      />
    </QueryFilter>
  )
}

const TableList: React.FC<any> = () => {
  const gridApi = useRef<GridApi>();
  const apolloClient  = useApolloClient();
  const { data, run, loading } = useRequest((value: FormStoreType) => queryUsers(apolloClient, value))
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
          }}
          onGridReady={onGridReady}
        >
          <AgGridColumn field="user.id"/>
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
