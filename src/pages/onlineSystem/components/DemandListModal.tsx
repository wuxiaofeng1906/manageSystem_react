import React, { useState, useEffect, useMemo } from 'react';
import { Modal, ModalFuncProps, Table, Select, Form, Col, Row, Spin } from 'antd';
import { useModel } from 'umi';
import styles from './DemandListModal.less';

const DemandListModal = (props: ModalFuncProps) => {
  const [form] = Form.useForm();
  const [user] = useModel('@@initialState', (init) => [init.initialState?.currentUser]);
  const [list, setList] = useState<any[]>([]);
  const [spin, setSpin] = useState(false);
  const [selected, setSelected] = useState<any[]>([]);

  useEffect(() => {
    if (props.visible) return;
    getTableList();
  }, [props.visible]);

  const getTableList = async () => {
    setSpin(true);
    try {
      setList([
        {
          name: '笑果文化',
          num: 2210,
          title: '预算编制单优化',
          phase: '测试中',
          server: 'trek',
          update: 'yes',
          recovery: 'no',
          hot: 'yes',
          create_pm: '张三',
          point_pm: '李四',
          id: '20221111',
        },
      ]);
      setSpin(false);
    } catch (e) {
      setSpin(false);
    }
  };

  const onConfirm = async () => {
    const values = await form.validateFields();
    props.onOk?.(true);
  };

  const memoColumn = useMemo(() => {
    const flag = list.every((it) => ['stage-patch', 'emergency'].includes(it.name));
    if (flag)
      return [
        {
          title: '序号',
          dataIndex: 'applicant',
        },
        {
          title: '禅道执行名称',
          dataIndex: 'name',
        },
        {
          title: '需求编号',
          dataIndex: 'num',
        },
        {
          title: '需求标题',
          dataIndex: 'title',
        },
        {
          title: '需求阶段',
          dataIndex: 'phase',
        },
        {
          title: '应用服务',
          dataIndex: 'server',
        },
        {
          title: '是否涉及数据update',
          dataIndex: 'update',
        },
        {
          title: '是否涉及数据Recovery',
          dataIndex: 'recovery',
        },
        {
          title: '是否可热更',
          dataIndex: 'hot',
          render: (p) => (
            <Select
              disabled={!permission}
              value={p.hot}
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
          dataIndex: 'create_pm',
        },
        {
          title: '需求指派人',
          dataIndex: 'point_pm',
        },
      ];
    else
      return [
        {
          title: '序号',
          dataIndex: 'applicant',
        },
        {
          title: '禅道执行名称',
          dataIndex: 'name',
        },
        {
          title: '需求阶段',
          dataIndex: 'phase',
        },
        {
          title: '应用服务',
          dataIndex: 'server',
        },
      ];
  }, [list]);
  const permission = useMemo(() => user?.group == 'superGroup', [user]);

  return (
    <Modal
      {...props}
      centered
      confirmLoading={spin}
      okText={'确定'}
      maskClosable={false}
      destroyOnClose={true}
      width={memoColumn?.length > 4 ? 1400 : 800}
      title={'新增发布批次：选择该批次发布的项目与需求'}
      wrapClassName={styles.DemandListModal}
      onCancel={() => props.onOk?.()}
      onOk={onConfirm}
    >
      <div>
        <Form form={form} size={'small'}>
          <Row justify={'space-between'} gutter={8}>
            <Col span={8}>
              <Form.Item
                name={'env'}
                label={'发布环境类型'}
                rules={[{ required: true, message: '请选择发布环境' }]}
              >
                <Select />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={'cluster'}
                label={'发布集群'}
                rules={[{ required: true, message: '请选择发布集群' }]}
              >
                <Select mode={'multiple'} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={'cluster'}
                label={'镜像环境绑定'}
                rules={[{ required: true, message: '请选择镜像环境绑定' }]}
              >
                <Select showSearch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          columns={memoColumn}
          rowKey={(p) => p.id}
          dataSource={list}
          rowSelection={{
            selectedRowKeys: selected,
            onChange: (selectedRowKeys) => setSelected(selectedRowKeys),
          }}
          pagination={false}
        />
        <p style={{ marginTop: 8 }}>提示：如本次发布不涉及的需求，请将对应需求前勾选的复选框去掉</p>
      </div>
    </Modal>
  );
};
export default DemandListModal;
