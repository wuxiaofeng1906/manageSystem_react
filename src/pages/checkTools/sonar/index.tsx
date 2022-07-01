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
  Button, Form, Select, Row, Col,
  Modal, Input, Divider, Spin, Checkbox
} from 'antd';
import {colums} from "./grid/columns";
import {getHeight} from '@/publicMethods/pageSet';
import {
  queryDevelopViews, getSonarDetails, getBranchNameCombobox, getProjectPathCombobox,
  executeTask, getBugAssigendTo
} from "./apiRequest";
import {errorMessage, sucMessage} from "@/publicMethods/showMessages";

const {Option} = Select;
// 组件初始化
const JenkinsCheck: React.FC<any> = () => {
  const {initialState} = useModel('@@initialState');
  const currentUser: any = {user_name: "", user_id: ""};
  if (initialState?.currentUser) {
    currentUser.user_name = initialState.currentUser === undefined ? "" : initialState.currentUser.name;
    currentUser.user_id = initialState.currentUser === undefined ? "" : initialState.currentUser.userid;
  }

  const personArray = useRequest(() => getBugAssigendTo()).data;
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

  /* endregion */

  /* region 弹出层相关事件 */
  // 判断是否显示loading状态
  const [loadState, setLoadSate] = useState(false);
  // 执行按钮是否禁用
  const [isButtonClick, setIsButtonClick] = useState("none");
  // bug指派人是否禁用
  const [bugAssigned, setBugAssigned] = useState(true);
  // 弹出层是否可见
  const [isCheckModalVisible, setCheckModalVisible] = useState(false);
  const [formForCarrySonar] = Form.useForm();
  // 取消
  const checkModalCancel = () => {
    setCheckModalVisible(false);
  }

  /* region 下拉框数据加载 */

  // 记载请求镜像环境下拉框
  const [branchName, setBranchName] = useState([]);
  const LoadBranchNameCombobox = async (projectId: any) => {
    const selectArray = await getBranchNameCombobox(projectId);
    setBranchName(selectArray);
  };

  const ProjectPathChanged = (values: any, params: any) => {
    // 设置默认显示的值。
    formForCarrySonar.setFieldsValue({
      ProjectKey: params.keyName,
    });
    LoadBranchNameCombobox(params.key);
  };

  const branchChanged = (value: any) => {
    const name = formForCarrySonar.getFieldsValue();
    formForCarrySonar.setFieldsValue({
      ProjectKey: `${name.ProjectKey}-${value}`,
    });
  }

  // 项目下拉框
  const [projectPath, setProjectPath] = useState([]);
  const LoadProjectPathCombobox = async () => {
    const selectArray = await getProjectPathCombobox();
    setProjectPath(selectArray);
  };

  const [Pages, setPages] = useState({
    totalCounts: 0,  // 总条数
    countsOfPage: 20,  // 每页显示多少条
    totalPages: 0,  // 一共多少页
    currentPage: 0, // 当前是第几页
    jumpToPage: 0  // 跳转到第几页
  });

  // 计算分页信息
  const showPageInfo = (pageInfo: any) => {
    let totalCount = 0;
    let countsOfPages = 1;
    let totalPage = 1;
    let currentPages = 1;
    if (data) {
      totalCount = Number(pageInfo.itemCount);
      countsOfPages = Number(pageInfo.pageSize);
      totalPage = Number(pageInfo.itemCount) === 0 ? 0 : Math.ceil(Number(pageInfo.itemCount) / Number(pageInfo.pageSize));
      currentPages = Number(pageInfo.pageCount);
    }

    setPages({
      totalCounts: totalCount,
      countsOfPage: countsOfPages,
      totalPages: totalPage,
      currentPage: currentPages,
      jumpToPage: 1
    });
  };

  /* endregion 下拉框数据加载 */

  // 执行定时任务
  const [currentTimerId, setCurrentTimerId] = useState("");
  const setIntervalForUpdateStatus = () => {
    // 判断有没有定时器id,有的话就代表有定时器，就不再创建了，如果没有，则创建
    if (currentTimerId === "") {
      const myTimer = setInterval(async () => {
        const newData = await queryDevelopViews(1, 20); // 一次只运行几条
        const {datas} = newData;
        gridApi.current?.setRowData(datas);

        // 是否还在运行
        let isRunning = false;
        for (let index = 0; index < datas.length; index += 1) {
          if (datas[index].excStatus === null) { // 没有状态时,直接跳出循环，继续等待下一次循环
            isRunning = true;
            break;
          }
        }

        // 如果所有运行结束，那么则清除定时任务
        if (isRunning === false) {
          setCurrentTimerId("");
          clearInterval(myTimer);
        }
      }, 10000); // 10S刷新一次
      setCurrentTimerId(myTimer.toString());
    }
  };

  // 执行按钮弹出层
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
      releaseToZentao: "no",
      bugAssignedTo: ""
    });
  };

  // 确定执行任务
  const carrySonarCheck = async () => {
    const modalData = formForCarrySonar.getFieldsValue()
    // LanguageType 、 ProjectPath 和 BranchName不能为空
    const language = modalData.LanguageType;
    if (!language) {
      errorMessage(`LanguageType 为必选项！`);
      return;
    }
    const ProjectPaths = modalData.ProjectPath;
    if (!ProjectPaths) {
      errorMessage(`ProjectPaths 为必选项！`);
      return;
    }
    const BranchNames = modalData.BranchName;
    if (!BranchNames) {
      errorMessage(`BranchName 为必选项！`);
      return;
    }

    // 严重bug是否生成到禅道：如果勾选了，那么后面的指派人为必填项。如果没勾选，后面指派人可以为空。
    let isBugToZentao = modalData.releaseToZentao;
    let bugAssignedt = "";
    if (isBugToZentao && isBugToZentao.length > 0) {
      bugAssignedt = modalData.bugAssignedTo;
      if (!bugAssignedt) {
        errorMessage(`Bug指派人不能为空！`);
        return;
      }
      isBugToZentao = isBugToZentao[0].toString();

    } else {
      isBugToZentao = "no";
    }

    // 传入参数错误：422 ；连接问题：422
    const datas = {
      name: "sonar-project-scan",
      user_name: currentUser.user_name,
      user_id: currentUser.user_id,
      job_parm: [
        {name: "languageType", value: language},
        {name: "projectPath", value: ProjectPaths},
        {name: "branchName", value: BranchNames},
        {name: "projectKey", value: modalData.ProjectKey},
        {name: "is_bug_zt", value: isBugToZentao},  // yes  no
        {name: "bug_assign", value: bugAssignedt},
      ]
    };

    setLoadSate(true);
    const executeRt = await executeTask(datas);
    if (executeRt.code === 200) {
      const newData = await queryDevelopViews(1, 20);
      gridApi.current?.setRowData(newData.datas);
      showPageInfo(newData.pageInfo);
      setCheckModalVisible(false);
      sucMessage("执行完毕！");
      setIntervalForUpdateStatus();
    } else {
      errorMessage(`执行失败：${executeRt.msg}`);
    }
    setLoadSate(false);

  };

  // 刷新表格
  const refreshGrid = async () => {
    const newData = await queryDevelopViews(Pages.currentPage, Pages.countsOfPage);
    gridApi.current?.setRowData(newData.datas);
    showPageInfo(newData.pageInfo);
  };

  // 扫描成功后bug生成到禅道(指派人是否可用)
  const bugToZentaoChanged = (params: any) => {
    if (params && params.length > 0) {
      setBugAssigned(false);
    } else {
      setBugAssigned(true);
    }
  }
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
      const newData = await queryDevelopViews(Pages.currentPage - 1, Pages.countsOfPage);
      gridApi.current?.setRowData(newData.datas);
    } else {
      errorMessage('当前页已是第一页！');
    }
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
    } else {
      errorMessage('当前页已是最后一页！');
    }
  };

  // 跳转到第几页
  const goToPage = async (params: any) => {

    const pageCounts = Number(params.currentTarget.defaultValue);
    if (pageCounts.toString() === "NaN") {
      errorMessage('请输入有效跳转页数！')
    } else if (pageCounts > Pages.totalPages) {
      // 提示已超过最大跳转页数
      errorMessage('已超过最大跳转页数!');
    } else {
      const newData = await queryDevelopViews(Number(params.currentTarget.defaultValue), Pages.countsOfPage);
      gridApi.current?.setRowData(newData.datas);
    }
  }
  /* endregion */

  /* region 定义列以及单元格的点击事件 */
  (window as any).showParams = async (params: any) => {

    setCheckModalVisible(true);
    setLoadSate(false);
    // 这个点击事件只能够进行查看
    setIsButtonClick("none");
    const details = await getSonarDetails(params.taskName, params.ID);
    if (details && details.length > 0) {
      let language = "";
      let prjPath = "";
      let branchNames = "";
      let prjKey = "";
      let butTpzt = "";
      let assignedTo = "";
      details.forEach((dts: any) => {
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
          case "is_bug_zt":
            butTpzt = dts.value;
            break;
          case "bug_assign":
            assignedTo = dts.value;
            break;

          default:
            break;
        }
      });

      // 设置显示的值。
      formForCarrySonar.setFieldsValue({
        LanguageType: language,
        ProjectPath: prjPath,
        BranchName: branchNames,
        ProjectKey: prjKey,
        releaseToZentao: butTpzt,
        bugAssignedTo: assignedTo
      });

      if (butTpzt === 'yes') {
        setBugAssigned(false);
      } else {
        setBugAssigned(true);
      }
    }
  };
  /* endregion */

  useEffect(() => {
    showPageInfo(data?.pageInfo);
  }, [loading])

  return (
    <PageContainer style={{marginLeft: -30, marginRight: -30}}>
      {/* 按钮 */}
      <div style={{background: 'white', marginTop: -20, height: 42}}>
        {/* 使用一个图标就要导入一个图标 */}
        <Button type="text" onClick={runSonarTask} style={{padding: 10}}>
          <img src="../operate.png" width="22" height="22" alt="执行sonar扫描任务" title="执行sonar扫描任务"/> &nbsp;执行sonar扫描任务
        </Button>
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
            suppressMenu: true,
            cellStyle: {"border-right": "solid 0.5px #E3E6E6"}
          }}
          onGridReady={onGridReady}
          onGridSizeChanged={onGridReady}
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
        <Input style={{textAlign: "center", width: 50, marginLeft: 2}} defaultValue={1}
               onBlur={goToPage}/>
        <label style={{marginLeft: 2, fontWeight: "bold"}}> 页 </label>


      </div>

      {/* 弹出层：扫描任务  isCheckModalVisible */}
      <Modal
        title={'sonar扫描任务'}
        visible={isCheckModalVisible}  //
        onCancel={checkModalCancel}
        centered={true}
        width={550}
        bodyStyle={{height: 340}}
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
          <div>
            <Row gutter={8}>
              <Col span={14}>
                <Form.Item name="releaseToZentao" label="扫描成功后严重bug是否自动生成到禅道" style={{marginTop: 7}}>

                  <Checkbox.Group style={{width: '100%'}} onChange={bugToZentaoChanged}>
                    <Checkbox value={"yes"}></Checkbox>
                  </Checkbox.Group>

                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name="bugAssignedTo" label="Bug指派人" style={{marginTop: 7}}>
                  <Select showSearch style={{marginLeft: 10, width: '100%'}} disabled={bugAssigned}
                          filterOption={(inputValue: string, option: any) =>
                            !!option.children.includes(inputValue)}>
                    {personArray}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>

    </PageContainer>
  );
};


export default JenkinsCheck;
