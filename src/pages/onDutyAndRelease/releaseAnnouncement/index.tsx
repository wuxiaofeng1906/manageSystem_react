import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {errorMessage} from '@/publicMethods/showMessages';
import {Button, DatePicker, Form, Input, Radio, Tabs} from 'antd';
import './style.css';
import {useRequest} from 'ahooks';
import {postAnnouncement, getAnnouncement} from "./axiosRequest/apiPage";
import moment from "moment";


const {TextArea} = Input;
const {TabPane} = Tabs;
const Announce: React.FC<any> = (props: any) => {
  const releaseNum = props.location?.query?.releaseNum;
  const [announceContent] = Form.useForm();
  const [formDatas, setFormDatas] = useState({
    announceTime: "",
    announceDetails_1: "亲爱的用户：您好，企企经营管理平台将于",
    announceDetails_2: "",
    showUpdateDetails: "true"
  });

  const announceData = useRequest(() => getAnnouncement(releaseNum, "before")).data; // 关联值班名单

  // Tab 修改
  const onTabChanged = async (activeKey: string) => {
    debugger;
    // const announceContent = await getAnnouncement(releaseNum, activeKey);

  }
  // 当表单种数据被改变时候
  const whenFormvalueChanged = (changedFields: any, allFields: any) => {
    if (changedFields && changedFields.length > 0) {
      const fieldName = (changedFields[0].name)[0];
      let fieldValue = changedFields[0].value;
      switch (fieldName) {
        case "announceTime":
          fieldValue = moment(fieldValue).format("YYYY-MM-DD HH:mm:ss");
          setFormDatas({
            ...formDatas,
            announceTime: fieldValue
          })
          break;
        case "announceDetails_1":
          setFormDatas({
            ...formDatas,
            announceDetails_1: fieldValue
          })
          break;
        case "announceDetails_2":
          setFormDatas({
            ...formDatas,
            announceDetails_2: fieldValue
          })
          break;
        case "showUpdateDetails":
          setFormDatas({
            ...formDatas,
            showUpdateDetails: fieldValue
          })
          break;
        default:
          break;
      }
    }
  };

  // 点击保存或者发布按钮
  const saveAndReleaseAnnouncement = (type: string) => {
    postAnnouncement("", type);
  };

  useEffect(() => {
    if (announceData) {
      //   有数据的时候需要显示在界面上
      if (announceData.code === 4001) { // 没有发布公告，需要显示默认信息。
        debugger
      } else if (announceData.data) { // 有数据，则展示出来

      }
    }


  }, [announceData])
  return (
    <PageContainer>
      <div style={{marginTop: -15}}>
        {/* Tab展示 */}
        <Tabs onChange={onTabChanged} type="card">
          <TabPane tab="升级前公告" key="before">
          </TabPane>
          <TabPane tab="升级后公告" key="after">
          </TabPane>
        </Tabs>

        {/* Tab内容 */}
        <div style={{backgroundColor: "white", height: "700px", marginTop: -15}}>
          <Form form={announceContent} autoComplete="off" onFieldsChange={whenFormvalueChanged}>
            <Form.Item label="升级时间:" name="announceTime" style={{paddingTop: 5}}>
              <DatePicker defaultValue={moment()} showTime/>
            </Form.Item>
            <Form.Item label="公告详情:" name="announceDetails_1" style={{marginTop: -20}}>
              <Input defaultValue={formDatas.announceDetails_1}/>
            </Form.Item>
            <Form.Item name="showAnnounceTime" className={"marginStyle"}>
              <label style={{color: "gray"}}>{formDatas.announceTime}</label>
            </Form.Item>
            <Form.Item name="announceDetails_2" className={"marginStyle"}>
              <TextArea rows={2}/>
            </Form.Item>
            <Form.Item label="展示查看更新详情:" name="showUpdateDetails" style={{marginTop: -20}}>
              <Radio.Group defaultValue={formDatas.showUpdateDetails}>
                <Radio value={"true"}>是</Radio>
                <Radio value={"false"}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>

          {/*预览界面 */}
          <div>
            <fieldset className={"fieldStyleA"}>
              <legend className={"legendStyleA"}>预览</legend>
              <div>
                <p>{"{"}</p>
                <p className={"preview"}>"UpgradeIntroDate":"{formDatas.announceTime}"</p>
                <p
                  className={"preview"}>"UpgradeDescription":"{`${formDatas.announceDetails_1}${formDatas.announceDetails_2}`}"</p>
                <p className={"preview"}> "isUpdated"：{formDatas.showUpdateDetails}</p>
                <p>{"}"}</p>
              </div>
            </fieldset>
          </div>

          {/* 保存按钮 */}
          <div style={{float: "right", marginTop: 20}}>
            <Button type="primary" className={"saveButtonStyle"} onClick={() => saveAndReleaseAnnouncement("save")}>
              保存
            </Button>
            <Button type="primary" className={"saveButtonStyle"} onClick={() => saveAndReleaseAnnouncement("release")}
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
