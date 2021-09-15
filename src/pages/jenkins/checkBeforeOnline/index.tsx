import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';

import {Button, InputNumber, message, Form, DatePicker, Select, Modal, Input, Row, Col} from 'antd';
import {FolderAddTwoTone, EditTwoTone, DeleteTwoTone, LogoutOutlined} from '@ant-design/icons';
import {formatMomentTime} from '@/publicMethods/timeMethods';
import {getHeight} from '@/publicMethods/pageSet';
import axios from 'axios';
import {history} from 'umi';
import {judgeAuthority} from "@/publicMethods/authorityJudge";
import {useModel} from "@@/plugin-model/useModel";

import dayjs from "dayjs";

const {RangePicker} = DatePicker;
const {Option} = Select;

// 默认条件：近一个月；未关闭的
const defalutCondition: any = {
  projectName: '',
  projectType: [],
  dateRange: {start: "", end: ""},
  projectStatus: ['wait', 'doing', 'suspended'],
};


// 查询数据
const queryDevelopViews = async (client: GqlClient<object>, params: any) => {
  // const range = `{start:"${params.dateRange.start}", end:"${params.dateRange.end}"}`;
  // const {data} = await client.query(`
  //     {
  //        project(name:"${params.projectName}",category:[${params.projectType}], range:${range},status:[${params.projectStatus}],order:ASC){
  //         id
  //         name
  //         type
  //         startAt
  //         testEnd
  //         testFinish
  //         expStage
  //         expOnline
  //         creator
  //         status
  //         createAt
  //         ztId
  //       }
  //     }
  // `);
  //
  // return data?.project;
  return [{
    ID: "111",
    taskName: "werfsdf-gfjf-fghfg",
    starttime: "2021-09-07 10:29:31",
    endtime: "",
    excUser: "张飞",
    excStatus: "waiting",
    excResult: "",
    url: "https://shimo.im/docs/BAQ7r3eVT9MHNJUd",
    taskLog: "https://ant.design/components/button-cn/",
  }, {
    ID: "110",
    taskName: "twcvbxc-sdg-fsdgsd",
    starttime: "2021-09-07 10:29:31",
    endtime: "2021-09-07 10:29:31",
    excUser: "张飞",
    excStatus: "running",
    excResult: "",
    url: "https://shimo.im/docs/BAQ7r3eVT9MHNJUd",
    taskLog: "https://ant.design/components/button-cn/",
  }, {
    ID: "109",
    taskName: "vxzcv-fsg-lll",
    starttime: "2021-09-07 10:29:31",
    endtime: "2021-09-07 10:29:31",
    excUser: "张飞",
    excStatus: "success",
    excResult: "failure",
    url: "https://shimo.im/docs/BAQ7r3eVT9MHNJUd",
    taskLog: "https://ant.design/components/button-cn/",
  }, {
    ID: "108",
    taskName: "dasd-xcbxcbv-okp",
    starttime: "2021-09-07 10:29:31",
    endtime: "2021-09-07 10:29:31",
    excUser: "张飞",
    excStatus: "success",
    excResult: "success",
    url: "https://shimo.im/docs/BAQ7r3eVT9MHNJUd",
    taskLog: "https://ant.design/components/button-cn/",
  }]
};


