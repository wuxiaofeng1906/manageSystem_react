import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Row, Col, Input, Radio, InputNumber, Form, DatePicker, Button, Layout, Divider, Modal, Space, Spin} from 'antd';
import style from './style.less';
import type {RadioChangeEvent} from 'antd';
import moment from 'moment';
import {history} from 'umi';
import {isEmpty} from 'lodash';
import dayjs from "dayjs";
import {SIZE} from "../constant";
import {saveAnnounceContent, announceIsOnlined, oneKeyToRelease} from "./axiosRequest/apiPage";
import {updateAnnouncement} from "./axiosRequest/apiPageForUpdate";
import {queryAnnounceDetail} from "./axiosRequest/gqlPage";
import {errorMessage, sucMessage} from "@/publicMethods/showMessages";
import {useModel} from "@@/plugin-model/useModel";
import {vertifyFieldForCommon, dealPopDataFromService} from "./dataAnalysis";
import {Prompt} from "react-router-dom";

const {TextArea} = Input;
// 重新合并公告数据
const {Footer} = Layout;
const Announce: React.FC<any> = (props: any) => {
  const {
    commonData, setAnnPopData, setCommonData, showPulishButton, setShowPulishButton, oldCommonData, setOldCommonData
  } = useModel('announcement');
  const [loading, setLoading] = useState(false);
  // 轮播页面改小的选择
  const [pageChoice, setPageChoice] = useState(false);
  // 是否可以离开这个页面（只有在数据已经保存了才能离开）
  // const [leaveShow, setLeaveShow] = useState(false);
  // 公告列表过来的数据（releaseName:公告名称, releaseID：公告id, type：新增还是删除）
  const {releaseName, releaseID, type} = props.location?.query;
  const [announcementForm] = Form.useForm();
  const [carousePageForm] = Form.useForm();
  // 如果是消息卡片，则显示一键发布和保存按钮，如果是弹窗卡片，则显示下一步按钮
  const [stepShow, setStepShow] = useState<any>({
    msgCard: "inline",
    popCard: "none"
  });
  // 轮播页数展示控制
  const [carouselNumShow, setCarouselNumShow] = useState<string>("none");
  // 发布时间
  const [releaseTime, setReleaseTime] = useState<string>(dayjs().format("YYYY-MM-DD HH:mm"));
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
  };

  const goToNext = (formInfo: any, isClearAllTab: any = undefined) => {
    setCommonData({...formInfo, clearTabContent: isClearAllTab});
    history.push('/onlineSystem/PopupCard' + props.location?.search);
  };

  // 跳转到下一页
  const nextPageClick = () => {
    if (stepShow.popCard !== "inline") return;
    const formInfo = announcementForm.getFieldsValue();
    if (vertifyFieldForCommon(formInfo)) {
      // 如果轮播页数减少，需要进行提示，是删除那些页。
      // 轮播图张数已改小，请选择删除轮播页面
      // 删除全部内容，重新创建
      // 删除后面多余张数的内容
      // 取消/确定
      if (oldCommonData && oldCommonData.carouselNum > formInfo.carouselNum) {
        setPageChoice(true);
      } else {
        goToNext(formInfo);
      }
    }
  };

  // 监听删除键是否用于删除公告详情中的数据
  document.onkeydown = function (event: KeyboardEvent) {
    if (event?.code === "Backspace" && event.target?.value.endsWith("更新升级。更新功能：")) {
      return false;
    }
    return true;
  }

  // 判断是否有上线，有上线才会进行一键发布
  const pulishButtonVisible = async () => {
    const result = await announceIsOnlined(releaseID);
    if (result.ok) {
      setShowPulishButton(true);
    }
  }

  // 根据公告ID获取对应的详细数据
  const getDataByReleaseId = async () => {
    const dts = await queryAnnounceDetail(releaseID);
    const {NoticeEdition} = dts;
    if (NoticeEdition && NoticeEdition.length) {
      const noticeDetails = NoticeEdition[0];
      const formdata = {
        announce_carousel: noticeDetails.isCarousel ? 1 : 0,
        announce_content: noticeDetails.description,
        announce_name: noticeDetails.iteration,
        announce_time: moment(noticeDetails.updatedTime),
        carouselNum: noticeDetails.pageSize,
        modules: noticeDetails.templateTypeId
      };
      // setReleaseTime(dayjs(noticeDetails.updatedTime).format("YYYY-MM-DD HH:mm"))
      setCommonData(formdata);
      setOldCommonData({...formdata, releaseID});
      announcementForm.setFieldsValue(formdata);
      // 显示下一步按钮还是保存按钮
      if (formdata.modules === "2") { // 如果是弹窗的话，格式化
        // 还需要在state中保存弹窗的数据
        setAnnPopData(dealPopDataFromService(NoticeEdition))
        setStepShow({
          msgCard: "none",
          popCard: "inline"
        });
        if (formdata.announce_carousel === 1) setCarouselNumShow("inline");
      }

      return;
    }
    errorMessage("明细获取失败！");
  }


  useEffect(() => {
    setLoading(true);

    // 一键发布按钮是否展示
    pulishButtonVisible();

    // 先设置数据源（commonData：当前页面的数据）
    if (type === "add") {
      // 默认展示的数据
      announcementForm.setFieldsValue({
        announce_content: `亲爱的用户：您好，企企经营管理平台已于${releaseTime}更新升级。更新功能：`,
        modules: "1",
        // announce_name: `${releaseName}升级公告`,
        // announce_time: moment(),
        announce_carousel: 0, // 默认为否
        carouselNum: 5
      });
      setCarouselNumShow("none");
      setCommonData(null);
      setOldCommonData(null);
      setAnnPopData([]);
    } else if (type === "detail") {
      // 如果是从列表页面过来，并且commonData 没有数据，则需要根据id和名字查询页面数据，只要type是details，表示一定是从列表过来的，下一步返回的数据没有这个字段
      getDataByReleaseId()
    } else if (commonData && !type) { // 下一页返回上来的数据

      // 先判断有没有存在原始数据（commonData），有的话则显示原始数据(存储的之前编辑的数据，跳转到下一页后又返回来了)
      // 以下是已有的数据（下一页返回或者历史记录）
      announcementForm.setFieldsValue({
        announce_name: commonData.announce_name,
        modules: commonData.modules,
        announce_time: moment(commonData.announce_time),
        announce_content: commonData.announce_content,
        announce_carousel: commonData.announce_carousel,
        carouselNum: commonData.carouselNum
      });
      if (commonData.modules === 1) { // 如果是消息卡片
        setStepShow({
          msgCard: "inline",
          popCard: "none"
        });
      } else {
        if (commonData.announce_carousel === 0) {
          //   不轮播，不展示轮播页数
          setCarouselNumShow("none");
        } else {
          setCarouselNumShow("inline");
        }
        setStepShow({
          msgCard: "none",
          popCard: "inline"
        });
      }
    } else {
      errorMessage("数据获取错误！")
    }

    setLoading(false);

  }, []);
  // 保存数据
  const saveMsgInfo = async () => {
    // const announceMsg = document.getElementById("announceContent")?.innerText;
    const formInfo = announcementForm.getFieldsValue();
    // 这个点击保存的，模板一定是消息卡片
    if (vertifyFieldForCommon(formInfo)) {
      let result: any;
      // 新增和修改调用不一样的接口
      if (type === "detail") {
        result = await updateAnnouncement(releaseID, formInfo, oldCommonData);
      } else if (type === "add") {
        result = await saveAnnounceContent({...formInfo});
      }
      if (result.ok) {
        sucMessage("保存成功！");
        history.push('./announceList')
        return;
      } else {
        result.message ? errorMessage(result.message) : errorMessage("保存失败！");
      }
    }
  };

  // 一键发布
  const releaseMsgInfo = async () => {
    const releaseResult = await oneKeyToRelease("");
    if (releaseResult.ok) {
      sucMessage("公告发布成功！")
    } else {
      errorMessage(releaseResult.message);
    }
  };


  return (
    <PageContainer>
      <Prompt
        when={false}
        message={'离开当前页后，所有未保存的数据将会丢失，请确认是否仍要离开？'}
      />
      <Spin size={"large"} spinning={loading} tip={"数据加载中..."}>
        <div style={{marginTop: -15, background: 'white', padding: 10}}>
          <Form form={announcementForm} autoComplete={"off"}
                onFieldsChange={() => {
                  // if (!leaveShow) setLeaveShow(true);
                }}>
            <Form.Item label="升级模板：" name="modules" rules={[{required: true}]}>
              {/* 升级模板选择按钮 （消息卡片或者弹窗）*/}
              <Radio.Group onChange={cardChanged}>
                <Radio.Button value={"1"} style={{width: 140, height: 100}}>
                  <img
                    {...SIZE}
                    src={require('../../../../../public/msgCard.png')}
                  />
                  <span style={{marginLeft: 25}}>消息卡片</span>
                </Radio.Button>
                <Radio.Button value={"2"} style={{width: 140, height: 100, marginLeft: 25}}>
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
              <Input style={{minWidth: 300, width: "50%"}} placeholder={"请填写公告名称"}/>
            </Form.Item>

            <Form.Item label={'升级时间'} name={'announce_time'}
                       rules={[{
                         required: true, validator: (r, v, callback) => {
                           if (v === undefined) callback('请填写升级时间！');
                           else callback();
                         }
                       }]}>
              <DatePicker style={{minWidth: 300, width: "50%"}} showTime allowClear={false} format="YYYY-MM-DD HH:mm"
                          onChange={(e, time) => {
                            // 先获取原始数据，再改变数据
                            let source = announcementForm.getFieldValue("announce_content");
                            const updateFunc = source.split("更新升级。更新功能：");
                            // 用原来的时间替换选中的时间
                            announcementForm.setFieldsValue({
                              announce_content: `亲爱的用户：您好，企企经营管理平台已于${time}更新升级。更新功能：${updateFunc[1]}`
                            });
                            setReleaseTime(time);
                          }}/>
            </Form.Item>

            <Form.Item label={'公告详情'} name="announce_content" rules={[{required: true}]}>
              {/*<div id={"announceContent"} contentEditable={"true"}*/}
              {/*     style={{minWidth: 300, width: "50%", border: "solid 1px #F0F0F0", minHeight: 60, textIndent: "2em"}}>*/}
              {/*  <label*/}
              {/*    contentEditable={"false"}*/}
              {/*    style={{color: "gray"}}>亲爱的用户：您好，企企经营管理平台已于 {releaseTime} 更新升级。更新功能：*/}
              {/*  </label>*/}
              {/*</div>*/}

              <TextArea rows={2} style={{minWidth: 300, width: "50%"}}/>
            </Form.Item>

            <div id={"popup"} style={{display: stepShow.popCard}}>
              <Row>
                <Col>
                  <Form.Item label={'是否轮播'} name="announce_carousel" rules={[{required: true}]}>
                    <Radio.Group onChange={(e: RadioChangeEvent) => {
                      if (e.target?.value === 1) {
                        setCarouselNumShow("inline");
                        announcementForm.setFieldsValue({carouselNum: 5});
                      } else {
                        setCarouselNumShow("none");
                      }
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
                style={{marginLeft: 10}} onClick={nextPageClick}>下一步
              </Button>
            </div>
            {/* 消息卡片操作 */}
            <div id={"message"} style={{display: stepShow.msgCard}}>
              <Button
                type="primary" className={style.saveButtonStyle}
                style={{marginLeft: 10}} onClick={saveMsgInfo}>保存
              </Button>
              <Button
                className={style.commonBtn} style={{marginLeft: 10, display: showPulishButton ? "inline" : "none"}}
                onClick={releaseMsgInfo}>一键发布
              </Button>
            </div>
          </Footer>
        </div>
      </Spin>


      <Modal title="轮播页操作" visible={pageChoice}
             centered maskClosable={false} destroyOnClose={true}
             onOk={() => {
               const v = carousePageForm.getFieldValue("clearChoice");
               //继续跳转到下一页
               goToNext(announcementForm.getFieldsValue(), v ? true : false);
             }}
             onCancel={() => {
               setPageChoice(false);
             }}>
        <Form form={carousePageForm} preserve={false}>

          <p>轮播图张数已改小，请选择删除轮播页面:</p>
          <Form.Item name={'clearChoice'} style={{textIndent: "10px"}}>
            <Radio.Group defaultValue={false}>
              <Space direction="vertical">
                <Radio value={false}>删除后面多余张数的内容</Radio>
                <Radio value={true}>删除全部内容，重新创建</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>

      </Modal>

    </PageContainer>
  );
};

export default Announce;
