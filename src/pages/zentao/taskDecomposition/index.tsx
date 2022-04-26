import React, {useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Button, Col, Form, InputNumber, Tooltip, Row, Select, Spin, TreeSelect} from "antd";
import {CopyOutlined, FolderAddTwoTone} from "@ant-design/icons";

// 组件初始化
const TaskDecompose: React.FC<any> = () => {

  const [createState, setCreateState] = useState(false); // 点击执行后的状态（是否执行完）

  /* region 操作栏相关事件 */
  const [formForTaskQuery] = Form.useForm();

  // 所属执行改变
  const executionChanged = () => {

  };


  // 禅道需求改变
  const ztStoryChanged = () => {

  }
  // 指派人改变
  const assignedToChanged = () => {

  }

  // 创建人改变
  const createrChanged = () => {

  };

  // 点击创建任务按钮
  const createZentaoTask = () => {

  };

  /* endregion 操作栏相关事件 */

  return (
    <PageContainer style={{marginTop: -30}}>
      <Spin spinning={createState} tip="任务创建中..." size={"large"}>
        <div style={{marginTop: -15}}>
          <Form form={formForTaskQuery}>
            {/* gutter col 之间的间隔 [水平，垂直] */}
            <Row style={{marginLeft: -10}} gutter={[4, 4]}>
              <Col>
                <Tooltip title="创建任务">
                  <Button type="text" icon={<CopyOutlined/>} size={'middle'}
                          style={{
                            color: '#46A0FC'
                          }}
                          onClick={createZentaoTask}>
                  </Button>
                </Tooltip>
              </Col>
              <Col span={5}>
                <Form.Item label="所属执行" name="execution">
                  <Select style={{width: '100%'}} showSearch onChange={executionChanged}>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="禅道需求" name="ztStory">
                  <Select style={{width: '100%'}} showSearch onChange={ztStoryChanged}>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="指派给" name="assignedTo">
                  <Select style={{width: '100%'}} showSearch onChange={assignedToChanged}>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="由谁创建" name="creater">
                  <Select style={{width: '100%'}} showSearch onChange={createrChanged}>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Spin>
    </PageContainer>
  );
};


export default TaskDecompose;
