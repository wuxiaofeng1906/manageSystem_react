import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {Button, message, Modal} from 'antd';
import {getTempColumns} from './gridMethod/columns';
import {getHeight} from "@/publicMethods/pageSet";
import {DeleteTwoTone, FolderAddTwoTone, ProfileTwoTone, DownloadOutlined} from "@ant-design/icons";
import {history} from "@@/core/history";
import {getTemplateList, deleteTemplate} from './axiosRequest/requestDataParse';
import {useRequest} from "ahooks";
import {downloadTemplateToExcel} from "./export";

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

  /* region 获取详情数据 */
  const templeList = useRequest(() => getTemplateList()).data;

  /* endregion */

  /* region 增改 */

  // 新增界面跳转
  const addTempList = () => {
    history.push('/zentao/editTemplate');
  };

  // 修改界面跳转
  const modifyTempList = (params: any) => {

    const {data} = params;
    history.push(`/zentao/editTemplate?tempId=${data.temp_id}&tempName=${data.temp_name}&tempType=${data.temp_type}|${data.temp_type_name}`);
  };

  /* endregion 增改 */

  /* region 删除模板 */
  const [isdelModalVisible, setIsDelModalVisible] = useState({
    showFalg: false,
    delData: ""
  });
  const delSelectedTemp = () => {
    // 判断是否选中数据
    const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行

    if (selRows.length === 0) {
      message.error({
        content: '请选中需要删除的数据!',
        duration: 1,
        className: 'delNone',
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }

    let selData = "";
    // 需要根据真实数据传值（名字或者ID）
    selRows.forEach((ele: any) => {
      selData = selData === "" ? ele.temp_id : `${selData},${ele.temp_id}`;
    });
    setIsDelModalVisible({
      showFalg: true,
      delData: selData
    });
  };

  // 取消删除
  const delFormCancle = () => {

    setIsDelModalVisible({
      showFalg: false,
      delData: ""
    });
  };

  // 确定删除
  const delTempList = async () => {

    const rtMsg = await deleteTemplate(isdelModalVisible.delData);
    if (rtMsg) {
      message.error({
        content: `删除失败：${rtMsg}`,
        duration: 1,
        className: 'delNone',
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }
    //   更新列表
    gridApi.current?.setRowData(await getTemplateList());
    setIsDelModalVisible({
      showFalg: false,
      delData: ""
    });
    message.info({
      content: `模板删除成功！`,
      duration: 1,
      className: 'delNone',
      style: {
        marginTop: '50vh',
      },
    });
  };
  /* endregion 删除模板 */

  /* region 生成任务 */

  const generateTask = () => {
    // 判断是否选中数据
    const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行

    if (selRows.length === 0) {
      message.error({
        content: '请选中需要生成的模板数据!',
        duration: 1,
        className: 'delNone',
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }

    if (selRows.length > 1) {
      message.error({
        content: '一次只能生成一个任务！',
        duration: 1,
        className: 'delNone',
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }

    const tempData: any = selRows[0];
    // 不同类型的模板进入不同的生成列表

    if (tempData.temp_type === "auxiliaryReleaseCheck" || tempData.temp_type === "comprehensiveReleaseCheck") {

      history.push(`/zentao/btForCheckBeforeOnline?tempID=${tempData.temp_id}&tempName=${tempData.temp_name}&tempType=${tempData.temp_type}`);
    } else {
      history.push(`/zentao/btForProjectTemplate?tempID=${tempData.temp_id}&tempName=${tempData.temp_name}&tempType=${tempData.temp_type}`);
    }
  };


  /* endregion 生成任务 */

  /* region 下载模板 */
  const downloadTemplate = () => {
    // 判断是否选中数据
    const selRows: any = gridApi.current?.getSelectedRows(); // 获取选中的行

    if (selRows.length === 0) {
      message.error({
        content: '请选中需要下载的模板数据!',
        duration: 1,
        className: 'delNone',
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }
    downloadTemplateToExcel(selRows);
  };

  /* endregion 下载模板 */

  return (
    <PageContainer>
      {/* 按钮栏 */}
      <div style={{background: 'white', marginTop: -20}}>
        <Button type="text" icon={<FolderAddTwoTone/>} size={'middle'}
                onClick={addTempList}>新增</Button>
        <Button type="text" icon={<DeleteTwoTone/>} size={'middle'}
                onClick={delSelectedTemp}>删除</Button>
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
            rowData={templeList} // 数据绑定
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
            onRowDoubleClicked={modifyTempList}
            rowSelection={'multiple'}
          >
          </AgGridReact>
        </div>

      </div>

      <Modal
        title={'删除确认'}
        visible={isdelModalVisible.showFalg}
        onCancel={delFormCancle}
        centered={true}
        footer={[
          <Button type="primary" style={{marginLeft: '110px'}} onClick={delTempList}>确定</Button>,
          <Button type="primary" style={{marginLeft: '30px'}} onClick={delFormCancle}>取消</Button>
        ]}
        width={350}
      > 您确定要删除选中的模板吗？
      </Modal>

    </PageContainer>
  );
};


export default ZentaoTemplateList;