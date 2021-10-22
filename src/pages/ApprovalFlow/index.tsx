import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {Button, message, Select, Input, DatePicker, Modal, InputNumber, Form} from 'antd';
import {getHeight} from '@/publicMethods/pageSet';
import axios from 'axios';
import {getGridColums, alaysisDatas} from "./columns";
import {getFlowDIv} from "./flow";


const {Option} = Select;
const {RangePicker} = DatePicker;

// 查询数据
const queryDevelopViews = async (condition: any) => {
  debugger;

  let datas: any = [];
  const pageInfo = {
    itemCount: 0,
    pageCount: 0,
    pageSize: 0
  };

  const paramData = {
    temp_id: condition.approvalType,  // 类型
    approval_id: condition.status, // 状态
    leader_name: condition.manager, // 开发经理 or 项目经理
    user_id: condition.applicant, // 申请人
    start_time: condition.start, // 开始时间
    end_time: condition.end,// 结束时间
    sp_no: condition.spNo,
    sp_person: condition.spPerson,
    page: condition.page, // 第几页
    page_size: condition.pageSize  // 每页多少条
  };

  await axios.get('/api/verify/apply/apply_data', {params: paramData})
    .then(function (res) {

      if (res.data.code === 200) {

        pageInfo.itemCount = res.data.data.count;
        pageInfo.pageCount = res.data.data.page;
        pageInfo.pageSize = res.data.data.page_size;

        datas = alaysisDatas(condition, res.data.data.data);

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

  const [condition, setCondition] = useState({
    approvalTypeName: "emergency申请",
    approvalType: "Bs7x1Pi9kpPJEEPC1N81bPfAhKrqpLH2CsuTHQCHu", // emergency id
    applicant: "",
    manager: "",
    status: "",
    start: "",
    end: "",
    spNo: "",
    spPerson: "",
    page: 1,
    pageSize: 20
  });

  /* region  表格相关事件 */


  const gridApi = useRef<GridApi>();
  const {data, loading} = useRequest(() => queryDevelopViews(condition));
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


  /* region 查询以及 翻页以及页面跳转功能 */

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

  // 表格查询按钮
  const refreshGrid = async (new_condition: any) => {

    const n_columns: any = getGridColums(new_condition.approvalType);
    gridApi.current?.setColumnDefs(n_columns);
    gridApi.current?.setRowData([]);

    const newData = await queryDevelopViews(new_condition);
    gridApi.current?.setRowData(newData.datas);
    showPageInfo(newData.pageInfo);

  };


  // 每页显示多少条数据
  const showItemChange = async (pageCount: any) => {

    setPages({
      ...Pages,
      countsOfPage: Number(pageCount),
      totalPages: Math.ceil(Pages.totalCounts / Number(pageCount)),
    });

    const queryCondition = {
      approvalType: condition.approvalType, // emergency id
      applicant: condition.applicant,
      manager: condition.manager,
      status: condition.status,
      start: condition.start,
      end: condition.end,
      spNo: condition.spNo,
      spPerson: condition.spPerson,
      page: Pages.currentPage, // 第几页
      pageSize: pageCount // 每页多少条
    };

    refreshGrid(queryCondition);


  };

  // 上一页
  const showPreviousPage = async () => {

    // 上一页不能为负数或0
    if (Pages.currentPage > 1) {
      setPages({
        ...Pages,
        currentPage: Pages.currentPage - 1
      });

      const queryCondition = {
        approvalType: condition.approvalType, // emergency id
        applicant: condition.applicant,
        manager: condition.manager,
        status: condition.status,
        start: condition.start,
        end: condition.end,
        spNo: condition.spNo,
        spPerson: condition.spPerson,
        page: Number(Pages.currentPage - 1), // 第几页
        pageSize: Pages.countsOfPage // 每页多少条
      };

      refreshGrid(queryCondition);
    } else {
      message.error({
        content: '当前已是第一页！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
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

      const queryCondition = {
        approvalType: condition.approvalType, // emergency id
        applicant: condition.applicant,
        manager: condition.manager,
        status: condition.status,
        start: condition.start,
        end: condition.end,
        spNo: condition.spNo,
        spPerson: condition.spPerson,
        page: Number(Pages.currentPage + 1), // 第几页
        pageSize: Pages.countsOfPage // 每页多少条
      };

      refreshGrid(queryCondition);
    } else {
      message.error({
        content: '当前已是最后一页！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }

  };

  // 跳转到第几页


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


      const queryCondition = {
        approvalType: condition.approvalType, // emergency id
        applicant: condition.applicant,
        manager: condition.manager,
        status: condition.status,
        start: condition.start,
        end: condition.end,
        spNo: condition.spNo,
        spPerson: condition.spPerson,
        page: pageCounts, // 第几页
        pageSize: Pages.countsOfPage // 每页多少条
      };

      refreshGrid(queryCondition);

    }


  };

  /* endregion */

  /* region 下拉框事件 */

  // 单据类型
  const [approvalType, setApprovalType] = useState([]);
  const getApprovalType = () => {
    axios.get('/api/verify/apply/template', {params: {}})
      .then(function (res) {

        if (res.data.code === 200) {
          const typeDatas = res.data.data;
          const typeOp: any = [];
          for (let index = 0; index < typeDatas.length; index += 1) {
            const id = typeDatas[index].template_id;
            const name = typeDatas[index].template_name
            typeOp.push(
              <Option value={id}>{name}</Option>,
            );
          }
          setApprovalType(typeOp);
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

  // 申请人
  const [applicant, setApplicant] = useState([]);
  const getApplicant = () => {
    axios.get('/api/verify/apply/applicant', {params: {}})
      .then(function (res) {

        if (res.data.code === 200) {
          const applicantDatas = res.data.data;
          const applicantOp: any = [<Option key={""} value={""}>{""}</Option>];
          for (let index = 0; index < applicantDatas.length; index += 1) {
            const id = applicantDatas[index].user_id;
            const name = applicantDatas[index].user_name
            applicantOp.push(
              <Option key={id} value={name}>{name}</Option>
            );
          }
          setApplicant(applicantOp);
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
  const getselectedApplicant = (values: any, params: any) => {
    setCondition({
      ...condition,
      applicant: params.key
    });

    const queryCondition = {
      approvalType: condition.approvalType, // emergency id
      applicant: params.key,
      manager: condition.manager,
      status: condition.status,
      start: condition.start,
      end: condition.end,
      spPerson: condition.spPerson,
      spNo: condition.spNo,
      page: condition.page,
      pageSize: condition.pageSize
    };

    refreshGrid(queryCondition);

  };

  // 状态
  const [status, setStatus] = useState([]);
  const getStatus = () => {
    axios.get('/api/verify/apply/approval_status', {params: {}})
      .then(function (res) {

        if (res.data.code === 200) {
          const statusDatas = res.data.data;
          const statustOp: any = [<Option key={""} value={""}>{""}</Option>];
          for (let index = 0; index < statusDatas.length; index += 1) {
            const id = statusDatas[index].approval_id;
            const name = statusDatas[index].approval_status
            statustOp.push(
              <Option key={id} value={name}>{name}</Option>
            );
          }
          setStatus(statustOp);
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
  const getSelectedStatus = (values: any, params: any) => {
    setCondition({
      ...condition,
      status: params.key
    });

    const queryCondition = {
      approvalType: condition.approvalType, // emergency id
      applicant: condition.applicant,
      manager: condition.manager,
      status: params.key,
      start: condition.start,
      end: condition.end,
      spPerson: condition.spPerson,
      spNo: condition.spNo,
      page: condition.page,
      pageSize: condition.pageSize
    };

    refreshGrid(queryCondition);


  };


  // 经理（开发经理 or 项目经理）
  const [managers, setManagers] = useState([]);
  const getManagers = (appType: string) => {
    axios.get('/api/verify/apply/leader', {params: {temp_id: appType}})
      .then(function (res) {

        if (res.data.code === 200) {
          const managersDatas = res.data.data;
          const managerstOp: any = [<Option key={""} value={""}>{""}</Option>];
          for (let index = 0; index < managersDatas.length; index += 1) {
            // const id = managersDatas[index].approval_id;
            const name = managersDatas[index].leader
            managerstOp.push(
              <Option key={name} value={name}>{name}</Option>
            );
          }
          setManagers(managerstOp);
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
  const getDevManager = (values: any, params: any) => {
    setCondition({
      ...condition,
      manager: params.key
    });

    const queryCondition = {
      approvalType: condition.approvalType, // emergency id
      applicant: condition.applicant,
      manager: params.key,
      status: condition.status,
      start: condition.start,
      end: condition.end,
      spPerson: condition.spPerson,
      spNo: condition.spNo,
      page: condition.page,
      pageSize: condition.pageSize
    };

    refreshGrid(queryCondition);

  };
  const getprojectManager = (values: any, params: any) => {

    setCondition({
      ...condition,
      manager: params.key
    });

    const queryCondition = {
      approvalType: condition.approvalType, // emergency id
      applicant: condition.applicant,
      manager: params.key,
      status: condition.status,
      start: condition.start,
      end: condition.end,
      spPerson: condition.spPerson,
      spNo: condition.spNo,
      page: condition.page,
      pageSize: condition.pageSize
    };

    refreshGrid(queryCondition);
  };

  // 待审批人
  const getselectedPendingApproval = (values: any, params: any) => {
    debugger;

    setCondition({
      ...condition,
      spPerson: params.key.toString()
    });

    const queryCondition = {
      approvalType: condition.approvalType, // emergency id
      applicant: condition.applicant,
      manager: condition.manager,
      status: condition.status,
      start: condition.start,
      end: condition.end,
      spPerson: params.key.toString(),
      spNo: condition.spNo,
      page: condition.page,
      pageSize: condition.pageSize
    };

    refreshGrid(queryCondition);

  };

  // 获取审批编号
  const getSpNo = (params: any) => {
    const values = params.currentTarget?.defaultValue;

    setCondition({
      ...condition,
      spNo: values.toString()
    });


    const queryCondition = {
      approvalType: condition.approvalType, // emergency id
      applicant: condition.applicant,
      manager: condition.manager,
      status: condition.status,
      start: condition.start,
      end: condition.end,
      spPerson: condition.spPerson,
      spNo: values.toString(),
      page: condition.page,
      pageSize: condition.pageSize
    };

    refreshGrid(queryCondition);

  };
  // 已选择的时间
  const getSelectedDateRange = (values: any, params: any) => {

    setCondition({
      ...condition,
      start: `${params[0].toString()} 00:00:00`,
      end: `${params[1].toString()} 23:59:59`
    });

    const queryCondition = {
      approvalType: condition.approvalType, // emergency id
      applicant: condition.applicant,
      manager: condition.manager,
      status: condition.status,
      start: `${params[0].toString()} 00:00:00`,
      end: `${params[1].toString()} 23:59:59`,
      spPerson: condition.spPerson,
      spNo: condition.spNo,
      page: condition.page,
      pageSize: condition.pageSize
    };

    refreshGrid(queryCondition);
  }

  // 切换单据类型

  const [showCondition, setShowCondition] = useState({
    devManager: "inline-block",
    prjManager: "none"
  });
  const changeAppType = async (appType: any, appTypeObject: any) => {


    console.log(appTypeObject.children)
    // 根据单据类型显示不同的经理选项（项目经理和开发经理）
    getManagers(appType);
    setCondition({
      ...condition,
      approvalTypeName: appTypeObject.children,
      approvalType: appType

    });

    if (appType === "Bs5Ku2j5MbW4WTNeiZBouW4quKxvhuy9WDdQnwUWt") {
      setShowCondition({
        devManager: "none",
        prjManager: "inline-block"
      });
    } else {
      setShowCondition({
        devManager: "inline-block",
        prjManager: "none"
      });
    }


    const queryCondition = {
      approvalType: appType, // emergency id
      applicant: condition.applicant,
      manager: condition.manager,
      status: condition.status,
      start: condition.start,
      end: condition.end,
      spPerson: condition.spPerson,
      spNo: condition.spNo,
      page: condition.page,
      pageSize: condition.pageSize
    };

    refreshGrid(queryCondition);
  };

  /* endregion */

  // region 弹出层修改事件
  const [formForModify] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const modalCancel = () => {
    setIsModalVisible(false);
  };
  const onRowDoubleClick = (params: any) => {
    if (condition.approvalType !== "Bs5Ku2j5MbW4WTNeiZBouW4quKxvhuy9WDdQnwUWt") { // 如果是变更申请
      return;
    }

    const datas = params.data;
    setIsModalVisible(true);
    formForModify.setFieldsValue({
      appNo: datas.sp_no,
      frontTime: (datas.change_hours)["前端"] === undefined ? 0 : (datas.change_hours)["前端"],
      backendTime: (datas.change_hours)["后端"] === undefined ? 0 : (datas.change_hours)["后端"],
      testTime: (datas.change_hours)["测试"] === undefined ? 0 : (datas.change_hours)["测试"]
    });
  };

  const carryModify = async () => {
    const formData = formForModify.getFieldsValue();

    const frontData = formData.frontTime;
    const backend = formData.backendTime;
    const test = formData.testTime;
    const sum = Number(frontData) + Number(backend) + Number(test);
    const datas = {
      "sp_no": formData.appNo,
      "front": frontData.toString(),
      "server": backend.toString(),
      "test": test.toString(),
      "sum": sum.toString()
    };

    await axios.put('/api/verify/apply/apply_data', datas)
      .then(function (res) {

        if (res.data.code === 200) {
          message.info({
            content: `变更工时影响时间修改成功！`,
            duration: 1, // 1S 后自动关闭
            style: {
              marginTop: '50vh',
            },
          });


          refreshGrid(condition);
          setIsModalVisible(false);
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


  // endregion

  // region 弹出层显示审批流程事件

  const [flowDiv, setFlowDiv] = useState(<div></div>);
  const [isDetailsVisible, setDetailsVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const detailModalCancle = () => {
    setDetailsVisible(false);
  };
  const onChangeCellClicked = (params: any) => {


    if (params.column.colId === "current_person") {
      const datas = params.data;
      if (condition.approvalType === "Bs5Ku2j5MbW4WTNeiZBouW4quKxvhuy9WDdQnwUWt") { // 如果是变更申请
        setModalTitle(datas.change_obj);
      } else {
        setModalTitle(condition.approvalTypeName);
      }
      setDetailsVisible(true);
      const returnDiv = getFlowDIv(datas);
      setFlowDiv(returnDiv);
    }
  };

  // endregion
  useEffect(() => {
    getApprovalType();
    getApplicant();
    getStatus();
    getManagers(condition.approvalType);

    showPageInfo(data?.pageInfo);
    gridApi.current?.setColumnDefs(getGridColums(condition.approvalType));
    gridApi.current?.setRowData(data?.datas);

  }, [loading]);


  return (
    <PageContainer style={{marginLeft: -30, marginRight: -30}}>

      {/* 按钮 */}
      <div style={{height: 35, marginTop: -15, overflow: "hidden"}}>

        <label> 类型： </label>
        <Select style={{minWidth: 140, width: '10%'}} onChange={changeAppType} value={condition.approvalType}>
          {approvalType}
        </Select>

        <label style={{marginLeft: 10}}> 申请人： </label>
        <Select style={{minWidth: 90, width: '10%'}} showSearch onChange={getselectedApplicant}>
          {applicant}
        </Select>

        <label style={{marginLeft: 10, display: showCondition.devManager}}> 开发经理： </label>
        <Select style={{minWidth: 90, width: '10%', display: showCondition.devManager}} showSearch
                onChange={getDevManager}>
          {managers}
        </Select>

        <label style={{marginLeft: 10, display: showCondition.prjManager}}> 项目经理： </label>
        <Select style={{minWidth: 90, width: '10%', display: showCondition.prjManager}} showSearch
                onChange={getprojectManager}>
          {managers}
        </Select>

        <label style={{marginLeft: 10}}> 待审批人： </label>
        <Select style={{minWidth: 90, width: '10%'}} showSearch onChange={getselectedPendingApproval}>
          {applicant}
        </Select>


        <label style={{marginLeft: 10}}> 状态： </label>
        <Select style={{width: '10%'}} onChange={getSelectedStatus}>
          {status}
        </Select>

        {/* <label style={{marginLeft: 10}}> 时间： </label> */}
        {/* <RangePicker onChange={getSelectedDateRange}/> */}


        <label style={{marginLeft: 10}}> 审批编号： </label>
        <Input style={{width: '10%'}} onBlur={getSpNo}/>

      </div>

      {/* ag-grid 表格定义 */}
      <div className="ag-theme-alpine" style={{marginTop: 3, height: gridHeight, width: '100%'}}>
        <AgGridReact
          // columnDefs={getGridColums(condition.approvalType)} // 定义列
          // rowData={data?.datas} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            suppressMenu: true,
            autoHeight: true,

          }}

          onGridReady={onGridReady}
          onGridSizeChanged={onChangeGridReady}
          onColumnEverythingChanged={onChangeGridReady}
          onRowDoubleClicked={onRowDoubleClick}
          onCellClicked={onChangeCellClicked}

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

      {/* 设置变更工时 */}
      <Modal
        title={'设置'}
        visible={isModalVisible}
        onCancel={modalCancel}
        centered={true}
        width={350}
        bodyStyle={{height: 250}}
        footer={
          [
            <Button
              style={{borderRadius: 5, marginTop: -100}}
              onClick={modalCancel}>取消
            </Button>,
            <Button type="primary"
                    style={{
                      marginLeft: 10,
                      color: '#46A0FC',
                      backgroundColor: "#ECF5FF",
                      borderRadius: 5,
                    }}

                    onClick={carryModify}>保存
            </Button>
          ]
        }

      >
        <Form form={formForModify}>

          <Form.Item label="审批编号" name="appNo">
            <Input disabled={true} style={{marginLeft: 25, width: 200, color: "black"}}/>
          </Form.Item>

          <Form.Item label="前端影响[h]" name="frontTime">
            <InputNumber step={0.5} style={{marginLeft: 10, width: 200}}/>
          </Form.Item>

          <Form.Item label="后端影响[h]" name="backendTime">
            <InputNumber step={0.5} style={{marginLeft: 10, width: 200}}/>
          </Form.Item>

          <Form.Item label="测试影响[h]" name="testTime">
            <InputNumber step={0.5} style={{marginLeft: 10, width: 200}}/>
          </Form.Item>


        </Form>
      </Modal>

      {/* 显示变更流程 */}
      <Modal
        title={<div style={{fontSize: 15, height: 5, marginLeft: -10, marginTop: -10}}>{modalTitle}</div>}
        closeIcon={<div style={{marginTop: -10}}>X</div>}
        visible={isDetailsVisible}
        onCancel={detailModalCancle}
        centered={true}
        width={480}
        footer={null}

      >
        <Form form={formForModify}>
          {flowDiv}
        </Form>
      </Modal>

    </PageContainer>
  );
};


export default JenkinsCheck;
