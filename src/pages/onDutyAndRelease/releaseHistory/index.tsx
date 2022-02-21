import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {useRequest} from "ahooks";
import {getGrayscaleListData} from './apiPage';

import {history} from "@@/core/history";
import {Button, Col, DatePicker, Form, Row, Select} from "antd";
import {loadPrjNameSelect} from "@/pages/onDutyAndRelease/preRelease/comControl/controler";
import dayjs from "dayjs";
import moment from 'moment';

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
  window.addEventListener('resize', () => {
    grayscaleGridApi.current?.sizeColumnsToFit();
  });

  const grayscaleData = useRequest(() => getGrayscaleListData({release_type: "1"})).data;

  // 发布详情
  (window as any).releaseProcessDetail = (releasedNum: string) => {
    if (releasedNum === "") {
      history.push(`/onDutyAndRelease/preRelease`);
    } else {
      history.push(`/onDutyAndRelease/preRelease?releasedNum=${releasedNum}`);
    }

  };

  const grayscaleBacklogList = () => {
    const column: any = [{
      headerName: '序号',
      maxWidth: 80,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    }, {
      headerName: '灰度发布批次号',
      field: 'ready_release_num',
      minWidth: 125,
      maxWidth: 150
    }, {
      headerName: '灰度发布名称',
      field: 'ready_release_name',
      minWidth: 145
    }, {
      headerName: '工单编号',
      field: 'order',
      minWidth: 100,
    }, {
      headerName: '项目名称',
      field: 'project_name'
    }, {
      headerName: '发布环境',
      field: 'online_environment'
    }, {
      headerName: '发布镜像ID',
      field: 'deployment_id',
    }, {
      headerName: '发布分支',
      field: 'branch'
    }, {
      headerName: '灰度发布时间',
      field: 'plan_release_time',
      maxWidth: 185
    }, {
      headerName: '操作',
      cellRenderer: (params: any) => {
        const readyReleaseNum = params.data?.ready_release_num;
        return `
        <div style="margin-top: -5px">
             <Button  style="border: none; background-color: transparent; font-size: small; color: #46A0FC" onclick='releaseProcessDetail(${JSON.stringify(readyReleaseNum)})'>
                <img src="../logs.png" width="20" height="20" alt="灰度发布过程详情" title="灰度发布过程详情" />
            </Button>
        </div>
            `;
      }
    }];

    return column;

  };

  // 一键生成正式发布
  const generateFormalRelease = () => {


  };
  /* endregion */

  /* region 已正式发布列表 */

  const releasedList = () => {
    return [{
      headerName: '序号',
      maxWidth: 80,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    }, {
      headerName: '正式发布批次号',
      field: 'ready_release_num',
      minWidth: 125,
      maxWidth: 150
    }, {
      headerName: '发布名称',
      field: 'ready_release_name',
      minWidth: 145
    }, {
      headerName: '工单编号',
      field: 'order',
      minWidth: 100,
    }, {
      headerName: '项目名称',
      field: 'project_name'
    }, {
      headerName: '发布环境',
      field: 'online_environment'
    }, {
      headerName: '发布镜像ID',
      field: 'deployment_id'
    }, {
      headerName: '发布分支',
      field: 'branch'
    }, {
      headerName: '正式发布时间',
      field: 'plan_release_time'
    }, {
      headerName: '操作',
      cellRenderer: (params: any) => {
        const readyReleaseNum = params.data?.ready_release_num;
        return `
        <div style="margin-top: -5px">
             <Button  style="border: none; background-color: transparent; font-size: small; color: #46A0FC" onclick='releaseProcessDetail(${JSON.stringify(readyReleaseNum)})'>
                <img src="../logs.png" width="20" height="20" alt="正式发布过程详情" title="正式发布过程详情" />
            </Button>
        </div>
            `;
      }
    }];
  };
  const projectsArray = useRequest(() => loadPrjNameSelect()).data;

  const releasedData = useRequest(() => getGrayscaleListData({
    release_type: "2",
    release_start_time: queryCondition.start,
    release_end_time: queryCondition.end
  })).data;

  const releasedGridApi = useRef<GridApi>();

  const onReleasedGridReady = (params: GridReadyEvent) => {
    releasedGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  if (releasedGridApi.current) {
    // if (loading) releasedGridApi.current.showLoadingOverlay();
    // else releasedGridApi.current.hideOverlay();
  }

  // 获取数据
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
    releasedGridApi.current?.setRowData(result.data)
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

  const gridHeight = (datas: any) => {
    let height = 100;
    if (datas && datas.length > 0) {
      height = (datas.length * 30) + 60
    }
    return height;
  }

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
        <div style={{
          height: "35px", lineHeight: "35px", verticalAlign: "middle",
          textAlign: "left", backgroundColor: "#F8F8F8", width: '100%',
          border: "solid 1px #CCCCCC"
        }}>&nbsp;
          <label style={{fontWeight: "bold"}}>已正式发布列表</label>

          <div style={{float: "right"}}>
            <Row>
              <Col span={12}>
                <Form.Item label="项目名称:" name="projectsName" style={{width: 400}}>
                  <Select size={"small"} showSearch mode="multiple" onChange={onProjectChanged}>
                    {projectsArray}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                {/* 发布类型 */}
                <Form.Item label="发布时间:" name="pulishTime" style={{width: 430}}>
                  <RangePicker size={"small"} defaultValue={[moment(queryCondition.start), moment(queryCondition.end)]}
                               onChange={onReleaseProject}/>
                </Form.Item>
              </Col>

            </Row>

          </div>
        </div>
        <div></div>
        <button></button>
        <div className="ag-theme-alpine"
             style={{height: gridHeight(releasedData?.data), width: '100%'}}>
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

    </PageContainer>
  );
};

export default ReleaseHistory;
