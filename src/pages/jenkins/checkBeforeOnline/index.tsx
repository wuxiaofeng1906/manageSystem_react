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

import {getHeight} from '@/publicMethods/pageSet';
import axios from 'axios';


import dayjs from "dayjs";


const {Option} = Select;


// 查询数据
const queryDevelopViews = async () => {
  debugger;
  const datas: any = [];
  await axios.get('/api/verify/job/build_info', {params: {name: "test_SQA"}})
    .then(function (res) {

      debugger;
      if (res.data.code === 200) {

        const serverDatas = res.data.data.data;
        serverDatas.forEach((ele: any, index: any) => {
          datas.push({
            ID: index,
            taskName: ele.task_name,
            starttime: ele.start_time,
            endtime: ele.end_time,
            excUser: ele.user_name,
            excStatus: ele.result,
            excResult: ele.result,
            url: ele.task_url,
            taskLog: ele.log_url,
          });
        });


      } else {
        message.error({
          content: `错误：${res.data.msg}`,
          duration: 1, // 1S 后自动关闭
          style: {
            marginTop: '50vh',
          },
        });
      }


    }).catch(function (error) {

      message.error({
        content: `异常信息:${error.toString()}`,
        duration: 1, // 1S 后自动关闭
        style: {
          marginTop: '50vh',
        },
      });
    });

  return datas;

};


