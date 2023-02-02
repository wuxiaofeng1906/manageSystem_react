import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Row, Col, Input, Radio, Tabs, InputNumber, Form, DatePicker, Button, Layout, Divider} from 'antd';
import style from './style.less';
import type {RadioChangeEvent} from 'antd';
import moment from 'moment';
import {history} from 'umi';
import {isEmpty} from 'lodash';
import dayjs from "dayjs";

const {Footer} = Layout;
const Announce: React.FC<any> = (props: any) => {
  const [announcementForm] = Form.useForm();
  const [stepShow, setStepShow] = useState<any>({
    msgCard: "inline",
    popCard: "none"
  });
  const [carouselNumShow, setCarouselNumShow] = useState<string>("none");
  const [releaseTime, setReleaseTime] = useState<string>(dayjs().format("YYYY-MM-DD HH:mm:ss"));
  // 设置显示哪个模板
  const cardChange = (e: RadioChangeEvent) => {
    if (e.target.value === "msgCard") {
      setStepShow({
        msgCard: "inline",
        popCard: "none"
      });
      return;
    }

    setStepShow({
      msgCard: "none",
      popCard: "inline"
    });
    // if (announcementForm.getFieldValue("announce_carousel") === undefined) setCarouselNumShow("inline");
  }

  // 保存消息卡面数据
  const saveMsgInfo = () => {
    const nsg = announcementForm.getFieldsValue();
    const announceMsg = document.getElementById("annCont")?.innerText;

  };

  // 一键发布
  const releaseMsgInfo = () => {

  };

  // 跳转到下一页
  const toNextPage = () => {
    if (stepShow.popCard !== "inline") return;
    //是否轮播
    const carInfo = announcementForm.getFieldsValue()
    if (carInfo.announce_carousel === 0) {//  不是轮播
      history.push('/onlineSystem/PopupCard/false/-1');
    } else {
      history.push(`/onlineSystem/PopupCard/true/${carInfo.carouselNum}`);
    }
  }

  // 监听删除键是否用于删除公告详情中的数据
  document.onkeydown = function (event: KeyboardEvent) {
    if (event?.code === "Backspace" && event.target?.innerText.endsWith("更新升级。更新功能：")) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    announcementForm.setFieldsValue({
      announce_time: moment(),
      announce_carousel: 1,
      carouselNum: 5
    });
    setCarouselNumShow("inline")
  }, []);
  return (
    <PageContainer>
      <div style={{marginTop: -15, background: 'white', padding: 10}}>
        <Form form={announcementForm}>
          <Form.Item label="升级模板：" name="module："
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
          <Form.Item label={'公告名称'} name={'announce_name'}
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
            <DatePicker style={{minWidth: 300, width: "50%"}} showTime
                        onChange={(e, time) => setReleaseTime(time)}/>
          </Form.Item>

          <Form.Item label={'公告详情'} name="announce_content" rules={[{required: true}]}>
            <div id={"annCont"} contentEditable={"true"}
                 style={{minWidth: 300, width: "50%", border: "solid 1px #F0F0F0", minHeight: 60, textIndent: "2em"}}>
              <label contentEditable={"false"}
                     style={{color: "gray"}}>亲爱的用户：您好，企企经营管理平台已于 {releaseTime} 更新升级。更新功能：</label>

            </div>
          </Form.Item>

          <div id={"popup"} style={{display: stepShow.popCard}}>
            <Row>
              <Col>
                <Form.Item label={'是否轮播'} name="announce_carousel" rules={[{required: true}]}>
                  <Radio.Group onChange={(e: RadioChangeEvent) => {
                    e.target?.value === 1 ? setCarouselNumShow("inline") : setCarouselNumShow("none");
                  }}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="carouselNum" rules={[{required: true}]} style={{display: carouselNumShow}}>
                  <InputNumber></InputNumber>
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
              onClick={toNextPage}
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
              onClick={releaseMsgInfo}
            >一键发布
            </Button>
          </div>
        </Footer>
      </div>
    </PageContainer>
  );
};

export default Announce;
