import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {errorMessage} from "@/publicMethods/showMessages";
import {AgGridReact} from 'ag-grid-react';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {Col, DatePicker, Form, Input, Row, Select} from "antd";
import "./style/style.css"
import {useRequest} from "ahooks";
import {
  loadReleaseTypeSelect,
  loadReleaseWaySelect,
  loadDutyNamesSelect
} from "@/pages/onDutyAndRelease/preRelease/comControl/controler";
import {getHeight} from "@/publicMethods/pageSet";
import {releaseColumns} from "./grid/columns";
import moment from 'moment';

const {Option} = Select;
const OfficialRelease: React.FC<any> = () => {
  const releaseServiceGridApi = useRef<GridApi>();
  const serviceGridReady = (params: GridReadyEvent) => {
    releaseServiceGridApi.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const [formForOfficialRelease] = Form.useForm(); // 预发布
  const releaseTypeArray = useRequest(() => loadReleaseTypeSelect()).data;
  const releaseWayArray = useRequest(() => loadReleaseWaySelect()).data;
  const dutyNameArray = useRequest(() => loadDutyNamesSelect()).data; // 关联值班名单

  // 表格的屏幕大小自适应
  const [gridHeight, setGridHeight] = useState(getHeight() - 180);
  window.onresize = function () {
    setGridHeight(getHeight() - 180);
  };


  return (
    <PageContainer>

      <div style={{marginTop: -15}}>
        {/* 检查总览 */}
        <div style={{backgroundColor: 'white', paddingTop: 10, height: 45,}}>
          <label style={{fontWeight: 'bold', marginLeft: 5}}>检查总览：</label>
          <label>
            <button
              style={{height: 13, width: 13, border: 'none', backgroundColor: "#2BF541",}}
            ></button>
            &nbsp;发布服务已填写完成
          </label>
          <label style={{marginLeft: 10}}>
            <label style={{fontWeight: 'bold'}}>线上发布结果：</label>
            <Select
              size={'small'}
              style={{width: 100}}
              // onChange={pulishResulttChanged}
              // value={processStatus.releaseResult}
              // disabled={operteStatus}
            >
              <Option key={'1'} value={'1'}>
                发布成功
              </Option>
              <Option key={'2'} value={'2'}>
                发布失败
              </Option>
              <Option key={'9'} value={'9'}>
                {' '}
              </Option>
            </Select>
          </label>
        </div>
        {/* step 1 发布方式及时间 */}
        <div style={{backgroundColor: 'white', marginTop: 4}}>
          <fieldset className={'fieldStyle'} style={{height: 135}}>
            <legend className={'legendStyle'}>Step1 发布方式及时间
              <label style={{color: "Gray"}}> (值班测试填写)</label>
            </legend>
            <div>
              <Form form={formForOfficialRelease}>
                <Row gutter={8} style={{marginTop: -5}}>
                  <Col span={7}>
                    {/* 发布类型 */}
                    <Form.Item label="发布类型:" name="pulishType">
                      <Select disabled={true} defaultValue={"2"}>{releaseTypeArray}</Select>
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    {/* 发布方式 */}
                    <Form.Item label="发布方式:" name="pulishMethod">
                      <Select defaultValue={"1"}>{releaseWayArray}</Select>
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    {/* 发布时间 */}
                    <Form.Item label="计划发布时间" name="pulishTime">
                      <DatePicker defaultValue={moment(moment().add(1, "days").format("YYYY-MM-DD"))} showTime
                                  format="YYYY-MM-DD HH:mm"
                                  style={{width: '100%'}}/>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8} style={{marginTop: -10}}>
                  <Col span={14}>
                    {/* 关联值班名单 */}
                    <Form.Item label="关联值班名单" name="pulishTime" style={{marginLeft: 5}}>
                      <Select filterOption={(inputValue: string, option: any) =>
                        !!option.children.includes(inputValue)} showSearch
                      >{dutyNameArray}</Select>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    {/* 编辑人 */}
                    <Form.Item label="编辑人:" name="editor">
                      <Input
                        style={{
                          border: 'none', backgroundColor: 'white',
                          color: 'black', marginLeft: -5,
                        }}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    {/* 编辑时间 */}
                    <Form.Item label="编辑时间:" name="editTime" style={{marginLeft: 5}}>
                      <Input
                        style={{
                          border: 'none', backgroundColor: 'white',
                          color: 'black', marginLeft: -5,
                        }}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>

          </fieldset>
        </div>

        {/* step 2 发布服务填写确认 */}
        <div style={{backgroundColor: 'white', marginTop: 4}}>
          <fieldset className={'fieldStyle'}>
            <legend className={'legendStyle'}>Step2 发布服务填写确认
              <label style={{color: "Gray"}}> (值班测试填写)</label>
            </legend>
            <div>
              <div
                className="ag-theme-alpine"
                style={{height: gridHeight, width: '100%', marginTop: -12}}
              >
                <AgGridReact
                  columnDefs={releaseColumns} // 定义列
                  rowData={[]} // 数据绑定
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    suppressMenu: true,
                    // autoHeight: true,
                    minWidth: 75,
                  }}
                  headerHeight={25}
                  rowHeight={65}
                  onGridReady={serviceGridReady}
                  onGridSizeChanged={serviceGridReady}
                  // onColumnEverythingChanged={onlineBranchGridReady}
                >

                </AgGridReact>
              </div>
            </div>

          </fieldset>
        </div>
      </div>

    </PageContainer>
  );
};

export default OfficialRelease;
