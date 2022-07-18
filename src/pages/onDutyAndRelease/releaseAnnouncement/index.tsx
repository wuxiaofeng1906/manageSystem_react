import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {errorMessage, sucMessage} from '@/publicMethods/showMessages';
import {Button, DatePicker, Form, Input, Radio, Tabs} from 'antd';
import './style.css';
import {useRequest} from 'ahooks';
import {postAnnouncement, getAnnouncement} from "./axiosRequest/apiPage";
import moment from "moment";

const {TextArea} = Input;
const {TabPane} = Tabs;
let releaseTime = "before"; // 升级前公告还是升级后公告
const Announce: React.FC<any> = (props: any) => {
  const releaseNum = props.location?.query?.releaseNum;
  const [announceContent] = Form.useForm();
  const [formDatas, setFormDatas] = useState({});

  const announceData = useRequest(() => getAnnouncement(releaseNum, "before")).data; // 关联值班名单

  // 展示界面数据
  const showFormData = (resData: any) => {
    //   有数据的时候需要显示在界面上
    if (resData.code === 4001) { // 没有发布公告，需要显示默认信息。
      setFormDatas({
        announcementId: 0,
        announceTime: moment().add(1, 'day').startOf('day').format("YYYY-MM-DD HH:mm:ss"),
        announceDetails_1: "亲爱的用户：您好，企企经营管理平台将于",
        announceDetails_2: "",
        showUpdateDetails: "true"
      });

    } else if (resData.data) { // 有数据，则展示出来
      const {data} = resData;
      const time = data.upgrade_time;
      const details = (data.upgrade_description).split(time);
      setFormDatas({
        announcementId: data.announcement_id,
        announceTime: time,
        announceDetails_1: details[0],
        announceDetails_2: details[1],
        showUpdateDetails: data.is_upgrade === "yes" ? "true" : "false"
      });
    }
  };

  // Tab 修改
  const onTabChanged = async (activeKey: string) => {

    releaseTime = activeKey;
    const announceContent = await getAnnouncement(releaseNum, activeKey);
    debugger;
    showFormData(announceContent);
  }

  // 当表单种数据被改变时候
  const whenFormValueChanged = (changedFields: any, allFields: any) => {
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
  const saveAndReleaseAnnouncement = async (releaseType: string) => {
    const basicInfo = {releaseNum, releaseType, releaseTime}
    const result = await postAnnouncement(formDatas, basicInfo);
    const operate = releaseType === "save" ? "保存" : "公告挂起";
    if (result.code === 200) {
      sucMessage(`${operate}成功！`);
    } else {
      errorMessage(`${operate}失败！`);
    }
  };

  useEffect(() => {
    if (announceData) {
      showFormData(announceData);
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
          <Form form={announceContent} autoComplete="off" onFieldsChange={whenFormValueChanged}>
            <Form.Item label="升级时间:" name="announceTime" style={{paddingTop: 5}}>
              <DatePicker value={moment(formDatas.announceTime)} showTime/>
            </Form.Item>
            <Form.Item label="公告详情:" name="announceDetails_1" style={{marginTop: -20}}>
              <Input value={formDatas.announceDetails_1}/>
            </Form.Item>
            <Form.Item name="showAnnounceTime" className={"marginStyle"}>
              <label style={{color: "gray"}}>{formDatas.announceTime}</label>
            </Form.Item>
            <Form.Item name="announceDetails_2" className={"marginStyle"}>
              <TextArea value={formDatas.announceDetails_2} rows={2}/>
            </Form.Item>
            <Form.Item label="展示查看更新详情:" name="showUpdateDetails" style={{marginTop: -20}}>
              <Radio.Group value={formDatas.showUpdateDetails}>
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
                  className={"preview"}>"UpgradeDescription":"{`${formDatas.announceDetails_1}${formDatas.announceTime}${formDatas.announceDetails_2}`}"</p>
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
