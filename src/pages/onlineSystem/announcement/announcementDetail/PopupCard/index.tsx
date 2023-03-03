import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {
  Button, Form, Input, Row, Col, Modal, Upload, Radio, Tabs, Divider, Layout,
  Spin
} from 'antd';
import {history} from "@@/core/history";
import style from '../style.less';
import {PlusCircleOutlined, UploadOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {getYuQueContent, oneKeyToRelease, saveAnnounceContent, updateAnnouncement} from '../axiosRequest/apiPage';
import {analysisSpecialTitle, vertifyFieldForPopup, tabsPanel} from "../dataAnalysis";
import {errorMessage, sucMessage} from "@/publicMethods/showMessages";
import {isEmpty} from "lodash";
import {matchYuQueUrl} from "@/publicMethods/regularExpression";
import {useModel} from "@@/plugin-model/useModel";
import {imgUrlHeader, defaultImgsUrl, bannerTips, picType} from "../uploadPic/index";
import {getS3Key, uploadPicToS3} from "../uploadPic/NoticeImageUploader";
import ImgCrop from 'antd-img-crop';

// 当前的tab页面
let currentTab = 1;
const {Footer} = Layout;
const PopupCard: React.FC<any> = (props: any) => {
  const {
    commonData,
    anPopData,
    setAnnPopData,
    showPulishButton,
    oldCommonData,
    oldAnPopData,
    setOldAnnPopData
  } = useModel('announcement');
  const {releaseName, releaseID, type} = props.location?.query;
  const [dtForm] = Form.useForm();
  // 图片上传弹出层显示
  const [picModalState, setPicModalState] = useState({
    visible: false,
    checkedImg: ""
  });
  // 语雀数据导入（加载）使用
  const [yuQueSpinLoading, setYuQueSpinLoading] = useState(false);

  // 上传图片的进度
  const [picUpLoading, setPicUpLoading] = useState(false);
  useEffect(() => {
    // 需要先判断anPopData有没有数据
    if (anPopData && anPopData.length) {
      // 展示第一个tab的数据即可。
      dtForm.setFieldsValue(anPopData[0]?.tabsContent);
      setPicModalState({
        ...picModalState,
        checkedImg: (anPopData[0]?.tabsContent).uploadPic
      });
      setOldAnnPopData({anPopData: anPopData, releaseID});
    } else {
      // 轮播时记录Tab数据用
      if (commonData?.announce_carousel === 1) {
        const tabsContent: any = [];
        for (let i = 0; i < commonData?.carouselNum; i++) {
          tabsContent.push({
            tabPage: i + 1,
            tabsContent: {}
          })
        }
        setAnnPopData(tabsContent)
      }
      // 初始化表单(不知道怎么设置值的格式时，可以先获取值，按照获取值的格式来写)
      dtForm.setFieldsValue({
        picLayout: "1", // 默认上下布局
        ptyGroup: [{ // 默认一组特性
          first: "",
          id:"2222",
          seconds: [{"first": "333",id:"33333"}]
        }]
      });
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
    setYuQueSpinLoading(true);
    const specialTitles = await getYuQueContent(yuQueUrl);
    if (specialTitles.ok) {
      dtForm.setFieldsValue({
        ptyGroup: analysisSpecialTitle(specialTitles?.data)
      });
    } else {
      errorMessage("从语雀获取信息失败！")
    }
    setYuQueSpinLoading(false);
  };
  // 如果时轮播则保存轮播数据 ，动态保存编辑数据（点击保存时保存当前页面），切换页面时保存已有数据的页面
  const getPopupSource = (currentKey: number) => {
    const specialList = dtForm.getFieldsValue();
    specialList.uploadPic = picModalState.checkedImg;
    // 覆盖已有当前页的数据或者添加新数据
    const oldList = [...anPopData];
    oldList.map((v: any) => {
      v.tabPage === currentKey ? v.tabsContent = specialList : v.tabsContent;
    });
    setAnnPopData(oldList);
    // 返回值共保存按钮使用
    return oldList;
  };
  // tab切换
  const onTabsChange = (key: string) => {
    // 先保存切换前的tab数据，后看下一个tab有没有存数据，若有则展示，若没有则赋值为空
    getPopupSource(currentTab);
    const oldList = [...anPopData];
    oldList.map((v: any) => {
      if (v.tabPage === Number(key)) {
        if (JSON.stringify(v.tabsContent) !== "{}") {
          dtForm.setFieldsValue(v.tabsContent);
          setPicModalState({...picModalState, checkedImg: v.tabsContent.uploadPic})
        } else {
          dtForm.resetFields();
          dtForm.setFieldsValue({"picLayout": "1"});
          setPicModalState({...picModalState, checkedImg: ""})
        }
      }
    });
    //  需要最后再赋值当前tab页码
    currentTab = Number(key);
  };
  // 保存数据
  const onFinish = async (popData: any) => {
    let finalData = [];
    // 如果是轮播则先放到state中再保存
    if (commonData?.announce_carousel === 1) {
      finalData = getPopupSource(currentTab);
    } else {
      // 不是轮播，需要把图片路径放进去
      popData.uploadPic = picModalState.checkedImg;
      finalData.push(popData);
    }
    if (vertifyFieldForPopup(finalData)) {
      let result: any;
      if (type === "detail") {
        result = await updateAnnouncement({commonData, finalData}, {oldCommonData, oldAnPopData});
      } else {
        result = await saveAnnounceContent(commonData, finalData);
      }
      // 需要验证必填项
      if (result.ok) {
        sucMessage("保存成功！");
        history.push('./announceList');
        return;
      }
      errorMessage("保存失败！");
    }
  };
  // upload 组件使用上传图片
  const [fileList, setFileList] = useState<any[]>([])
  // 选择图片时
  const picChecked = (e: any) => {
    if (e.target.tagName === 'LI' || e.target.tagName === 'IMG') {
      setPicModalState({...picModalState, checkedImg: e.target.dataset.value})
    }
  };
  // 点击确定按钮
  const uploadPicClick = async () => {

    // 判断是不是手动上传的数据，如果是则需要先调用上传接口，如果不是则直接保存
    // 之前就选择了图片
    if (picModalState.checkedImg) {
      setPicModalState({...picModalState, visible: false})
      return;
    }
    setPicUpLoading(true);
    // 这个是保存自己上传的图片
    if (fileList.length) { // 如果大于0 则已手动上传了数据，如果小于0则看有没有以前的数据
      const s3Info = await getS3Key(fileList[0].name);
      if (s3Info) {
        // 再上传到服务器
        const upResult = await uploadPicToS3(s3Info, fileList[0]);
        document.getElementById("file_img").src = upResult.temp;

        if (upResult.result && upResult.result.status === 204) {
          // const picUrl = `${s3Info.url}/${s3Info.fields?.key}`;

          // console.log("requestResult", upResult.result);
          // upResult.result.headers.location 中就是返回的最终地址
          console.log("finalUrl", upResult.result.headers.location);
          setPicModalState({checkedImg: upResult.result.headers.location, visible: false});

        } else {
          errorMessage("图片上传失败");
        }
      }
    }
    setPicUpLoading(false);
  };
  // 预览
  const onPreView = async () => {
    //   需要需要校验不能为空
    let finalData = [];
    // 如果是轮播则先放到state中再保存
    if (commonData?.announce_carousel === 1) {
      finalData = getPopupSource(currentTab);
    } else {
      // 不是轮播，需要把图片路径放进去
      const popData = dtForm.getFieldsValue();
      popData.uploadPic = picModalState.checkedImg;
      finalData.push(popData);
    }
    if (vertifyFieldForPopup(finalData)) {
      //    commonData, finalData  进行预览的数据
    }
  };
  // 一键发布
  const releaseAnnounceInfo = async () => {
    const releaseResult = await oneKeyToRelease("");
    if (releaseResult.ok) {
      sucMessage("公告发布成功！")
    }
  };
  return (
    <PageContainer>
      {/* 要轮播界面 */}
      <Spin spinning={yuQueSpinLoading} size={"large"} tip={"数据同步中，请稍后..."}>
        <div className={style.popForm}>
          <Tabs
            onChange={onTabsChange}
            style={{
              width: '100%',
              marginLeft: 80,
              display: commonData?.announce_carousel === 1 ? "inline-block" : "none"
            }}>
            {tabsPanel(Number(commonData?.carouselNum))}
          </Tabs>
          <Form form={dtForm} autoComplete={"off"} onFinish={onFinish} name={"dynamic_form_nest_item"}>
            {/* 特性名称只针对轮播功能 */}
            <Row style={{display: commonData?.announce_carousel === 1 ? "inline-block" : "none"}}>
              <Form.Item label={"特性名称"} name={"specialName"} rules={[{required: false, message: '特性名称不能为空！'}]}>
                <Input style={{minWidth: 400}}></Input>
              </Form.Item>
            </Row>
            {/* 特性名称只针对不轮播功能 */}
            <Row style={{display: commonData?.announce_carousel === 1 ? "none" : "inline-flex"}}>
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
              {picModalState.checkedImg ?
                <img key={picModalState.checkedImg} data-value={picModalState.checkedImg}
                     src={`${imgUrlHeader}${picModalState.checkedImg}`}
                     alt="默认图" style={{height: 100, width: 150}}
                     onClick={() => setPicModalState({...picModalState, visible: true})}/>
                :
                <Button type="default" icon={<UploadOutlined/>}
                        style={{color: "#1890FF", border: "none"}}
                        onClick={() => setPicModalState({...picModalState, visible: true})}>选择/上传
                </Button>}
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
                                    {/*// 将原来的second 改为first是为了匹配后端数据回显时递归请求出来的数据*/}
                                    <Row>
                                      <Form.Item
                                        {...secondField}
                                        label={`二级特性${index + 1}`}
                                        name={[secondField.name, 'first']}
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
                  <Button className={style.commonBtn}
                          style={{marginLeft: 10, display: showPulishButton ? "inline" : "none"}}
                          onClick={releaseAnnounceInfo}>一键发布</Button>
                  <Button className={style.commonBtn} style={{marginLeft: 10}} onClick={onPreView}>预览</Button>
                  <Button className={style.commonBtn} style={{marginLeft: 10}}
                          onClick={() => history.push(`/onlineSystem/announcementDetail`)}>上一步</Button>
                </div>
              </Footer>
            </Form.Item>
          </Form>
        </div>
      </Spin>

      {/* 图片上传弹出框 picModalState.visible */}
      <Modal title="上传图片" visible={picModalState.visible} centered={true} maskClosable={false}
             onOk={uploadPicClick}
             onCancel={() => setPicModalState({checkedImg: "", visible: false})}
             width={700}>
        <Spin spinning={picUpLoading} size={"large"} tip={"图片上传中，请稍等..."}>
          <div className={style.imgComponentBox}>
            <div className={style.defaultBox}>
              <div className={style.titleBox}>
                <h5 className={style.titlew}>选择默认图片</h5>
              </div>
              <ul className={style.imgList} onClick={picChecked}>
                {defaultImgsUrl.map(item => (
                  <li key={item} data-value={item}
                      className={picModalState.checkedImg === item ? style.activeChose : ''}>
                    <img key={item} data-value={item} src={`${imgUrlHeader}${item}`} alt="默认图"/>
                  </li>))}
              </ul>
            </div>
            <div className={style.padBox}/>
            <div className={style.setBox}>
              <h5 className={style.titlew7}>从本地上传</h5>
              <div className={style.antPicUpload} style={{backgroundColor: "transparent", marginTop: 13}}>
                <ImgCrop
                  modalTitle={"裁剪图片"}
                  aspect={2.35 / 1}       // 裁剪比例
                  rotate
                  zoom
                  modalOk={"确定"}
                  modalCancel={"取消"}
                >
                  <Upload
                    style={{color: "red"}}
                    listType="picture-card"
                    showUploadList={{showPreviewIcon: false}}
                    fileList={fileList}
                    beforeUpload={(file) => {
                      return false;
                    }}
                    onChange={(v: any) => {
                      const {file} = v;
                      // 判断文件类型，文件大小，和裁剪
                      if (!picType.includes(file.type)) {
                        errorMessage('仅支持上传jpg、jpeg、png格式的图片！');
                        return;
                      }
                      if ((file.size / 1024 / 1024) >= 10) {
                        errorMessage('图片大小不能超过10M');
                        return;
                      }
                      setFileList(v.fileList);
                      // 清空之前选的图片
                      setPicModalState({...picModalState, checkedImg: ""});
                    }}
                  >
                    {fileList.length >= 1 ? null :
                      <Button icon={<PlusOutlined/>} style={{backgroundColor: "transparent", border: "none"}}></Button>}
                  </Upload>
                </ImgCrop>
              </div>
              <div className={style.hintInfo}>{bannerTips}</div>
            </div>
            <div>
              <img id={"file_img"} style={{width: 200, height: 100}}>
              </img>
            </div>
          </div>
        </Spin>
      </Modal>
    </PageContainer>
  );
};
export default PopupCard;
