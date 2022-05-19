import React from 'react';
import { Form, Select, DatePicker, Checkbox, Row, Col } from 'antd';
import FieldSet from '@/components/FieldSet';

const Release = () => {
  return (
    <div className={'formItem'}>
      <FieldSet data={{ title: '版本检查', dot: true }}>
        <Form>
          <Form.Item label={'是否开启'} name={'open'}>
            <span>是</span>
          </Form.Item>
          <Form.Item label={'服务'} name={'serve'} style={{ marginLeft: 30 }}>
            <Select options={[]} style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label={'镜像环境'} name={'env'}>
            <Select options={[]} style={{ width: 300 }} />
          </Form.Item>
        </Form>
      </FieldSet>
      <FieldSet data={{ title: '检查上线分支是否包含对比分支的提交', dot: true }}>
        <Form>
          <Form.Item label={'是否开启'} name={'open'}>
            <span>是</span>
          </Form.Item>
          <Form.Item label={'被对比的主分支'} name={'branch'}>
            <span>stage & master</span>
          </Form.Item>
          <Form.Item label={'技术侧'} name={'env'}>
            <span>前后端</span>
          </Form.Item>
          <Form.Item label={'对比起始时间'} name={'date'}>
            <DatePicker />
          </Form.Item>
        </Form>
      </FieldSet>
      <Form>
        <Form.Item label={'环境一致性检查环境'} name={'date'} style={{ margin: '10px 0 0 10px' }}>
          <Select options={[]} style={{ width: 300 }} />
        </Form.Item>
      </Form>
      <FieldSet
        data={{ title: '自动化检查设置', mark: '[测试值班负责人填写自动化检查参数]', dot: true }}
      >
        <div>
          <Form>
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
          </Form>
        </div>
      </FieldSet>
    </div>
  );
};
export default Release;
