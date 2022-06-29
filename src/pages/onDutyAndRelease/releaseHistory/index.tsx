import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {useRequest} from "ahooks";
import {getGrayscaleListData, getFormalListData, vertifyOnlineProjectExit} from './axiosRequest/apiPage';
import {history} from "@@/core/history";
import {Button, DatePicker, Select} from "antd";
import {loadPrjNameSelect} from "@/pages/onDutyAndRelease/preRelease/comControl/controler";
import dayjs from "dayjs";
import moment from 'moment';
import {grayscaleBacklogList, releasedList} from './gridSet';
import {errorMessage} from "@/publicMethods/showMessages";
import {getHeight} from "@/publicMethods/pageSet";

const {RangePicker} = DatePicker;
const formalQueryCondition = {
  start: dayjs().subtract(7, 'day').format("YYYY-MM-DD HH:mm:ss"),
  end: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  project: "",
  page: 1, // 跳转到第几页
  pageSize: 10  // 一页显示多少条数据
}
const start = dayjs().subtract(30, 'day').format("YYYY-MM-DD HH:mm:ss");
const end = dayjs().format("YYYY-MM-DD HH:mm:ss");

const ReleaseHistory: React.FC<any> = () => {

  /* region 灰度积压列表 */
  const grayscaleGridApi = useRef<GridApi>();
  const onGrayscaleGridReady = (params: GridReadyEvent) => {
    grayscaleGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const [buttonTitle, setButtonTitle] = useState("一键生成正式发布");  // 待发布详情
  // 积压列表数据
  const grayscaleData = useRequest(() => getGrayscaleListData(start, end)).data;
  // 根据时间查询
  const onGrayReleaseTimeChanged = async (params: any, times: any) => {
    const grayReleaseList = await getGrayscaleListData(dayjs(times[0]).format("YYYY-MM-DD HH:mm:ss"), dayjs(times[1]).format("YYYY-MM-DD HH:mm:ss"));
    grayscaleGridApi.current?.setRowData(grayReleaseList);
  };
  // 一键生成正式发布
  const generateFormalRelease = () => {
    const sel_rows = grayscaleGridApi.current?.getSelectedRows();

    // 如果是待发布详情，则不需要判断有没有勾选
    if (buttonTitle === "待发布详情") {
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

      history.push(`/onDutyAndRelease/officialRelease?releaseNum=${ready_release_num.join("|")}`);
    }
  };

  /* endregion */

  /* region 已正式发布列表 */
  const releasedGridApi = useRef<GridApi>();
  const onReleasedGridReady = (params: GridReadyEvent) => {
    releasedGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };


  // 项目名称
  const projectsArray = useRequest(() => loadPrjNameSelect()).data;

  // 正式发布列表数据
  const releasedData = useRequest(() => getFormalListData(formalQueryCondition)).data;

  // 根据查询条件获取数据
  const getReleasedList = async () => {
    const cond = {
      page: 1,
      pageSize: 10
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

  /* endregion */

  // 灰度和正式发布详情页面跳转
  const releaseProcessDetail = (releData: any, type: string) => {
    const releasedNum = releData.data?.ready_release_num;

    if (releasedNum !== "") {
      if (type === "gray") {
        history.push(`/onDutyAndRelease/preRelease?releasedNum=${releasedNum}&history=true`);
      } else {
        history.push(`/onDutyAndRelease/officialRelease?releasedNum=${releasedNum}&history=true`);
      }
    }
  };

  window.addEventListener('resize', () => {
    grayscaleGridApi.current?.sizeColumnsToFit();
    releasedGridApi.current?.sizeColumnsToFit();
  });

  // 显示button title
  const showButtonTitle = async () => {
    const result = await vertifyOnlineProjectExit();
    if (result) {
      setButtonTitle("待发布详情");
    }
  }
  useEffect(() => {
    showButtonTitle();
  }, [releasedData]);
  return (
    <PageContainer>
      {/* 灰度积压列表 */}
      <div style={{marginTop: -20}}>
        <div style={{
          height: "35px", lineHeight: "35px", verticalAlign: "middle",
          textAlign: "left", backgroundColor: "#F8F8F8", width: '100%',
          border: "solid 1px #CCCCCC"
        }}> &nbsp;
          <Button type="text" onClick={generateFormalRelease} style={{float: "right"}}>
            <img src="../pushMessage.png" width="25" height="25" alt="一键生成正式发布" title="一键生成正式发布"/> &nbsp;{buttonTitle}
          </Button>
          <div style={{float: "right"}}>
            <label style={{marginLeft: 10}}>发布时间: </label>
            <RangePicker style={{marginLeft: 5}} size={"small"} defaultValue={[moment(start), moment(end)]}
                         onChange={onGrayReleaseTimeChanged}/>
          </div>
        </div>
        <button></button>
        <div className="ag-theme-alpine"
             style={{marginTop: -21, height: getHeight() / 2, width: '100%'}}>
          <AgGridReact
            columnDefs={grayscaleBacklogList()} // 定义列
            rowData={grayscaleData?.data} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              suppressMenu: true,
              cellStyle: {'line-height': '30px'},
            }}
            rowHeight={30}
            headerHeight={35}
            rowSelection={'multiple'} // 设置多行选中
            suppressRowTransform={true}
            onGridReady={onGrayscaleGridReady}
            frameworkComponents={{
              grayReleaseDetails: (params: any) => {
                return (
                  <Button style={{border: "none", backgroundColor: "transparent", fontSize: "small", color: "#46A0FC"}}
                          onClick={() => releaseProcessDetail(params, "gray")}>
                    <img src="../gray_detail_normal.png" width="20" height="20" alt="灰度发布过程详情" title="灰度发布过程详情"/>
                  </Button>)
              }
            }}>
          </AgGridReact>
        </div>
      </div>

      {/*  已正式发布列表 */}
      <div style={{marginTop: 20}}>
        <div style={{
          height: "35px", lineHeight: "35px",
          width: "100%", backgroundColor: "#F8F8F8",
          border: "solid 1px #CCCCCC",
        }}>
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
        <div className="ag-theme-alpine" style={{marginTop: -21, height: getHeight() / 2, width: '100%'}}>
          <AgGridReact
            columnDefs={releasedList()} // 定义列
            rowData={releasedData?.data} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              suppressMenu: true,
              cellStyle: {'line-height': '30px'},
            }}
            rowHeight={30}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onReleasedGridReady}
            frameworkComponents={{
              officialReleaseDetails: (params: any) => {
                return (
                  <div>
                    <Button
                      style={{border: "none", backgroundColor: "transparent", fontSize: "small", color: "#46A0FC"}}
                      onClick={() => releaseProcessDetail(params, "gray")}>
                      <img src="../gray_detail_forbit.png" width="20" height="20" alt="灰度发布过程详情" title="灰度发布过程详情"/>
                    </Button>
                    <Button
                      style={{border: "none", backgroundColor: "transparent", fontSize: "small", color: "#46A0FC"}}
                      onClick={() => releaseProcessDetail(params, "official")}>
                      <img src="../formal_detail.png" width="20" height="20" alt="正式发布过程详情" title="正式发布过程详情"/>
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
