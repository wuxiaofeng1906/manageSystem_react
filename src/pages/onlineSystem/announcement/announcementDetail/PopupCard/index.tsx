import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {
  Button, Form, Input, Row, Col, Modal, Upload, Radio, Divider, Layout,
  Spin, Image, Tabs
} from 'antd';
import {history} from "@@/core/history";
import style from '../style.less';
import {
  PlusCircleOutlined, UploadOutlined, MinusCircleOutlined,
  PlusOutlined, ExclamationCircleFilled
} from '@ant-design/icons';
import {getYuQueContent, oneKeyToRelease, saveAnnounceContent} from '../axiosRequest/apiPage';
import {updateAnnouncement} from "../axiosRequest/apiPageForUpdate";
import {
  analysisSpecialTitle, vertifyFieldForPopup, getChanedData,
  vertifyPageAllFinished, changeTabSort
} from "../dataAnalysis";
import {errorMessage, sucMessage} from "@/publicMethods/showMessages";
import {isEmpty} from "lodash";
import {matchYuQueUrl} from "@/publicMethods/regularExpression";
import {useModel} from "@@/plugin-model/useModel";
import {imgUrlHeader, defaultImgsUrl, picType, getImageToBackend, getImageForFront} from "../uploadPic/index";
import {getS3Key, uploadPicToS3, getBase64} from "../uploadPic/NoticeImageUploader";
import {DragTabs} from './TabsApi';


// 当前的tab页面
let currentTab = 1;
const {Footer} = Layout;
const {confirm} = Modal;

