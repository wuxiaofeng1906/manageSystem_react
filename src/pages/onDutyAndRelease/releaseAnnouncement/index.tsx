import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {errorMessage} from '@/publicMethods/showMessages';
import {Button, Checkbox, Col, DatePicker, Form, Input, Radio, Row, Select, Tabs} from 'antd';
import './style.css';
import {useRequest} from 'ahooks';
import {loadDutyNamesSelect} from '@/pages/onDutyAndRelease/preRelease/comControl/controler';

const {TextArea} = Input;
const {TabPane} = Tabs;
const Announce: React.FC<any> = (props: any) => {

  const onlineReleaseNum = props.location?.query?.onlineReleaseNum; // 正式发布列表的数据

  const dutyNameArray = useRequest(() => loadDutyNamesSelect(true)).data; // 关联值班名单

  const onChange = () => {

  }

  const [announceContent] = Form.useForm();
  return (
    <PageContainer>
      <div style={{marginTop: -15}}>
        {/* Tab展示 */}
        <Tabs onChange={onChange} type="card">
          <TabPane tab="升级前公告" key="before">
          </TabPane>
          <TabPane tab="升级后公告" key="after">
          </TabPane>
        </Tabs>

        {/* Tab内容 */}
        <div style={{backgroundColor: "white", height: "700px", marginTop: -15}}>
          <Form form={announceContent}>
            <Form.Item label="升级时间:" name="announceTime" style={{paddingTop: 5}}>
              <DatePicker showTime onChange={onChange} onOk={onChange}/>
            </Form.Item>
            <Form.Item label="公告详情:" name="announceDetails_1" style={{marginTop: -20}}>
              <Input placeholder="Basic usage"/>
            </Form.Item>
            <Form.Item name="showAnnounceTime" className={"marginStyle"}>
              <label style={{color: "gray"}}>2022-07-14 14:00:00</label>
            </Form.Item>
            <Form.Item name="announceDetails_2" className={"marginStyle"}>
              <TextArea rows={2}/>
            </Form.Item>
            <Form.Item label="展示查看更新详情:" name="showUpdateDetails" style={{marginTop: -20}}>
              <Radio.Group onChange={onChange}>
                <Radio value={"yes"}>是</Radio>
                <Radio value={"no"}>否</Radio>
              </Radio.Group>
            </Form.Item>

            <div>

              <fieldset className={"fieldStyleA"}>
                <legend className={"legendStyleA"}>预览</legend>
                <div>
                  <p>{"{"}</p>
                  <p className={"preview"}>"UpgradeIntroDate":"2022-07-08 23:00:00"</p>
                  <p className={"preview"}>"UpgradeDescription":"啦啦啦啦啦啦啦啦啦阿拉拉啊啦啦啦啦啦啦啦啦啦啦啊啦啦啦啊啦啦啦啦啦啦啦啦啊啦啦啦啦啦啊啦啦啦"</p>
                  <p className={"preview"}> "isUpdated"：true</p>
                  <p>{"}"}</p>
                </div>
              </fieldset>
            </div>
          </Form>

          {/* 保存按钮 */}
          <div style={{float: "right", marginTop: 20}}>
            <Button type="primary" className={"saveButtonStyle"}>
              保存
            </Button>
            <Button type="primary" className={"saveButtonStyle"}
                    style={{marginLeft: 10}}>
              一键挂起公告
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Announce;
