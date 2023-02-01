import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {errorMessage, sucMessage} from '@/publicMethods/showMessages';
import {Row, Col, Input, Radio, Tabs, InputNumber, Form, DatePicker, Button, Layout, Divider} from 'antd';
import style from './style.less';
import type {RadioChangeEvent} from 'antd';

const {Header, Footer, Sider, Content} = Layout;
import {useRequest} from 'ahooks';
import {postAnnouncement, getAnnouncement} from './axiosRequest/apiPage';
import moment from 'moment';
import {getHeight} from '@/publicMethods/pageSet';
import usePermission from '@/hooks/permission';
import {useParams} from 'umi';
import {isEmpty} from 'lodash';
import MessageCard from "@/pages/onlineSystem/announcement/announcementDetail/MessageCard";
import PopupCard from "@/pages/onlineSystem/announcement/announcementDetail/PopupCard";
import {display} from "html2canvas/dist/types/css/property-descriptors/display";

const {TextArea} = Input;
const {TabPane} = Tabs;

const Announce: React.FC<any> = (props: any) => {
  // const { id: releaseNum, status: operteStatus } = useParams() as {
  //   id: string;
  //   status: string;
  //   type: 'add' | 'detail';
  // };
  const [announcementNameForm] = Form.useForm();

  const [stepShow, setStepShow] = useState({
    msgCard: "inline",
    popCard: "none"
  });
  const cardChange = (e: RadioChangeEvent) => {

    e.target.value === "msgCard" ? setStepShow({
      msgCard: "inline",
      popCard: "none"
    }) : setStepShow({
      msgCard: "none",
      popCard: "inline"
    })
  }

  const saveMsgInfo = () => {
    const values = announcementNameForm.getFieldsValue();
    const content = document.getElementById("content")?.innerText;
    debugger;
    console.log(values, content)
  };

  // 监听删除键是否用于删除公告详情中的数据
  document.onkeydown = function (event: KeyboardEvent) {
    if (event?.code === "Backspace" && event.target?.innerText.endsWith("更新升级。更新功能：")) {
      return false;
    }
    return true;
  }
  return (
    <PageContainer>
      <div style={{marginTop: -15, background: 'white', padding: 10}}>
        <Form form={announcementNameForm}>
          <Form.Item
            label="升级模板："
            name="module："
            rules={[{required: true}]}
          >
            {/* 升级模板选择按钮 （消息卡片或者弹窗）*/}
            <Radio.Group onChange={cardChange} defaultValue={"msgCard"}>
              <Radio.Button value="msgCard" className={style.buttonStyle}>
                <img
                  src={require('../../../../../public/77Logo.png')}
                  width="100"
                  height="100"
                  alt="消息卡片"
                  title="消息卡片"
                />
                消息卡片
              </Radio.Button>
              <Radio.Button value="popupCard" className={style.marginStyle}>
                <img
                  src={require('../../../../../public/77Logo.png')}
                  width="100"
                  height="100"
                  alt="弹窗"
                  title="弹窗"
                />
                弹窗
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label={'公告名称'}
            name={'announce_name'}
            rules={[
              {
                required: true,
                validator: (r, v, callback) => {
                  if (isEmpty(v?.trim())) callback('请填写公告名称！');
                  else callback();
                },
              },
            ]}
          >
            <Input style={{minWidth: 300, width: "50%"}}/>
          </Form.Item>
          <Form.Item
            label={'升级时间'}
            name={'announce_time'}
            rules={[{required: true}]}
          >
            <DatePicker style={{minWidth: 300, width: "50%"}}/>
          </Form.Item>
          <Form.Item label={'公告详情'} name="announce_content" rules={[{required: true}]}>
            <div id={"content"} contentEditable={"true"}
                 style={{minWidth: 300, width: "50%", border: "solid 1px #F0F0F0", minHeight: 60}}>
              <label contentEditable={"false"} style={{color: "gray"}}>亲爱的用户：您好，企企经营管理平台已于 xx 时间更新升级。更新功能：</label>

            </div>
          </Form.Item>

          <div id={"popup"} style={{display: stepShow.popCard}}>
            <Row>
              <Col>
                <Form.Item label={'是否轮播'} name="announce_carousel" rules={[{required: true}]}>
                  <Radio.Group defaultValue={1}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="carouselNum" rules={[{required: true}]}>
                  <InputNumber defaultValue={5}></InputNumber> 张
                </Form.Item>
              </Col>
            </Row>
          </div>


        </Form>
        <Divider/>
        <Footer style={{height: 70, backgroundColor: "white", marginTop: -20}}>
          {/* 弹窗操作 */}
          <div id={"popup"} style={{display: stepShow.popCard}}>
            <Button
              type="primary"
              className={style.saveButtonStyle}
              style={{marginLeft: 10}}
            >下一步
            </Button>
          </div>


          {/* 消息卡片操作 */}
          <div id={"message"} style={{display: stepShow.msgCard}}>
            <Button
              type="primary"
              className={style.saveButtonStyle}
              style={{marginLeft: 10}}
              onClick={saveMsgInfo}
            >保存
            </Button>
            <Button
              className={style.commonBtn}
              style={{marginLeft: 10}}
            >一键发布
            </Button>
          </div>
        </Footer>
      </div>
    </PageContainer>
  );
};

export default Announce;
