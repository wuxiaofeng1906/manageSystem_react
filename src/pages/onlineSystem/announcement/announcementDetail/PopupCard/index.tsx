import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {
  Button, Form, Input, Row, Col, Modal, Upload, Image, Radio, Tabs, Divider, Layout, UploadProps,
  Spin
} from 'antd';
// import {useParams} from "umi";
import {history} from "@@/core/history";
import style from '../style.less';
import {PlusCircleOutlined, UploadOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {getYuQueContent, saveAnnounceContent} from '../axiosRequest/apiPage';
import {analysisSpecialTitle, vertifyFieldForPopup, tabsPanel} from "../dataAnalysis";
import {errorMessage, sucMessage} from "@/publicMethods/showMessages";
import {isEmpty} from "lodash";
import {matchYuQueUrl} from "@/publicMethods/regularExpression";
import {useModel} from "@@/plugin-model/useModel";
import {defaultImgsUrl, bannerTips} from "../uploadPic/index";
import {getS3Key} from "../uploadPic/NoticeImageUploader";


// 当前的tab页面
let currentTab = 1;
const {Footer} = Layout;
const PopupCard: React.FC<any> = (props: any) => {
  const {anCommonData, setAnCommonData, anPopData, setAnnPopData} = useModel('announcement');
  const [dtForm] = Form.useForm();
  // isCarousel是否轮播 ，轮播张数
  // const {isCarousel, count} = useParams() as { isCarousel: string; count: string };
  // 图片上传框
  const [picModalState, setPicModalState] = useState({
    visible: false,
    checkedImg: ""
  });

  // 图片上传文件
  const [s3ServiceInfo, setS3ServiceInfo] = useState({fields: {}, url: ""});
  const [spinLoading, setSpinLoading] = useState(false);
  useEffect(() => {
    // 初始化表单(不知道怎么设置值的格式时，可以先获取值，按照获取值的格式来写)
    dtForm.setFieldsValue({
      picLayout: "1", // 默认上下布局
      ptyGroup: [{ // 默认一组特性
        first: "",
        seconds: [{"second": ""}]
      }]
    });
    // 轮播时记录数据
    if (anCommonData?.announce_carousel === 1) {
      let tabsContent: any = [];
      for (let i = 0; i < anCommonData?.carouselNum; i++) {
        tabsContent.push({
          tabPage: i + 1,
          tabsContent: {}
        })
      }
      setAnnPopData(tabsContent)
    }

  }, []);

  // 同步语雀信息
  const syncYuqueInfo = async () => {
    const yuQueUrl = dtForm.getFieldValue("yuQueUrl");
    if (isEmpty(yuQueUrl) || !matchYuQueUrl(yuQueUrl)) {
      errorMessage("请输入语雀迭代版本地址！");
      return;
    }
    // 加载中进度显示
    setSpinLoading(true);
    const specialTitles = await getYuQueContent(yuQueUrl);
    if (specialTitles.ok) {
      dtForm.setFieldsValue({
        ptyGroup: analysisSpecialTitle(specialTitles?.data)
      });
    } else {
      errorMessage("从语雀获取信息失败！")
    }
    setSpinLoading(false);
  };

  // 如果时轮播则保存轮播数据 ，动态保存编辑数据（点击保存时保存当前页面），切换页面时保存已有数据的页面
  const getPopupSource = (currentKey: number) => {
    const specialList = dtForm.getFieldsValue();
    // 覆盖已有当前页的数据或者添加新数据
    const oldList = [...anPopData];
    oldList.map((v: any) => {
      v.tabPage === currentKey ? v.tabsContent = specialList : v.tabsContent;
    });
    setAnnPopData(oldList);

    // 返回值共保存按钮使用
    return oldList;
  }
  // tab切换
  const onTabsChange = (key: string) => {
    // 先保存切换前的tab数据，后看下一个tab有没有存数据，若有则展示，若没有则赋值为空
    getPopupSource(currentTab);
    const oldList = [...anPopData];
    oldList.map((v: any) => {
      if (v.tabPage === Number(key)) {
        if (JSON.stringify(v.tabsContent) !== "{}") {
          dtForm.setFieldsValue(v.tabsContent)
        } else {
          dtForm.resetFields();
          dtForm.setFieldsValue({"picLayout": "1"});
        }
      }
    });
    //  需要最后再赋值当前tab页码
    currentTab = Number(key);
  };

  // 保存数据
  const onFinish = async (popData: any) => {
    let finalData = [popData];
    // 如果是轮播则先放到state中再保存
    if (anCommonData?.announce_carousel === 1) {
      finalData = getPopupSource(currentTab);
    }

    if (vertifyFieldForPopup([popData])) {
      // 需要验证必填项
      const result = await saveAnnounceContent(anCommonData, finalData);
      if (result.ok) {
        sucMessage("保存成功！")
        return;
      }
      errorMessage("保存失败！");
    }

  };

  // 选择图片时
  const picChecked = (e: any) => {
    if (e.target.tagName === 'LI' || e.target.tagName === 'IMG') {
      setPicModalState({...picModalState, checkedImg: e.target.currentSrc})
    }
  }

  const upProps: UploadProps = {
    name: 'file',
    // action: 'http://baseapp.cn-northwest-0.77hub.com/baseapp/Attachment/signature/post?fileName=xxx.jpg&isPublicRead=true&isHttp=false',
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload: async (file) => {
      // debugger
      //   获取鉴权
      const s3Info = await getS3Key(file.name);
      debugger
      if (s3Info) {
        setS3ServiceInfo(s3Info);
        return true
      }
      return false;
    },
    onChange(info) {
      // debugger/
      // if (info.file.status !== 'uploading') {
      //   console.log(info.file, info.fileList);
      // }
      if (info.file.status === 'done') {
        sucMessage(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        errorMessage(`伤上传失败，原因:${info.file.response.message}`);
      }
    },
  };

  const files: any = [];
  const uploadPic = () => {

  };
  return (
    <PageContainer>
      {/* 要轮播界面 */}
      <Spin spinning={spinLoading} size={"large"} tip={"数据同步中，请稍后..."}>
        <div className={style.popForm}>
          <Tabs
            onChange={onTabsChange}
            style={{
              width: '100%',
              marginLeft: 80,
              display: anCommonData?.announce_carousel === 1 ? "inline-block" : "none"
            }}>
            {tabsPanel(Number(anCommonData?.carouselNum))}
          </Tabs>
          <Form form={dtForm} autoComplete={"off"} onFinish={onFinish} name={"dynamic_form_nest_item"}>
            {/* 特性名称只针对轮播功能 */}
            <Row style={{display: anCommonData?.announce_carousel === 1 ? "inline-block" : "none"}}>
              <Form.Item label={"特性名称"} name={"specialName"} rules={[{required: false, message: '特性名称不能为空！'}]}>
                <Input style={{minWidth: 400}}></Input>
              </Form.Item>
            </Row>
            {/* 特性名称只针对不轮播功能 */}
            <Row style={{display: anCommonData?.announce_carousel === 1 ? "none" : "inline-flex"}}>
              <Col>
                <Form.Item label={"语雀迭代版本地址："} name={"yuQueUrl"}>
                  <Input style={{minWidth: 400}} placeholder={"从语雀复制更新版本地址"} spellCheck={"false"}></Input>
                </Form.Item>
              </Col>
              <Col>
                <Button
                  className={style.commonBtn} style={{marginLeft: 10}}
                  onClick={syncYuqueInfo}>
                  同步信息
                </Button>
              </Col>
            </Row>
            <Form.Item label={"上传图片"} name={"uploadPic"} required>
              <Button type="default" icon={<UploadOutlined/>} style={{color: "#1890FF", border: "none"}}
                      onClick={() => setPicModalState({visible: true})}>选择/上传
              </Button>
            </Form.Item>
            <Form.Item label={"图文布局"} name={"picLayout"} required>
              <Radio.Group>
                <Radio value={"1"}>上下布局</Radio>
                <Radio value={"2"}>左右布局</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.List name="ptyGroup" initialValue={[Object.create(null)]}>
              {(fields, {add: addFirst, remove: removeFirst}) => {
                return (
                  <div>
                    {fields.map((field, index) => (
                      <div key={field.key}>
                        <Row>
                          <Form.Item
                            {...field}
                            label={"一级特性"}
                            name={[field.name, 'first']}
                            rules={[{required: true, message: '请输入一级特性'}]}
                          >
                            <Input placeholder={"建议不超过15个字"} style={{minWidth: 400}}></Input>
                          </Form.Item>

                          {/* 删除 */}
                          <Button
                            style={{border: 'none', color: "red", marginLeft: 5}}
                            icon={<MinusCircleOutlined/>}
                            onClick={() => removeFirst(field.name)}
                          />
                        </Row>
                        {/* 二级特性 */}
                        <Form.List name={[field.name, 'seconds']} initialValue={[Object.create(null)]}>
                          {(secondFields, {add: addSecond, remove: removeSeond}) => {
                            return (
                              <>
                                {secondFields.map((secondField, index) => (
                                  <div key={secondField.key}>
                                    <Row>
                                      <Form.Item
                                        {...secondField}
                                        label={`二级特性${index + 1}`}
                                        name={[secondField.name, 'second']}
                                      >
                                        <Input style={{minWidth: 400}}></Input>
                                      </Form.Item>

                                      {/* 删除 */}
                                      <Button
                                        style={{border: 'none', color: "#1890FF", marginLeft: 5}}
                                        icon={<PlusCircleOutlined/>}
                                        onClick={() => addSecond()}
                                      />
                                      <Button
                                        style={{border: 'none', color: "red", marginLeft: 5}}
                                        icon={<MinusCircleOutlined/>}
                                        onClick={() => removeSeond(secondField.name)}
                                      />
                                    </Row>
                                  </div>
                                ))}
                              </>
                            );
                          }}
                        </Form.List>
                      </div>
                    ))}
                    {/* 点击一级特性 */}
                    <Form.Item>
                      <Button style={{marginLeft: 130, border: 'none', color: '#1890FF'}}
                              icon={<PlusCircleOutlined/>}
                              onClick={() => addFirst()}  // 直接写add函数会导致获取的参数多余
                      > 添加一级特性 </Button>

                    </Form.Item>
                  </div>
                );
              }}
            </Form.List>
            <Divider/>
            <Form.Item>
              <Footer style={{height: 70, backgroundColor: "white", marginTop: -20}}>
                <div id={"message"}>
                  <Button className={style.saveButtonStyle} type="primary" style={{marginLeft: 10}}
                          htmlType="submit">保存</Button>
                  <Button className={style.commonBtn} style={{marginLeft: 10}}>一键发布</Button>
                  <Button className={style.commonBtn} style={{marginLeft: 10}}>预览</Button>
                  <Button className={style.commonBtn} style={{marginLeft: 10}}
                          onClick={() => history.push(`/onlineSystem/announcementDetail`)}>上一步</Button>
                </div>
              </Footer>
            </Form.Item>
          </Form>
        </div>
      </Spin>

      {/* 图片上传弹出框 picModalState.visible */
      }
      <Modal title="上传图片" visible={true} centered={true} maskClosable={false}
             onOk={() => setPicModalState({visible: false})}
             onCancel={() => setPicModalState({visible: false})}
             width={700}>

        <div className={style.imgComponentBox}>
          <div className={style.defaultBox}>
            <div className={style.titleBox}>
              <h5 className={style.titlew}>选择默认图片</h5>
            </div>
            <ul className={style.imgList} onClick={picChecked}>
              {defaultImgsUrl.map(item => (
                <li key={item} data-value={item} className={picModalState.checkedImg === item ? style.activeChose : ''}>
                  <img key={item} data-value={item} src={item} alt="默认图"/>
                </li>))}
            </ul>
          </div>
          <div className={style.padBox}/>
          <div className={style.setBox}>
            <h5 className={style.titlew7}>从本地上传</h5>
            <div style={{
              marginTop: 13,
              height: 115,
              width: "100%",
              backgroundColor: "#FAFAFA",
              textAlign: "center",
              lineHeight: 8,
              border: "1px dashed Gainsboro"
            }}>

              <Upload {...upProps}>
                <Button icon={<PlusOutlined/>} style={{backgroundColor: "transparent", border: "none"}}></Button>
              </Upload>

              {/*<PlusOutlined style={{height: 20, width: 20}} onClick={uploadPic}/>*/}
              {/*<Button>点击进行图片上传</Button>*/}
            </div>
            <div className={style.hintInfo}>{bannerTips}</div>
          </div>
        </div>

        {/* title */}
        {/*<Row>*/}
        {/*  <Col span={12}>*/}
        {/*    <h4 style={{fontWeight: "bold"}}>选择默认图片</h4>*/}
        {/*  </Col>*/}
        {/*  <Col span={12}>*/}
        {/*    <h4 style={{fontWeight: "bold"}}>从本地上传</h4>*/}
        {/*  </Col>*/}
        {/*</Row>*/}
        {/* 图片展示和上传 */}
        {/*<Row>*/}
        {/*  <Col span={12}>*/}
        {/*    <div onClick={(e) => {*/}
        {/*      // debugger*/}
        {/*      // console.log(e)*/}
        {/*    }}>*/}
        {/*      <Image*/}
        {/*        height={150} width={'90%'}*/}
        {/*        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"*/}
        {/*      />*/}

        {/*      <img key={defaultImgsUrl[0]} data-value={defaultImgsUrl[0]} src={defaultImgsUrl[0]} alt="默认图" height={150}*/}
        {/*           width={'90%'}/>*/}
        {/*    </div>*/}
        {/*    <div style={{marginTop: 10}}>*/}
        {/*      <Image*/}
        {/*        height={150} width={'90%'}*/}
        {/*        src={defaultImgsUrl[1]}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*    <div style={{marginTop: 10}}>*/}
        {/*      <Image*/}
        {/*        height={150} width={'90%'}*/}
        {/*        src={defaultImgsUrl[2]}*/}
        {/*      />*/}
        {/*    </div>*/}

        {/*  </Col>*/}
        {/*  <Col span={12}>*/}

        {/*    /!*<Upload*!/*/}
        {/*    /!*  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"*!/*/}
        {/*    /!*  listType="picture-circle"*!/*/}

        {/*    /!*>*!/*/}
        {/*    /!*  {fileList.length < 5 && '+ Upload'}*!/*/}
        {/*    /!*</Upload>*!/*/}

        {/*  </Col>*/}
        {/*</Row>*/}

      </Modal>
    </PageContainer>
  );
};


export default PopupCard;
