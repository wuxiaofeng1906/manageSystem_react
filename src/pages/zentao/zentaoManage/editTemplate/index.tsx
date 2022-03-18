import React, {useEffect, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {Button, Col, Form, Input, message, Modal, Row, Select, Upload} from "antd";
import Header from "./components/CusPageHeader";
import {DeleteTwoTone, ImportOutlined} from "@ant-design/icons";
import {getTempColumns} from "./gridMethod/columns";
import {getHeight} from "@/publicMethods/pageSet";
import {history} from "@@/core/history";
import {loadExcelData, getGridDataFromExcel} from './import';
import {
  getTemTypeSelect, getAddTypeSelect, getAssignedToSelect, getPrioritySelect,
  getTaskTypeSelect, getSideSelect, getTaskSourceSelect, deleteTemplateList
} from './axiosRequest/requestDataParse';
import {getTemplateDetails} from './gridMethod/girdData';
import {useRequest} from "ahooks";
import {
  addTypeRenderer, assignedToRenderer, priorityRenderer,
  taskTypeRenderer, sideRenderer, taskSourceRenderer, cutRenderer
} from "./gridMethod/gridRenderer";

const selectOptions = {
  addType: [],
  assignedTo: [],
  priority: [],
  taskType: [],
  side: [],
  taskSource: []
}
// 组件初始化
const EditTemplateList: React.FC<any> = () => {

  /* region 表格事件 */
  const [gridData, setGridData] = useState([]);
  // 获取跳转过来的模板，并获取对应数据
  const template = {id: "", name: "", type: ""}
  const location = history.location.query;
  if (location && JSON.stringify(location) !== '{}') {
    if (location.tempName) {
      template.name = location.tempName.toString();
    }
    if (location.tempId) {
      template.id = location.tempId.toString();
    }
    if (location.tempType) {
      template.type = location.tempType.toString();
    }
  }

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

  /* region 几个下拉框取值 */
  const templeType = useRequest(() => getTemTypeSelect()).data;

  selectOptions.addType = useRequest(() => getAddTypeSelect()).data;
  selectOptions.assignedTo = useRequest(() => getAssignedToSelect()).data;
  selectOptions.priority = useRequest(() => getPrioritySelect()).data;
  selectOptions.taskType = useRequest(() => getTaskTypeSelect()).data;
  selectOptions.side = useRequest(() => getSideSelect()).data;
  selectOptions.taskSource = useRequest(() => getTaskSourceSelect()).data;


  /* endregion */

  const [formForTemplate] = Form.useForm();

  // 导入excel任务
  const importTemplate = (file: any) => {

    //   获取数据()
    loadExcelData(file).then((result: any) => {

      if (result.message) {
        message.error({
          content: `导入失败：${result.message}`,
          duration: 1,
          style: {marginTop: '50vh'},
        });
        return;
      }
      // 将数据显示到表格中
      if ((result.data).length === 0) {
        message.error({
          content: `导入失败：表格中没有数据！`,
          duration: 1,
          style: {marginTop: '50vh'},
        });
        return;
      }

      const newDatas: any = getGridDataFromExcel(result.data);
      // 导入需要追加之前的数据
      const finalData: any = gridData.concat(newDatas);
      setGridData(finalData);
    });

  };

  // 新增行
  (window as any).addTemplateRow = async (rowIndex: any, rowData: any) => {
    debugger;
    const addRow: any = {add_type_name: "",};
    // 判断当前点击是父任务还是子任务（增加类型是新增还是子任务），
    if (rowData.add_type_name === "子任务") {
      // 如果是子任务，则在本父任务后面添加一行子任务
      addRow.add_type_name = "子任务";
      gridApi.current?.updateRowData({add: [addRow], addIndex: Number(rowIndex) + 1});
      return;
    }

    // 如果是父任务，则本地新增则添加到这个父任务所属所有子任务的后面一行。
    addRow.add_type_name = "新增";
    const oldData = gridData;
    let addPosition = -1; // 新增行的位置
    for (let index = Number(rowIndex); index < oldData.length; index += 1) {
      //  查找下一个父任务的ID
      const dts: any = oldData[index + 1];
      if (!dts || dts.add_type_name === "新增") {  // !dts 表示只有一行新增，则直接在下面新增一行父任务即可
        // 如果找到了下一个父任务，就在这个父任务的上面新增一行。
        addPosition = index + 1;
        break;
      }
    }
    gridApi.current?.updateRowData({add: [addRow], addIndex: addPosition});
  };

  /* region 删除行 */
  const [isdelModalVisible, setIsDelModalVisible] = useState({
    showFalg: false,
    db_delData: "", // 需要从数据库删除的数据
    cu_delData: []  // 本地的数据，还未保存到数据库中
  });

  // 删除行
  const delTemplateRow = () => {
    // 获取选中的行
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
    // 获取需要删除的ID
    selRows.forEach((ele: any) => {
      // 首先要判断有没有subtask_id，有的话才是数据库中已经存储的，需要链接数据库删除，如果没有的，直接在表格中删除即可。
      if (ele.subtask_id) {
        selData = selData === "" ? ele.subtask_id : `${selData},${ele.subtask_id}`;
      }
    });
    setIsDelModalVisible({
      showFalg: true,
      db_delData: selData,
      cu_delData: selRows
    });
  };

  // 取消删除
  const delFormCancle = () => {
    setIsDelModalVisible({
      showFalg: false,
      delData: ""
    });
  };

  // 确定删除选中项
  const delTempRow = async () => {
    // 判断有无数据库删除项目，有的话则调用删除接口，没有直接删除表格本地数据即可
    if (isdelModalVisible.db_delData) {
      const rtMsg = await deleteTemplateList(isdelModalVisible.db_delData);
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
    }

    gridApi.current?.updateRowData({remove: isdelModalVisible.cu_delData});
    setIsDelModalVisible({
      showFalg: false,
      db_delData: "", // 需要从数据库删除的数据
      cu_delData: []  // 本地的数据，还未保存到数据库中
    });
    message.info({
      content: `删除成功！`,
      duration: 1,
      className: 'delNone',
      style: {
        marginTop: '50vh',
      },
    });

  };

  /* endregion  删除行 */

  // 取消模板编辑
  const cancleTempEdit = () => {
    history.push('/zentao/templateList');
  };

  // 保存编辑后的模板
  const saveTemplate = () => {
    // 需要校验模版名称不能为空
    const tempName = formForTemplate.getFieldValue("tempName");
    if (!tempName) {
      message.error({
        content: `模板名称不能为空！`,
        duration: 1, // 1S 后自动关闭
        style: {marginTop: '50vh'},
      });
      return;
    }
    const gridDatas = [];

    // 遍历列表中的数据
    gridApi.current?.forEachNode((node: any) => {
      gridDatas.push(node);
    });

    // 保存成功之后返回列表，并刷新数据
    // history.push('/zentao/templateList');
  };

  const showInitPages = async () => {

    if (template.id) {
      const dt = await getTemplateDetails(template.id);
      setGridData(dt);

      formForTemplate.setFieldsValue({
        tempName: template.name,
        tempType: template.type
      });
    }
  };
  useEffect(() => {

    showInitPages();

  }, [1]);
  return (
    <div style={{width: "100%", height: "100%", marginTop: "-20px"}}>
      <Header/>
      <div className={"content"} style={{marginTop: 5}}>
        <div style={{background: 'white', height: 36, paddingTop: 2}}>
          <Form form={formForTemplate} autoComplete="off" style={{marginLeft: 5}}>
            <Row>
              <Col span={8}>
                <Form.Item label="模板名称:" name="tempName" required={true}>
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="模板类型:" name="tempType" required={true} style={{marginLeft: 5}}>
                  <Select showSearch style={{width: "100%"}}>
                    {templeType}
                  </Select>

                </Form.Item>

              </Col>
              <Col span={4}>
                <Upload beforeUpload={importTemplate}>
                  <Button type="text" style={{color: "#46A0FC"}} icon={<ImportOutlined/>} size={'middle'}
                  >导入Excel任务</Button>
                </Upload>
              </Col>
              <Col span={4}>
                <Button type="text" icon={<DeleteTwoTone/>} size={'middle'} style={{float: "right"}}
                        onClick={delTemplateRow}>删除</Button>
              </Col>
            </Row>
          </Form>

        </div>

        {/* 模板列表 */}
        <div style={{marginTop: 5}}>
          <div className="ag-theme-alpine" style={{height: gridHeight - 20, width: '100%'}}>
            <AgGridReact
              columnDefs={getTempColumns()} // 定义列
              rowData={gridData} // 数据绑定
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
              rowSelection={'multiple'}
              onGridReady={onGridReady}
              frameworkComponents={{
                addTypeRender: (props: any) => {
                  return addTypeRenderer(props.value, selectOptions.addType);
                },
                assignedToRender: (props: any) => {
                  return assignedToRenderer(props.value, selectOptions.assignedTo);
                },
                priorityRender: (props: any) => {
                  return priorityRenderer(props.value, selectOptions.priority);
                },
                taskTypeRender: (props: any) => {
                  return taskTypeRenderer(props.value, selectOptions.taskType);
                },
                belongsSideRender: (props: any) => {
                  return sideRenderer(props.value, selectOptions.side);
                },
                taskSourceRender: (props: any) => {
                  return taskSourceRenderer(props.value, selectOptions.taskSource);
                },
                cutRender: (props: any) => {
                  return cutRenderer(props.value);
                },
              }}
            >
            </AgGridReact>
          </div>
        </div>

        <div style={{marginTop: 10}}>
          <Button type="primary"
                  style={{
                    float: "right", color: '#46A0FC',
                    backgroundColor: "#ECF5FF", borderRadius: 5, marginLeft: 20
                  }}
                  onClick={saveTemplate}>保存
          </Button>
          <Button
            style={{float: "right", borderRadius: 5}}
            onClick={cancleTempEdit}>取消
          </Button>
        </div>

        <Modal
          title={'删除行'}
          visible={isdelModalVisible.showFalg}
          onCancel={delFormCancle}
          centered={true}
          footer={null}
          width={400}
        >
          <Form>
            <Form.Item>
              <label>
                确定删除选中的数据吗？
              </label>
            </Form.Item>

            <Form.Item>
              <Button type="primary" style={{marginLeft: '110px'}} onClick={delTempRow}>
                确定
              </Button>
              <Button type="primary" style={{marginLeft: '30px'}} onClick={delFormCancle}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>

      </div>
    </div>
  );
};


export default EditTemplateList;
