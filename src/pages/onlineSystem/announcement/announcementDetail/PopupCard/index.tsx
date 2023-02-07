import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {
  Button, Form, Input, Row, Col, Space,
  Radio, Tabs, Divider, Layout, RadioChangeEvent, FormListFieldData
} from 'antd';
import {useParams} from "umi";
import {isEmpty} from "lodash";
import {history} from "@@/core/history";
import style from '../style.less';
import {PlusCircleOutlined, UploadOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';

const {Header, Footer} = Layout;
const {TabPane} = Tabs;
const PopupCard: React.FC<any> = (props: any) => {
  const [dtForm] = Form.useForm();
  const {isCarousel, count} = useParams() as { isCarousel: string; count: string };

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
    // 初始化表单
    dtForm.setFieldsValue({
      users: [{first: "", second: ""}]
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
            <Row style={{display: isCarousel === "true" ? "inline-block" : "none"}}>
              <Form.Item label={"特性名称"} name={"specialName"} rules={[{required: true, message: '特性名称不能为空！'}]}>
                <Input style={{minWidth: 300}}></Input>
              </Form.Item>
            </Row>

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
            <Form.Item label={"上传图片"} name={"uploadPic"} rules={[{required: true, message: '图片不能为空！'}]}>
              <Button type="default" icon={<UploadOutlined/>} style={{color: "#1890FF", border: "none"}}>
                选择/上传
              </Button>
            </Form.Item>
            <Form.Item label={"图文布局"} name={"picLayout"} required>
              <Radio.Group>
                <Radio value={1}>上下布局</Radio>
                <Radio value={0}>左右布局</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.List name="users">
              {(fields: FormListFieldData[], {add, remove}) => (
                <>
                  {fields.map(({key, name, ...restField}) => (
                    <div key={key}>
                      <Row>
                        <Form.Item
                          {...restField}
                          label={"一级特性"}
                          name={[name, 'first']}
                          rules={[{required: true, message: '请输入一级特性'}]}
                        >
                          <Input style={{minWidth: 300}}></Input>
                        </Form.Item>

                        {/* 删除 */}
                        <Button
                          style={{border: 'none', color: "red", marginLeft: 5}}
                          icon={<MinusCircleOutlined/>}
                          onClick={() => remove(name)}
                        />
                      </Row>
                      <Row>
                        <Form.Item
                          {...restField}
                          label={"二级特性"}
                          name={[name, 'second']}
                        >
                          <Input style={{minWidth: 300}}></Input>
                        </Form.Item>

                        {/* 删除 */}
                        <Button
                          style={{border: 'none', color: "#1890FF", marginLeft: 5}}
                          icon={<PlusCircleOutlined/>}
                          onClick={() => add()}
                        />
                        <Button
                          style={{border: 'none', color: "red", marginLeft: 5}}
                          icon={<MinusCircleOutlined/>}
                          onClick={() => remove(name)}
                        />
                      </Row>

                    </div>

                  ))}

                  {/* 点击一级特性 */}
                  <Form.Item>
                    <Button style={{marginLeft: 130, border: 'none', color: '#1890FF'}}
                            icon={<PlusCircleOutlined/>}
                            onClick={() => add()}  // 直接写add函数会导致获取的参数多余
                    > 添加一级特性 </Button>

                  </Form.Item>
                </>
              )}
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
    </PageContainer>
  );
};


export default PopupCard;
