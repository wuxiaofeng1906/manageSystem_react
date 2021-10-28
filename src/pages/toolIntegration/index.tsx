import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {getHeight} from '@/publicMethods/pageSet';
import "./style.css";

import CustomCellRenderer from './customCellRenderer';

import {Button} from "antd";

import {DeleteTwoTone, EditTwoTone, FolderAddTwoTone} from "@ant-design/icons";


// 查询数据
const queryDevelopViews = async () => {
  return [];
};

// 组件初始化
const ToolIntegrate: React.FC<any> = () => {

  const testData = [{
    appName: "研发管理平台",
    appDesc: "测试数据------测试数据"
  }, {
    appName: "禅道",
    appDesc: "测试数据------测试数据"
  }, {
    appName: "gitlab",
    appDesc: "测试数据------测试数据"
  }];

  // 定义列名
  const colums = () => {
    const component = new Array();
    component.push(
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        maxWidth: 50,
        pinned: 'left',
      },
      {
        headerName: '序号',
        maxWidth: 90,
        filter: false,
        cellRenderer: (params: any) => {
          return Number(params.node.id) + 1;
        },
      },
      {
        headerName: '应用名称',
        field: 'appName',
        minWidth: 130,
      },
      {
        headerName: '应用描述',
        field: 'appDesc',
        minWidth: 130,
      },
      {
        headerName: '排序',
        minWidth: 80,
        cellRenderer: "myCustomCell",
      }
    );

    return component;
  };

  /* region  表格相关事件 */
  const gridApi = useRef<GridApi>(); // 绑定ag-grid 组件
  const {data, loading} = useRequest(() => queryDevelopViews());

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  if (gridApi.current) {
    if (loading) gridApi.current.showLoadingOverlay();
    else gridApi.current.hideOverlay();
  }

  // 表格的屏幕大小自适应
  const [gridHeight, setGridHeight] = useState(getHeight());
  window.onresize = function () {
    setGridHeight(getHeight());
    gridApi.current?.sizeColumnsToFit();
  };

  const onChangeGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };
  /* endregion */

  // region 新增、修改、删除、排序
  // 新增工具信息
  const addToolInfo = () => {

  };


  // 修改工具信息
  const modifyToolInfo = () => {

  };


  // 删除工具信息
  const deleteToolInfo = () => {

  };

  // 排序拖动
  const dragOver = () => {

    gridApi.current?.forEachNode(function (node, index) {

      console.log(node, index);


    });

  }

  // endregion

  return (
    <PageContainer>
      {/* 查询条件 */}
      <div style={{width: '100%', backgroundColor: "white", marginTop: -15}}>
        <Button type="text" icon={<FolderAddTwoTone/>} size={'large'} onClick={addToolInfo}>新增</Button>
        <Button type="text" icon={<EditTwoTone/>} size={'large'} onClick={modifyToolInfo}>修改</Button>
        <Button type="text" icon={<DeleteTwoTone/>} size={'large'} onClick={deleteToolInfo}>删除</Button>
      </div>

      {/* ag-grid 表格定义 */}
      {/* 拖拽功能:https://www.ag-grid.com/react-data-grid/row-dragging/#multi-row-dragging */}
      <div className="ag-theme-alpine" style={{height: gridHeight, width: '100%'}}>
        <AgGridReact
          columnDefs={colums()} // 定义列
          rowData={testData} // 数据绑定
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            flex: 1,
            minWidth: 100,
          }}
          rowDragManaged={true}
          animateRows={true}
          frameworkComponents={{myCustomCell: CustomCellRenderer}}
          onRowDragEnd={dragOver}
          onGridReady={onGridReady}
          onGridSizeChanged={onChangeGridReady}

        >
        </AgGridReact>
      </div>


    </PageContainer>
  );
};

export default ToolIntegrate;
