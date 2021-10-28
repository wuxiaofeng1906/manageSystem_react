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

import {Button, message} from "antd";

import {DeleteTwoTone, EditTwoTone, FolderAddTwoTone} from "@ant-design/icons";
import axios from "axios";
import {history} from "@@/core/history";


// 查询数据
const queryDevelopViews = async () => {

  let result: any = [];
  const paramData = {
    page: 1,
    page_size: 100
  };


  await axios.get('/api/verify/app_tools/app_list', {params: paramData})
    .then(function (res) {

      if (res.data.code === 200) {
        result = res.data.data;
      } else {
        message.error({
          content: `错误：${res.data.msg}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }


    }).catch(function (error) {

      message.error({
        content: `异常信息:${error.toString()}`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    });

  return result;
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

  // 跳转到当前网站的链接
  (window as any).gotoCurrentPage = (params: any) => {
    history.push(params);
  };

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
        field: 'app_name',
        minWidth: 130,
        cellRenderer: (params: any) => {
          if (params.value) {
            const myHref = window.location.origin;
            const goToHref = params.data.app_url;

            if (goToHref.indexOf(myHref) > -1) {
              const newUrl = goToHref.replace(myHref, "").trim();

              debugger;
              // > -1就代表是同一个地址。。就不另起网页调转了
              return `<a  style="text-decoration: underline" onclick='gotoCurrentPage(${JSON.stringify(newUrl)})'>${params.value}</a>`;
            }

            return `<a href="${goToHref}" target="_blank" style="text-decoration: underline" >${params.value}</a>`
          }
          return params.value;
        },
      },
      {
        headerName: '应用描述',
        field: 'app_description',
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
          rowData={data?.data} // 数据绑定
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
