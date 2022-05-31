import React, { useEffect } from 'react';
import { Form, Select, DatePicker, Checkbox, Row, Col, Button, Space } from 'antd';
import FieldSet from '@/components/FieldSet';
import OnlineServices from '@/services/online';
import { useModel, useLocation } from 'umi';
const Release = ({ onTab }: { onTab: (v: string) => void }) => {
  // const [autoCheckForm] = Form.useForm();
  const [versionForm] = Form.useForm();
  const [branchForm] = Form.useForm();
  const [envForm] = Form.useForm();
  const {
    query: { idx, disable },
  } = useLocation() as any;
  const [frontSelector] = useModel('systemOnline', (system) => [system.frontSelector]);

  const getBranchInfo = async () => {
    if (idx) {
      const res = await OnlineServices.getCheckBranchInfo(idx);
      if (res) {
        versionForm.setFieldsValue({
          env: res.env,
          app_name: res.app_name?.split(','),
        });
      }
    }
  };
  useEffect(() => {
    onTab('release');
    getBranchInfo();
  }, [idx]);

  const onFinish = async () => {
    const res = await OnlineServices.updateCheckBranchInfo({});
  };

  return (
    <div className={'formItem'}>
      <FieldSet data={{ title: '版本检查', dot: true }}>
        <Form form={versionForm}>
          <Form.Item label={'是否开启'}>
            <span>是</span>
          </Form.Item>
          <Form.Item label={'服务'} name={'app_name'} style={{ marginLeft: 30 }}>
            <Select mode="multiple" disabled style={{ width: 300 }}>
              {frontSelector?.map((it: any) => (
                <Select.Option key={it.app_name}>{it.app_name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={'镜像环境'} name={'env'}>
            <Select options={[]} style={{ width: 300 }} disabled />
          </Form.Item>
        </Form>
      </FieldSet>
      <FieldSet data={{ title: '检查上线分支是否包含对比分支的提交', dot: true }}>
        <Form form={branchForm} onValuesChange={onFinish}>
          <Form.Item label={'是否开启'}>
            <span>是</span>
          </Form.Item>
          <Form.Item label={'被对比的主分支'}>
            <span>stage & master</span>
          </Form.Item>
          <Form.Item label={'技术侧'}>
            <span>前后端</span>
          </Form.Item>
          <Form.Item label={'对比起始时间'} name={'create_time'}>
            <DatePicker disabled={disable == 'success'} />
          </Form.Item>
        </Form>
      </FieldSet>
      <Form form={envForm}>
        <Form.Item label={'环境一致性检查环境'} name={'env'} style={{ margin: '10px 0 0 10px' }}>
          <Select options={[]} style={{ width: 300 }} disabled />
        </Form.Item>
      </Form>
      {/* <FieldSet
        data={{ title: '自动化检查设置', mark: '【测试值班负责人填写自动化检查参数】', dot: true }}
      >
        <Form form={autoCheckForm} onFinish={onFinish}>
          <Form.Item label={'①上线前自动化检查设置'} name={'auto_check'} valuePropName="checked">
            <Checkbox>是否立即启用</Checkbox>
          </Form.Item>
          <Row gutter={12}>
            <Col span={6}>
              <Form.Item label={'检查类型'} name={'check_type'}>
                <Select options={[]} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={'测试环境'} name={'test_env'}>
                <Select options={[]} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={'浏览器'} name={'test_env'}>
                <Select options={[]} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label={'②上线后自动化检查设置'}
            name={'auto_check_after'}
            valuePropName="checked"
          >
            <Checkbox>是否立即启用</Checkbox>
          </Form.Item>
          <Row gutter={12}>
            <Col span={6}>
              <Form.Item label={'检查类型'} name={'check_type_after'}>
                <Select options={[]} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={'测试环境'} name={'test_env_after'}>
                <Select options={[]} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={'浏览器'} name={'test_env'}>
                <Select options={[]} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: 'right' }}>
            <Space size={10}>
              <Button onClick={() => autoCheckForm.resetFields()}>清空</Button>
              <Button type="primary" htmlType="submit">
                点击保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </FieldSet> */}
    </div>
  );
};
export default Release;
