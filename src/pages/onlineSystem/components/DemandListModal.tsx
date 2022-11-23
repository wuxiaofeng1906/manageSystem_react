import React, { useState, useEffect, useMemo } from 'react';
import { Modal, ModalFuncProps, Table, Select, Form, Col, Row, Spin, Checkbox } from 'antd';
import { useModel, useParams } from 'umi';
import styles from './DemandListModal.less';
import { OnlineSystemServices } from '@/services/onlineSystem';
import { StoryStatus, WhetherOrNot } from '@/pages/onlineSystem/config/constant';

const DemandListModal = (props: ModalFuncProps) => {
  const [form] = Form.useForm();
  const query = useParams() as { branch: string };
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);
  const [list, setList] = useState<any[]>([]);
  const [spin, setSpin] = useState(false);
  const [selected, setSelected] = useState<any[]>([]);
  const [envs, setEnvs] = useState<any[]>([]);

  useEffect(() => {
    if (!props.visible) {
      form.resetFields();
      setSelected([]);
      return;
    }
    getSelectList();
    getTableList();
  }, [props.visible]);

  const getSelectList = async () => {
    const res = await OnlineSystemServices.getEnvs();
    setEnvs(
      res?.map((it: any) => ({
        label: it.online_environment_name,
        value: it.online_environment_id,
      })),
    );
  };

  const getTableList = async () => {
    setSpin(true);
    try {
      const res = await OnlineSystemServices.getStoryList({ branch: query.branch ?? '' });
      console.log(res);
      setList(res);
      setSpin(false);
    } catch (e) {
      setSpin(false);
    }
  };

  const onConfirm = async () => {
    const values = await form.validateFields();
    props.onOk?.(true);
  };
  const onChange = (v: string) => {
    setSelected([]);
    form.setFieldsValue({
      cluster: v == 'global' ? ['global'] : ['0'],
    });
    setList(list.map((it) => ({ ...it, disabled: it.type !== v })));
  };

  const memoColumn = useMemo(() => {
    return [
      {
        title: '序号',
        dataIndex: 'applicant',
      },
      {
        title: '禅道执行名称',
        dataIndex: 'pro_name',
      },
      {
        title: '需求编号',
        dataIndex: 'story',
      },
      {
        title: '需求标题',
        dataIndex: 'title',
      },
      {
        title: '需求阶段',
        dataIndex: 'status',
        render: (v) => StoryStatus[v] ?? '',
      },
      {
        title: '应用服务',
        dataIndex: 'apps',
      },
      {
        title: '是否涉及数据update',
        dataIndex: 'db_update',
        render: (v) => WhetherOrNot[v] ?? (v || ''),
      },
      {
        title: '是否涉及数据Recovery',
        dataIndex: 'is_recovery',
        render: (v) => WhetherOrNot[v] ?? (v || ''),
      },
      {
        title: '是否可热更',
        dataIndex: 'is_update',
        render: (v) => (
          <Select
            disabled={!permission}
            value={v}
            style={{ width: '100%' }}
            options={[
              { label: '是', value: 'yes' },
              { label: '否', value: 'no' },
              { label: '免', value: 'unknown' },
            ]}
            onChange={(e) => {
              console.log(e);
            }}
          />
        ),
      },
      {
        title: '需求创建人',
        dataIndex: 'opened_by',
      },
      {
        title: '需求指派人',
        dataIndex: 'ass_to',
      },
    ];
  }, [list]);

  const permission = useMemo(() => user?.group == 'superGroup', [user]);

  return (
    <Modal
      {...props}
      centered
      okText={'确定'}
      maskClosable={false}
      destroyOnClose={true}
      width={1400}
      title={'新增发布批次：选择该批次发布的项目与需求'}
      wrapClassName={styles.DemandListModal}
      onCancel={() => props.onOk?.()}
      onOk={onConfirm}
    >
      <Spin spinning={spin} tip={'数据加载中...'}>
        <div>
          <Form form={form} size={'small'}>
            <Row justify={'space-between'} gutter={8}>
              <Col span={8}>
                <Form.Item
                  name={'env'}
                  label={'发布环境类型'}
                  rules={[{ required: true, message: '请选择发布环境' }]}
                >
                  <Select
                    placeholder={'发布环境类型'}
                    options={[
                      { label: 'global集群', value: 'global' },
                      { label: '租户集群发布', value: 'tenant' },
                    ]}
                    onChange={onChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item noStyle shouldUpdate={(old, next) => old.env !== next.env}>
                  {({ getFieldValue }) => {
                    const env = getFieldValue('env');
                    return (
                      <Form.Item
                        name={'cluster'}
                        label={'发布集群'}
                        rules={[{ required: true, message: '请选择发布集群' }]}
                      >
                        <Select
                          mode={'multiple'}
                          options={envs}
                          disabled={env == 'global'}
                          placeholder={'发布集群'}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={'clusters'}
                  label={'镜像环境绑定'}
                  rules={[{ required: true, message: '请选择镜像环境绑定' }]}
                >
                  <Select showSearch options={[]} placeholder={'镜像环境绑定'} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Table
            pagination={false}
            columns={memoColumn}
            rowKey={(p) => p.id}
            dataSource={list}
            rowSelection={{
              selectedRowKeys: selected,
              onChange: (selectedRowKeys) => setSelected(selectedRowKeys),
              getCheckboxProps: (record) => ({ disabled: record.disabled }),
            }}
          />
          <p style={{ marginTop: 8 }}>
            提示：如本次发布不涉及的需求，请将对应需求前勾选的复选框去掉
          </p>
        </div>
      </Spin>
    </Modal>
  );
};
export default DemandListModal;
