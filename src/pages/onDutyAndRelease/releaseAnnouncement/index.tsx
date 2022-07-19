import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {errorMessage, sucMessage} from '@/publicMethods/showMessages';
import {Button, DatePicker, Form, Input, Radio, Tabs, Divider} from 'antd';
import './style.css';
import {useRequest} from 'ahooks';
import {postAnnouncement, getAnnouncement} from "./axiosRequest/apiPage";
import moment from "moment";
import {getHeight} from "@/publicMethods/pageSet";

const {TextArea} = Input;
const {TabPane} = Tabs;
let releaseTime = "before"; // 升级前公告还是升级后公告
let announceId = 0; // 记录升级ID
const Announce: React.FC<any> = (props: any) => {
  const releaseNum = props.location?.query?.releaseNum;
  const [announceContentForm] = Form.useForm();
  const [pageHeight, setPageHeight] = useState(getHeight());

  // 当表单种数据被改变时候
  const whenFormValueChanged = (changedFields: any, allFields: any) => {
    if (changedFields && changedFields.length > 0) {
      const fieldName = (changedFields[0].name)[0];
      let fieldValue = changedFields[0].value;
      switch (fieldName) {
        case "announceTime":
          fieldValue = moment(fieldValue).format("YYYY-MM-DD HH:mm:ss");
          announceContentForm.setFieldsValue({
            showAnnounceTime: fieldValue,
          });
          break;
        case "announceDetails_1":
          announceContentForm.setFieldsValue({
            announceDetails_1: fieldValue,
          });

          break;
        case "announceDetails_2":
          announceContentForm.setFieldsValue({
            announceDetails_2: fieldValue,
          });

          break;
        case "showUpdateDetails":
          announceContentForm.setFieldsValue({
            showUpdateDetails: fieldValue,
          });
          break;
        default:
          break;
      }

      const formData = announceContentForm.getFieldsValue();
      // 无论前面更新了哪个字段，后面的预览都要更新
      announceContentForm.setFieldsValue({
        UpgradeIntroDate: `"${formData.showAnnounceTime}"`,
        UpgradeDescription: `"${formData.announceDetails_1}${formData.showAnnounceTime}${formData.announceDetails_2}"`,
        isUpdated: `"${formData.showUpdateDetails}"`
      });
    }
  };

  // 点击保存或者发布按钮
  const saveAndReleaseAnnouncement = async (releaseType: string) => {
    const basicInfo = {releaseNum, releaseType, releaseTime, announceId};
    const formDatas = announceContentForm.getFieldsValue();
    const result = await postAnnouncement(formDatas, basicInfo);
    const operate = releaseType === "save" ? "保存" : "公告挂起";
    if (result.code === 200) {
      sucMessage(`${operate}成功！`);
    } else {
      errorMessage(`${operate}失败！`);
    }
  };

  // 展示界面数据
  const showFormData = (resData: any) => {
    //   有数据的时候需要显示在界面上
    if (resData.code === 4001) { // 没有发布公告，需要显示默认信息。
      const initTime = moment().add(1, 'day').startOf('day');
      announceContentForm.setFieldsValue({
        announceTime: initTime,
        announceDetails_1: "亲爱的用户：您好，企企经营管理平台将于",
        showAnnounceTime: initTime.format("YYYY-MM-DD HH:mm:ss"),
        announceDetails_2: "",
        showUpdateDetails: "true",

        //   以下为预览数据
        UpgradeIntroDate: `"${initTime.format("YYYY-MM-DD HH:mm:ss")}"`,
        UpgradeDescription: "",
        isUpdated: "true"
      });
    } else if (resData.data) { // 有数据，则展示出来
      const {data} = resData;
      const time = data.upgrade_time;
      const details = (data.upgrade_description).split(time);

      announceId = data.announcement_id;
      announceContentForm.setFieldsValue({
        announceTime: moment(time),
        announceDetails_1: details[0],
        showAnnounceTime: moment(time).format("YYYY-MM-DD HH:mm:ss"),
        announceDetails_2: details[1],
        showUpdateDetails: data.is_upgrade === "yes" ? "true" : "false",

        //   以下为预览数据
        UpgradeIntroDate: `"${moment(time).format("YYYY-MM-DD HH:mm:ss")}"`,
        UpgradeDescription: `"${data.upgrade_description}"`,
        isUpdated: data.is_upgrade === "yes" ? "true" : "false"
      });
    }
  };

  // Tab 修改
  const onTabChanged = async (activeKey: string) => {
    releaseTime = activeKey;
    const announceContent = await getAnnouncement(releaseNum, activeKey);
    showFormData(announceContent);
  }

  const announceData = useRequest(() => getAnnouncement(releaseNum, "before")).data; // 关联值班名单
  useEffect(() => {
    if (announceData) {
      showFormData(announceData);
    }
  }, [announceData]);

  window.onresize = function () {
    setPageHeight(getHeight());
  };
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
        <div style={{backgroundColor: "white", height: pageHeight, minHeight: "500px", marginTop: -15}}>
          <Form form={announceContentForm} autoComplete="off" onFieldsChange={whenFormValueChanged} style={{marginLeft:15}}>
            <Form.Item label="升级时间:" name="announceTime" style={{paddingTop: 5}}>
              <DatePicker showTime/>
            </Form.Item>
            <Form.Item label="公告详情:" name="announceDetails_1" style={{marginTop: -15}}>
              <Input/>
            </Form.Item>
            <Form.Item name="showAnnounceTime" className={"itemStyle"}>
              <Input style={{color: "gray"}} disabled bordered={false}></Input>
            </Form.Item>
            <Form.Item name="announceDetails_2" className={"itemStyle"}>
              <TextArea rows={2}/>
            </Form.Item>
            <Form.Item label="展示查看更新详情:" name="showUpdateDetails" style={{marginTop: -20}}>
              <Radio.Group>
                <Radio value={"true"}>是</Radio>
                <Radio value={"false"}>否</Radio>
              </Radio.Group>
            </Form.Item>
            {/* 预览界面 */}
            <Form.Item style={{marginTop: -20}}>
              <Divider orientation="left" style={{fontSize:"small"}}>预览</Divider>
              <div style={{marginTop: -20}}>
                <Form.Item>{"{"}</Form.Item>
                <Form.Item label={'"UpgradeIntroDate"'} name="UpgradeIntroDate" className={"marginStyle"}>
                  <Input disabled bordered={false} style={{color: "black"}}></Input>
                </Form.Item>
                <Form.Item label={'"UpgradeDescription"'} name="UpgradeDescription" className={"marginStyle"}>
                  <Input disabled bordered={false} style={{color: "black"}}></Input>
                </Form.Item>
                <Form.Item label={'"isUpdated"'} name="isUpdated" className={"marginStyle"}>
                  <Input disabled bordered={false} style={{color: "black"}}></Input>
                </Form.Item>
                <Form.Item style={{marginTop: -25}}>{"}"}</Form.Item>
              </div>
              <Divider orientation="left" style={{marginTop: -20}}></Divider>
            </Form.Item>
            {/*<fieldset className={"fieldStyleA"}>*/}
            {/*  <legend className={"legendStyleA"}>预览</legend>*/}
            {/*</fieldset>*/}

          </Form>

          {/* 保存按钮 */}
          <div style={{float: "right"}}>
            <Button type="primary" className={"saveButtonStyle"}
                    onClick={() => saveAndReleaseAnnouncement("save")}>
              保存
            </Button>
            <Button type="primary" className={"saveButtonStyle"} style={{marginLeft: 10}}
                    onClick={() => saveAndReleaseAnnouncement("release")}>
              一键挂起公告
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Announce;
