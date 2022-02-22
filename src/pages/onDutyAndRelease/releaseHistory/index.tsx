import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {useRequest} from "ahooks";
import {getGrayscaleListData} from './axiosRequest/apiPage';
import {history} from "@@/core/history";
import {Button, Col, DatePicker, Form, Row, Select} from "antd";
import {loadPrjNameSelect} from "@/pages/onDutyAndRelease/preRelease/comControl/controler";
import dayjs from "dayjs";
import moment from 'moment';
import {gridHeight, grayscaleBacklogList, releasedList} from './gridSet';

const {RangePicker} = DatePicker;

const queryCondition = {
  start: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  end: dayjs().subtract(7, 'day').format("YYYY-MM-DD HH:mm:ss"),
  project: ""
}
const ReleaseHistory: React.FC<any> = () => {

  /* region 灰度积压列表 */
  const grayscaleGridApi = useRef<GridApi>();
  const onGrayscaleGridReady = (params: GridReadyEvent) => {
    grayscaleGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  // 积压列表数据
  const grayscaleData = useRequest(() => getGrayscaleListData({release_type: "1"})).data;

  // 一键生成正式发布
  const generateFormalRelease = () => {


  };
  /* endregion */

  /* region 已正式发布列表 */
  const releasedGridApi = useRef<GridApi>();
  const onReleasedGridReady = (params: GridReadyEvent) => {
    releasedGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  // 表格高度
  const [releasedGridHight, setReleasedGridHight] = useState(100);

  // 项目名称
  const projectsArray = useRequest(() => loadPrjNameSelect()).data;

  // 正式发布列表数据
  const releasedData = useRequest(() => getGrayscaleListData({
    release_type: "2",
    release_start_time: queryCondition.start,
    release_end_time: queryCondition.end
  })).data;

  // 根据查询条件获取数据
  const getReleasedList = async () => {
    const cond = {release_type: "2"};

    if (queryCondition.start && queryCondition.end) {
      cond["release_start_time"] = queryCondition.start;
      cond["release_end_time"] = queryCondition.end;
    }
    if (queryCondition.project) {
      cond["project_id"] = queryCondition.project;
    }
    const result = await getGrayscaleListData(cond);
    releasedGridApi.current?.setRowData(result.data);
    setReleasedGridHight(gridHeight(result?.data))
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

    queryCondition.project = prjStr;
    getReleasedList();
  };

  // 根据时间获取
  const onReleaseProject = (params: any, times: any) => {
    queryCondition.start = times[0] === "" ? "" : dayjs(times[0]).format("YYYY-MM-DD HH:mm:ss");
    queryCondition.end = times[1] === "" ? "" : dayjs(times[1]).format("YYYY-MM-DD HH:mm:ss");
    getReleasedList();

  }

  /* endregion */

  // 发布详情
  (window as any).releaseProcessDetail = (releasedNum: string) => {
    if (releasedNum === "") {
      history.push(`/onDutyAndRelease/preRelease`);
    } else {
      history.push(`/onDutyAndRelease/preRelease?releasedNum=${releasedNum}`);
    }

  };

  window.addEventListener('resize', () => {
    grayscaleGridApi.current?.sizeColumnsToFit();
    releasedGridApi.current?.sizeColumnsToFit();
  });

  useEffect(() => {
    setReleasedGridHight(gridHeight(releasedData?.data))
  }, [releasedData]);
  return (
    <PageContainer>
      {/* 灰度积压列表 */}
      <div>
        <div style={{
          height: "35px", lineHeight: "35px", verticalAlign: "middle",
          textAlign: "left", backgroundColor: "#F8F8F8", width: '100%',
          border: "solid 1px #CCCCCC"
        }}> &nbsp;

          <label style={{fontWeight: "bold",}}>灰度积压列表 </label>
          <Button type="text" onClick={generateFormalRelease}
                  style={{
                    float: "right"
                    // display: judgeAuthorityByName("addDutyMsgPush") === true ? "inline" : "none"
                  }}>
            <img src="../pushMessage.png" width="25" height="25" alt="一键生成正式发布" title="一键生成正式发布"/> &nbsp;一键生成正式发布
          </Button>
        </div>

        <div className="ag-theme-alpine" style={{height: gridHeight(grayscaleData?.data), width: '100%'}}>
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
            suppressRowTransform={true}
            onGridReady={onGrayscaleGridReady}
          >
          </AgGridReact>
        </div>
      </div>

      {/*  已正式发布列表 */}
      <div style={{marginTop: 20}}>
        <div
          style={{
            height: "35px",
            lineHeight: "35px",
            width: "100%",
            backgroundColor: "#F8F8F8",
            border: "solid 1px #CCCCCC",
          }}
        >
          <label style={{fontWeight: "bold", float: "left"}}>已正式发布列表</label>
          {/* 发布类型 */}
          <Form.Item label="发布时间:" name="pulishTime" style={{float: "right",marginLeft:10}}>
            <RangePicker size={"small"} defaultValue={[moment(queryCondition.start), moment(queryCondition.end)]}
                         onChange={onReleaseProject}/>
          </Form.Item>
          <Form.Item label="项目名称:" name="projectsName"
                     style={{float: "right", minWidth: 300}}>
            <Select size={"small"} showSearch mode="multiple" onChange={onProjectChanged}>
              {projectsArray}
            </Select>
          </Form.Item>
        </div>
        <div style={{clear: "right"}}>
          <div className="ag-theme-alpine" style={{height: releasedGridHight, width: '100%'}}>
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
            >
            </AgGridReact>
          </div>
        </div>

      </div>

    </PageContainer>
  );
};

export default ReleaseHistory;
