import React, { useEffect, useRef, useState, useMemo } from 'react';
import styles from './index.less';
import { Button, Spin, Modal, Form, Col, Row, Select, Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import { isEmpty } from 'lodash';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { getHeight } from '@/publicMethods/pageSet';
import { applicationConfigColumn } from './column';
import { TechnicalSide, WhetherOrNot } from '@/pages/onlineSystem/common/constant';
import { infoMessage } from '@/publicMethods/showMessages';

const ApplicationServerConfig = () => {
  const [gridHeight, setGridHeight] = useState(getHeight() - 60);
  const [list, setList] = useState<any[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [activeItem, setActiveItem] = useState<any>();
  const gridRef = useRef<GridApi>();

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onRemove = async () => {
    const selected = gridRef.current?.getSelectedRows();
    if (isEmpty(selected)) return infoMessage('请先选择删除项！');
    console.log(selected);
  };
  window.onresize = function () {
    setGridHeight(Number(getHeight()) - 60);
    gridRef.current?.sizeColumnsToFit();
  };

  useEffect(() => {
    setList([
      {
        name: 'web',
        side: '前端',
        type: '前端业务应用',
        env: '租户集群',
        apk: 'yes',
        unit_check: 'yes',
        env_check: 'no',
        hot: 'no',
        upgrade: 'no',
        gitlab: 'front/front-goserver',
        mark: '测试一下',
        creator: '张值',
        create_time: '2022-10-10 12:23:21',
        editor: '邓刚',
        editor_time: '2022-10-10 18:20:20',
      },
    ]);
  }, []);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <PageContainer>
        <div className={styles.applicationServerConfig}>
          <div className={styles.btnBox}>
            <Button type={'primary'} onClick={() => setEditModal(true)}>
              新增
            </Button>
            <Button type={'primary'} onClick={onRemove}>
              删除
            </Button>
          </div>
          <div style={{ height: gridHeight }}>
            <AgGridReact
              className="ag-theme-alpine"
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: true,
                suppressMenu: true,
                cellStyle: { 'line-height': '30px' },
              }}
              rowHeight={30}
              headerHeight={35}
              suppressRowTransform={true}
              onGridReady={onGridReady}
              onGridSizeChanged={onGridReady}
              columnDefs={applicationConfigColumn}
              rowData={list}
              onRowDoubleClicked={(p) => {
                setActiveItem(p.data);
                setEditModal(true);
              }}
            />
          </div>
          <EditModal
            onCancel={() => {
              setActiveItem(undefined);
              setEditModal(false);
            }}
            visible={editModal}
            data={activeItem}
          />
        </div>
      </PageContainer>
    </Spin>
  );
};
export default ApplicationServerConfig;

const EditModal = (props: ModalFuncProps & { data: any }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const memoWhetherOrNot = useMemo(
    () => Object.entries(WhetherOrNot).map(([k, v]) => ({ label: v, value: k })),
    [],
  );
  const onConfirm = async () => {
    const values = await form.validateFields();
    props.onCancel?.(values);
  };
  useEffect(() => {
    if (!props?.visible) {
      form.resetFields();
      return;
    }
    form.setFieldsValue(props.data);
  }, [props?.visible]);

  return (
    <Modal
      {...props}
      centered
      maskClosable={false}
      title={`${isEmpty(props.data) ? '新增' : '编辑'}新增应用服务配置`}
      onCancel={() => props?.onCancel?.()}
      onOk={onConfirm}
      destroyOnClose={true}
      okButtonProps={{ disabled: loading }}
      width={800}
    >
      <Form form={form}>
        <Row gutter={6}>
          <Col span={12}>
            <Form.Item
              name={'applicant'}
              label={'应用名称'}
              rules={[{ message: '请选择应用名称', required: true }]}
            >
              <Select placeholder={'请选择应用名称'} options={[]} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={'side'}
              label={'技术侧'}
              rules={[{ message: '请选择应用名称', required: true }]}
            >
              <Select
                placeholder={'请选择技术侧'}
                mode={'multiple'}
                options={Object.entries(TechnicalSide).map(([k, v]) => ({ label: v, value: k }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={6}>
          <Col span={12}>
            <Form.Item
              name={'type'}
              label={'所属应用类型'}
              rules={[{ message: '请选择所属应用类型', required: true }]}
            >
              <Select
                placeholder={'请选择所属应用类型'}
                options={[
                  { label: '前端业务应用', value: 'front' },
                  { label: '后端业务应用', value: 'backend' },
                  { label: '后端平台应用', value: 'platform' },
                  { label: '流程应用', value: 'tech' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={'env'}
              label={'可上线环境'}
              rules={[{ message: '请选择可上线环境', required: true }]}
            >
              <Select placeholder={'请选择可上线环境'} options={[]} mode={'multiple'} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={6}>
          <Col span={12}>
            <Form.Item
              name={'apk'}
              label={'是否是应用包'}
              rules={[{ message: '请选择是否是应用包', required: true }]}
            >
              <Select placeholder={'应用包'} options={memoWhetherOrNot} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={'hot'}
              label={'是否执行"可热更"辅助检查'}
              rules={[{ message: '请选择是否执行"可热更"辅助检查', required: true }]}
            >
              <Select placeholder={'是否执行"可热更"辅助检查'} options={memoWhetherOrNot} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={6}>
          <Col span={12}>
            <Form.Item
              name={'unit_check'}
              label={'是否需要检查单元测试'}
              rules={[{ message: '请选择是否需要检查单元测试', required: true }]}
            >
              <Select placeholder={'检查单元测试'} options={memoWhetherOrNot} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={'env_check'}
              label={'是否需要执行环境一致性检查'}
              rules={[{ message: '请选择是否需要执行环境一致性检查', required: true }]}
            >
              <Select placeholder={'是否需要执行环境一致性检查'} options={memoWhetherOrNot} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={6}>
          <Col span={12}>
            <Form.Item
              name={'upgrade'}
              label={'是否涉及数据修复/升级'}
              rules={[{ message: '请选择是否涉及数据修复/升级', required: true }]}
            >
              <Select
                placeholder={'是否涉及数据修复/升级(backend/apps/build)'}
                options={memoWhetherOrNot}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={'gitlab'}
              label={'对应gitlab工程地址'}
              rules={[{ message: '请填写对应gitlab工程地址', required: true }]}
            >
              <Input placeholder={'对应gitlab工程地址'} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name={'mark'} label={'备注'}>
              <Input.TextArea placeholder={'备注'} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
