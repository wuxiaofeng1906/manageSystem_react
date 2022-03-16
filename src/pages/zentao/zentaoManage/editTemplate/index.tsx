import React, {useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {Button, Col, Form, Input, message, Modal, Row, Select, Upload} from "antd";
import Header from "./components/CusPageHeader";
import {ImportOutlined} from "@ant-design/icons";
import {getTempColumns, getTestData} from "./gridMethod/columns";
import {getHeight} from "@/publicMethods/pageSet";
import {history} from "@@/core/history";
import {loadExcelData, getGridDataFromExcel} from './import';

const {Option} = Select;

// 组件初始化
const EditTemplateList: React.FC<any> = () => {

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

  // 获取跳转过来的模板。。
  let tempname = "";
  const location = history.location.query;
  if (JSON.stringify(location) !== '{}') {
    if (location !== undefined && location.tempName !== null) {
      tempname = location.tempName.toString();
    }
  }


  const [formForTemplate] = Form.useForm(); // 上线分支设置

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

      const gridData: any = getGridDataFromExcel(result.data)
      gridApi.current?.setRowData(gridData);

    });

  };

  // 新增行
  (window as any).addTemplateRow = async () => {


  };

  /* region 删除行 */
  const [isdelModalVisible, setIsDelModalVisible] = useState({
    showFalg: false,
    delData: ""
  });

  (window as any).delTemplateRow = async (params: any) => {

    setIsDelModalVisible({
      showFalg: true,
      delData: params
    });
  };

  // 取消删除
  const delFormCancle = () => {
    setIsDelModalVisible({
      showFalg: false,
      delData: ""
    });
  };

  // 确定删除慈航
  const delTempRow = () => {

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

  // 这是使用Input控件做导入
  // {/*<input id="file" type="file" onChange={testLoad}/>*/}
  // const testLoad = (file: any) => {
  //   debugger;
  //   // 获取上传的文件对象
  //   const {files} = file.target;
  //   // 通过FileReader对象读取文件
  //   const fileReader = new FileReader();
  //   fileReader.onload = event => {
  //     try {
  //       const excelData = event.target?.result;
  //       // 以二进制流方式读取得到整份excel表格对象
  //       const workbook = XLSX.read(excelData, {type: 'binary'});
  //       // 存储获取到的数据
  //       let resultData: any = [];
  //       // 遍历每张工作表进行读取（这里默认只读取第一张表）
  //       Object.keys(workbook.Sheets).forEach((sheet: string, index: number) => {
  //         debugger;
  //         if (index === 0) { // 只获取第一个sheet的数据
  //           // 利用 sheet_to_json 方法将 excel 转成 json 数据
  //           resultData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
  //         }
  //       })
  //
  //       console.log(resultData);
  //
  //       // for (const sheet in workbook.Sheets) {
  //       //   if (workbook.Sheets.hasOwnProperty(sheet)) {
  //       //     debugger;
  //       //     // 利用 sheet_to_json 方法将 excel 转成 json 数据
  //       //     resultData = resultData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
  //       //     break; // 如果只取第一张表，就取消注释这行
  //       //   }
  //       // }
  //
  //     } catch (e) {
  //       message.error(`错误：${e}`);
  //     }
  //   };
  //   fileReader.readAsBinaryString(files[0]);   // 以二进制方式打开文件
  // };


  return (
    <div style={{width: "100%", height: "100%", marginTop: "-20px"}}>
      <Header/>
      <div className={"content"} style={{marginTop: 5}}>
        <div style={{background: 'white', height: 36,paddingTop:2}}>
          <Form form={formForTemplate} autoComplete="off" style={{marginLeft: 5}}>
            <Row>
              <Col span={8}>
                <Form.Item label="模板名称:" name="tempName" required={true}>
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="模板类型:" name="tempType" required={true}>
                  <Input/>
                </Form.Item>

              </Col>
              <Col span={8}>
                <Upload beforeUpload={importTemplate}>
                  <Button type="text" style={{color: "#46A0FC"}} icon={<ImportOutlined/>} size={'middle'}
                  >导入Excel任务</Button>
                </Upload>,
              </Col>
            </Row>
          </Form>
        </div>

        {/* 模板列表 */}
        <div style={{marginTop: 5}}>
          <div className="ag-theme-alpine" style={{height: gridHeight - 20, width: '100%'}}>
            <AgGridReact
              columnDefs={getTempColumns()} // 定义列
              rowData={tempname === "" ? [] : getTestData()} // 数据绑定
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
              frameworkComponents={{
                confirmSelectChoice: (props: any) => {
                  const currentValue = props.value;
                  return (
                    <Select
                      size={'small'}
                      defaultValue={currentValue}
                      bordered={false}
                      style={{width: '100%'}}
                      onChange={(newValue: any) => {
                        console.log(newValue);
                      }}>
                      <Option key={'1'} value={'1'}>
                        新增
                      </Option>
                      <Option key={'2'} value={'2'}>
                        子任务
                      </Option>
                    </Select>
                  );
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
                确定删除此行吗？
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
