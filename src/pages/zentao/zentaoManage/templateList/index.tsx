import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {useRequest} from 'ahooks';
import {Card, Button, message, Form, Select, Row, Col, InputNumber, Spin} from 'antd';
import {getTempColumns} from './gridMethod/columns';
import {getHeight} from "@/publicMethods/pageSet";
import {DeleteTwoTone, FolderAddTwoTone, ProfileTwoTone, DownloadOutlined} from "@ant-design/icons";


// 组件初始化
const ZentaoTemplateList: React.FC<any> = () => {

  /* region 表格事件 */
  const [gridHeight, setGridHeight] = useState(getHeight());
  const gridApi = useRef<GridApi>();
  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  window.onresize = function () {
    setGridHeight(getHeight());
    gridApi.current?.sizeColumnsToFit();
  };

  /* endregion 表格事件 */

  /* region 增删改查 */
  const add = () => {

  };
  const del = () => {

  };

  /* endregion 增删改查 */

  /* region 生成任务 */
  const generateTask = () => {

  };


  /* endregion 生成任务 */

  /* region 下载模板 */
  const downloadTemplate = () => {

  };

  /* endregion 下载模板 */

  return (
    <PageContainer>
      {/* 按钮栏 */}
      <div style={{background: 'white', marginTop: -20}}>
        <Button type="text" icon={<FolderAddTwoTone/>} size={'middle'}
                onClick={add}>新增</Button>
        <Button type="text" icon={<DeleteTwoTone/>} size={'middle'}
                onClick={del}>删除</Button>
        <Button type="text" style={{float: "right", color: "#46A0FC"}} icon={<DownloadOutlined/>} size={'middle'}
                onClick={downloadTemplate}><label style={{color: "black"}}>下载模板</label></Button>
        <Button type="text" style={{float: "right"}} icon={<ProfileTwoTone/>} size={'middle'}
                onClick={generateTask}>生成任务</Button>
      </div>


      {/* 模板列表 */}
      <div>
        <div className="ag-theme-alpine" style={{height: gridHeight, width: '100%'}}>
          <AgGridReact
            columnDefs={getTempColumns()} // 定义列
            rowData={[]} // 数据绑定
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              suppressMenu: true,
              cellStyle: {'line-height': '28px'},
            }}
            rowHeight={28}
            headerHeight={30}
            suppressRowTransform={true}
            onGridReady={onGridReady}
          >
          </AgGridReact>
        </div>

      </div>

    </PageContainer>
  );
};


export default ZentaoTemplateList;
