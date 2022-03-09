import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {useRequest} from 'ahooks';
import {Card, Button, message, Form, Select, Row, Col, InputNumber} from 'antd';
import {getZentaoUserSelect, getPositionSelect, getExcuteTypeSelect, getExcutionSelect} from './component';

const {Option} = Select;

// 查询数据


// 组件初始化
const PeopleExcuteSetting: React.FC<any> = () => {
  /* region 下拉列表 */
  // 人员列表
  const zentaoUserList = useRequest(() => getZentaoUserSelect()).data;
  // 职位
  const positionsList = useRequest(() => getPositionSelect()).data;

  // 执行类型
  const excuteTypeList = useRequest(() => getExcuteTypeSelect()).data;


  /* endregion */

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

  const [excute, setExcute] = useState({
    distributeExcute: null,// 分配
    excludeExcute: null // 排除

  })
  const onExcuteTypeChanged = async () => {
    await getExcutionSelect("");
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
                  <Select mode="multiple" showSearch style={{width: '100%'}}
                  >
                    {zentaoUserList}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="职位" name="position" required={true}>
                  <Select style={{width: '100%'}} showSearch defaultValue={"研发"}>
                    {positionsList}
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
              <Col span={11}>
                <Form.Item label="分配执行类型筛选" name="distributeExcute" required={true}>
                  <Select style={{width: '100%'}} showSearch>
                    {excuteTypeList}
                  </Select>
                </Form.Item>
                <Form.Item label="排除执行类型筛选" name="excludeExcute" required={true} style={{marginTop: -20}}>
                  <Select style={{width: '100%'}} showSearch>
                    {excuteTypeList}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={10}>
                <Form.Item label="分配执行" name="distributeExcute" required={true}>
                  <Select style={{width: '100%'}} showSearch>
                    {excute.distributeExcute}
                  </Select>
                </Form.Item>
                <Form.Item label="排除执行" name="excludeExcute" required={true} style={{marginTop: -20}}>
                  <Select style={{width: '100%'}} showSearch>
                    {excute.excludeExcute}
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