// 组件初始化
const JenkinsCheck: React.FC<any> = () => {


  const sys_accessToken = localStorage.getItem("accessId");
  axios.defaults.headers['Authorization'] = `Bearer ${sys_accessToken}`;
  // const {initialState} = useModel('@@initialState');
  // let currentUser: any;
  // if (initialState?.currentUser) {
  //   currentUser = initialState.currentUser === undefined ? "" : initialState.currentUser.userid;
  // }


  (window as any).showParams = (params: any) => {

    alert(`获取信息：${params.taskName.toString()}`)

  };

  // 定义列名
  const colums = () => {
    const component: any = [
      {
        headerName: 'ID',
        field: 'ID',
        maxWidth: 70,
      },
      {
        headerName: '任务名称',
        field: 'taskName',
        minWidth: 150,
      },
      {
        headerName: '开始时间',
        field: 'starttime',
        minWidth: 110,
      },
      {
        headerName: '结束时间',
        field: 'endtime',
        minWidth: 110,
      },
      {
        headerName: '执行用户',
        field: 'excUser',
        minWidth: 90,
      },
      {
        headerName: '执行状态',
        field: 'excStatus',
        minWidth: 95,
        cellRenderer: (params: any) => {
          let color = "gray";
          if (params.value === "running") {
            color = "#46A0FC";
          }
          if (params.value === "success") {
            color = "#32D529";
          }

          return `<span style="font-size: medium; color:${color}">${params.value}</span>`;
        }
      },
      {
        headerName: '执行结果',
        field: 'excResult',
        minWidth: 95,
        cellRenderer: (params: any) => {
          let color = "black";
          if (params.value === "failure") {
            color = "red";
          }

          if (params.value === "success") {
            color = "#32D529";
          }

          return `<span style="font-size: medium; color:${color}">${params.value}</span>`;
        }
      },
      {
        headerName: '任务URL',
        field: 'url',
        minWidth: 200,
        cellRenderer: (params: any) => {
          return `<a href="${params.value}" target="_blank" style="text-decoration: underline">${params.value}</a>`;
        }
      },
      {
        headerName: '任务日志',
        field: 'taskLog',
        minWidth: 200,
        cellRenderer: (params: any) => {
          return `<a href="${params.value}" target="_blank" style="text-decoration: underline">${params.value}</a>`;
        }

      }, {
        headerName: '执行参数',
        cellRenderer: (params: any) => {

          const datas = JSON.stringify(params.data);
          return `<button  style="width:100%;border: none; background-color: #AAAAAA; font-size: small; color: white" onclick='showParams(${datas})'> 查看参数 </button>`

        }
      }];

    return component;
  };


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
  const [gridHeight, setGridHeight] = useState(getHeight() - 5);
  window.onresize = function () {
    setGridHeight(getHeight() - 5);
    gridApi.current?.sizeColumnsToFit();
  };

  const onChangeGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* endregion */


  const runTask = () => {

  };

  const refreshGrid = () => {

  };

  const showItemChange = () => {

  };
  const showPreviousPage = () => {

  };

  const showNextPage = () => {

  };


  // https://www.ag-grid.com/react-data-grid/row-pagination/  数据分页
  return (
    <PageContainer>

      <div style={{background: 'white', marginTop: -20}}>
        {/* 使用一个图标就要导入一个图标 */}

        <Button type="primary" style={{color: '#46A0FC', backgroundColor: "#ECF5FF"}}
                onClick={runTask}>执行上线前检查任务</Button>

        <Button type="primary"
                style={{marginLeft: 10, color: '#32D529', backgroundColor: "#ECF5FF"}}
                onClick={refreshGrid}>刷新</Button>


      </div>
      {/* ag-grid 表格定义 */}
      <div className="ag-theme-alpine" style={{marginTop: 3, height: gridHeight, width: '100%'}}>
        <AgGridReact
          columnDefs={colums()} // 定义列
          rowData={data} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            minWidth: 100,
            suppressMenu: true,
            // 自动换行显示
            wrapText: true,
            // 自动行高
            autoHeight: true,
          }}

          onGridReady={onGridReady}
          onGridSizeChanged={onChangeGridReady}
        >
        </AgGridReact>
      </div>

      {/* 分页控件 */}
      <div style={{background: 'white', marginTop: 2}}>
        {/* 使用一个图标就要导入一个图标 */}

        <label style={{marginLeft: 20, fontWeight: "bold"}}> Total 4</label>
        <InputNumber style={{marginLeft: 20}} size={"middle"} min={1} max={10000} defaultValue={20}
                     onChange={showItemChange}/>

        <Button size={"small"}
                style={{fontWeight: "bold", marginLeft: 20, color: 'black', backgroundColor: "WhiteSmoke"}}
                onClick={showPreviousPage}>&lt;</Button>

        <span style={{
          display: "inline-block", marginLeft: 10, textAlign: "center",
          fontWeight: "bold", backgroundColor: "#46A0FC", color: "white", width: "40px"
        }}> 4 </span>

        <Button size={"small"}
                style={{fontWeight: "bold", marginLeft: 10, color: 'black', backgroundColor: "WhiteSmoke"}}
                onClick={showNextPage}>&gt;</Button>
        <label style={{marginLeft: 20, fontWeight: "bold"}}> Go to </label>
        <Input style={{textAlign: "center", width: 50, marginLeft: 6}} value={1}/>


      </div>

      {/*

      <Modal
        title={'删除项目'}
        visible={isdelModalVisible}
        onCancel={DelCancel}
        centered={true}
        footer={null}
        width={500}
      >
        <Form form={formForDel}>
          <Form.Item>
            <label style={{marginLeft: '20px'}}>
              此项目包含【{delCounts}】条数据，请确认是否删除？
            </label>
          </Form.Item>

          <Form.Item>
            <Button type="primary" style={{marginLeft: '150px'}} onClick={delSprintList}>
              确定
            </Button>
            <Button type="primary" style={{marginLeft: '20px'}} onClick={DelCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal> */}
    </PageContainer>
  );
};

export default JenkinsCheck;
