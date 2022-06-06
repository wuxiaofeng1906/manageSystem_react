import React, { useEffect } from 'react';
import { useModel, useLocation } from 'umi';
import { Modal, Form, Switch, Row, Col, Divider, Select, Space } from 'antd';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import styles from './index.less';
import OnlineServices from '@/services/online';
import { WEAPPENV } from '../../constants';

const DeploySetting = (props: ModalFuncProps) => {
  const [form] = Form.useForm();
  const {
    query: { idx },
  } = useLocation() as any;
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [release_project, disabled] = useModel('systemOnline', (system) => [
    system.proInfo?.release_project,
    system.disabled,
  ]);
  const onConfirm = async () => {
    const values = await form.getFieldsValue();
    if (!idx || !user?.userid) return;
    const res = await OnlineServices.updateDeploySetting({
      ...values,
      user_id: user.userid,
      release_env: release_project?.release_env,
    });
    props.onCancel?.();
  };

  useEffect(() => {
    const env = release_project?.release_env;
    if (env && props.visible) {
      OnlineServices.getDeploySetting(env).then((res) => {
        form.setFieldsValue({
          ...res['backend-build-image'],
          ...res['bpmn-test'],
          ...res['front-authapp'],
          ...res['front-static'],
        });
      });
    } else form.resetFields();
  }, [props.visible]);

  return (
    <Modal
      destroyOnClose
      width={1000}
      visible={props.visible}
      title={props.title}
      onCancel={props.onCancel}
      okText={'点击保存'}
      wrapClassName={styles.deploySetting}
      onOk={onConfirm}
      okButtonProps={{ disabled }}
      centered
    >
      <Form form={form}>
        <Divider plain>① backend-build-image</Divider>
        <Row>
          <Col span={5}>
            <Form.Item label={'全局数据库升级'} name={'DBUP_GLOBAL'} valuePropName="checked">
              <Switch checkedChildren="是" unCheckedChildren="否" disabled={disabled} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={'默认对租户数据库升级'} name={'DBUP_TANANT'} valuePropName="checked">
              <Switch checkedChildren="是" unCheckedChildren="否" disabled={disabled} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={'是否进行黑盒测试，输出测试覆盖率'}
              name={'black_box'}
              valuePropName="checked"
            >
              <Switch checkedChildren="是" unCheckedChildren="否" disabled={disabled} />
            </Form.Item>
          </Col>
        </Row>
        <Divider plain>② bpmn</Divider>
        <Form.Item
          label={'推送流程定义batch到运维平台上线，需上灰度/生产环境时打勾'}
          name={'Batch_ops'}
          valuePropName="checked"
        >
          <Switch checkedChildren="是" unCheckedChildren="否" disabled={disabled} />
        </Form.Item>
        <Divider plain>③ front-authapp</Divider>
        <Col>
          <Form.Item
            label={
              '需要更新依赖（需要耗费比较长的时间执行 rush update --purge --full 命令来更新依赖）'
            }
            name={'needUpdateDependences'}
            valuePropName="checked"
          >
            <Switch checkedChildren="是" unCheckedChildren="否" disabled={disabled} />
          </Form.Item>
          <Form.Item label={'启动sourcemap 方便调试'} name={'sourcemap'} valuePropName="checked">
            <Switch checkedChildren="是" unCheckedChildren="否" disabled={disabled} />
          </Form.Item>
          <Form.Item
            label={'是否启动sentry 错误监控（如果此次打包需要上线，需要勾上）'}
            name={'needSentry'}
            valuePropName="checked"
          >
            <Switch checkedChildren="是" unCheckedChildren="否" disabled={disabled} />
          </Form.Item>
          <Form.Item
            label={'是否需要打包两次，服务于自动化测试'}
            name={'needBuildTwice'}
            valuePropName="checked"
          >
            <Switch checkedChildren="是" unCheckedChildren="否" disabled={disabled} />
          </Form.Item>
          <Form.Item label={'是否需要前端测试用例报告'} name={'report'} valuePropName="checked">
            <Switch checkedChildren="是" unCheckedChildren="否" disabled={disabled} />
          </Form.Item>
          <Form.Item label={'weAppEnv'}>
            <Form.Item name={'weAppEnv'} noStyle>
              <Select
                options={WEAPPENV}
                style={{ width: 200, marginRight: 20 }}
                disabled={disabled}
              />
            </Form.Item>
            <span className="ant-form-text">
              说明：小程序环境 beta={'>'} 新版测试环境 development={'>'} 老版测试环境 production=
              {'>'} 生产环境
            </span>
          </Form.Item>
        </Col>
        <Divider plain>④front-authapp</Divider>
        <Row>
          <Col span={6}>
            <Form.Item label={'是否需要上传到sentry'} name={'SENTRY'} valuePropName="checked">
              <Switch checkedChildren="是" unCheckedChildren="否" disabled={disabled} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label={'自动化测试'} name={'AUTOMATION_TEST'} valuePropName="checked">
              <Switch checkedChildren="是" unCheckedChildren="否" disabled={disabled} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label={'单元测试'} name={'UNIT_TEST'} valuePropName="checked">
              <Switch checkedChildren="是" unCheckedChildren="否" disabled={disabled} />
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
