import React, { useEffect, useState } from 'react';
import { Layout, Form, Select, DatePicker, Button, Menu } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import dayjs from 'dayjs';

const menus = [
  { label: '项目&服务', key: 'projectServices' },
  { label: '部署', key: 'deploy' },
  { label: '工单', key: 'worksheet' },
  { label: '发布', key: 'publish' },
  { label: '总览', key: 'overview' },
];
const PreLayout = ({ location, children }) => {
  const [form] = Form.useForm();
  const [activePath, setActivePath] = useState([
    location.pathname.split('/systemOnline/prePublish/')[1] || 'projectServices',
  ]);
  const [condition] = useState({
    publish_type: '1',
    publish_by: 'no',
    publish_date: dayjs().hour(23).minute(0),
  });
  useEffect(() => {
    if (location.pathname === '/systemOnline/prePublish') {
      history.replace('/systemOnline/prePublish/projectServices');
    }
  }, [location.pathname]);

  return (
    <div className={styles.preLayout}>
      <Layout>
        <Layout.Sider width={300} theme={'light'} className={styles.layout}>
          <div className={styles.formWrap}>
            <Form form={form} initialValues={condition}>
              <Form.Item label={'发布类型'} name={'publish_type'}>
                <Select
                  options={[
                    { value: '1', label: '灰度发布（集群1）' },
                    { value: '2', label: '热更线上（热更2-6/1-6）' },
                    { value: '3', label: '灰度推线上（集群1推2-6）' },
                  ]}
                />
              </Form.Item>
              <Form.Item label={'发布方式'} name={'publish_by'}>
                <Select
                  options={[
                    { value: 'yes', label: '停服' },
                    { value: 'no', label: '不停服' },
                  ]}
                />
              </Form.Item>
              <Form.Item label={'发布时间'} name={'publish_date'}>
                <DatePicker format={'YYYY-MM-DD HH:mm'} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label={'确认封板'}>
                <Button block type={'primary'}>
                  未封板
                </Button>
              </Form.Item>
              <Form.Item label={'发布结果'} name={'publish_result'}>
                <Select options={[]} />
              </Form.Item>
            </Form>
          </div>
          <Menu className={styles.menu} selectedKeys={activePath} mode="inline">
            {menus.map((it) => (
              <Menu.Item
                key={it.key}
                onClick={(e) => {
                  setActivePath(e.keyPath);
                  history.push(`/systemOnline/prePublish/${it.key}`);
                }}
              >
                {it.label}
              </Menu.Item>
            ))}
          </Menu>
        </Layout.Sider>
        <Layout>
          <div className={styles.content}>{children}</div>
        </Layout>
      </Layout>
    </div>
  );
};
export default PreLayout;
