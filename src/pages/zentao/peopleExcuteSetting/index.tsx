import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {useRequest} from 'ahooks';

import {Card, Button, message, Form, Select, Row, Col, InputNumber} from 'antd';

const {Option} = Select;

// 查询数据


// 组件初始化
const PeopleExcuteSetting: React.FC<any> = () => {

  const [formForExcuteSetting] = Form.useForm();

  // 执行权限分配
  const excuteAuthorityDistribute = () => {
    const formData = formForExcuteSetting.getFieldsValue();
    console.log(formData);

  };

  // 点击保存
  const saveExcute = () => {
    const formData = formForExcuteSetting.getFieldsValue();
    console.log(formData);
  };

  useEffect(() => {
    // formForExcuteSetting.setFieldsValue({
    //   // usersName: undefined,
    //   position: "",
    //   workDay: "",
    //   workHours: "",
    //   distributeExcute: "",
    //   excludeExcute: ""
    // });

  })
  return (
    <PageContainer style={{marginTop: -30}}>
      <div style={{marginTop: -20}}>
        <div>
          <Form form={formForExcuteSetting}>
            <Row>
              <Col span={7}>
                <Form.Item label="人员选择" name="usersName" required={true}>
                  <Select mode="multiple" allowClear style={{width: '100%'}}
                  >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="职位" name="position" required={true}>
                  <Select style={{width: '100%'}} defaultValue={"开发"}>
                    <Option value="开发">开发</Option>
                    <Option value="测试">测试</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="可用工日[天]" name="workDay" required={true}>
                  <InputNumber style={{width: '100%'}} min={1} defaultValue={720}/>
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="可用工时/天" name="workHours" required={true}>
                  <InputNumber style={{width: '100%'}} min={1} defaultValue={8}/>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Button
                  type="primary"
                  style={{
                    color: '#46A0FC', backgroundColor: '#ECF5FF',
                    borderRadius: 5, marginLeft: 10,
                    marginTop: 3, minWidth: "110px", width: "100%"
                  }}
                  onClick={excuteAuthorityDistribute}>

                  执行权限分配
                </Button>
              </Col>

            </Row>
            <Row style={{marginTop: -20}}>
              <Col span={21}>
                <Form.Item label="分配执行" name="distributeExcute" required={true}>
                  <Select style={{width: '100%'}}>
                    <Option value="开发">开发</Option>
                    <Option value="测试">测试</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="排除执行" name="excludeExcute" required={true} style={{marginTop: -20}}>
                  <Select style={{width: '100%'}}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={3}>

                <Button
                  type="primary"
                  style={{
                    color: '#46A0FC', backgroundColor: '#ECF5FF',
                    borderRadius: 5, marginLeft: 10,
                    marginTop: 10, height: 50, minWidth: "110px", width: "100%"
                  }} onClick={saveExcute}>
                  点击保存
                </Button>

              </Col>
            </Row>

          </Form>
        </div>
        {/* 执行日志 */}
        <Card size="small" title="执行日志" style={{width: '100%', marginTop: -20}}>
          <p> content</p>
          <p> content</p>
          <p> content</p>
          <p> content</p>
          <p> content</p>
        </Card>
      </div>


    </PageContainer>
  );
};


export default PeopleExcuteSetting;
