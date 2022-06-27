import React, {useEffect, useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {errorMessage} from "@/publicMethods/showMessages";
import {Col, DatePicker, Form, Input, Row, Select} from "antd";
import "./style/style.css"
import {useRequest} from "ahooks";
import {loadReleaseTypeSelect, loadReleaseWaySelect} from "@/pages/onDutyAndRelease/preRelease/comControl/controler";

const {Option} = Select;
const OfficialRelease: React.FC<any> = () => {
  const [formForOfficialRelease] = Form.useForm(); // 预发布
  const releaseTypeArray = useRequest(() => loadReleaseTypeSelect()).data;
  const releaseWayArray = useRequest(() => loadReleaseWaySelect()).data;

  return (
    <PageContainer style={{backgroundColor: 'white'}}>

      {/* 检查总览 */}
      <div style={{marginTop: 5, marginLeft: 5}}>
        <label style={{fontWeight: 'bold'}}>检查总览：</label>
        <label>
          <button
            style={{height: 13, width: 13, border: 'none', backgroundColor: "green",}}
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

      <div>
        <fieldset className={'fieldStyle'}>
          <legend className={'legendStyle'}>Step1 发布方式及时间
            <label style={{color: "Gray"}}> (值班测试填写)</label>
          </legend>
          <div>
            <Form form={formForOfficialRelease}>
              <Row>
                <Col span={4}>
                  {/* 发布类型 */}
                  <Form.Item label="发布类型:" name="pulishType" style={{marginLeft: 5}}>
                    <Select>{releaseTypeArray}</Select>
                  </Form.Item>
                </Col>

                <Col span={4}>
                  {/* 发布方式 */}
                  <Form.Item label="发布方式:" name="pulishMethod" style={{marginLeft: 5}}>
                    <Select>{releaseWayArray}</Select>
                  </Form.Item>
                </Col>

                <Col span={4}>
                  {/* 发布时间 */}
                  <Form.Item label="计划发布时间" name="pulishTime" style={{marginLeft: 5}}>
                    <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{width: '100%'}}/>
                  </Form.Item>
                </Col>
                <Col span={4}>
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
                <Col span={4}>
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

    </PageContainer>
  );
};

export default OfficialRelease;