const PopupCard: React.FC<any> = (props: any) => {
  const {
    commonData, anPopData, setAnnPopData, getAnnounceContent,
    showPulishButton, setCommonData, setOldCommonData, tabOrder
  } = useModel('announcement');
  const {releaseID, type} = props.location?.query;
  const [dtForm] = Form.useForm();
  // 图片上传弹出层显示
  const [picModalState, setPicModalState] = useState({
    visible: false,
    checkedImg: ""
  });
  // 语雀数据导入（加载）使用
  const [yuQueSpinLoading, setYuQueSpinLoading] = useState(false);
  const setEmptyForm = () => {
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
        seconds: [{first: ""}]
      }]
    });
  };
  // 上传图片的进度
  const [picUpLoading, setPicUpLoading] = useState(false);
  // 预览的状态
  const [showPreView, setShowPreView] = useState<boolean>(false);

  // 同步语雀信息
  const syncYuqueInfo = async () => {
    const yuQueUrl = dtForm.getFieldValue("yuQueUrl");
    if (isEmpty(yuQueUrl) || !matchYuQueUrl(yuQueUrl)) {
      errorMessage("请输入语雀迭代版本地址！", 1.5, "0vh");
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
    specialList.uploadPic = getImageToBackend(picModalState.checkedImg, specialList.picLayout);
    // specialList.uploadPic = picModalState.checkedImg;
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
    setShowUpload(true);
    setFileList([])
  };

  const saveTabPages = async (finalData: any, preView: boolean) => {

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
        window.open("https://nx-temp1-k8s.e7link.com/cn-global/login");
      }
      sucMessage("保存成功！");
      // 清空state中原始数据
      setAnnPopData([]);
      setCommonData(null);
      setOldCommonData(null);
      history.push('./announceList');
      return;
    }
    errorMessage("保存失败！");
  };

  // 保存数据
  const onFinish = async (popData: any, preView: boolean = false) => {

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
            saveTabPages(finalData, preView);
          },
          onCancel() {
            return;
          },
        });
      } else {
        // 填写完了则直接保存。
        saveTabPages(finalData, preView);
      }

    }
  };
  // upload 组件使用上传图片
  const [fileList, setFileList] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState<boolean>(true);

  // 选择图片时
  const picChecked = (e: any) => {
    if (e.target.tagName === 'LI' || e.target.tagName === 'IMG') {
      setPicModalState({...picModalState, checkedImg: e.target.dataset.value});
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
        if (upResult.result && upResult.result.status === 204) {
          // alert("id：" + s3Info.fields?.key)
          setPicModalState({checkedImg: s3Info.fields?.key, visible: false});
        } else {
          errorMessage("图片上传失败");
        }
      }
    }
    setPicUpLoading(false);
  };
  // 预览
  const onPreView = async () => {
    if (showPreView) {
      window.open("https://nx-temp1-k8s.e7link.com/cn-global/login");
      return;
    }

    const formData = dtForm.getFieldsValue();
    debugger
    onFinish(formData, true);
    //   需要需要校验不能为空
    // let finalData = [];
    // // 如果是轮播则先放到state中再保存
    // if (commonData?.announce_carousel === 1) {
    //   finalData = getPopupSource(currentTab);
    // } else {
    //   // 不是轮播，需要把图片路径放进去
    //   const popData = dtForm.getFieldsValue();
    //   popData.uploadPic = picModalState.checkedImg;
    //   finalData.push(popData);
    // }
    // if (vertifyFieldForPopup(finalData)) {
    //   //    commonData, finalData  进行预览的数据
    // }

    //
  };


  // 一键发布
  const releaseAnnounceInfo = async () => {
    confirm({
      title: '发布确认',
      icon: <ExclamationCircleFilled/>,
      content: '确定发布这条公告吗？',
      centered: true,
      onOk: async () => {
        const releaseResult = await oneKeyToRelease(releaseID);
        if (releaseResult.ok) {
          sucMessage("公告发布成功！");
        } else {
          errorMessage(releaseResult.message);
        }
      }
    });
  };
  // 展示上传的图片
  const setPicImgSource = (file: string) => {
    document.getElementById("file_img")!.src = file;
  };

  // 上一页
  const goToPrePage = () => {
    debugger

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
    history.push('/onlineSystem/announcementDetail' + props.location?.search + "&back=true");
  }

  // 显示旧数据
  const showServiceData = async (newHead: any) => {
    // 获取弹窗页的数据
    const {head, body} = await getAnnounceContent(releaseID, true); // 现在的head 是旧数据，新数据可能被编辑过了。
    setOldCommonData(head);

    // 如果是否轮播不改变，才显示原有的数据，否则清空原弹窗中的数据
    if (head.announce_carousel === newHead.announce_carousel) {
      // 如果是轮播，并且轮播页数有发生改变
      if (newHead.announce_carousel === 1 && newHead.carouselNum < head.carouselNum) {
        // 轮播页数改变了:======>>>>>>是否清空轮播页数,是的话则全部清空，否的话则删除后面几张页数
        if (newHead.clearTabContent) {
          setEmptyForm();
          return;
        } else {
          //
          const filtered: any = [];
          body.map((v: any, i: number) => {
            if (i < newHead.carouselNum) {
              filtered.push(v);
            }
          });
          setAnnPopData(filtered);
        }
      } else {
        setAnnPopData(body);
      }


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
  }
  const showPageDt = async () => {

    debugger
    // 先判断commondata有没有数据，如果有，则直接展示，如果没有（界面可能手动刷新过），则获取缓存的数据
    let newHead: any = {...commonData};
    debugger
    if (!newHead || JSON.stringify(newHead) === "{}") {
      // 获取上一页的数据（缓存了）
      const storage = localStorage.getItem("noticeHeader");
      if (storage) {
        newHead = JSON.parse(storage);
      }
      setCommonData(newHead);
    }
    // 如果没有 type=add 的话，则新增
    if (type === "add") {
      debugger
      // 如果又返回了上一页，那么这个add界面可能有数据,或者是否轮播改变  || newHead.announce_carousel  这里还要改
      if (anPopData.length === 0) {
        setEmptyForm();
      } else {
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
      }
    } else if (type === "detail") {
      debugger
      // 有之前的数据
      if (anPopData && anPopData.length > 0) {
        //   如果ID相同，则展示原有数据，如果不同，则获取服务器数据
        if (anPopData[0]?.tabsContent?.id === releaseID) {
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
    } else {
      setEmptyForm();
    }

  }
  useEffect(() => {
    currentTab = 1;
    showPageDt();

  }, []);

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
                onFieldsChange={() => setShowPreView(false)}>
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
                                        onClick={() => {
                                          // 仅有一个二级属性时不能删
                                          if (!secondFields || secondFields.length <= 1) {
                                            errorMessage("只有一个二级特性时不能删除！")
                                            return;
                                          }
                                          removeSeond(secondField.name);
                                        }}
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
                  <Button className={style.commonBtn} style={{marginLeft: 10}}
                          onClick={onPreView}>预览</Button>
                  <Button className={style.commonBtn} style={{marginLeft: 10}}
                          onClick={goToPrePage}>上一步</Button>
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
               setPicImgSource("");
               setShowUpload(true);
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
              <ul className={style.imgList} onClick={picChecked}>
                {defaultImgsUrl.map(item => (
                  <li key={item} data-value={item}
                      className={picModalState.checkedImg === item ? style.activeChose : ''}>
                    <img key={item} data-value={item}
                         src={`${imgUrlHeader}${item}`}
                      // src={require('../../../../../../public/77Logo.png')}
                         alt="默认图"/>

                  </li>))}
              </ul>
            </div>

            <div className={style.setBox}>
              <h5 className={style.titlew7}>从本地上传</h5>
              <div className={style.antPicUpload} style={{backgroundColor: "transparent", marginTop: 13}}>
                <div style={{display: showUpload ? "inline" : "none"}}>
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
                        errorMessage('仅支持上传jpg、jpeg、png、gif、svg、psd格式的图片！');
                        return;
                      }
                      setFileList(fileList);
                      // 清空之前选的图片
                      setPicModalState({...picModalState, checkedImg: ""});
                      //   在界面展示图片
                      const picString: any = await getBase64(fileList[0].originFileObj);
                      setPicImgSource(picString);
                      // document.getElementById("file_img")!.src = picString;
                      setShowUpload(false);
                    }}
                  >
                    {fileList.length >= 1 ? null :
                      <Button icon={<PlusOutlined/>} style={{backgroundColor: "transparent", border: "none"}}></Button>}
                  </Upload>
                </div>

                {/* 用于上传的图片选择后来展示已选择的照片，原始组件不支持图片展示的大小 */}
                <img width={'100%'}
                     height={77}
                     id={"file_img"}
                     style={{display: !showUpload ? "inline" : "none"}}
                     onContextMenu={(e: any) => {
                       e.preventDefault();
                       confirm({
                         title: "确定删除这张图片？",
                         icon: <ExclamationCircleFilled/>,
                         centered: true,
                         onOk() {
                           // 显示上传框
                           setShowUpload(true);
                           //   清空展示的图片
                           setPicImgSource("")
                           // document.getElementById("file_img")!.src = "";
                           //   清空fileList
                           setFileList([]);
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
