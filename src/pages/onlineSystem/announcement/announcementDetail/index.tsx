import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Row, Col, Input, Radio, InputNumber, Form, DatePicker, Button, Layout, Divider, Spin} from 'antd';
import style from './style.less';
import type {RadioChangeEvent} from 'antd';
import moment from 'moment';
import {history, useParams} from 'umi';
import {isEmpty} from 'lodash';
import dayjs from "dayjs";
import {SIZE} from "./constant";
import {saveAnnounceContent} from "./axiosRequest/apiPage";
import {errorMessage, sucMessage} from "@/publicMethods/showMessages";
import {useModel} from "@@/plugin-model/useModel";
import {vertifyFieldForCommon} from "./dataAnalysis";
import {Prompt} from "react-router-dom";

const {Footer} = Layout;
const Announce: React.FC<any> = (props: any) => {
  const {anCommonData, setAnCommonData} = useModel('announcement');
  // 是否可以离开这个页面（只有在数据已经保存了才能离开）
  const [leaveShow, setLeaveShow] = useState(false);
  // 公告列表过来的数据
  const {id: releaseNum} = useParams() as { id: string; type: 'add' | 'detail'; };
  const [announcementForm] = Form.useForm();
  // 如果是消息卡片，则显示一键发布和保存按钮，如果是弹窗卡片，则显示下一步按钮
  const [stepShow, setStepShow] = useState<any>({
    msgCard: "inline",
    popCard: "none"
  });
  // 轮播页数展示控制
  const [carouselNumShow, setCarouselNumShow] = useState<string>("none");
  // 发布时间
  const [releaseTime, setReleaseTime] = useState<string>(dayjs().format("YYYY-MM-DD HH:mm:ss"));
  // 设置显示哪个模板(消息或者弹窗)
  const cardChanged = (e: RadioChangeEvent) => {
    if (e.target.value === "1") { // 1 是消息弹窗
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
    if (announcementForm.getFieldValue("announce_carousel") === 1) setCarouselNumShow("inline");
  }
  // 跳转到下一页
  const toNextPage = () => {
    if (stepShow.popCard !== "inline") return;
    const formInfo = announcementForm.getFieldsValue();
    const announceMsg = document.getElementById("announceContent")?.innerText;
    if (vertifyFieldForCommon(formInfo, announceMsg)) {
      setAnCommonData({...formInfo, announceMsg});
      history.push('/onlineSystem/PopupCard');
    }
  }
  // 监听删除键是否用于删除公告详情中的数据
  document.onkeydown = function (event: KeyboardEvent) {

    if (event?.code === "Backspace" && announcementForm.getFieldValue("announce_content").endsWith("更新升级。更新功能：")) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    // 先判断有没有存在原始数据（anCommonData），有的话则显示原始数据(存储的之前编辑的数据，跳转到下一页后又返回来了)
    if (anCommonData) {
      // 以下是已有的数据（下一页返回或者历史记录）
      announcementForm.setFieldsValue({
        announce_name: anCommonData.announce_name,
        modules: anCommonData.modules,
        announce_time: moment(anCommonData.announce_time),
        announce_content: anCommonData.announce_content,
        announce_carousel: anCommonData.announce_carousel,
        carouselNum: anCommonData.carouselNum
      });
      if (anCommonData.modules === 1) { // 如果是消息卡片
        setStepShow({
          msgCard: "inline",
          popCard: "none"
        });
      } else {
        setStepShow({
          msgCard: "none",
          popCard: "inline"
        });
      }
      setCarouselNumShow("inline");
    } else {
      announcementForm.setFieldsValue({
        announce_content: `亲爱的用户：您好，企企经营管理平台已于${releaseTime}更新升级。更新功能：`,
        modules: "1",
        announce_name: `${dayjs().format("YYYYMMDD")}升级公告`,
        announce_time: moment(),
        announce_carousel: 0, // 默认为否
        carouselNum: 5
      });
      setCarouselNumShow("none");
    }
  }, []);
  // 保存消息卡面数据
  const saveMsgInfo = async () => {
    const announceMsg = document.getElementById("announceContent")?.innerText;
    const formInfo = announcementForm.getFieldsValue();
    if (vertifyFieldForCommon(formInfo, announceMsg)) {
      const result = await saveAnnounceContent({...formInfo, announceMsg});
      if (result.ok) {
        sucMessage("保存成功！");
        return;
      }
    }
  };

  // 一键发布
  const releaseMsgInfo = () => {

  };

  return (
    <PageContainer>
      <Prompt
        when={leaveShow}
        message={'离开当前页后，所有未保存的数据将会丢失，请确认是否仍要离开？'}
      />
      <div style={{marginTop: -15, background: 'white', padding: 10}}>
        <Form form={announcementForm} autoComplete={"off"}
              onFieldsChange={() => {
                if (!leaveShow) setLeaveShow(true);
              }}>
          <Form.Item label="升级模板：" name="modules" rules={[{required: true}]}>
            {/* 升级模板选择按钮 （消息卡片或者弹窗）*/}
            <Radio.Group onChange={cardChanged}>
              <Radio.Button value={"1"} className={style.buttonStyle}>
                <img
                  {...SIZE}
                  src={require('../../../../../public/msgCard.png')}
                />
                <span style={{marginLeft: 25}}>消息卡片</span>
              </Radio.Button>
              <Radio.Button value={"2"} className={style.marginStyle}>
                <img
                  {...SIZE}
                  src={require('../../../../../public/popCard.png')}
                />
                <span style={{marginLeft: 30}}>弹窗</span>
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item label={'公告名称'} name={'announce_name'}
                     rules={[{
                       required: true,
                       validator: (r, v, callback) => {
                         if (isEmpty(v?.trim())) callback('请填写公告名称！');
                         else callback();
                       },
                     },]}>
            <Input style={{minWidth: 300, width: "50%"}}/>
          </Form.Item>

          <Form.Item label={'升级时间'} name={'announce_time'}
                     rules={[{required: true}]}>
            <DatePicker style={{minWidth: 300, width: "50%"}} showTime allowClear={false}
                        onChange={(e, time) => setReleaseTime(time)}/>
          </Form.Item>

          <Form.Item label={'公告详情'} name="announce_content" rules={[{required: true}]}>
            {/*<div id={"announceContent"} contentEditable={"true"}*/}
            {/*     style={{minWidth: 300, width: "50%", border: "solid 1px #F0F0F0", minHeight: 60, textIndent: "2em"}}>*/}
            {/*  <label*/}
            {/*    contentEditable={"false"}*/}
            {/*    style={{color: "gray"}}>亲爱的用户：您好，企企经营管理平台已于 {releaseTime} 更新升级。更新功能：*/}
            {/*  </label>*/}
            {/*</div>*/}

            <Input style={{minWidth: 300, width: "50%"}}/>
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
        {/* 我是一条分割线 */}
        <Divider/>
        {/* 一键发布、保存、下一步 */}
        <Footer style={{height: 70, backgroundColor: "white", marginTop: -20}}>
          {/* 弹窗操作 */}
          <div id={"popup"} style={{display: stepShow.popCard}}>
            <Button
              type="primary" className={style.saveButtonStyle}
              style={{marginLeft: 10}} onClick={toNextPage}>下一步
            </Button>
          </div>
          {/* 消息卡片操作 */}
          <div id={"message"} style={{display: stepShow.msgCard}}>
            <Button
              type="primary" className={style.saveButtonStyle}
              style={{marginLeft: 10}} onClick={saveMsgInfo}>保存
            </Button>
            <Button
              className={style.commonBtn} style={{marginLeft: 10}}
              onClick={releaseMsgInfo}>一键发布
            </Button>
          </div>
        </Footer>
      </div>
    </PageContainer>
  );
};

export default Announce;
