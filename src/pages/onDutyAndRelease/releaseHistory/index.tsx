import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import type {GridApi, GridReadyEvent} from 'ag-grid-community';
import {useRequest} from "ahooks";
import {
  getGrayscaleListData, getFormalListData, vertifyOnlineProjectExit, getOnlineProocessDetails,
  delGrayReleaseHistory
} from './axiosRequest/apiPage';
import {history} from "@@/core/history";
import {Button, DatePicker, Select, Popconfirm, Modal} from "antd";
import {loadPrjNameSelect} from "@/pages/onDutyAndRelease/preRelease/comControl/controler";
import dayjs from "dayjs";
import moment from 'moment';
import {grayscaleBacklogList, releasedList} from './gridSet';
import {errorMessage, sucMessage} from "@/publicMethods/showMessages";
import {gridHeadDivStyle, girdDefaultSetting} from "./commonSetting";
import "./style.css";
import {Link} from 'umi';

const {RangePicker} = DatePicker;
const formalQueryCondition = {
  start: dayjs().subtract(7, 'day').format("YYYY-MM-DD"),
  end: dayjs().format("YYYY-MM-DD"),
  project: "",
  page: 1, // 跳转到第几页
  pageSize: 100  // 一页显示多少条数据
}
// 0级灰度发布列表时间
let zeroStart = dayjs().subtract(30, 'day').format("YYYY-MM-DD");
let zeroEnd = dayjs().format("YYYY-MM-DD");
// 1级灰度发布列表时间
let firstStart = dayjs().subtract(30, 'day').format("YYYY-MM-DD");
let firstEnd = dayjs().format("YYYY-MM-DD");

