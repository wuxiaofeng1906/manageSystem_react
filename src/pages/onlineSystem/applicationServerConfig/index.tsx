import React, { useEffect, useRef, useState, useMemo } from 'react';
import styles from './index.less';
import { Button, Spin, Modal, Form, Col, Row, Select, Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import { isEmpty } from 'lodash';
import type { ModalFuncProps } from 'antd/lib/modal/Modal';
import { GridApi } from 'ag-grid-community';
import { getHeight } from '@/publicMethods/pageSet';
import { applicationConfigColumn } from './column';
import {
  appServerSide,
  ClusterType,
  TechnicalSide,
  WhetherOrNot,
} from '@/pages/onlineSystem/config/constant';
import { infoMessage } from '@/publicMethods/showMessages';
import { OnlineSystemServices } from '@/services/onlineSystem';
import { useModel } from 'umi';
import { initGridTable } from '@/utils/utils';
import { InfoCircleOutlined } from '@ant-design/icons';

const ApplicationServerConfig = () => {
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [gridHeight, setGridHeight] = useState((getHeight() ?? 0) - 60);
  const [list, setList] = useState<any[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [activeItem, setActiveItem] = useState<any>();
  const gridRef = useRef<GridApi>();

  const onRemove = async () => {
    const selected = gridRef.current?.getSelectedRows();
    if (isEmpty(selected)) return infoMessage('请先选择删除项！');
    Modal.confirm({
      centered: true,
      icon: <InfoCircleOutlined style={{ color: 'red' }} />,
      title: '应用服务配置删除提示',
      content: '请确认是否删除该服务?',
      onOk: async () => {
        await OnlineSystemServices.removeAppConfig({
          app_id: selected?.map((it) => it.app_id)?.join(','),
        });
        await getConfigList();
      },
    });
  };
  window.onresize = function () {
    setGridHeight(Number(getHeight()) - 60);
    gridRef.current?.sizeColumnsToFit();
  };
  const getConfigList = async () => {
    setSpinning(true);
    try {
      const res = await OnlineSystemServices.appConfig();
      setList(res);
      setSpinning(false);
    } catch (e) {
      setSpinning(false);
    }
  };

  useEffect(() => {
    getConfigList();
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
              rowSelection={'multiple'}
              {...initGridTable({ ref: gridRef, height: 30 })}
              columnDefs={applicationConfigColumn}
              rowData={list}
              onRowDoubleClicked={(p) => {
                setActiveItem(p.data);
                setEditModal(true);
              }}
            />
          </div>
          <EditModal
            onCancel={async (v) => {
              if (!isEmpty(v)) {
                await OnlineSystemServices.updateAppConfig({
                  ...v,
                  app_id: activeItem?.app_id,
                  remark: v.remark || '',
                  side: v?.side?.length == 2 ? 'backendFront' : v?.side?.join(','),
                  release_env: v?.release_env?.join(','),
                  user_id: user?.userid ?? '',
                });
                getConfigList();
              }
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
  const [touched, setTouched] = useState(false);
  const [form] = Form.useForm();
  const memoWhetherOrNot = useMemo(
    () => Object.entries(WhetherOrNot).map(([k, v]) => ({ label: v, value: k })),
    [],
  );
  const onConfirm = async () => {
    const values = await form.validateFields();
    try {
      setTouched(true);
      await props.onCancel?.(values);
      setTouched(false);
    } catch (e) {
      setTouched(false);
    }
  };
  useEffect(() => {
    if (!props?.visible) {
      form.resetFields();
      return;
    }
    setLoading(true);
    if (props.data) {
      form.setFieldsValue({
        ...props.data,
        side:
          props.data?.side?.split(',')?.length == 2
            ? ['backendFront']
            : props.data?.side?.split(','),
        release_env: props.data?.release_env?.split(','),
      });
    }
    setLoading(false);
  }, [props?.visible]);

  return (
    <Modal
      {...props}
      centered
      maskClosable={false}
      title={`${isEmpty(props.data) ? '新增' : '编辑'}应用服务配置`}
      onCancel={() => props?.onCancel?.()}
      onOk={onConfirm}
      destroyOnClose={true}
      okButtonProps={{ disabled: loading || touched }}
      width={950}
    >
      <Spin spinning={loading || touched} tip={`数据${touched ? '保存' : '加载'}中...`}>
        <Form form={form} autoComplete={'off'}>
          <Row gutter={6}>
            <Col span={12}>
              <Form.Item
                name={'app_name'}
                label={'应用名称'}
                rules={[
                  {
                    required: true,
                    validator: (rule, v, cb) => {
                      if (isEmpty(v?.trim())) return cb('请填写应用名称');
                      else if (!v?.match(/^[A-Za-z0-9_-]+$/g)) {
                        return cb('请输入字母、数字 或特殊符号 _ -');
                      }
                      return cb();
                    },
                  },
                ]}
              >
                <Input placeholder={'应用名称'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item noStyle shouldUpdate={(pre, next) => next.side != pre.side}>
                {({ getFieldValue }) => {
                  const backendFront = 'backendFront';
                  const side = getFieldValue('side');
                  return (
                    <Form.Item
                      name={'side'}
                      label={'技术侧'}
                      rules={[{ required: true, message: '请选择技术侧' }]}
                    >
                      <Select
                        placeholder={'技术侧'}
                        mode={'multiple'}
                        options={Object.entries(TechnicalSide).map(([k, v]) => ({
                          label: v,
                          value: k,
                          disabled: isEmpty(side)
                            ? false
                            : side == backendFront
                            ? k !== backendFront
                            : k == backendFront,
                        }))}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={6}>
            <Col span={12}>
              <Form.Item
                name={'technical_side'}
                label={'所属应用类型'}
                rules={[{ message: '请选择所属应用类型', required: true }]}
              >
                <Select
                  placeholder={'所属应用类型'}
                  options={Object.keys(appServerSide).map((key) => ({
                    label: appServerSide[key],
                    value: key,
                    key,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'release_env'}
                label={'可上线环境'}
                rules={[{ message: '请选择可上线环境', required: true }]}
              >
                <Select
                  mode={'multiple'}
                  placeholder={'可上线环境'}
                  options={Object.keys(ClusterType).map((key) => ({
                    label: ClusterType[key],
                    value: key,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={6}>
            <Col span={12}>
              <Form.Item
                name={'is_package'}
                label={'是否是应用包'}
                rules={[{ message: '请选择是否是应用包', required: true }]}
              >
                <Select placeholder={'应用包'} options={memoWhetherOrNot} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'is_check_hot_update'}
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
                name={'is_need_test_unit'}
                label={'是否需要检查单元测试'}
                rules={[{ message: '请选择是否需要检查单元测试', required: true }]}
              >
                <Select placeholder={'检查单元测试'} options={memoWhetherOrNot} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'is_check_env'}
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
                name={'is_have_data_recovery'}
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
                name={'server_path'}
                label={'对应gitlab工程地址'}
                rules={[
                  {
                    required: true,
                    validator: (r, v, cb) => {
                      if (!v?.trim()) return cb('请填写gitlab工程地址');
                      else if (!v?.match(/^[A-Za-z0-7_/,-]+$/g)) {
                        return cb('请输入字母、数字或特殊符号 _ / - ,');
                      }
                      return cb();
                    },
                  },
                ]}
              >
                <Input placeholder={'对应gitlab工程地址 多个以英文逗号隔开'} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={6}>
            <Col span={12}>
              <Form.Item
                name={'pkg_check'}
                label={'是否做发布包检查'}
                rules={[{ message: '请选择是否做发布包检查', required: true }]}
              >
                <Select placeholder={'是否做发布包检查'} options={memoWhetherOrNot} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={'remark'} label={'备注'}>
                <Input.TextArea placeholder={'备注'} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <span>说明：是否是应用包，对应gitlab上是subgroup还是project</span>
      </Spin>
    </Modal>
  );
};
