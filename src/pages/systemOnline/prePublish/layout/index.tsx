import React, { useEffect, useState } from 'react';
import { Layout, Form, Select, DatePicker, Menu, Spin } from 'antd';
import { history, useModel, useLocation } from 'umi';

import styles from './index.less';
import moment from 'moment';
import { PUBLISH_RESULT, MENUS } from '../../constants';
import { MOMENT_FORMAT } from '@/namespaces';
import { omit } from '@/utils/utils';

const PreLayout = ({ location, children }: { location: any; children: React.ReactNode }) => {
  const {
    query: { idx },
  } = useLocation() as any;
  const [activePath, setActivePath] = useState([
    location.pathname.split('/systemOnline/prePublish/')[1] || 'projectServices',
  ]);
  const { typeSelectors, methodSelectors, updateColumn, proInfo, getProInfo, disabled } =
    useModel('systemOnline');
  const [form] = Form.useForm();
  const [flag, setFlag] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const update = async (type: any, values: any) => {
    if (idx && !disabled) {
      setSpinning(true);
      try {
        await updateColumn({
          ...values,
          release_num: idx,
          release_date: moment(values.release_date).format(MOMENT_FORMAT.utc),
          release_project: type == 'create' ? '' : proInfo?.release_project?.release_project || '',
          release_env: type == 'create' ? '' : proInfo?.release_project?.release_env || '',
          release_branch: type == 'create' ? '' : proInfo?.release_project?.release_branch || '',
        });
        await getProInfo(idx);
        setSpinning(false);
      } catch (e) {
        setSpinning(false);
      }
    }
  };

  // create or query
  useEffect(() => {
    getProInfo(idx).then((res) => {
      if (res && !Object.keys(res?.release_project).length) {
        update('create', {
          release_type: typeSelectors?.[0]?.value,
          release_method: methodSelectors?.[0]?.value,
          release_result: PUBLISH_RESULT[0].value,
          release_date: moment().hour(23).minute(0).seconds(0),
        });
      }
    });
  }, [idx]);

  useEffect(() => {
    if (proInfo?.release_project) {
      form.setFieldsValue({
        ...proInfo?.release_project,
        release_date: moment(proInfo?.release_project?.release_date),
      });
    }
    const status = proInfo?.upgrade_project?.some((it) =>
      [it.is_database_upgrade, it.is_recovery_database].includes('yes'),
    );
    setFlag(status || false);
  }, [JSON.stringify(proInfo)]);

  return (
    <Spin spinning={spinning} tip={'数据加载中...'} wrapperClassName={styles.spinWrap}>
      <div className={styles.preLayout}>
        <Layout>
          <Layout.Sider width={290} theme={'light'} className={styles.layout}>
            <div className={styles.formWrap}>
              <Form form={form} onValuesChange={update}>
                <Form.Item label={'发布类型'} name={'release_type'}>
                  <Select disabled={disabled} options={typeSelectors} />
                </Form.Item>
                <Form.Item label={'发布方式'} name={'release_method'}>
                  <Select
                    disabled={disabled}
                    options={methodSelectors?.map((it) => ({
                      ...it,
                      disabled: it.value == 'keep_server' ? flag : false,
                    }))}
                  />
                </Form.Item>
                <Form.Item label={'发布时间'} name={'release_date'}>
                  <DatePicker
                    format={MOMENT_FORMAT.utc}
                    style={{ width: '100%' }}
                    disabled={disabled}
                    allowClear={false}
                    showTime
                  />
                </Form.Item>
                <Form.Item label={'发布结果'} name={'release_result'}>
                  <Select options={PUBLISH_RESULT} disabled={disabled} />
                </Form.Item>
              </Form>
            </div>
            <Menu className={styles.menu} selectedKeys={activePath} mode="inline">
              {MENUS.map((it) => (
                <Menu.Item
                  key={it.key}
                  onClick={(e) => {
                    setActivePath(e.keyPath);
                    history.push({
                      pathname: `/systemOnline/prePublish/${it.key}`,
                      query: omit(location.query, ['active']), // 排除active
                    });
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
    </Spin>
  );
};
export default PreLayout;
