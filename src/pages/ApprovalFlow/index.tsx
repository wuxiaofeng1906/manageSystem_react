import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {Button, message, Select, Input, DatePicker} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {getHeight} from '@/publicMethods/pageSet';
import axios from 'axios';
import {getGridColums} from "./columns";

const {Option} = Select;
const {RangePicker} = DatePicker;

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


  /* region 获取下拉框选项 */

  const [approvalType, setApprovalType] = useState([]);
  const getApprovalType = () => {
    axios.get('/api/wechat/apply/template', {params: {}})
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

  const [applicant, setApplicant] = useState([]);
  const getApplicant = () => {
    axios.get('/api/wechat/apply/applicant', {params: {}})
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

  const [status, setStatus] = useState([]);
  const getStatus = () => {
    axios.get('/api/wechat/apply/approval_status', {params: {}})
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

  const [managers, setManagers] = useState([]);
  const getManagers = (appType: string) => {
    axios.get('/api/wechat/apply/leader', {params: {temp_id: appType}})
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

  /* endregion */


  const [approveType, setApproveType] = useState("emergency申请")
  // const [condition, setCondition] = useState({
  //
  //
  // });


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


  const columns: any = getGridColums("emergency申请");

  /* endregion */


  const [Pages, setPages] = useState({
    totalCounts: 0,  // 总条数
    countsOfPage: 20,  // 每页显示多少条
    totalPages: 0,  // 一共多少页
    currentPage: 0, // 当前是第几页
    jumpToPage: 0  // 跳转到第几页
  });

  const [showCondition, setShowCondition] = useState({
    devManager: "inline-block",
    prjManager: "none"
  });

  // 刷新表格
  const refreshGrid = async () => {

    const newData = await queryDevelopViews(Pages.currentPage, Pages.countsOfPage);
    gridApi.current?.setRowData(newData.datas);

  };

  // 切换审批类型
  const changeAppType = (appType: any, allParams: any) => {

    // 根据单据类型显示不同的经理选项（项目经理和开发经理）
    getManagers(appType);
    setApproveType(appType);

    if (appType === "Bs5Ku2j5MbW4WTNeiZBouW4quKxvhuy9WDdQnwUWt") {
      setShowCondition({
        devManager: "none",
        prjManager: "inline-block"   // Internal
      });
    } else {
      setShowCondition({
        devManager: "inline-block",
        prjManager: "none"
      });
    }
    const new_columns: any = getGridColums(allParams.children);
    gridApi.current?.setColumnDefs(new_columns);

  };


  /* region 翻页以及页面跳转功能 */

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

  useEffect(() => {
    getApprovalType();
    getApplicant();
    getStatus();
    getManagers("Bs7x1Pi9kpPJEEPC1N81bPfAhKrqpLH2CsuTHQCHu");

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
      <div style={{height: 35, marginTop: -15, overflow: "hidden"}}>

        <label> 类型： </label>
        <Select style={{width: '10%'}} onChange={changeAppType} value={approveType}>
          {approvalType}
          {/* <Option value="开发hotfix上线申请">开发hotfix上线申请</Option>
          <Option value="产品hotfix修复申请">产品hotfix修复申请</Option>
          <Option value="UED-hotfix修复申请">UED-hotfix修复申请</Option>
          <Option value="emergency申请">emergency申请</Option>
          <Option value="变更申请">变更申请</Option> */}
        </Select>

        <label style={{marginLeft: 10}}> 申请人： </label>
        <Select style={{width: '10%'}} showSearch>
          {applicant}
          {/* <Option value="开发hotfix上线申请">1</Option>
          <Option value="产品hotfix修复申请">2</Option>
          <Option value="UED-hotfix修复申请">3-hotfix修复申请</Option>
          <Option value="emergency申请">4</Option>
          <Option value="变更申请">5</Option> */}
        </Select>

        <label style={{marginLeft: 10, display: showCondition.devManager}}> 开发经理： </label>
        <Select style={{width: '10%', display: showCondition.devManager}} showSearch>
          {managers}
          {/* <Option value="开发hotfix上线申请">1</Option>
          <Option value="产品hotfix修复申请">2</Option>
          <Option value="UED-hotfix修复申请">UED-3</Option>
          <Option value="emergency申请">4</Option>
          <Option value="变更申请">5</Option> */}
        </Select>

        <label style={{marginLeft: 10, display: showCondition.prjManager}}> 项目经理： </label>
        <Select style={{width: '10%', display: showCondition.prjManager}} showSearch>
          {managers}
          {/*  <Option value="开发hotfix上线申请">1</Option>
          <Option value="产品hotfix修复申请">2</Option>
          <Option value="UED-hotfix修复申请">UED-3</Option>
          <Option value="emergency申请">4</Option>
          <Option value="变更申请">5</Option> */}
        </Select>


        <label style={{marginLeft: 10}}> 状态： </label>
        <Select style={{width: '10%'}}>
          {status}
          {/* <Option value="开发hotfix上线申请">全部</Option>
          <Option value="产品hotfix修复申请">审批中</Option>
          <Option value="UED-hotfix修复申请">已驳回</Option>
          <Option value="emergency申请">审批通过</Option> */}

        </Select>


        <label style={{marginLeft: 10}}> 时间： </label>
        <RangePicker/>

        <Button icon={<SearchOutlined/>} style={{marginLeft: 10, borderRadius: 5}} onClick={refreshGrid}>查询</Button>


      </div>

      {/* ag-grid 表格定义 */}
      <div className="ag-theme-alpine" style={{marginTop: 3, height: gridHeight, width: '100%'}}>
        <AgGridReact
          columnDefs={columns} // 定义列
          rowData={data?.datas} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            suppressMenu: true,
          }}

          onGridReady={onGridReady}
          onGridSizeChanged={onChangeGridReady}
          onColumnEverythingChanged={onChangeGridReady}
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

    </PageContainer>
  );
};


export default JenkinsCheck;
