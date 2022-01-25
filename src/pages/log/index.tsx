import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient, useQuery} from '@/hooks';
import moment from 'moment';
import {Form, DatePicker, Select} from 'antd';
import {getHeight} from '@/publicMethods/pageSet';
import axios from 'axios';
import dayjs from "dayjs";

const {RangePicker} = DatePicker;
const {Option} = Select;


const defalutCondition: any = {
  operator: "",
  project: "",
  start: dayjs().format("YYYY-MM-DD"),
  end: dayjs().format("YYYY-MM-DD")
};

// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, params: any) => {
  let query = `optionAt:{start:"${params.start}",end:"${params.end}"}`;

  if (params.project !== "") {
    query = `objectId:"${params.project}",${query}`;
  }
  if (params.operator !== "") {
    query = `userId:"${params.operator}",${query}`;
  }

  const {data} = await client.query(`
      {
        logHistory(${query}){
          id
          actor
          option
          previous
          later
          objectId
          objectType
          show
          optionAt
        }
      }
  `);

  return data?.logHistory;
};

const LogList: React.FC<any> = () => {

  const sys_accessToken = localStorage.getItem("accessId");
  axios.defaults.headers['Authorization'] = `Bearer ${sys_accessToken}`;

  // 定义列名
  const colums = () => {
    const component = new Array();
    component.push(
      {
        headerName: 'NO.',
        maxWidth: 60,
        filter: false,
        cellRenderer: (params: any) => {
          return Number(params.node.id) + 1;
        },
      },
      {
        headerName: '操作人',
        field: 'actor',
        minWidth: 100,
      },
      {
        headerName: '操作',
        field: 'option',
        minWidth: 100,
      },
      {
        headerName: '旧值',
        field: 'previous',
        minWidth: 124,
      },
      {
        headerName: '新值',
        field: 'later',
        minWidth: 124,
      },
      {
        headerName: '修改时间',
        field: 'optionAt',
        minWidth: 170,
      }
    );

    return component;
  };
  const LoadUserCombobox = () => {

    const deptMan = [];
    deptMan.push(
      <Option value={""}> {""}</Option>,
    );

    const {data: {WxDeptUsers = []} = {}} = useQuery(` {
            WxDeptUsers{
               id
              userName
            }
          }`);

    for (let index = 0; index < WxDeptUsers.length; index += 1) {
      deptMan.push(
        <Option value={WxDeptUsers[index].id}> {WxDeptUsers[index].userName}</Option>,
      );
    }
    return deptMan;

  };

  const LoadPrjCombobox = () => {

    const projects = [];
    projects.push(
      <Option value={""}> {""}</Option>,
    );

    const {data: {project = []} = {}} = useQuery(` {
       project(order:DESC){
              id
              name
            }
          }`);

    if(project){
      for (let index = 0; index < project.length; index += 1) {
        projects.push(
          <Option value={project[index].id}> {project[index].name}</Option>,
        );
      }
    }

    return projects;

  };

  const [choicedCondition, setQueryCondition] = useState({
    operator: "",
    project: "",
    start: dayjs().format("YYYY-MM-DD"),
    end: dayjs().format("YYYY-MM-DD")
  });
  /* region  表格相关事件 */
  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const gqlClient = useGqlClient();
  const {data, loading} = useRequest(() => queryDevelopViews(gqlClient, defalutCondition));

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


  /* region 条件查询功能 */

  const updateGrid = async () => {

    const datas: any = await queryDevelopViews(gqlClient, choicedCondition);
    gridApi.current?.setRowData(datas);
  };

  const uerChanged = (params: any) => {

    setQueryCondition({
      ...choicedCondition,
      operator: params.toString()
    });
  };

  const prjChanged = (params: any) => {

    setQueryCondition({
      ...choicedCondition,
      project: params.toString()
    });
  };

  // 时间选择事件
  const onTimeSelected = async (params: any, dateString: any) => {

    //  输入后在useEffect中实现查询
    setQueryCondition({
      ...choicedCondition,
      start: dateString[0],
      end: dateString[1]
    });
  };

  /* endregion */


  useEffect(() => {
    updateGrid();
  }, [choicedCondition]);

  // 返回渲染的组件
  return (
    <PageContainer>
      {/* 查询条件 */}
      <div style={{width: '100%', overflow: 'auto', whiteSpace: 'nowrap', marginTop: "-10px"}}>

        <Form.Item name="prjName">
          <label style={{marginLeft: '10px'}}>操作人：</label>
          <Select placeholder="请选择" style={{width: "18%"}} onChange={uerChanged} showSearch optionFilterProp="children">
            {LoadUserCombobox()}
          </Select>

          <label style={{marginLeft: '10px'}}>项目：</label>
          <Select placeholder="请选择" style={{width: "18%"}} onChange={prjChanged} showSearch optionFilterProp="children">
            {LoadPrjCombobox()}
          </Select>

          <label style={{marginLeft: '20px'}}>时间：</label>
          <RangePicker
            className={'times'}
            style={{width: '22%'}}
            value={[choicedCondition.start === "" ? null : moment(choicedCondition.start),
              choicedCondition.end === "" ? null : moment(choicedCondition.end)]}
            onChange={onTimeSelected}
          />

        </Form.Item>
      </div>

      {/* ag-grid 表格定义 */}
      <div className="ag-theme-alpine" style={{height: gridHeight, width: '100%', marginTop: "-10px"}}>
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
            suppressMenu: true,
            cellStyle: {"line-height": "30px"},
          }}
          rowHeight={32}
          headerHeight={35}
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

export default LogList;
