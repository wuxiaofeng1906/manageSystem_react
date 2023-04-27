import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {
  Button, Form, Input, Row, Col, Modal, Upload, Radio, Divider, Layout, Spin, Select, Popover, Popconfirm
} from 'antd';
import {history} from "@@/core/history";
import style from '../style.less';
import {
  PlusCircleOutlined, UploadOutlined, MinusCircleOutlined, ArrowDownOutlined,
  PlusOutlined, ExclamationCircleFilled
} from '@ant-design/icons';
import {getYuQueContent, oneKeyToRelease, preViewNotice, saveAnnounceContent} from '../axiosRequest/apiPage';
import {updateAnnouncement} from "../axiosRequest/apiPageForUpdate";
import {
  analysisSpecialTitle, vertifyFieldForPopup, getChanedData,
  vertifyPageAllFinished, changeTabSort
} from "../dataAnalysis";
import {customMessage} from "@/publicMethods/showMessages";
import {isEmpty} from "lodash";
import {matchYuQueUrl} from "@/publicMethods/regularExpression";
import {useModel} from "@@/plugin-model/useModel";
import {getDefaultImg, picType, getImageToBackend, getImageForFront} from "../uploadPic/index";
import {getS3Key, uploadPicToS3, getBase64} from "../uploadPic/NoticeImageUploader";
import {DragTabs} from './TabsApi';
import {noticeUrl} from "../../../../../../config/qqServiceEnv";
import {preEnv} from "@/pages/onlineSystem/announcement/constant";

// 当前的tab页面
let currentTab = 1;
const {Footer} = Layout;
const {confirm} = Modal;