const ReleaseHistory: React.FC<any> = () => {
  // 设置表格的高度。
  const [gridHeight, setGridHeight] = useState({
    zeroGrid: 100,
    firstGrid: 100,
    formalGrid: 100
  });

  /* region 0级灰度发布界面 */
  const gotoGrayReleasePage = (releData: any) => {
    // const releasedNum = releData.data?.ready_release_num;
    // history.push(`/onDutyAndRelease/preRelease?releasedNum=${releasedNum}&history=true`);
  };

  // 一级灰度跳转到正式发布界面
  const gotoFirstReleasePage = (releData: any) => {
    const onlineReleasedNum = releData.data?.release_gray_num;
    history.push(`/onDutyAndRelease/officialRelease?releaseType=gray&onlineReleaseNum=${onlineReleasedNum}&history=true`);
  };

  /* region 0级灰度积压列表 */
  const zeroGrayscaleGridApi = useRef<GridApi>();
  const onZeroGrayscaleGridReady = (params: GridReadyEvent) => {
    zeroGrayscaleGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const [zeroButtonTitle, setZeroButtonTitle] = useState("一键生成1级灰度发布");  // 待发布详情
  // 0级灰度积压列表数据
  const zeroGrayscaleData = useRequest(() => getGrayscaleListData("zero", zeroStart, `${zeroEnd} 23:59:59`)).data;
  // 一键生成正式发布
  const generateFormalZeroRelease = async () => {
    const sel_rows = zeroGrayscaleGridApi.current?.getSelectedRows();
    // 如果是待发布详情，则不需要判断有没有勾选
    if (zeroButtonTitle === "待发布详情") {
      history.push(`/onDutyAndRelease/officialRelease?releaseType=gray`);
    } else {
      if (sel_rows?.length === 0) {
        errorMessage("请先勾选需要发布的数据！")
        return;
      }
      const ready_release_num: any = [];
      sel_rows?.forEach((ele: any) => {
        ready_release_num.push(ele.ready_release_num);
      });

      // 需要在这个页面生成发布编号。只有成功了才跳转到详情界面
      const readyReleaseNum = ready_release_num.join("|");
      const onlineNum = await getOnlineProocessDetails(readyReleaseNum, "gray");
      if (onlineNum) {
        history.push(`/onDutyAndRelease/officialRelease?releaseType=gray&releaseNum=${readyReleaseNum}&onlineReleaseNum=${onlineNum}`);
      }
    }
  };

  // 刷新0级灰度发布
  const refreshZeroReleaseGrid = async () => {
    const girdDatas = await getGrayscaleListData("zero", zeroStart, `${zeroEnd} 23:59:59`);
    if (girdDatas.message !== "") {
      errorMessage((girdDatas.message).toString());
    } else {
      zeroGrayscaleGridApi.current?.setRowData(girdDatas?.data);
      setGridHeight({
        ...gridHeight,
        zeroGrid: (girdDatas?.data).length * 30 + 80,
      });
    }
  };

  // 根据时间查询
  const onZeroGrayReleaseTimeChanged = async (params: any, times: any) => {
    if (times[0]) {
      zeroStart = dayjs(times[0]).format("YYYY-MM-DD");
    }
    if (times[1]) {
      zeroEnd = dayjs(times[1]).format("YYYY-MM-DD");
    }
    // 更新数据
    await refreshZeroReleaseGrid();
  };

  /* endregion */

  /* region 1级灰度积压列表 */
  const firstGrayscaleGridApi = useRef<GridApi>();
  const onFirstGrayscaleGridReady = (params: GridReadyEvent) => {
    firstGrayscaleGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const [firstButtonTitle, setFirstButtonTitle] = useState("一键生成正式发布");  // 待发布详情
  // 1级灰度积压列表数据
  const firstGrayscaleData = useRequest(() => getGrayscaleListData("one", firstStart, `${firstEnd} 23:59:59`)).data;
  // 一键生成正式发布
  const generateFormalFirstRelease = async () => {
    const sel_rows = firstGrayscaleGridApi.current?.getSelectedRows();

    // 如果是待发布详情，则不需要判断有没有勾选
    if (firstButtonTitle === "待发布详情") {
      history.push(`/onDutyAndRelease/officialRelease?releaseType=online`);
    } else {
      if (sel_rows?.length === 0) {
        errorMessage("请先勾选需要发布的数据！")
        return;
      }
      const ready_release_num: any = [];
      sel_rows?.forEach((ele: any) => {
        ready_release_num.push(ele.ready_release_num);
      });

      // 需要在这个页面生成发布编号。只有成功了才跳转到详情界面
      const readyReleaseNum = ready_release_num.join("|");
      const onlineNum = await getOnlineProocessDetails(readyReleaseNum, "online");
      if (onlineNum) {
        history.push(`/onDutyAndRelease/officialRelease?releaseType=online&releaseNum=${readyReleaseNum}&onlineReleaseNum=${onlineNum}`);
      }
    }
  };

  // 刷新1级灰度发布列表
  const refreshFirstReleaseGrid = async () => {
    const girdDatas = await getGrayscaleListData("one", firstStart, `${firstEnd} 23:59:59`);
    if (girdDatas.message !== "") {
      errorMessage((girdDatas.message).toString());
    } else {
      firstGrayscaleGridApi.current?.setRowData(girdDatas?.data);
      setGridHeight({
        ...gridHeight,
        firstGrid: (girdDatas?.data).length * 30 + 80,
      });
    }
  };
  // 根据时间查询
  const onFirstGrayReleaseTimeChanged = async (params: any, times: any) => {
    if (times[0]) {
      firstStart = dayjs(times[0]).format("YYYY-MM-DD");
    }
    if (times[1]) {
      firstEnd = dayjs(times[1]).format("YYYY-MM-DD");
    }
    await refreshFirstReleaseGrid();
  };

  /* endregion */


  // 删除发布详情
  const confirmDelete = async (releaseType: string, params: any) => {
    const delResult = await delGrayReleaseHistory(params.ready_release_num);
    if (delResult.code === 200) {
      sucMessage("删除成功！")
      // 刷新数据
      if (releaseType === "zero") {
        await refreshZeroReleaseGrid();
      } else if (releaseType === "one") {
        await refreshFirstReleaseGrid();
      }
    }
  };

  // 操作按钮
  const grayListOperate = (releaseType: string, params: any) => {
    // 跳转到灰度发布详情
    const grayButton = <Button className={"operateButton"} onClick={() => gotoGrayReleasePage(params)}>
      <img src={"../gray_detail_normal.png"} width="20" height="20" alt="0级灰度发布过程详情" title="0级灰度发布过程详情"/>
    </Button>;

    // 删除功能
    const deleteButton =
      <Popconfirm
        placement="topRight"
        title={"已停留在灰度积压列表中，请谨慎核对,是否确认需要删除?"}
        onConfirm={() => {
          confirmDelete(releaseType, params?.data);
        }}
        okText="是"
        cancelText="否"
      >
        <Button className={"operateButton"} style={{marginLeft: -20}}>
          <img src="../delete.png" width="20" height="20" alt="删除发布详情" title="删除发布详情"/>
        </Button>
      </Popconfirm>;

    // 跳转到正式发布列表
    const firstGrayNum = params.data?.release_gray_num;
    let firstSrcPath = "../details_0.png";
    let firstButtonDisable = false;
    if (!firstGrayNum) {
      firstSrcPath = "../details_0_gray.png";
      firstButtonDisable = true;
    }

    const onlineButton =
      <Button style={{
        border: "none", backgroundColor: "transparent",
        fontSize: "small", color: "#46A0FC", marginLeft: -20
      }} disabled={firstButtonDisable}
              onClick={() => gotoFirstReleasePage(params)}>
        <img src={firstSrcPath} width="20" height="20" alt="1级灰度发布过程详情" title="1级灰度发布过程详情"/>
      </Button>;

    if (releaseType === "one") {
      return <div>
        {grayButton}
        {onlineButton}
        {deleteButton}
      </div>;
    } else {
      return <div>
        {grayButton}
        {deleteButton}
      </div>;
    }
  }

  /* endregion 灰度发布界面 */

  /* region 已正式发布列表 */
  const releasedGridApi = useRef<GridApi>();
  const onReleasedGridReady = (params: GridReadyEvent) => {
    releasedGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  // 项目名称
  const projectsArray = useRequest(() => loadPrjNameSelect()).data;

  // 正式发布列表数据
  const formalReleasedData = useRequest(() => getFormalListData(formalQueryCondition)).data;

  // 根据查询条件获取数据
  const getReleasedList = async () => {
    const cond: any = {
      page: 1,
      pageSize: 100
    };

    if (formalQueryCondition.start && formalQueryCondition.end) {
      cond.release_start_time = formalQueryCondition.start;
      cond.release_end_time = `${formalQueryCondition.end} 23:59:59`;
    }
    if (formalQueryCondition.project) {
      cond.project_id = formalQueryCondition.project;
    }
    const result = await getFormalListData(cond);
    releasedGridApi.current?.setRowData(result.data);
    setGridHeight({
      ...gridHeight,
      formalGrid: (result.data).length * 30 + 80
    })
  };

  // 根据项目获取
  const onProjectChanged = (params: any) => {
    let prjStr = "";
    if (params && params.length > 0) {
      params.forEach((ele: any) => {
        const prjNum = ele.split("&");
        prjStr = prjStr === "" ? prjNum[1] : `${prjStr},${prjNum[1]}`;
      });
    }

    formalQueryCondition.project = prjStr;
    getReleasedList();
  };

  // 根据时间获取
  const onReleaseProject = (params: any, times: any) => {
    formalQueryCondition.start = times[0] === "" ? "" : dayjs(times[0]).format("YYYY-MM-DD");
    formalQueryCondition.end = times[1] === "" ? "" : dayjs(times[1]).format("YYYY-MM-DD");
    getReleasedList();
  }

  const [modalInfo, setModalInfo] = useState({
    visible: false,
    title: "",
    content: ""
  });
  // 跳转到预发布界面
  const formalToReleasePage = (releData: any, gotoType: string) => {
    const detailsLinks: any = [];
    if (gotoType === "0级灰度发布详情") {  // 跳转到发布过程详情
      const releasedNums = releData.data?.ready_release_num;
      releasedNums.forEach((reInfo: any) => {
        detailsLinks.push(
          <p> {reInfo.ready_release_name}:
            <Link
              to={`/onDutyAndRelease/preRelease?releasedNum=${reInfo.ready_release_num}&history=true`}>{reInfo.ready_release_num}</Link>
          </p>);
      });
    } else if (gotoType === "1级灰度发布详情") { // 跳转到正式发布详情
      const releasedNums = releData.data?.release_gray_num;
      releasedNums.forEach((reInfo: any) => {
        detailsLinks.push(
          <p> {reInfo.release_gray_name}:
            <Link
              to={`/onDutyAndRelease/officialRelease?releaseType=gray&onlineReleaseNum=${reInfo.release_gray_num}&history=true`}>{reInfo.release_gray_num}</Link>
          </p>);
      });
    }
    setModalInfo({
      visible: true,
      title: gotoType,
      content: detailsLinks
    });
  }

  // 跳转到正式发布界面
  const gotoOnlineReleasePage = (releData: any) => {
    const onlineReleasedNum = releData.data?.online_release_num;
    history.push(`/onDutyAndRelease/officialRelease?releaseType=online&onlineReleaseNum=${onlineReleasedNum}&history=true`);
  };

  // 取消弹出框
  const handleCancel = () => {
    setModalInfo({
      visible: false,
      title: "",
      content: ""
    });
  }
  /* endregion */

  window.addEventListener('resize', () => {
    zeroGrayscaleGridApi.current?.sizeColumnsToFit();
    firstGrayscaleGridApi.current?.sizeColumnsToFit();
    releasedGridApi.current?.sizeColumnsToFit();
  });

  // 显示button title
  const showButtonTitle = async () => {
    const zeroResult = await vertifyOnlineProjectExit("gray");
    if (zeroResult) {
      // 0级灰度发布列表按钮title
      setZeroButtonTitle("待发布详情");
    }
    const firstResult = await vertifyOnlineProjectExit("online");
    if (firstResult) {
      setFirstButtonTitle("待发布详情");
    }
  };

  useEffect(() => {
    showButtonTitle();
    if (formalReleasedData?.data) {
      setGridHeight({
        ...gridHeight,
        formalGrid: (formalReleasedData?.data).length * 30 + 80
      });
    }
  }, [formalReleasedData]);

  useEffect(() => {
    // 设置表格高度
    if (zeroGrayscaleData?.data) {
      setGridHeight({
        ...gridHeight,
        zeroGrid: (zeroGrayscaleData?.data).length * 30 + 80,
      });
    }

    if (firstGrayscaleData?.data) {
      setGridHeight({
        ...gridHeight,
        firstGrid: (firstGrayscaleData?.data).length * 30 + 80,
      });
    }

  }, [zeroGrayscaleData, firstGrayscaleData]);


  return (
    <PageContainer>
      {/* 0级灰度积压列表 */}
      <div style={{marginTop: -20}}>
        <div style={gridHeadDivStyle}> &nbsp;
          <label style={{fontWeight: "bold", float: "left"}}>0级灰度发布列表</label>
          <Button type="text" onClick={generateFormalZeroRelease} style={{float: "right"}}>
            <img src="../pushMessage.png" width="25" height="25" alt="一键生成1级灰度发布"
                 title="一键生成1级灰度发布"/> &nbsp;{zeroButtonTitle}
          </Button>
          <div style={{float: "right"}}>
            <label style={{marginLeft: 10}}>发布时间: </label>
            <RangePicker style={{marginLeft: 5}} size={"small"} defaultValue={[moment(zeroStart), moment(zeroEnd)]}
                         onChange={onZeroGrayReleaseTimeChanged}/>
          </div>
        </div>
        <button></button>
        <div className="ag-theme-alpine"
             style={{marginTop: -21, height: gridHeight.zeroGrid, width: '100%'}}>
          <AgGridReact
            columnDefs={grayscaleBacklogList()} // 定义列
            rowData={zeroGrayscaleData?.data} // 数据绑定
            defaultColDef={girdDefaultSetting}
            rowHeight={30}
            headerHeight={35}
            rowSelection={'multiple'} // 设置多行选中
            suppressRowTransform={true}
            onGridReady={onZeroGrayscaleGridReady}
            frameworkComponents={{
              grayReleaseDetails: (params: any) => {
                return grayListOperate("zero", params);
              }
            }}>
          </AgGridReact>
        </div>
      </div>

      {/* 1级灰度积压列表 */}
      <div style={{marginTop: 20}}>
        <div style={gridHeadDivStyle}> &nbsp;
          <label style={{fontWeight: "bold", float: "left"}}>1级灰度发布列表</label>
          <Button type="text" onClick={generateFormalFirstRelease} style={{float: "right"}}>
            <img src="../pushMessage.png" width="25" height="25" alt="一键生成正式发布"
                 title="一键生成正式发布"/> &nbsp;{firstButtonTitle}
          </Button>
          <div style={{float: "right"}}>
            <label style={{marginLeft: 10}}>发布时间: </label>
            <RangePicker style={{marginLeft: 5}} size={"small"} defaultValue={[moment(firstStart), moment(firstEnd)]}
                         onChange={onFirstGrayReleaseTimeChanged}/>
          </div>
        </div>
        <button></button>
        <div className="ag-theme-alpine"
             style={{marginTop: -21, height: gridHeight.firstGrid, width: '100%'}}>
          <AgGridReact
            columnDefs={grayscaleBacklogList()} // 定义列
            rowData={firstGrayscaleData?.data} // 数据绑定
            defaultColDef={girdDefaultSetting}
            rowHeight={30}
            headerHeight={35}
            rowSelection={'multiple'} // 设置多行选中
            suppressRowTransform={true}
            onGridReady={onFirstGrayscaleGridReady}
            frameworkComponents={{
              grayReleaseDetails: (params: any) => {
                return grayListOperate("one", params);
              }
            }}>
          </AgGridReact>
        </div>
      </div>

      {/*  已正式发布列表 */}
      <div style={{marginTop: 20}}>
        <div style={gridHeadDivStyle}>
          <label style={{fontWeight: "bold", float: "left"}}>已正式发布列表</label>
          <div style={{textAlign: "right"}}>
            <label> 项目名称:</label>
            <Select size={"small"} showSearch mode="multiple" onChange={onProjectChanged}
                    style={{minWidth: 300, marginLeft: 5}}>
              {projectsArray}
            </Select>
            <label style={{marginLeft: 10}}>发布时间: </label>
            <RangePicker style={{marginLeft: 5}} size={"small"}
                         defaultValue={[moment(formalQueryCondition.start), moment(formalQueryCondition.end)]}
                         onChange={onReleaseProject}/>
          </div>
        </div>

        <button></button>
        <div className="ag-theme-alpine" style={{marginTop: -21, height: gridHeight.formalGrid, width: '100%'}}>
          <AgGridReact
            columnDefs={releasedList()} // 定义列
            rowData={formalReleasedData?.data} // 数据绑定
            defaultColDef={girdDefaultSetting}
            rowHeight={30}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onReleasedGridReady}
            frameworkComponents={{
              officialReleaseDetails: (params: any) => {
                // 如果ready_release_num 数组中只有一个值，需要和online_release_num进行对比，如果值相同，则只显示发布过程详情。1级灰度和正式发布详情不能进行跳转。
                let firstSrcPath = "../details_0.png"; // 1级灰度跳转图标
                let firstButtonDisable = false;
                let onlineSrcPath = "../formal_detail.png";  // 正式发布详情图标
                let buttonDisable = false;
                const {ready_release_num, release_gray_num, online_release_num} = params.data;
                if (ready_release_num && ready_release_num === 1) {
                  if (ready_release_num[0].ready_release_num === online_release_num) {
                    firstButtonDisable = true;
                    buttonDisable = true;
                  }
                } else {
                  // 1级发布
                  if (!release_gray_num || release_gray_num.length === 0) {
                    firstSrcPath = "../details_0_gray.png";
                    firstButtonDisable = true;
                  }
                  // 正式发布
                  if (!online_release_num) {
                    onlineSrcPath = "../formal_detail_gray.png";
                    buttonDisable = true;
                  }
                }
                return (
                  <div>
                    <Button
                      className={"operateButton"}     // ready_release_num
                      onClick={() => formalToReleasePage(params, "0级灰度发布详情")}>
                      <img src={"../gray_detail_normal.png"} width="20" height="20" alt="0级灰度发布详情" title="0级灰度发布详情"/>
                    </Button>
                    <Button
                      disabled={firstButtonDisable}   // release_gray_num
                      style={{
                        border: "none", backgroundColor: "transparent",
                        fontSize: "small", color: "#46A0FC", marginLeft: -20
                      }}
                      onClick={() => formalToReleasePage(params, "1级灰度发布详情")}>
                      <img src={firstSrcPath} width="20" height="20" alt="1级灰度发布详情" title="1级灰度发布详情"/>
                    </Button>
                    <Button
                      disabled={buttonDisable} // online_release_num
                      style={{
                        border: "none", backgroundColor: "transparent", fontSize: "small",
                        color: "#46A0FC", marginLeft: -20
                      }}
                      onClick={() => gotoOnlineReleasePage(params)}>
                      <img src={onlineSrcPath} width="20" height="20" alt="正式发布详情" title="正式发布详情"/>
                    </Button>
                  </div>
                )
              }
            }}
          >
          </AgGridReact>
        </div>
      </div>

      {/*详情跳转选择 */}
      <div>
        <Modal title={modalInfo.title} visible={modalInfo.visible} onCancel={handleCancel} footer={null}
               centered={true}>
          {modalInfo.content}
        </Modal>
      </div>

    </PageContainer>
  );
};


export default ReleaseHistory;