// 组件初始化
const JenkinsCheck: React.FC<any> = () => {


  // const sys_accessToken = localStorage.getItem("accessId");
  // axios.defaults.headers['Authorization'] = `Bearer ${sys_accessToken}`;
  // const {initialState} = useModel('@@initialState');
  // let currentUser: any;
  // if (initialState?.currentUser) {
  //   currentUser = initialState.currentUser === undefined ? "" : initialState.currentUser.userid;
  // }


  /* region  表格相关事件 */
  const gridApi = useRef<GridApi>();

  const {data, loading} = useRequest(() => queryDevelopViews());

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

  // 执行按钮是否禁用
  const [isButtonClick, setIsButtonClick] = useState("none");

  // 弹出层是否可见
  const [isCheckModalVisible, setCheckModalVisible] = useState(false);
  const [formForCarryTask] = Form.useForm();

  const checkModalCancel = () => {
    setCheckModalVisible(false);
  }

  /* region 下拉框数据加载 */

  // 加载请求Server下拉框
  const [servers, setServers] = useState([]);
  const LoadSeverCombobox = () => {
    axios.get('/api/verify/project/server', {params: {}})
      .then(function (res) {

        if (res.data.code === 200) {
          const serverDatas = res.data.data;
          const serversOp: any = [];
          for (let index = 0; index < serverDatas.length; index += 1) {
            const id = serverDatas[index].server_id;
            const {server} = serverDatas[index]
            serversOp.push(
              <Option value={id}>{server}</Option>,
            );
          }

          setServers(serversOp);
        } else {
          message.error({
            content: `错误：${res.data.msg}`,
            duration: 1, // 1S 后自动关闭
            style: {
              marginTop: '50vh',
            },
          });
        }

      }).catch(function (error) {

      message.error({
        content: `异常信息:${error.toString()}`,
        duration: 1, // 1S 后自动关闭
        style: {
          marginTop: '50vh',
        },
      });
    });


  };

  // 记载请求镜像分支下拉框
  const [imageBranch, setImageBranch] = useState([]);
  const LoadImageBranchCombobox = () => {
    axios.get('/api/verify/project/image_branch', {params: {}})
      .then(function (res) {

        if (res.data.code === 200) {
          const branchDatas = res.data.data;
          const branchOp: any = [];
          for (let index = 0; index < branchDatas.length; index += 1) {
            const id = branchDatas[index].branch_id;
            const branch = branchDatas[index].image_branch
            branchOp.push(
              <Option value={id}>{branch}</Option>,
            );
          }

          setImageBranch(branchOp);
        } else {
          message.error({
            content: `错误：${res.data.msg}`,
            duration: 1, // 1S 后自动关闭
            style: {
              marginTop: '50vh',
            },
          });
        }

      }).catch(function (error) {

      message.error({
        content: `异常信息:${error.toString()}`,
        duration: 1, // 1S 后自动关闭
        style: {
          marginTop: '50vh',
        },
      });
    });


  };

  // 记载请求镜像环境下拉框
  const [imageEvn, setImageEvn] = useState([]);
  const LoadImageEvnCombobox = () => {
    axios.get('/api/verify/project/image_env', {params: {}})
      .then(function (res) {

        if (res.data.code === 200) {
          const imageDatas = res.data.data;
          const imageOp: any = [];
          for (let index = 0; index < imageDatas.length; index += 1) {
            const id = imageDatas[index].env_id;
            const image = imageDatas[index].image_env
            imageOp.push(
              <Option value={id}>{image}</Option>,
            );
          }

          setImageEvn(imageOp);
        } else {
          message.error({
            content: `错误：${res.data.msg}`,
            duration: 1, // 1S 后自动关闭
            style: {
              marginTop: '50vh',
            },
          });
        }

      }).catch(function (error) {

      message.error({
        content: `异常信息:${error.toString()}`,
        duration: 1, // 1S 后自动关闭
        style: {
          marginTop: '50vh',
        },
      });
    });


  };
  /* endregion 下拉框数据加载 */

  const runTask = () => {
    LoadSeverCombobox();
    LoadImageBranchCombobox();
    LoadImageEvnCombobox();
    setCheckModalVisible(true);

    setIsButtonClick("inline");
    // 设置显示的值。
    formForCarryTask.setFieldsValue({
      // 版本检查
      verson_check: true,
      verson_server: "apps",
      verson_imagebranch: "hotfix",
      verson_imageevn: "nx-hotfix",

      // 检查上线分支是否包含对比分支的提交
      branch_check: false,
      branch_mainBranch: ["stage", "master"],
      branch_teachnicalSide: ["前端", "后端"],
      branch_targetBranch: "",
      branch_mainSince: dayjs().subtract(6, 'day')
    });
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

  (window as any).showParams = (params: any) => {
    setCheckModalVisible(true);
    // 这个点击事件只能够进行查看
    setIsButtonClick("none");

    // alert(`获取信息：${params.taskName.toString()}`);


    // 设置显示的值。
    formForCarryTask.setFieldsValue({
      // 版本检查
      verson_check: true,
      verson_server: "apps",
      verson_imagebranch: "hotfix",
      verson_imageevn: "nx-temp7",

      // 检查上线分支是否包含对比分支的提交
      branch_check: true,
      branch_mainBranch: "master",
      branch_teachnicalSide: "后端",
      branch_targetBranch: "aaaaa,bbbbb,cccc",
      branch_mainSince: dayjs("2021-09-09")
    });

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
          if (params.value === "ABORTED ") {
            return `<span style="font-size: medium; color:gray">aborted</span>`;
          }

          if (params.value === "None") {
            return `<span style="font-size: medium; color:#46A0FC">running</span>`;
          }
          if (params.value === "SUCCESS") {
            return `<span style="font-size: medium; color:#32D529">success</span>`;
          }

          if (params.value === "FAILURE") {
            return `<span style="font-size: medium;color: red">failure</span>`;
          }
          return `<span style="font-size: medium;">${params.value}</span>`;
        }
      },
      {
        headerName: '执行结果',
        field: 'excResult',
        minWidth: 95,
        cellRenderer: (params: any) => {

          if (params.value === "ABORTED ") {
            return `<span style="font-size: medium; color:gray">aborted</span>`;
          }

          if (params.value === "None") {
            return `<span style="font-size: medium; "> </span>`;
          }
          if (params.value === "SUCCESS") {
            return `<span style="font-size: medium; color:#32D529">success</span>`;
          }

          if (params.value === "FAILURE") {
            return `<span style="font-size: medium;color: red">failure</span>`;
          }
          return `<span style="font-size: medium;">${params.value}</span>`;
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

      {/* 弹出层：检查任务  */}

      <Modal
        title={'上线前任务检查'}
        visible={isCheckModalVisible}
        onCancel={checkModalCancel}
        centered={true}
        width={550}
        bodyStyle={{height: 535}}
        footer={
          [
            <Button
              style={{borderRadius: 5, marginTop: -100}}
              onClick={checkModalCancel}>取消
            </Button>,
            <Button type="primary"
                    style={{
                      marginLeft: 10,
                      color: '#46A0FC',
                      backgroundColor: "#ECF5FF",
                      borderRadius: 5,
                      display: isButtonClick
                    }}

                    onClick={carryTask}>执行
            </Button>
          ]
        }

      >
        <Form form={formForCarryTask} style={{marginTop: -15}}>

          <Form.Item label="任务名称" name="taskName">
            <Input defaultValue={"popup-online-check"} disabled={true} style={{color: "black"}}/>
          </Form.Item>

          <Divider style={{marginTop: -25}}>任务参数</Divider>

          {/* 版本检查card */}
          <Card size="small" title="版本检查" style={{width: "100%", marginTop: -15, height: 190}}>
            <Form.Item name="verson_check" label="Check" valuePropName="checked" style={{marginTop: -10}}>
              <Switch checkedChildren="是" unCheckedChildren="否" style={{marginLeft: 41}}/>
            </Form.Item>

            <Form.Item name="verson_server" label="Server" style={{marginTop: -22}}>
              <Select placeholder="请选择相应的服务！" style={{marginLeft: 41, width: 375}}>
                {servers}
              </Select>
            </Form.Item>

            <Form.Item name="verson_imagebranch" label="ImageBranch" style={{marginTop: -20, width: 468}}>
              <Select placeholder="请选择待检查分支！" showSearch>
                {imageBranch}
              </Select>
            </Form.Item>

            <Form.Item name="verson_imageevn" label="ImageEvn" style={{marginTop: -20}}>
              <Select placeholder="请选择对应的环境！" style={{marginLeft: 20, width: 375}} showSearch>
                {imageEvn}
              </Select>
            </Form.Item>

          </Card>

          {/* 分支检查Card */}
          <Card size="small" title="检查上线分支是否包含对比分支的提交" style={{width: "100%", marginTop: 5, height: 270}}>
            <Form.Item label="Check" name="branch_check" valuePropName="checked" style={{marginTop: -13}}>
              <Switch checkedChildren="是" unCheckedChildren="否" style={{marginLeft: 51}}/>
            </Form.Item>

            <Form.Item label="MainBranch" name="branch_mainBranch" style={{marginTop: -30}}>
              <Checkbox.Group>
                <Checkbox value={"stage"} style={{marginLeft: 17}}>stage</Checkbox>
                <Checkbox value={"master"}>master</Checkbox>
              </Checkbox.Group>
            </Form.Item>

            <div style={{marginTop: -30, marginLeft: 105, fontSize: "x-small", color: "gray"}}>
              被对比的主分支
            </div>

            <Form.Item label="TeachnicalSide" name="branch_teachnicalSide" style={{marginTop: -3}}>
              <Checkbox.Group>
                <Checkbox value={"前端"}>前端</Checkbox>
                <Checkbox value={"后端"}>后端</Checkbox>
              </Checkbox.Group>
            </Form.Item>
            <div style={{marginTop: -30, marginLeft: 105, fontSize: "x-small", color: "gray"}}>
              技术侧
            </div>

            <Form.Item label="TargetBranch" name="branch_targetBranch" style={{marginTop: 0}}>
              <Input style={{marginLeft: 8, width: 360}}/>
            </Form.Item>

            <div style={{marginTop: -25, marginLeft: 103, fontSize: "x-small", color: "gray"}}>
              待检查的上线分支。支持多个，中间以英文逗号进行分隔。<br/>示例：feature-budget,feature-project
            </div>

            <Form.Item label="MainSince" name="branch_mainSince" style={{marginTop: 0}}>
              <DatePicker style={{marginLeft: 25, width: 360}}/>
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