const PopupCard: React.FC<any> = (props: any) => {
  const {
    commonData, anPopData, setAnnPopData, getAnnounceContent, showPulishButton,
    setCommonData, setOldCommonData, tabOrder, setTabOrder
  } = useModel('announcement');
  const {releaseName, releaseID, type, back} = props.location?.query;
  const [dtForm] = Form.useForm();
  // 点击预览按钮过后进度展示
  const [preview, setPreview] = useState(false);
  // 图片上传弹出层显示
  const [picModalState, setPicModalState] = useState({
    visible: false,
    checkedImg: ""
  });
  // 语雀数据导入（加载）使用
  const [yuQueSpinLoading, setYuQueSpinLoading] = useState(false);
  const setEmptyForm = () => {
    const storage: any = JSON.parse(localStorage.getItem("first_noticeHeader") as string);
    // 轮播时记录Tab数据用
    if (storage?.announce_carousel === 1) {
      const tabsContent: any = [];
      for (let i = 0; i < storage?.carouselNum; i++) {
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
        seconds: [{first: ""}]
      }]
    });
  };
  // 上传图片的进度
  const [picUpLoading, setPicUpLoading] = useState(false);
  // 预览的状态
  const [showPreView, setShowPreView] = useState<boolean>(false);
  // upload 组件使用上传图片
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadPics, setUploadPics] = useState<any>([]);

  // 同步语雀信息
  const syncYuqueInfo = async () => {
    const yuQueUrl = dtForm.getFieldValue("yuQueUrl");
    if (isEmpty(yuQueUrl) || !matchYuQueUrl(yuQueUrl)) {
      customMessage({type: "error", msg: "请输入正确的语雀迭代版本地址！", position: "0vh"})
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
      customMessage({type: "error", msg: "从语雀获取信息失败！", position: "0vh"})

    }
    setYuQueSpinLoading(false);
  };

  // 轮播时候的动态编辑数据(使用地方：Tab切换，上一页按钮点击，保存按钮点击)
  const getPopupSource = (currentKey: number) => {
    const specialList = dtForm.getFieldsValue();
    specialList.uploadPic = getImageToBackend(picModalState.checkedImg, specialList.picLayout);
    const result = getChanedData(currentKey, commonData, anPopData, specialList);
    setAnnPopData(result);
    return result;
  };

  // tab切换
  const onTabsChange = (key: string) => {

    // 保存切换前的tab数据，
    const list = getPopupSource(currentTab);
    // 后看下一个tab有没有存数据，若有则展示，若没有则赋值为空
    for (let i = 0; i < list.length; i++) {
      const v = list[i];
      if (v.tabPage === Number(key) && JSON.stringify(v.tabsContent) !== "{}") {
        const fromData = v.tabsContent
        const imgString = getImageForFront(fromData.uploadPic);
        dtForm.setFieldsValue({...fromData, uploadPic: imgString});
        setPicModalState({...picModalState, checkedImg: imgString});
        break;
      } else {
        dtForm.resetFields();
        dtForm.setFieldsValue({
          picLayout: "1", // 默认上下布局
          ptyGroup: [{ // 默认一组特性
            first: "",
            seconds: [{first: ""}]
          }]
        });
        setPicModalState({...picModalState, checkedImg: ""})
      }
    }

    //  需要最后再赋值当前tab页码
    currentTab = Number(key);
  };

  // 图片选择确认按钮
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
        if (upResult.result && upResult.result.status === 204) {
          // alert("id：" + s3Info.fields?.key)
          setPicModalState({checkedImg: s3Info.fields?.key, visible: false});
        } else {
          customMessage({type: "error", msg: "图片上传失败", position: "0vh"});
        }
      }
    }
    setPicUpLoading(false);
    setUploadPics([]);
    setFileList([]);
    setShowPreView(true);
  };

  // 一键发布
  const releaseAnnounceInfo = async () => {
    confirm({
      title: '发布确认',
      icon: <ExclamationCircleFilled/>,
      content: '确定发布这条公告吗？',
      centered: true,
      onOk: async () => {
        const formData = dtForm.getFieldsValue();
        if (await onFinish(formData)) {
          const releaseResult = await oneKeyToRelease(releaseID);
          if (releaseResult.ok) {
            customMessage({type: "success", msg: "公告发布成功！", position: "0vh"});
          } else {
            customMessage({type: "error", msg: releaseResult.message, position: "0vh"});
          }
        }

      }
    });
  };

  // 上一页
  const goToPrePage = () => {
    // 上一步之前也要保存本页数据
    // 跟 保存功能一样
    let finalData = [];
    // 如果是轮播则先放到state中再保存
    if (commonData?.announce_carousel === 1) {
      finalData = getPopupSource(currentTab);
    } else {
      // 不是轮播，需要把图片路径放进去
      const popData = dtForm.getFieldsValue();
      popData.uploadPic = getImageToBackend(picModalState.checkedImg, popData.picLayout);
      finalData.push({
        tabPage: 0,
        tabsContent: popData
      });
    }

    setAnnPopData(finalData);
    history.push(`/onlineSystem/announcementDetail?releaseName=${releaseName}&releaseID=${releaseID}&type=${type}&back=true`);
  }

  // region =======>>>>>>>>>>>>>>>>>保存数据和预览
  // 点击保存按钮保存数据
  const saveTabPages = async (finalData: any, preView: boolean, preViewEnv: any) => {

    let result: any;
    //  重新对tab排序
    const sortedFinalData = changeTabSort(commonData, finalData, tabOrder);
    if (type === "detail") {
      result = await updateAnnouncement(releaseID, commonData, sortedFinalData,);
    } else {
      result = await saveAnnounceContent(commonData, sortedFinalData);
    }

    if (result.ok) {
      if (preView) {
        let noticeId = releaseID;
        if (type === "add") {
          noticeId = result.data.toString();
          // 清空state中原始数据
          setAnnPopData([]);
          setCommonData(null);
          setOldCommonData(null);
          history.push('./announceList');
        }
        // 如果是明细数据，且没有被改变过
        const preRt = await preViewNotice(noticeId, preViewEnv.dataEnv);
        if (preRt.ok) {
          // const goUrls = `https://${preViewEnv.viewEnv}.e7link.com/${preViewEnv.dataEnv}/app#/penetrate/viewSystemUpdate/NoticeEdition/${preRt?.data.targEnvNoticeAdd}`;
          const goUrl = preViewEnv.dataEnv === "cn-northwest-0" ? `https://app.77hub.com/${preViewEnv.dataEnv}/app#/penetrate/viewSystemUpdate/NoticeEdition/${preRt?.data.targEnvNoticeAdd}`
            : `https://${preViewEnv.viewEnv}.e7link.com/${preViewEnv.dataEnv}/app#/penetrate/viewSystemUpdate/NoticeEdition/${preRt?.data.targEnvNoticeAdd}`;
          console.log("预览跳转地址", goUrl);
          window.open(goUrl);
        } else {
          customMessage({type: "error", msg: "预览数据保存失败，无法预览！", position: "0vh"});
        }

      } else {
        customMessage({type: "success", msg: "保存成功！", position: "0vh"});
        // 清空state中原始数据
        setAnnPopData([]);
        setCommonData(null);
        setOldCommonData(null);
        history.push('./announceList');
      }
      setTabOrder([]);
      return true;
    }
    customMessage({type: "error", msg: `数据保存失败:${result.message}`, position: "0vh"});
    return false;
  };

  // 保存数据
  const onFinish = async (popData: any, preView: boolean = false, preViewEnv: any = {}) => {
    let finalData: any = [];
    // 如果是轮播则先放到state中再保存
    if (commonData?.announce_carousel === 1) {
      finalData = getPopupSource(currentTab);
    } else {
      // 不是轮播，需要把图片路径放进去.如果是修改的话还需要轮播旧数据的id
      popData.uploadPic = getImageToBackend(picModalState.checkedImg, popData.picLayout);
      // 不是轮播还需要将公告名称保存到特性名称
      popData.specialName = commonData.announce_name;
      finalData.push(popData);
    }
    if (vertifyFieldForPopup(finalData)) {
      // 验证所有的page 是否填写完，没有填写完则提示，但是不影响修改。
      const notFinishedPage = vertifyPageAllFinished(finalData);

      if (notFinishedPage.length) {
        confirm({
          title: "保存确认",
          icon: <ExclamationCircleFilled/>,
          content: `第${notFinishedPage.join(",")}页轮播页没有填写，确认要保存吗？`,
          centered: true,
          onOk() {
            return saveTabPages(finalData, preView, preViewEnv);
          },
          onCancel() {
            return;
          },
        });
      } else {
        // 填写完了则直接保存。
        return saveTabPages(finalData, preView, preViewEnv);
      }

    }
    return false;
  };

  // 预览
  const onPreView = async () => {
    setPreview(true);
    let preViewEnv = {
      dataEnv: "", // 保存数据的环境
      viewEnv: "" // 预览效果的环境
    };

    const _content =
      <div>
        <Select
          style={{width: '100%'}}
          showSearch
          onChange={(v: any, v2: any) => {
            preViewEnv.dataEnv = v2.value;
            preViewEnv.viewEnv = v2.viewKey;
          }}
          options={await preEnv()}
        />
      </div>;

    setPreview(false);
    // 测试环境需要选择环境
    confirm({
      title: '选择预览环境',
      icon: <ExclamationCircleFilled/>,
      content: _content,
      centered: true,
      maskClosable: true,
      onOk: async () => {
        if (isEmpty(preViewEnv.dataEnv)) {
          customMessage({type: "error", msg: "预览环境不能为空！", position: "0vh"});
          return;
        }

        if (!showPreView && type === "detail") {
          // 如果是明细数据，且没有被改变过
          const result = await preViewNotice(releaseID, preViewEnv.dataEnv);
          if (result.ok) {
            const goUrl = preViewEnv.dataEnv === "cn-northwest-0" ? `https://app.77hub.com/${preViewEnv.dataEnv}/app#/penetrate/viewSystemUpdate/NoticeEdition/${result?.data.targEnvNoticeAdd}`
              : `https://${preViewEnv.viewEnv}.e7link.com/${preViewEnv.dataEnv}/app#/penetrate/viewSystemUpdate/NoticeEdition/${result?.data.targEnvNoticeAdd}`;
            // const goUrl = `https://${preViewEnv.viewEnv}.e7link.com/${preViewEnv.dataEnv}/app#/penetrate/viewSystemUpdate/NoticeEdition/${result?.data.targEnvNoticeAdd}`;
            console.log("预览跳转地址", goUrl);
            window.open(goUrl);
          } else {
            customMessage({type: "error", msg: "预览数据保存失败，无法预览！", position: "0vh"});
          }

          return;
        }
        const formData = dtForm.getFieldsValue();
        onFinish(formData, true, preViewEnv);
      }
    });

  };
  // endregion

  // region =======>>>>>>>>>>>>>>>>>界面初始化展示

  // 获取服务端旧数据
  const showServiceData = async (newHead: any) => {
    // 获取弹窗页的数据
    const {head, body} = await getAnnounceContent(releaseID, true); // 现在的head 是旧数据，新数据可能被编辑过了。
    setOldCommonData(head);
    setAnnPopData(body);
    // 如果是否轮播不改变，才显示原有的数据，否则清空原弹窗中的数据
    if (head.announce_carousel === newHead.announce_carousel && body) {
      // 还要对应上传的图片ID
      const picString = getImageForFront((body[0]?.tabsContent).uploadPic);
      // 展示第一个tab的数据即可。
      const formData = body[0]?.tabsContent;
      formData.uploadPic = picString;
      dtForm.setFieldsValue(formData);
      setPicModalState({
        ...picModalState,
        checkedImg: picString
      });
      setShowPreView(true);
    } else {
      setEmptyForm();
    }
  };

  // 修改数据时候
  const showForDetail = async (newHead: any) => {
    const {head} = await getAnnounceContent(releaseID);
    if (head.announce_carousel !== newHead.announce_carousel) {
      setEmptyForm();
      return;
    }
    // 有之前的数据,点击过上一步才有之前的保存数据
    if (anPopData && anPopData.length > 0 && back !== "undefined") {
      //   如果ID相同，则展示原有数据，如果不同，则获取服务器数据
      if (newHead.releaseID === releaseID) {
        const picString = getImageForFront((anPopData[0]?.tabsContent).uploadPic);
        // 展示第一个tab的数据。
        const formData = anPopData[0]?.tabsContent;
        formData.uploadPic = picString;
        dtForm.setFieldsValue(formData);
        setPicModalState({
          ...picModalState,
          checkedImg: picString
        });
        setShowPreView(true);
      } else {
        showServiceData(newHead)
      }
    } else {
      // 如果没有才获取后端保存的数据
      showServiceData(newHead)
    }
  };
  // 新增数据时候
  const showForAdd = () => {
    if (back === "undefined" || !back || anPopData.length === 0) {
      setEmptyForm();
      return;
    }

    // 展示之前的数据  不能用 showOldPage 因为没有release ID
    // 还要对应上传的图片ID
    const picString = getImageForFront((anPopData[0]?.tabsContent).uploadPic);
    // 展示第一个tab的数据即可。
    const formData = anPopData[0]?.tabsContent;
    formData.uploadPic = picString;
    dtForm.setFieldsValue(formData); // 表单数据
    setPicModalState({ // 图片
      ...picModalState,
      checkedImg: picString
    });
  };

  // 展示界面数据
  useEffect(() => {
    try {
      currentTab = 1;
      // 先判断commondata有没有数据，如果有，则直接展示，如果没有（界面可能手动刷新过），则获取缓存的数据
      let newHead: any = {...commonData};
      // if (!newHead || JSON.stringify(newHead) === "{}") {
      // 获取上一页的数据（缓存了）
      const storage = localStorage.getItem("first_noticeHeader");
      if (storage) {
        newHead = JSON.parse(storage);
      }
      setCommonData(newHead);
      // }

      // 如果没有 type=add 的话，则新增
      if (type === "add") {
        showForAdd();

      } else if (type === "detail") {

        showForDetail(newHead);

      } else {
        setEmptyForm();
      }
    } catch (e: any) {
      customMessage({type: "error", msg: `错误：${e.toString()}`, position: "0vh"});
    }
  }, []);

  useEffect(() => {
    try {
      // 按照轮播页数减少anPopData中的数据
      const head = {...commonData};
      if (head.announce_carousel === 1) {
        if (head.clearTabContent) {
          setEmptyForm();
        } else if (anPopData && head.carouselNum < anPopData.length) {

          const filtered: any = [];
          anPopData.map((v: any, i: number) => {
            if (i < head.carouselNum) {
              filtered.push(v);
            }
          });
          setAnnPopData(filtered);
        }
      }
    } catch (e: any) {
      customMessage({type: "error", msg: `错误：${e.toString()}`, position: "0vh"});
    }


  }, [commonData, anPopData]);
  // endregion

  window.onbeforeunload = function () {

    //注：alert在这里面不起作用，不会弹出消息
    // alert(`删除缓存：${localStorage.getItem("first_noticeHeader")}`)
    // localStorage.removeItem("first_noticeHeader");
    // localStorage.removeItem("second_noticeHeader");

  };

  const styleAdd = {marginTop: 8, marginLeft: 8, color: '#1890FF', fontSize: 16, height: 16};
  const styleDelete = {marginTop: 8, color: "red", marginLeft: 15, fontSize: 16, height: 16};
  return (
    <PageContainer>
      {/* 要轮播界面 */}
      <Spin spinning={yuQueSpinLoading} size={"large"} tip={"数据同步中，请稍后..."}>
        <div className={style.popForm}>
          {/*<Tabs*/}
          {/*  onChange={onTabsChange}*/}
          {/*  style={{*/}
          {/*    width: '100%',*/}
          {/*    marginLeft: 80,*/}
          {/*    display: commonData?.announce_carousel === 1 ? "inline-block" : "none"*/}
          {/*  }}>*/}
          {/*  {tabsPanel(Number(commonData?.carouselNum))}*/}
          {/*</Tabs>*/}

          <DragTabs onChange={onTabsChange}/>

          <Form form={dtForm} autoComplete={"off"} onFinish={onFinish} name={"dynamic_form_nest_item"}
                onFieldsChange={() => setShowPreView(true)}>
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
                     src={`${noticeUrl(location.origin).imageUpload}${picModalState.checkedImg}`}
                     alt="默认图" style={{height: 100, width: 150}}
                     onClick={() => {
                       setFileList([]);
                       setPicModalState({...picModalState, visible: true});
                     }
                     }/> :
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
                    {fields.map((field, first_index) => (
                      <div key={field.key}>
                        <Row>
                          <Form.Item
                            {...field}
                            label={"一级特性"}
                            name={[field.name, 'first']}
                            rules={[{required: true, message: '请输入一级特性'}]}>
                            <Input placeholder={"建议不超过15个字"} style={{minWidth: 400}}></Input>
                          </Form.Item>
                          {/* 删除 */}
                          <Popconfirm
                            title="确定删除该特性？"
                            onConfirm={() => removeFirst(field.name)}
                          >
                            <MinusCircleOutlined style={{...styleDelete, marginLeft: 38}}/>
                          </Popconfirm>


                        </Row>
                        {/* 二级特性 */}
                        <Form.List name={[field.name, 'seconds']} initialValue={[Object.create(null)]}>
                          {(secondFields, {add: addSecond, remove: removeSeond}) => {

                            return (
                              <>
                                {secondFields.map((secondField, second_index) => {

                                  return (
                                    <div key={secondField.key}>
                                      <Row style={{backgroundColor: "red"}}>
                                        {/* 添加一级特性 */}
                                        <Popover content={
                                          <div>
                                            <div>
                                              <Button type="link" onClick={() => addFirst("", first_index + 1)}>添加一级特性
                                              </Button>
                                            </div>
                                            <div>
                                              <Button type="link" onClick={() => addSecond("", 0)}>添加二级特性
                                              </Button>
                                            </div>
                                          </div>
                                        }>
                                          <PlusCircleOutlined
                                            style={{
                                              ...styleAdd,
                                              marginTop: -48,
                                              display: second_index === 0 ? "inline" : "none",
                                              marginLeft: 558
                                            }}/>
                                        </Popover>
                                      </Row>
                                      {/*// 将原来的second 改为first是为了匹配后端数据回显时递归请求出来的数据*/}
                                      <Row>
                                        <Form.Item
                                          {...secondField}
                                          label={`二级特性${second_index + 1}`}
                                          name={[secondField.name, 'first']}
                                        >
                                          <Input style={{minWidth: 400}}></Input>
                                        </Form.Item>

                                        {/* 添加二级特性 */}
                                        <PlusCircleOutlined
                                          style={styleAdd} onClick={() => addSecond("", second_index + 1)}/>

                                        {/* 删除二级特性 */}
                                        <MinusCircleOutlined
                                          style={styleDelete}
                                          onClick={() => {
                                            // 仅有一个二级属性时不能删
                                            if (!secondFields || secondFields.length <= 1) {
                                              customMessage({type: "error", msg: "只有一个二级特性时不能删除！", position: "0vh"});
                                              return;
                                            }
                                            removeSeond(secondField.name);
                                          }}/>
                                      </Row>
                                    </div>
                                  )
                                })}
                              </>
                            );
                          }}
                        </Form.List>
                      </div>
                    ))}
                    {/* 点击一级特性 */
                    }
                    <Form.Item>
                      <Button style={{marginLeft: 130, border: 'none', color: '#1890FF'}}
                              icon={<PlusCircleOutlined/>}
                              onClick={() => addFirst()}  // 直接写add函数会导致获取的参数多余
                      > 添加一级特性 </Button>

                    </Form.Item>
                  </div>
                )
                  ;
              }}
            </Form.List>
            <Divider/>
            <Form.Item>
              <Footer style={{height: 70, backgroundColor: "white", marginTop: -20}}>
                <div id={"message"}>
                  <Spin spinning={preview} tip={"预览环境加载中，请稍后..."}>
                    <Button className={style.saveButtonStyle} type="primary" style={{marginLeft: 10}}
                            htmlType="submit">保存</Button>
                    <Button className={style.commonBtn}
                            style={{marginLeft: 10, display: showPulishButton ? "inline" : "none"}}
                            onClick={releaseAnnounceInfo}>一键发布</Button>
                    <Button className={style.commonBtn} style={{marginLeft: 10}}
                            onClick={onPreView}>预览</Button>
                    <Button className={style.commonBtn} style={{marginLeft: 10}}
                            onClick={goToPrePage}>上一步</Button>
                  </Spin>
                </div>
              </Footer>
            </Form.Item>
          </Form>
        </div>
      </Spin>

      {/* 图片上传弹出框 picModalState.visible */}
      <Modal title="上传图片" visible={picModalState.visible} centered={true} maskClosable={false}
             onOk={uploadPicClick}
             onCancel={() => {
               setPicModalState({checkedImg: "", visible: false});
               document.getElementById("file_img")!.src = "";

               setFileList([]);
             }}
             closable={false}
             width={570}>
        <Spin spinning={picUpLoading} size={"large"} tip={"图片上传中，请稍等..."}>
          <div className={style.imgComponentBox}>
            <div className={style.defaultBox}>
              <div className={style.titleBox}>
                <h5 className={style.titlew}>选择默认图片</h5>
              </div>
              <ul className={style.imgList} onClick={(e: any) => {
                if (e.target.tagName === 'LI' || e.target.tagName === 'IMG') {
                  setPicModalState({...picModalState, checkedImg: e.target.dataset.value});
                }
              }}>
                {getDefaultImg().map(item => (
                  <li key={item} data-value={item}
                      className={picModalState.checkedImg === item ? style.activeChose : ''}>
                    <img key={item} data-value={item}
                         src={`${noticeUrl(location.origin).imageUpload}${item}`}
                      // src={require('../../../../../../public/77Logo.png')}
                         alt="默认图"/>

                  </li>))}
              </ul>
            </div>

            <div className={style.setBox}>
              <h5 className={style.titlew7}>从本地上传</h5>
              <div className={style.antPicUpload} style={{backgroundColor: "transparent", marginTop: 13}}>
                <div
                  style={{display: uploadPics.length === 0 ? "inline" : "none"}}
                >
                  <Upload
                    listType="picture-card"
                    showUploadList={{showPreviewIcon: false, showRemoveIcon: false}}
                    fileList={fileList}
                    beforeUpload={() => {
                      return false;
                    }}
                    onChange={async (v: any) => {
                      const {file, fileList} = v;
                      // 判断文件类型，文件大小，和裁剪
                      if (!picType.includes(file.type)) {
                        customMessage({type: "error", msg: "仅支持上传jpg、jpeg、png、gif、svg、psd格式的图片！", position: "0vh"});
                        return;
                      }
                      setFileList(fileList);
                      setUploadPics(fileList);
                      // 清空之前选的图片
                      setPicModalState({...picModalState, checkedImg: ""});
                      //   在界面展示图片
                      const picString: any = await getBase64(fileList[0].originFileObj);
                      document.getElementById("file_img")!.src = picString;
                      // document.getElementById("file_img")!.src = picString;
                      // setShowUpload(false);
                    }}
                  >
                    {fileList.length >= 1 ? null :
                      <Button icon={<PlusOutlined/>} style={{backgroundColor: "transparent", border: "none"}}></Button>}
                  </Upload>
                </div>

                {/* 用于上传的图片选择后来展示已选择的照片，原始组件不支持图片展示的大小 */}
                <img width={'100%'}
                     height={77}
                     style={{display: uploadPics.length > 0 ? "inline" : "none"}}
                     id={"file_img"}
                     onContextMenu={(e: any) => {
                       e.preventDefault();
                       confirm({
                         title: "确定删除这张图片？",
                         icon: <ExclamationCircleFilled/>,
                         centered: true,
                         onOk() {
                           // 显示上传框
                           // setShowUpload(true);
                           //   清空展示的图片
                           document.getElementById("file_img")!.src = "";
                           //   清空fileList
                           setFileList([]);
                           setUploadPics([])
                         },
                         onCancel() {
                           return;
                         },
                       });
                     }}
                />
              </div>
              <div className={style.hintInfo}></div>
            </div>
          </div>
        </Spin>
      </Modal>

      <Modal>

      </Modal>
    </PageContainer>
  );
};
export default PopupCard;
