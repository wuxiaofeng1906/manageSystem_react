import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {useRequest} from "ahooks";
import {
  getGrayscaleListData, getFormalListData, vertifyOnlineProjectExit, getOnlineProocessDetails
} from './axiosRequest/apiPage';
import {history} from "@@/core/history";
import {Button, DatePicker, Select, Popconfirm} from "antd";
import {loadPrjNameSelect} from "@/pages/onDutyAndRelease/preRelease/comControl/controler";
import dayjs from "dayjs";
import moment from 'moment';
import {grayscaleBacklogList, releasedList} from './gridSet';
import {errorMessage} from "@/publicMethods/showMessages";
import {getHeight} from "@/publicMethods/pageSet";
import {gridHeadDivStyle, girdDefaultSetting} from "./commonSetting";
import "./style.css";

const {RangePicker} = DatePicker;
const formalQueryCondition = {
  start: dayjs().subtract(7, 'day').format("YYYY-MM-DD HH:mm:ss"),
  end: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  project: "",
  page: 1, // 跳转到第几页
  pageSize: 100  // 一页显示多少条数据
}
const start = dayjs().subtract(30, 'day').format("YYYY-MM-DD HH:mm:ss");
const end = dayjs().format("YYYY-MM-DD HH:mm:ss");

const ReleaseHistory: React.FC<any> = () => {
  const [gridHeight, setGridHeight] = useState({
    zeroGrid: 100,
    firstGrid: 100,
    formalGrid: 100
  });

  /* region 灰度发布界面 */

  /* region 0级灰度积压列表 */
  const zeroGrayscaleGridApi = useRef<GridApi>();
  const onZeroGrayscaleGridReady = (params: GridReadyEvent) => {
    zeroGrayscaleGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const [zeroButtonTitle, setZeroButtonTitle] = useState("一键生成1级灰度发布");  // 待发布详情
  // 0级灰度积压列表数据
  const zeroGrayscaleData = useRequest(() => getGrayscaleListData(start, end)).data;
  // 根据时间查询
  const onZeroGrayReleaseTimeChanged = async (params: any, times: any) => {
    let startTimes = times[0];
    if (startTimes) {
      startTimes = dayjs(start).format("YYYY-MM-DD HH:mm:ss");
    }
    let endTimes = times[1];
    if (endTimes) {
      endTimes = dayjs(end).format("YYYY-MM-DD HH:mm:ss");
    }
    const grayReleaseList = await getGrayscaleListData(startTimes, endTimes);
    zeroGrayscaleGridApi.current?.setRowData(grayReleaseList?.data);
  };
  // 一键生成正式发布
  const generateFormalZeroRelease = async () => {
    const sel_rows = zeroGrayscaleGridApi.current?.getSelectedRows();

    // 如果是待发布详情，则不需要判断有没有勾选
    if (zeroButtonTitle === "待发布详情") {
      history.push(`/onDutyAndRelease/officialRelease`);
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
      const onlineNum = await getOnlineProocessDetails(readyReleaseNum);
      if (onlineNum) {
        history.push(`/onDutyAndRelease/officialRelease?releaseNum=${readyReleaseNum}&onlineReleaseNum=${onlineNum}`);
      }
    }
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
  const firstGrayscaleData = useRequest(() => getGrayscaleListData(start, end)).data;
  // 根据时间查询
  const onFirstGrayReleaseTimeChanged = async (params: any, times: any) => {
    let startTimes = times[0];
    if (startTimes) {
      startTimes = dayjs(start).format("YYYY-MM-DD HH:mm:ss");
    }
    let endTimes = times[1];
    if (endTimes) {
      endTimes = dayjs(end).format("YYYY-MM-DD HH:mm:ss");
    }
    const grayReleaseList = await getGrayscaleListData(startTimes, endTimes);
    zeroGrayscaleGridApi.current?.setRowData(grayReleaseList?.data);
  };
  // 一键生成正式发布
  const generateFormalFirstRelease = async () => {
    const sel_rows = zeroGrayscaleGridApi.current?.getSelectedRows();

    // 如果是待发布详情，则不需要判断有没有勾选
    if (zeroButtonTitle === "待发布详情") {
      history.push(`/onDutyAndRelease/officialRelease`);
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
      const onlineNum = await getOnlineProocessDetails(readyReleaseNum);
      if (onlineNum) {
        history.push(`/onDutyAndRelease/officialRelease?releaseNum=${readyReleaseNum}&onlineReleaseNum=${onlineNum}`);
      }
    }
  };
  /* endregion */

  // 跳转到灰度界面
  const gotoGrayReleasePage = (releData: any) => {
    const releasedNum = releData.data?.ready_release_num;
    history.push(`/onDutyAndRelease/preRelease?releasedNum=${releasedNum}&history=true`);
  };

  // 删除发布详情
  const confirmDelete = (params: any) => {
    console.log(params);
  };

  // 操作按钮
  const grayListOperate = (params: any) => {
    return <div>
      <Button className={"operateButton"}
              onClick={() => gotoGrayReleasePage(params)}>
        <img src="../gray_detail_normal.png" width="20" height="20" alt="发布过程详情" title="发布过程详情"/>
      </Button>
      <Popconfirm
        placement="topRight"
        title={"已停留在灰度积压列表中，请谨慎核对是否需要删除?"}
        onConfirm={() => {
          confirmDelete(params?.data);
        }}
        okText="是"
        cancelText="否"
      >
        <Button className={"operateButton"} style={{marginLeft: -20}}>
          <img src="../delete.png" width="20" height="20" alt="删除发布详情" title="删除发布详情"/>
        </Button>
      </Popconfirm>
    </div>;
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
    const cond = {
      page: 1,
      pageSize: 100
    };

    if (formalQueryCondition.start && formalQueryCondition.end) {
      cond["release_start_time"] = formalQueryCondition.start;
      cond["release_end_time"] = formalQueryCondition.end;
    }
    if (formalQueryCondition.project) {
      cond["project_id"] = formalQueryCondition.project;
    }
    const result = await getFormalListData(cond);
    releasedGridApi.current?.setRowData(result.data);

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
    formalQueryCondition.start = times[0] === "" ? "" : dayjs(times[0]).format("YYYY-MM-DD HH:mm:ss");
    formalQueryCondition.end = times[1] === "" ? "" : dayjs(times[1]).format("YYYY-MM-DD HH:mm:ss");
    getReleasedList();
  }

  // 跳转到正式发布界面
  const gotoOnlineReleasePage = (releData: any) => {
    const onlineReleasedNum = releData.data?.online_release_num;
    history.push(`/onDutyAndRelease/officialRelease?onlineReleaseNum=${onlineReleasedNum}&history=true`);
  };
  /* endregion */

  window.addEventListener('resize', () => {
    zeroGrayscaleGridApi.current?.sizeColumnsToFit();
    firstGrayscaleGridApi.current?.sizeColumnsToFit();
    releasedGridApi.current?.sizeColumnsToFit();
  });

  // 显示button title
  const showButtonTitle = async () => {
    const result = await vertifyOnlineProjectExit();

    if (result) {
      // 0级灰度发布列表按钮title
      setZeroButtonTitle("待发布详情");

      //   1级灰度发布列表按钮title
      setFirstButtonTitle("待发布详情");
    }
  };
  useEffect(() => {
    showButtonTitle();

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
    if (formalReleasedData?.data) {
      setGridHeight({
        ...gridHeight,
        formalGrid: (formalReleasedData?.data).length * 30 + 80
      });
    }
  }, [zeroGrayscaleData, firstGrayscaleData, formalReleasedData]);


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
            <RangePicker style={{marginLeft: 5}} size={"small"} defaultValue={[moment(start), moment(end)]}
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
                return grayListOperate(params);
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
            <RangePicker style={{marginLeft: 5}} size={"small"} defaultValue={[moment(start), moment(end)]}
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
                return grayListOperate(params);
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

                // 发布过程详情都可以跳转，正式发布详情需要判断。
                const onlineNum = params.data?.online_release_num; // 为空。就可以跳到发布过程详情
                // 需要判断有没有灰度，没有则置灰
                // let srcPath = "../gray_detail_normal.png";
                // let buttonDisable = false;
                // if (onlineNum) {
                //   srcPath = "../gray_detail_forbit.png";
                //   buttonDisable = true;
                // }

                let srcPath = "../formal_detail.png";
                let buttonDisable = false;
                if (!onlineNum) {
                  srcPath = "../formal_detail_gray.png";
                  buttonDisable = true;
                }

                return (
                  <div>
                    <Button
                      style={{border: "none", backgroundColor: "transparent", fontSize: "small", color: "#46A0FC"}}
                      onClick={() => gotoGrayReleasePage(params)}>
                      <img src={"../gray_detail_normal.png"} width="20" height="20" alt="发布过程详情" title="发布过程详情"/>
                    </Button>
                    <Button
                      disabled={buttonDisable}
                      style={{border: "none", backgroundColor: "transparent", fontSize: "small", color: "#46A0FC"}}
                      onClick={() => gotoOnlineReleasePage(params)}>
                      <img src={srcPath} width="20" height="20" alt="正式发布详情" title="正式发布详情"/>
                    </Button>
                  </div>
                )
              }
            }}
          >
          </AgGridReact>
        </div>
      </div>

    </PageContainer>
  );
};


export default ReleaseHistory;
