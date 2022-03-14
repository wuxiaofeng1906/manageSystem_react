import React, {useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {Button, Col, Form, Input, message, Row} from "antd";
import Header from "./components/CusPageHeader";
import {ImportOutlined} from "@ant-design/icons";
import {getTempColumns,getTestData} from "./gridMethod/columns";
import {getHeight} from "@/publicMethods/pageSet";
import {history} from "@@/core/history";


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

  const [formForTemplate] = Form.useForm(); // 上线分支设置

  // 导入excel任务
  const importTemplate = () => {

  };

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
    history.push('/zentao/templateList');
  };
  return (
    <div style={{width: "100%", height: "100%", marginTop: "-20px"}}>
      <Header/>
      <div className={"content"} style={{marginTop: 5}}>
        <div style={{background: 'white', height: 35}}>
          <Row>
            <Col span={12}>
              <Form form={formForTemplate} autoComplete="off" style={{marginLeft: 5}}>
                <Form.Item label="模板名称:" name="tempName" required={true}>
                  <Input/>
                </Form.Item>
              </Form>
            </Col>
            <Col span={12}>
              <Button type="text" style={{color: "#46A0FC"}} icon={<ImportOutlined/>} size={'middle'}
                      onClick={importTemplate}>导入Excel任务</Button>
            </Col>
          </Row>


        </div>

        {/* 模板列表 */}
        <div style={{marginTop: 5}}>
          <div className="ag-theme-alpine" style={{height: gridHeight - 20, width: '100%'}}>
            <AgGridReact
              columnDefs={getTempColumns()} // 定义列
              rowData={getTestData()} // 数据绑定
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

      </div>
    </div>
  );
};


export default EditTemplateList;