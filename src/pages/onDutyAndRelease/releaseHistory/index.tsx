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
import {Button} from "antd";


/* endregion */

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
      field: 'kind'
    }];
  };

  const releasedData = useRequest(() => getGrayscaleListData({
    release_type: "2",
    release_start_time: "",
    release_end_time: ""
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
        </div>


        <div className="ag-theme-alpine" style={{height:  gridHeight(releasedData?.data), width: '100%'}}>
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
