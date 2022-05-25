import React from 'react';
import { Modal, Form, Switch, Row, Col, Divider, Select, Space } from 'antd';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import styles from './index.less';

const DeploySetting = (props: ModalFuncProps) => {
  const [form] = Form.useForm();

  return (
    <Modal
      destroyOnClose
      width={1000}
      visible={props.visible}
      title={props.title}
      onCancel={props.onCancel}
      okText={'点击保存'}
      wrapClassName={styles.deploySetting}
      onOk={async () => {
        const result = await form.validateFields();
        props.onOk?.(result);
      }}
    >
      <Form
        form={form}
        initialValues={{
          black_test: false,
          push_process: false,
          start_sentry: false,
          start_sourcemap: false,
          test_auto: false,
          test_report: false,
          test_temp: false,
          two_pack: false,
          update_nodemodules: false,
          upgrade_dbs: false,
          upgrade_users_dbs: false,
          upload_sentry: false,
          weapp_env: undefined,
        }}
      >
        <Divider plain>① backend-build-image</Divider>
        <Row>
          <Col span={5}>
            <Form.Item label={'全局数据库升级'} name={'upgrade_dbs'} valuePropName="checked">
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={'默认对租户数据库升级'}
              name={'upgrade_users_dbs'}
              valuePropName="checked"
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={'是否进行黑盒测试，输出测试覆盖率'}
              name={'black_test'}
              valuePropName="checked"
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </Col>
        </Row>
        <Divider plain>② bpmn</Divider>
        <Form.Item
          label={'推送流程定义batch到运维平台上线，需上灰度/生产环境时打勾'}
          name={'push_process'}
          valuePropName="checked"
        >
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
        <Divider plain>③ front-authapp</Divider>
        <Col>
          <Form.Item
            label={
              '需要更新依赖（需要耗费比较长的时间执行 rush update --purge --full 命令来更新依赖）'
            }
            name={'update_nodemodules'}
            valuePropName="checked"
          >
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
          <Form.Item
            label={'启动sourcemap 方便调试'}
            name={'start_sourcemap'}
            valuePropName="checked"
          >
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
          <Form.Item
            label={'是否启动sentry 错误监控（如果此次打包需要上线，需要勾上）'}
            name={'start_sentry'}
            valuePropName="checked"
          >
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
          <Form.Item
            label={'是否需要打包两次，服务于自动化测试'}
            name={'two_pack'}
            valuePropName="checked"
          >
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
          <Form.Item
            label={'是否需要前端测试用例报告'}
            name={'test_report'}
            valuePropName="checked"
          >
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
          <Form.Item label={'weAppEnv'} name={'weapp_env'} valuePropName="checked">
            <Select options={[]} style={{ width: 200, marginRight: 20 }} />
            <span className="ant-form-text">
              {' '}
              说明：小程序环境 beta={'>'} 新版测试环境 development={'>'} 老版测试环境 production=
              {'>'} 生产环境
            </span>
          </Form.Item>
        </Col>
        <Divider plain>④front-authapp</Divider>
        <Row>
          <Col span={6}>
            <Form.Item
              label={'是否需要上传到sentry'}
              name={'upload_sentry'}
              valuePropName="checked"
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label={'自动化测试'} name={'test_auto'} valuePropName="checked">
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label={'单元测试'} name={'test_temp'} valuePropName="checked">
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider plain>⑤ 全局</Divider>
      <Space size={16}>
        <span>前端是否封板：否</span>
        <span>后端是否封板：否</span>
      </Space>
    </Modal>
  );
};
export default DeploySetting;
