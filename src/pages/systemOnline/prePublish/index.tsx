import React, { useMemo, useState } from 'react';
import { Layout, Form, Select, DatePicker, Button, Menu } from 'antd';
import styles from './index.less';
import ProjectServices from './projectServices';
import Deploy from './deploy';
import Worksheet from './worksheet';
import Publish from './publish';
import Overview from './overview';
import moment from 'moment';

const menus = [
  {
    label: '项目&服务',
    key: 'projectService',
  },
  {
    label: '部署',
    key: 'deploy',
  },
  {
    label: '工单',
    key: 'worksheet',
  },
  {
    label: '发布',
    key: 'publish',
  },
  {
    label: '总览',
    key: 'overview',
  },
];
const PreLayout = () => {
  const [activePath, setActivePath] = useState('projectService');
  const [condition] = useState({
    publish_type: '1',
    publish_by: 'no',
    publish_date: moment().hours(23).minute(0),
  });
  const renderContent = useMemo(() => {
    if (activePath == 'deploy') return <Deploy />;
    if (activePath == 'worksheet') return <Worksheet />;
    if (activePath == 'publish') return <Publish />;
    if (activePath == 'overview') return <Overview />;
    return <ProjectServices />;
  }, [activePath]);

  const [form] = Form.useForm();
  return (
    <div className={styles.prepublish}>
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
          <Menu
            className={styles.menu}
            selectedKeys={[activePath]}
            mode="inline"
            onClick={(it) => {
              setActivePath(it.key);
            }}
            items={menus.map((it) => it)}
          />
        </Layout.Sider>
        <Layout>
          <div className={styles.content}>{renderContent}</div>
        </Layout>
      </Layout>
    </div>
  );
};
export default PreLayout;
