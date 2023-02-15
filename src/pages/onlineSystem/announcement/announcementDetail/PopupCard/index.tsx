import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {
  Button, Form, Input, Row, Col, Modal, Upload, Image,
  Radio, Tabs, Divider, Layout
} from 'antd';
import {useParams} from "umi";
import {history} from "@@/core/history";
import style from '../style.less';
import {PlusCircleOutlined, UploadOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import type {UploadFile} from 'antd/es/upload/interface';


const {Footer} = Layout;
const {TabPane} = Tabs;
const PopupCard: React.FC<any> = (props: any) => {
  const [dtForm] = Form.useForm();
  const {isCarousel, count} = useParams() as { isCarousel: string; count: string };
  const [picModalState, setPicModalState] = useState({
    visible: false
  });

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };

  // tab切换
  const onTabsChange = (key: string) => {
    console.log(key);
  };

  // 动态panes
  const tabsData = () => {
    const numberChange = {
      "1": "一",
      "2": "二",
      "3": "三",
      "4": "四",
      "5": "五",
      "6": "六",
      "7": "七",
      "8": "八",
      "9": "九",
      "10": "十",
    };

    const panes = [];
    for (let i = 1; i <= Number(count); i++) {
      panes.push({
        title: `第${numberChange[i]}张`, key: i
      });
    }

    return panes;
  };

  useEffect(() => {
    // 初始化表单(不知道怎么设置值的格式时，可以先获取值，按照获取值的格式来写)
    dtForm.setFieldsValue({
      ptyGroup: [{first: "钱钱钱钱钱", seconds: [{"second": "2324234"}]}]
    });

  }, []);


  return (
    <PageContainer>
      {/* 要轮播界面 */}
      <div>
        <div className={style.popForm}>
          <Tabs onChange={onTabsChange} style={{display: isCarousel === "true" ? "inline" : "none"}}>
            {tabsData()?.map((pane: any) => (
              <TabPane tab={pane.title} key={pane.key}/>
            ))}
          </Tabs>

          <Form form={dtForm} autoComplete={"off"} onFinish={onFinish} name={"dynamic_form_nest_item"}>
            {/* 特性名称只针对轮播功能 */}
            <Row style={{display: isCarousel === "true" ? "inline-block" : "none"}}>
              <Form.Item label={"特性名称"} name={"specialName"} rules={[{required: false, message: '特性名称不能为空！'}]}>
                <Input style={{minWidth: 300}}></Input>
              </Form.Item>
            </Row>
            {/* 特性名称只针对不轮播功能 */}
            <Row style={{display: isCarousel === "true" ? "none" : "inline"}}>
              <Col>
                <Form.Item label={"语雀迭代版本地址："} name={"yuqueUrl"}>
                  <Input style={{minWidth: 300}} placeholder={"从语雀复制更新版本地址"}></Input>
                </Form.Item>
              </Col>
              <Col>
                <Button
                  className={style.commonBtn} style={{marginLeft: 10}}>同步信息
                </Button>
              </Col>
            </Row>

            <Form.Item label={"上传图片"} name={"uploadPic"}>
              <Button type="default" icon={<UploadOutlined/>} style={{color: "#1890FF", border: "none"}}
                      onClick={() => setPicModalState({visible: true})}>
                选择/上传
              </Button>
            </Form.Item>
            <Form.Item label={"图文布局"} name={"picLayout"} required={false}>
              <Radio.Group>
                <Radio value={1}>上下布局</Radio>
                <Radio value={0}>左右布局</Radio>
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
                            rules={[{required: false, message: '请输入一级特性'}]}
                          >
                            <Input style={{minWidth: 300}}></Input>
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
                                        <Input style={{minWidth: 300}}></Input>
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
                          onClick={() => history.push(`/onlineSystem/announcementDetail/1/1/false/true`)}>上一步</Button>
                </div>
              </Footer>
            </Form.Item>

          </Form>

        </div>
      </div>

      {/* 图片上传弹出框 */}
      <Modal title="上传图片" visible={true} centered={true} maskClosable={false}
             onOk={() => setPicModalState({visible: false})}
             onCancel={() => setPicModalState({visible: false})}
             width={700}>
        {/* title */}
        <Row>
          <Col span={12}>
            <h4 style={{fontWeight: "bold"}}>选择默认图片</h4>
          </Col>
          <Col span={12}>
            <h4 style={{fontWeight: "bold"}}>从本地上传</h4>
          </Col>
        </Row>
        {/* 图片展示和上传 */}
        <Row>

          <Col span={12}>
            <div>
              <Image
                height={150} width={'90%'}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            </div>
            <div style={{marginTop: 10}}>
              <Image
                height={150} width={'90%'}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            </div>
            <div style={{marginTop: 10}}>
              <Image
                height={150} width={'90%'}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            </div>

          </Col>
          <Col span={12}>

            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-circle"

            >
              {fileList.length < 5 && '+ Upload'}
            </Upload>

          </Col>
        </Row>

      </Modal>
    </PageContainer>
  );
};


export default PopupCard;
