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
  // isCarousel 是否轮播，count 轮播的数量
  if (isCarousel === "true" && Number(count) > 0) {

  } else {

  }


  const [property, setProperty] = useState([{
      stProperty: "",
      edProperty: ""
    }]
  );

  const addFirstProperty = () => {

    const newArray = [...property];
    newArray.push({
      stProperty: "新增的一级特性",
      edProperty: "新增二级特性"
    });

    dtForm.setFieldsValue({
      property: newArray,
    });
    return setProperty(newArray);

  };

  const addSeondProperty = (v: any) => {
    debugger;
    console.log(v)
    const newArray = [...property];
    newArray.push({
      stProperty: "新增的一级特性",
      edProperty: "新增二级特性",
    });

    dtForm.setFieldsValue({
      property: newArray,
    });
    return setProperty(newArray);

  };

  const propertyItems = property.map((item: any, index: any) => {

    return (<div>
      <Row>
        <Col>
          <Form.Item label={"一级特性"} name={['property', index, 'stProperty']} required>
            <Input style={{minWidth: 300}} required placeholder={"建议不超过15个字"}></Input>
          </Form.Item>
        </Col>
        <Col>
          <Button
            style={{border: 'none', color: "red"}}
            icon={<MinusCircleOutlined/>}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Item label={"二级特性"} name={['property', index, 'edProperty']}>
            <Input style={{minWidth: 300}}></Input>
          </Form.Item>
        </Col>
        <Col>
          <Button
            style={{border: 'none', color: '#1890FF'}}
            icon={<PlusCircleOutlined/>}
            onClick={() => addSeondProperty(index)}
          />
          <Button
            style={{border: 'none', color: "red", marginLeft: 5, backgroundColor: "transparent"}}
            icon={<MinusCircleOutlined/>}
          />
        </Col>
      </Row>
    </div>);
  });

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };

  useEffect(() => {
    // 初始化表单
    dtForm.setFieldsValue({
      users: [{first: "", second: ""}]
    });
  }, [])
  return (
    <PageContainer>
      <div className={style.popForm}>
        <Form form={dtForm} autoComplete={"off"} onFinish={onFinish} name={"dynamic_form_nest_item"}>
          <Row>
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
          <Form.Item label={"上传图片"} name={"uploadPic"} required>
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
    </PageContainer>
  );
};


export default PopupCard;
