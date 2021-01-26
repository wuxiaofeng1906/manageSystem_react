import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';
import moment from 'moment';
import {Button, Input, Form, DatePicker, Select} from 'antd';
import {FolderAddTwoTone, EditTwoTone, DeleteTwoTone} from '@ant-design/icons';

const {RangePicker} = DatePicker;
const {Option} = Select;

type FormStoreType = {
  dateRange?: [string, string];
  deptId?: number;
};

const colums = () => {
  const component = new Array();
  component.push(
    {
      headerName: '序号',
      field: 'user.dept.name',
    },
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 50,
      'pinned': 'left'
    },
    {
      headerName: '项目名称',
      field: 'user.dept.name',
      cellRenderer: deatilsCellRenderer,

    },
    {
      headerName: '来源类型',
      field: 'user.realname',
    }, {
      headerName: '开始时间',
      field: 'user.realname',
    },
    {
      headerName: '提测截止日期',
      field: 'user.realname',
    }, {
      headerName: '测试完成日期',
      field: 'user.realname',
    }, {
      headerName: '计划灰度日期',
      field: 'user.realname',
    }, {
      headerName: '计划上线日期',
      field: 'user.realname',
    }, {
      headerName: '创建日期',
      field: 'user.realname',
    }, {
      headerName: '创建人',
      field: 'user.realname',
    }, {
      headerName: '项目状态',
      field: 'user.realname',
    }, {
      headerName: '访问禅道',
      field: 'user.realname',
      cellRenderer: (params: any) => {
        return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://172.31.1.219:8384/zentao/project-task-269-unclosed.html'>${params.value}</a>`;
      }
    },
  );

  return component;
};

// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, value: FormStoreType = {}) => {
  let from = 0;
  let to = 0;
  const {dateRange, deptId = 0} = value;

  if (!dateRange) {
    from = moment().startOf('month').valueOf();
    to = moment().endOf('month').valueOf();
  } else {
    from = moment(dateRange[0]).valueOf();
    to = moment(dateRange[1]).valueOf();
  }

  const rangeArgs = `dateRange: { from: ${from}, to: ${to} }`;

  const {data} = await client.query(`
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
function deatilsCellRenderer(params: any) {
  return `<a target="_blank" style="color:blue;text-decoration: underline" href='http://172.31.1.219:8384/zentao/project-task-269-unclosed.html'>${params.value}</a>`;

  // let values: number = 0;
  // if (params.value === '' || params.value == null) {
  //   values = 400;
  // } else {
  //   values = params.value;
  // }
  // if (values === 400) {
  //   return ` <span style="color: dodgerblue">  ${values} </span> `;
  // }
  // return values.toString();
}

const onChange = (e: any) => {
  console.log(e.nativeEvent.data);
};

function handleChange(value: any) {
  console.log(`selected ${value}`);
}

const TableList: React.FC<any> = () => {
  const gridApi = useRef<GridApi>();
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest((value: FormStoreType) =>
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

  const arrays: any = [
    < Option value={1} children={1}></Option>,
    < Option value={2} children={2}></Option>,
    < Option value={3} children={3}></Option>,
    < Option value={4} children={4}></Option>
  ];

  return (

    <PageContainer >
      <div style={{width: "100%" ,  overflow: "auto", whiteSpace: "nowrap"}}>

        <Form.Item name="prjName">
          <label style={{marginLeft: "10px"}}>项目名称：</label>
          <Input placeholder="请输入" style={{"width": "18%"}} allowClear={true} onChange={onChange}/>

          <label style={{marginLeft: "10px"}}>项目类型：</label>
          <Select placeholder="请选择" mode="tags" style={{width: '18%'}} onChange={handleChange}
                  tokenSeparators={[',']}> {arrays}
          </Select>

          <label style={{marginLeft: "10px"}}>时间：</label>
          <RangePicker className={"times"} style={{width: '18%'}}/>


          <label style={{marginLeft: "10px"}}>项目状态：</label>
          <Select placeholder="请选择" mode="tags" style={{width: '18%'}} onChange={handleChange}
                  tokenSeparators={[',']}>
            {arrays}
          </Select>


        </Form.Item>

      </div>

      <div style={{"background": "white"}}> {/* 使用一个图标就要导入一个图标 */}
        <Button type="text" style={{"color": "black"}} disabled={true} size={"large"}> 默认：近1月未关闭的 </Button>

        <Button type="text" style={{"color": "black", float: "right"}} icon={<FolderAddTwoTone/>}
                size={"large"}>删除 </Button>

        <Button type="text" style={{"color": "black", float: "right"}} icon={<EditTwoTone/>}
                size={"large"}> 修改 </Button>

        <Button type="text" style={{"color": "black", float: "right"}} icon={<DeleteTwoTone/>}
                size={"large"}> 新增 </Button>
      </div>

      <div className="ag-theme-alpine" style={{height: 1000, width: '100%'}}>

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
          // suppressDragLeaveHidesColumns // 取消分组时，例如单击删除区域中某一列上的“ x” ，该列将不可见
          // suppressMakeColumnVisibleAfterUnGroup // 如果用户在移动列时不小心将列移出了网格，但并不打算将其隐藏，那么这就很方便。
          // rowGroupPanelShow="always"
          onGridReady={onGridReady}
        >
        </AgGridReact>
      </div>
    </PageContainer>
  );
};

export default TableList;
