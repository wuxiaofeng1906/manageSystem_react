import React, {useEffect, useRef, useState} from 'react';
import {useModel} from "@@/plugin-model/useModel";
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {
  Button,
  message,
  Form,
  Select,
  Modal,
  Input,
  Divider,
  Spin
} from 'antd';

import {getHeight} from '@/publicMethods/pageSet';
import axios from 'axios';

const {Option} = Select;

// 查询数据
const queryDevelopViews = async (pages: Number, pageSize: Number) => {

  const datas: any = [];
  const pageInfo = {
    itemCount: 0,
    pageCount: 0,
    pageSize: 0
  };

  await axios.get('/api/verify/job/build_info',
    {
      params:
        {
          name: "sonar-project-scan",
          page: pages,
          page_size: pageSize
        }
    })
    .then(function (res) {

      if (res.data.code === 200) {

        pageInfo.itemCount = res.data.data.count;
        pageInfo.pageCount = res.data.data.page;
        pageInfo.pageSize = res.data.data.page_size;

        const serverDatas = res.data.data.data;
        serverDatas.forEach((ele: any) => {

          datas.push({
            ID: ele.number,
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

  return {pageInfo, datas};

};


// 组件初始化
const JenkinsCheck: React.FC<any> = () => {

  const {initialState} = useModel('@@initialState');
  const currentUser: any = {user_name: "", user_id: ""};
  if (initialState?.currentUser) {
    currentUser.user_name = initialState.currentUser === undefined ? "" : initialState.currentUser.name;
    currentUser.user_id = initialState.currentUser === undefined ? "" : initialState.currentUser.userid;
  }


  /* region  表格相关事件 */
  const gridApi = useRef<GridApi>();

  const {data, loading} = useRequest(() => queryDevelopViews(1, 20));

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

  /* region 弹出层相关事件 */
  // 判断是否显示loading状态
  const [loadState, setLoadSate] = useState(false);

  // 执行按钮是否禁用
  const [isButtonClick, setIsButtonClick] = useState("none");

  // 弹出层是否可见
  const [isCheckModalVisible, setCheckModalVisible] = useState(false);
  const [formForCarrySonar] = Form.useForm();

  const checkModalCancel = () => {
    setCheckModalVisible(false);
  }

  /* region 下拉框数据加载 */


  // 记载ProjectPath下拉框，这个下拉框跟以下几个数据是联动的，因此需要记录id，name等数据


  // 记载请求镜像环境下拉框
  const [branchName, setBranchName] = useState([]);
  const LoadBranchNameCombobox = (projectId: any) => {
    axios.get('/api/verify/sonar/branch', {params: {pro_id: projectId}})
      .then(function (res) {

        if (res.data.code === 200) {
          const branchDatas = res.data.data;
          const branchOp: any = [];
          for (let index = 0; index < branchDatas.length; index += 1) {
            const branch = branchDatas[index].branch_name
            branchOp.push(
              <Option value={branch}>{branch}</Option>,
            );
          }

          setBranchName(branchOp);
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

  const ProjectPathChanged = (values: any, params: any) => {

    // 设置默认显示的值。
    formForCarrySonar.setFieldsValue({

      // LanguageType: "",
      // ProjectPath: "",
      // BranchName: "",
      ProjectKey: params.keyName,

    });

    // key: "1038824"
    // keyName: "go-business-flow"
    // value: "front/go-business-flow"
    LoadBranchNameCombobox(params.key);

  };

  const branchChanged = (value: any) => {
    const name = formForCarrySonar.getFieldsValue();
    debugger;
    formForCarrySonar.setFieldsValue({
      ProjectKey: `${name.ProjectKey}-${value}`,

    });
  }

  const [projectPath, setProjectPath] = useState([]);
  const LoadProjectPathCombobox = () => {
    axios.get('/api/verify/sonar/project', {params: {}})
      .then(function (res) {

        if (res.data.code === 200) {
          const pathDatas = res.data.data;
          const pathOp: any = [];
          for (let index = 0; index < pathDatas.length; index += 1) {
            const prjId = pathDatas[index].project_id
            const prjName = pathDatas[index].project_name
            const branch = pathDatas[index].project_path_with_namespace
            pathOp.push(
              <Option key={prjId} keyName={prjName} value={branch}>{branch}</Option>,
            );
          }

          setProjectPath(pathOp);
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

  const runSonarTask = () => {


    setCheckModalVisible(true);
    setLoadSate(false);
    setIsButtonClick("inline");
    LoadProjectPathCombobox();
    formForCarrySonar.setFieldsValue({
      LanguageType: "java",
      ProjectPath: "",
      BranchName: "",
      ProjectKey: "",

    });
  };

  // 确定执行任务
  const carrySonarCheck = () => {

    const modalData = formForCarrySonar.getFieldsValue()

    // LanguageType 、 ProjectPath 和 BranchName不能为空
    const language = modalData.LanguageType;
    if (!language) {
      message.error({
        content: `LanguageType 为必选项！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }

    const ProjectPaths = modalData.ProjectPath;
    if (!ProjectPaths) {
      message.error({
        content: `ProjectPaths 为必选项！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }

    const BranchNames = modalData.BranchName;
    if (!BranchNames) {
      message.error({
        content: `BranchName 为必选项！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

    }

    if (language && ProjectPaths && BranchNames) {
      // 传入参数错误：422  ；连接问题：422

      const datas = {
        name: "sonar-project-scan",
        user_name: currentUser.user_name,
        user_id: currentUser.user_id,
        job_parm: [
          {name: "languageType", value: language},
          {name: "projectPath", value: ProjectPaths},
          {name: "branchName", value: BranchNames},
          {name: "projectKey", value: modalData.ProjectKey},
        ]
      };

      setLoadSate(true);
      axios.post('/api/verify/job/build', datas).then(async function (res) {

        if (res.data.code === 200) {
          const newData = await queryDevelopViews(1, 20);

          gridApi.current?.setRowData(newData.datas);
          setCheckModalVisible(false);
          message.info({
            content: "执行完毕！",
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
          setLoadSate(false);
        } else {
          message.error({
            content: `${res.data.message}${res.data.zt.message.end[0]}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
          setLoadSate(false);
        }
      })
        .catch(function (error) {
          message.error({
            content: `异常信息：${error.toString()}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
          setLoadSate(false);
        });
    }


  };

  const [Pages, setPages] = useState({
    totalCounts: 0,  // 总条数
    countsOfPage: 20,  // 每页显示多少条
    totalPages: 0,  // 一共多少页
    currentPage: 0, // 当前是第几页
    jumpToPage: 0  // 跳转到第几页
  });
  // 刷新表格
  const refreshGrid = async () => {

    const newData = await queryDevelopViews(Pages.currentPage, Pages.countsOfPage);

    gridApi.current?.setRowData(newData.datas);

  };

  /* endregion */

  /* region 翻页以及页面跳转功能 */
  // https://www.ag-grid.com/react-data-grid/row-pagination/  数据分页


  // 每页显示多少条数据
  const showItemChange = async (pageCount: any) => {

    setPages({
      ...Pages,
      countsOfPage: Number(pageCount),
      totalPages: Math.ceil(Pages.totalCounts / Number(pageCount)),
    });

    const newData = await queryDevelopViews(Pages.currentPage, pageCount);
    gridApi.current?.setRowData(newData.datas);

  };

  // 上一页
  const showPreviousPage = async () => {

    // 上一页不能为负数或0
    if (Pages.currentPage > 1) {
      setPages({
        ...Pages,
        currentPage: Pages.currentPage - 1
      });


    }

    const newData = await queryDevelopViews(Pages.currentPage - 1, Pages.countsOfPage);
    gridApi.current?.setRowData(newData.datas);

  };

  // 下一页
  const showNextPage = async () => {
    const nextPage = Pages.currentPage + 1;

    // 下一页的页面不能超过总页面之和
    if (nextPage <= Pages.totalPages) {
      setPages({
        ...Pages,
        currentPage: Pages.currentPage + 1
      });

      const newData = await queryDevelopViews(Pages.currentPage + 1, Pages.countsOfPage);
      gridApi.current?.setRowData(newData.datas);
    }

  };

  // 跳转到第几页

  const jumpChange = (params: any) => {

    const inputData = params.nativeEvent.data;
    if (Number(inputData)) {

      if (Number(inputData) > Pages.totalPages) {
        setPages({
          ...Pages,
          jumpToPage: Number(inputData)

        });
      } else {
        setPages({
          ...Pages,
          jumpToPage: Number(inputData),
          currentPage: Number(inputData)
        });
      }

    }
  };

  const goToPage = async (params: any) => {

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

      const newData = await queryDevelopViews(Number(params.currentTarget.defaultValue), Pages.countsOfPage);
      gridApi.current?.setRowData(newData.datas);

    }


  }
  /* endregion */

  /* region 定义列以及单元格的点击事件 */


  (window as any).showParams = (params: any) => {

    setCheckModalVisible(true);
    setLoadSate(false);
    // 这个点击事件只能够进行查看
    setIsButtonClick("none");

    // alert(`获取信息：${params.taskName.toString()}`);
    axios.get('/api/verify/job/build_info_param',
      {
        params: {
          name: params.taskName,
          num: params.ID
        }
      }).then(function (res: any) {


      if (res.data.code === 200) {
        let language = "";
        let prjPath = "";
        let branchNames = "";
        let prjKey = "";


        const result = res.data.data;
        if (result) {
          result.forEach((dts: any) => {
            switch (dts.name) {
              case "languageType":
                language = dts.value;
                break;
              case "projectPath":
                prjPath = dts.value;
                break;
              case "branchName":
                branchNames = dts.value;
                break;
              case "projectKey":
                prjKey = dts.value;
                break;
              default:
                break;
            }
          });
        }


        // 设置显示的值。
        formForCarrySonar.setFieldsValue({
          LanguageType: language,
          ProjectPath: prjPath,
          BranchName: branchNames,
          ProjectKey: prjKey,

        });


      } else {
        message.error({
          content: `错误：${res.data.msg}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }

    }).catch(function (error) {

      message.error({
        content: `异常信息:${error.toString()}`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
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
        minWidth: 170,
      },
      {
        headerName: '开始时间',
        field: 'starttime',
        minWidth: 170,
      },
      {
        headerName: '结束时间',
        field: 'endtime',
        minWidth: 170,
      },
      {
        headerName: '执行用户',
        field: 'excUser',
        minWidth: 90,
      },
      {
        headerName: '执行状态',
        field: 'excStatus',
        minWidth: 100,
        cellRenderer: (params: any) => {
          if (params.value === "ABORTED ") {
            return `<span style="font-size: large; color:gray">aborted</span>`;
          }

          if (params.value === null) {
            return `<span style="font-size: large; color:#46A0FC">running</span>`;
          }
          if (params.value === "SUCCESS") {
            return `<span style="font-size: large; color:#32D529">success</span>`;
          }

          if (params.value === "FAILURE") {
            return `<span style="font-size: large;color: red">failure</span>`;
          }
          return `<span style="font-size: large;">${params.value}</span>`;
        }
      },
      {
        headerName: '执行结果',
        field: 'excResult',
        minWidth: 100,
        cellRenderer: (params: any) => {

          if (params.value === "ABORTED ") {
            return `<span style="font-size: large; color:gray">aborted</span>`;
          }

          if (params.value === null) {
            return `<span style="font-size: large; "> </span>`;
          }
          if (params.value === "SUCCESS") {
            return `<span style="font-size: large; color:#32D529">success</span>`;
          }

          if (params.value === "FAILURE") {
            return `<span style="font-size: large;color: red">failure</span>`;
          }
          return `<span style="font-size: large;">${params.value}</span>`;
        }
      },
      // {
      //   headerName: '任务URL',
      //   field: 'url',
      //   minWidth: 200,
      //   cellRenderer: (params: any) => {
      //     if (params.value === undefined) {
      //       return "";
      //     }
      //
      //     return `<a href="${params.value}" target="_blank" style="text-decoration: underline">${params.value}</a>`;
      //   }
      // },
      // {
      //   headerName: '任务日志',
      //   field: 'taskLog',
      //   minWidth: 200,
      //   cellRenderer: (params: any) => {
      //     if (params.value === undefined) {
      //       return "";
      //     }
      //     return `<a href="${params.value}" target="_blank" style="text-decoration: underline">${params.value}</a>`;
      //   }
      //
      // }, {
      //   headerName: '执行参数',
      //   cellRenderer: (params: any) => {
      //
      //     const datas = JSON.stringify(params.data);
      //     return `<button  style="width:100%;border: none; background-color: #AAAAAA; font-size: small; color: white" onclick='showParams(${datas})'> 查看参数 </button>`
      //
      //   }
      // },
      {
        headerName: '操作',
        minWidth: 130,
        cellRenderer: (params: any) => {

          const paramData = JSON.stringify(params.data);
          return `
             <a href="${params.data.url}" target="_blank" >
               <img src="../taskUrl.png" width="20" height="20" alt="任务URL" title="任务URL">
             </a>
             <a href="${params.data.taskLog}" target="_blank" >
               <img src="../logs.png" width="20" height="20" alt="任务日志" title="任务日志">
             </a>
            <Button  style="border: none; background-color: transparent; font-size: small; color: #46A0FC" onclick='showParams(${paramData})'>
              <img src="../params.png" width="20" height="20" alt="执行参数" title="执行参数">
            </Button>`;

        }
      }
    ];

    return component;
  };

  /* endregion */

  useEffect(() => {

    let totalCount = 0;
    let countsOfPages = 1;
    let totalPage = 1;
    let currentPages = 1;
    if (data) {
      totalCount = Number(data?.pageInfo.itemCount);
      countsOfPages = Number(data?.pageInfo.pageSize);
      totalPage = Number(data?.pageInfo.itemCount) === 0 ? 0 : Math.ceil(Number(data?.pageInfo.itemCount) / Number(data?.pageInfo.pageSize));
      currentPages = Number(data?.pageInfo.pageCount);
    }


    setPages({
      totalCounts: totalCount,
      countsOfPage: countsOfPages,
      totalPages: totalPage,
      currentPage: currentPages,
      jumpToPage: 1
    });
  }, [loading])

  return (
    <PageContainer style={{marginLeft: -30, marginRight: -30}}>

      {/* 按钮 */}
      <div style={{background: 'white', marginTop: -20, height: 42}}>
        {/* 使用一个图标就要导入一个图标 */}

        {/*<Button type="primary" style={{color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5}}*/}
        {/*        onClick={runSonarTask}>执行sonar扫描任务</Button>*/}
        <Button type="text" onClick={runSonarTask} style={{padding: 10}}>
          <img src="../operate.png" width="22" height="22" alt="执行sonar扫描任务" title="执行sonar扫描任务"/> &nbsp;执行sonar扫描任务
        </Button>


        {/*<Button type="primary"*/}
        {/*        style={{marginLeft: 10, color: '#32D529', backgroundColor: "#ECF5FF", borderRadius: 5}}*/}
        {/*        onClick={refreshGrid}>刷新</Button>*/}

        <Button type="text" onClick={refreshGrid}>
          <img src="../refresh.png" width="30" height="30" alt="刷新" title="刷新"/> 刷新
        </Button>


      </div>

      {/* ag-grid 表格定义 */}
      <div className="ag-theme-alpine" style={{marginTop: 3, height: gridHeight, width: '100%'}}>
        <AgGridReact
          columnDefs={colums()} // 定义列
          rowData={data?.datas} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            // minWidth: 100,
            suppressMenu: true,
            // 自动换行显示
            // wrapText: true,
            // 自动行高
            // autoHeight: true,
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
        <Select style={{marginLeft: 10, width: 80}} onChange={showItemChange} value={Pages.countsOfPage}>
          <Option value={20}>20 </Option>
          <Option value={50}>50 </Option>
          <Option value={100}>100 </Option>
          <Option value={200}>200 </Option>
        </Select>


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
        <Input style={{textAlign: "center", width: 50, marginLeft: 2}} value={Pages.jumpToPage} onChange={jumpChange}
               onBlur={goToPage}/>
        <label style={{marginLeft: 2, fontWeight: "bold"}}> 页 </label>


      </div>

      {/* 弹出层：扫描任务  isCheckModalVisible */}

      <Modal
        title={'sonar扫描任务'}
        visible={isCheckModalVisible}
        onCancel={checkModalCancel}
        centered={true}
        width={550}
        bodyStyle={{height: 300}}
        footer={
          [
            <Spin spinning={loadState} tip="Loading...">
              <Button
                style={{borderRadius: 5, marginTop: -100}}
                onClick={checkModalCancel}>取消
              </Button>
              <Button type="primary"
                      style={{
                        marginLeft: 10,
                        color: '#46A0FC',
                        backgroundColor: "#ECF5FF",
                        borderRadius: 5,
                        display: isButtonClick
                      }}

                      onClick={carrySonarCheck}>执行
              </Button>
            </Spin>

          ]
        }

      >
        <Form form={formForCarrySonar} style={{marginTop: -15}}>

          <Form.Item label="任务名称" name="taskName">
            <Input defaultValue={"sonar-project-scan"} disabled={true}
                   style={{marginLeft: 35, width: 390, color: "black"}}/>
          </Form.Item>

          <Divider style={{marginTop: -25}}>任务参数</Divider>

          <div>

            <Form.Item name="LanguageType" label="LanguageType" style={{marginTop: -15}}>
              <Select style={{width: 390}}>
                <Option value="java">java</Option>
                <Option value="ts">ts</Option>
                <Option value="go">go</Option>
              </Select>
            </Form.Item>
            <div style={{marginTop: -23, marginLeft: 104, fontSize: "x-small", color: "gray"}}>
              语言类型：默认是java；如果是前端，则选择ts；如果是golang，则选择go
            </div>

            <Form.Item name="ProjectPath" label="ProjectPath" style={{marginTop: 7}}>
              <Select showSearch style={{marginLeft: 20, width: 390}} onChange={ProjectPathChanged}>
                {projectPath}
              </Select>
            </Form.Item>
            <div style={{marginTop: -23, marginLeft: 104, fontSize: "x-small", color: "gray"}}>
              项目路径：如：backend/apps/asset
            </div>

            <Form.Item name="BranchName" label="BranchName" style={{marginTop: 7}}>
              <Select showSearch style={{marginLeft: 10, width: 390}} onChange={branchChanged}>
                {branchName}
              </Select>
            </Form.Item>
            <div style={{marginTop: -23, marginLeft: 104, fontSize: "x-small", color: "gray"}}>
              分支名称：如：feature-multi-org2
            </div>


            <Form.Item name="ProjectKey" label="ProjectKey" style={{marginTop: 7}}>

              <Input style={{marginLeft: 25, width: 390}}/>
            </Form.Item>
            <div style={{marginTop: -23, marginLeft: 104, fontSize: "x-small", color: "gray"}}>
              sonar中展示的项目名称，唯一
            </div>

          </div>
        </Form>
      </Modal>

    </PageContainer>
  );
};


export default JenkinsCheck;
