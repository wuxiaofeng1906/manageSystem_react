import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {GqlClient, useGqlClient} from '@/hooks';

import {
  Button,
  InputNumber,
  message,
  Form,
  DatePicker,
  Select,
  Modal,
  Input,
  Divider,
  Card,
  Switch,
  Checkbox
} from 'antd';
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
  const gridApi = useRef<GridApi>();
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
  const [gridHeight, setGridHeight] = useState(getHeight() - 20);
  window.onresize = function () {
    setGridHeight(getHeight() - 20);
    gridApi.current?.sizeColumnsToFit();
  };

  const onChangeGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  /* endregion */
  /* region 上线前检查任务弹出层相关事件 */
  // 弹出层是否可见
  const [isCheckModalVisible, setCheckModalVisible] = useState(false);
  const [formForCarryTask] = Form.useForm();

  const checkModalCancel = () => {
    setCheckModalVisible(false);
  }

  const runTask = () => {
    setCheckModalVisible(true);
  };

  // 确定执行任务
  const carryTask = () => {

  }

  // 刷新表格
  const refreshGrid = () => {

  };

  /* endregion */

  /* region 翻页以及页面跳转功能 */
  // https://www.ag-grid.com/react-data-grid/row-pagination/  数据分页

  const [Pages, setPages] = useState({
    totalCounts: 4,
    totalPages: 1,
    currentPage: 1,
  });

  // 每页显示多少条数据
  const showItemChange = (pageCOunt: any) => {

    alert(`每页显示${pageCOunt}条数据`);

  };

  // 上一页
  const showPreviousPage = () => {

    // 上一页不能为负数或0
    if (Pages.currentPage > 1) {
      setPages({
        ...Pages,
        currentPage: Pages.currentPage - 1
      });
    }


  };

  // 下一页
  const showNextPage = () => {
    const nextPage = Pages.currentPage + 1;

    // 下一页的页面不能超过总页面之和
    if (nextPage <= Pages.totalPages) {
      setPages({
        ...Pages,
        currentPage: Pages.currentPage + 1
      });
    }

  };

  // 跳转到第几页
  const goToPage = (params: any) => {

    const pageCounts = Number(params.currentTarget.defaultValue);
    if (pageCounts > Pages.totalPages) {

      // 提示已超过最大跳转页数
      message.error({
        content: '已超过最大跳转页数!',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

    } else {
      alert(`跳转到第${params.currentTarget.defaultValue}页`)

    }


  }
  /* endregion */

  return (
    <PageContainer style={{marginLeft: -30, marginRight: -30}}>

      {/* 按钮 */}
      <div style={{background: 'white', marginTop: -20}}>
        {/* 使用一个图标就要导入一个图标 */}

        <Button type="primary" style={{color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5}}
                onClick={runTask}>执行上线前检查任务</Button>

        <Button type="primary"
                style={{marginLeft: 10, color: '#32D529', backgroundColor: "#ECF5FF", borderRadius: 5}}
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
            cellStyle: {"border-right": "solid 0.5px #E3E6E6"}
            //  BABFC7 lightgrey EAEDED E3E6E6
          }}

          onGridReady={onGridReady}
          onGridSizeChanged={onChangeGridReady}
        >
        </AgGridReact>
      </div>

      {/* 分页控件 */}
      <div style={{background: 'white', marginTop: 2, height: 50, paddingTop: 10}}>

        {/* 共XX条 */}
        <label style={{marginLeft: 20, fontWeight: "bold"}}> 共 {Pages.totalCounts} 条</label>

        {/* 每页 XX 条 */}
        <label style={{marginLeft: 20, fontWeight: "bold"}}>每页</label>
        <InputNumber style={{marginLeft: 10}} size={"middle"} min={1} max={10000} defaultValue={20}
                     onChange={showItemChange}/>
        <label style={{marginLeft: 10, fontWeight: "bold"}}>条</label>

        <label style={{marginLeft: 10, fontWeight: "bold"}}>共 {Pages.totalPages} 页</label>

        {/* 上一页 */}
        <Button size={"small"}
                style={{fontWeight: "bold", marginLeft: 20, color: 'black', backgroundColor: "WhiteSmoke"}}
                onClick={showPreviousPage}>&lt;</Button>

        {/* 条数显示 */}
        <span style={{
          display: "inline-block", marginLeft: 10, textAlign: "center",
          fontWeight: "bold", backgroundColor: "#46A0FC", color: "white", width: "40px"
        }}> {Pages.currentPage} </span>

        {/* 下一页 */}
        <Button size={"small"}
                style={{fontWeight: "bold", marginLeft: 10, color: 'black', backgroundColor: "WhiteSmoke"}}
                onClick={showNextPage}>&gt;</Button>

        {/* 跳转到第几页 */}
        <label style={{marginLeft: 20, fontWeight: "bold"}}> 跳转到第 </label>
        <Input style={{textAlign: "center", width: 50, marginLeft: 2}} defaultValue={1} onBlur={goToPage}/>
        <label style={{marginLeft: 2, fontWeight: "bold"}}> 页 </label>


      </div>

      {/* 弹出层：检查任务 */}

      <Modal
        title={'上线前任务检查'}
        visible={true}
        onCancel={checkModalCancel}
        centered={true}
        width={550}
        footer={[
          <Button
            style={{borderRadius: 5}}
            onClick={checkModalCancel}>取消
          </Button>,
          <Button type="primary"
                  style={{marginLeft: 10, color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5}}
                  onClick={carryTask}>执行
          </Button>
        ]}
      >
        <Form form={formForCarryTask} style={{marginTop: -15}}>

          <Form.Item label="任务名称" name="taskName">
            <Input defaultValue={"popup-online-check"} disabled={true} style={{color: "black"}}/>
          </Form.Item>

          <Divider style={{marginTop: -20}}>任务参数</Divider>

          {/* 版本检查card */}
          <Card size="small" title="版本检查" style={{width: "100%", marginTop: -10, height: 230}}>
            <Form.Item label="Check" name="verson_check">
              <Switch checkedChildren="是" unCheckedChildren="否" style={{marginLeft: 41}} defaultChecked/>
            </Form.Item>

            <Form.Item name="verson_server" label="Server" style={{marginTop: -15}}>
              <Select placeholder="请选择相应的服务！" style={{marginLeft: 41, width: 382}}>
                <Option value="apps">apps</Option>
                <Option value="global">global</Option>
              </Select>
            </Form.Item>

            <Form.Item name="verson_imagebranch" label="ImageBranch" style={{marginTop: -15}}>
              <Select placeholder="请选择待检查分支！" showSearch>
                <Option value="hotfix">hotfix</Option>
                <Option value="release">release</Option>
                <Option value="release-fix">release-fix</Option>
                <Option value="emergency">emergency</Option>
                <Option value="release-emergency">release-emergency</Option>
                <Option value="hotfix-inte">hotfix-inte</Option>
                <Option value="hotfix-emergency">hotfix-emergency</Option>
                <Option value="hotfix-inte-emergency">hotfix-inte-emergency</Option>
                <Option value="stage-emergency">stage-emergency</Option>

              </Select>
            </Form.Item>

            <Form.Item name="verson_imageevn" label="ImageEvn" style={{marginTop: -15}}>
              <Select placeholder="请选择对应的环境！" style={{marginLeft: 20, width: 382}} showSearch>

                <Option value="nx-hotfix">nx-hotfix</Option>
                <Option value="nx-hotfix-db">nx-hotfix-db</Option>
                <Option value="nx-release">nx-release</Option>
                <Option value="nx-release-db">nx-release-db</Option>
                <Option value="nx-temp7">nx-temp7</Option>
                <Option value="nx-hotfix-inte">nx-hotfix-inte</Option>

                <Option value="bj-hotfix">bj-hotfix</Option>
                <Option value="bj-hotfix-db">bj-hotfix-db</Option>
                <Option value="bj-release">bj-release</Option>
                <Option value="bj-release-db">bj-release-db</Option>
                <Option value="bj-hotfix-inte">bj-hotfix-inte</Option>
                <Option value="bj-reports">bj-reports</Option>

                <Option value="bj-temp1">bj-temp1</Option>
                <Option value="bj-temp2">bj-temp2</Option>
                <Option value="bj-temp3">bj-temp3</Option>
                <Option value="bj-temp4">bj-temp4</Option>
                <Option value="bj-temp5">bj-temp5</Option>
                <Option value="bj-temp6">bj-temp6</Option>
                <Option value="bj-temp7">bj-temp7</Option>
                <Option value="bj-temp8">bj-temp8</Option>

              </Select>
            </Form.Item>

          </Card>

          {/* 分支检查Card */}
          <Card size="small" title="检查上线分支是否包含对比分支的提交" style={{width: "100%", marginTop: 10}}>
            <Form.Item label="Check" name="branch_check">
              <Switch checkedChildren="是" unCheckedChildren="否" style={{marginLeft: 50}}/>
            </Form.Item>

            <Form.Item label="MainBranch" name="branch_mainBranch" style={{marginTop: -20,}}>
              <Checkbox name={"stage"} style={{marginLeft: 15}}>stage</Checkbox>
              <Checkbox name={"master"}>master</Checkbox>
            </Form.Item>

            <div style={{marginTop: -25, marginLeft: 103, fontSize: "x-small", color: "gray"}}>
              被对比的主分支
            </div>

            <Form.Item label="TeachnicalSide" name="branch_teachnicalSide" style={{marginTop: 10}}>
              <Checkbox name={"前端"}>前端</Checkbox>
              <Checkbox name={"后端"}>后端</Checkbox>
            </Form.Item>
            <div style={{marginTop: -25, marginLeft: 103, fontSize: "x-small", color: "gray"}}>
              技术测侧
            </div>

            <Form.Item label="TargetBranch" name="branch_targetBranch" style={{marginTop: 10}}>
              <Input style={{marginLeft: 8, width: 370}}/>
            </Form.Item>

            <div style={{marginTop: -25, marginLeft: 103, fontSize: "x-small", color: "gray"}}>
              待检查的上线分支。支持多个，中间以英文逗号进行分隔。<br/>示例：feature-budget,feature-project
            </div>

            <Form.Item label="MainSince" name="branch_mainSince" style={{marginTop: 10}}>
              <DatePicker style={{marginLeft: 25, width: 370}}/>
            </Form.Item>

            <div style={{marginTop: -25, marginLeft: 103, fontSize: "x-small", color: "gray"}}>
              默认查询近一周数据
            </div>

          </Card>


        </Form>
      </Modal>
    </PageContainer>
  );
};


export default JenkinsCheck;
