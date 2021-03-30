import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';


// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, params: any) => {


  // const {data} = await client.query(`
  //     {
  //
  //     }
  // `);

  console.log(client, params);
  return [
    {
      name1: "title",
      name2: 2,
      name3: 3,
      name4: 4,
      name5: 5,
      name6: 6,
    },
    {
      name1: "title",
      name2: 2,
      name3: 3,
      name4: 4,
      name5: 5,
      name6: 6,
    }
  ];
};


// 组件初始化
const SprintList: React.FC<any> = () => {


  const colums = () => {
    const component = new Array();
    component.push(
      {
        headerName: '部门',
        field: 'name1',
      }, {
        headerName: '组名',
        field: 'name1',
      },
      {
        headerName: '姓名',
        field: 'name1',
      },
      {
        headerName: '指标名称',
        field: 'name1',
      },
      {
        headerName: '权重',
        field: 'name2',
      },
      {
        headerName: '目标值',
        field: 'name3',
      },
      {
        headerName: '实际值',
        field: 'name4',
      },
      {
        headerName: '目标完成率',
        field: 'name5',
      },
      {
        headerName: '单项指标得分',
        field: 'name6',
      }
    );

    return component;
  };
  const condition: any = {
    users: "",
    starttime: "",
    endtime: ""
  };


  /* region  表格相关事件 */
  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() => queryDevelopViews(gqlClient, condition));

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();

  };

  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  /* endregion */


  // 返回渲染的组件
  return (
    <PageContainer>

      <div className="ag-theme-alpine" style={{height: 1000, width: '100%'}}>
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
          groupDefaultExpanded={9} // 展开分组
          onGridReady={onGridReady}

        >

        </AgGridReact>
      </div>

    </PageContainer>
  );
};
export default SprintList;
