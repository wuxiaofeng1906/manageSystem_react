import React, { useState, useEffect, useRef, useMemo } from 'react';
import { history, useModel } from 'umi';
import { Form, DatePicker, Row, Col, Button, Select, message, Modal, Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import { FolderAddTwoTone, CopyTwoTone } from '@ant-design/icons';
import dutyColumn from '@/pages/onDutyAndRelease/dutyDirectory/column';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import styles from './index.less';
import DutyListServices from '@/services/dutyList';
import moment from 'moment';
import { isEmpty } from 'lodash';
import useLock from '@/hooks/lock';

const DutyList = () => {
  const [list, setList] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const { updateLockStatus, getAllLock, lockList } = useLock();
  const [form] = Form.useForm();
  const [modifyDutyForm] = Form.useForm();
  const gridRef = useRef<GridApi>();
  const [currentUser] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const getList = async () => {
    const values = await form.getFieldsValue();
    const res = await DutyListServices.getDutyList({
      pro_id: values.pro_id?.join(),
      start_time: values.time?.length > 0 ? moment(values.time[0]).format('YYYY-MM-DD') : '',
      end_time: values.time?.length > 0 ? moment(values.time[1]).format('YYYY-MM-DD') : '',
    });
    setList(res);
  };

  const getProjects = async () => {
    const res = await DutyListServices.getProject();
    setProjects(
      res?.map((it: any) => ({ key: it.project_id, value: it.project_id, label: it.project_name })),
    );
  };

  const onCopy = async () => {
    const selected: any = gridRef.current?.getSelectedRows();
    if (isEmpty(selected)) return message.warning('请先选择需复制的行数据！');
    const releaseNum = await getDutyNumber();
    const data = await DutyListServices.getDutyDetail({
      person_duty_num: selected[0].person_duty_num,
    });
    const update = async (value: string) => {
      await DutyListServices.addDuty({
        ...data,
        person_duty_num: releaseNum,
        duty_name: value ?? data.duty_name,
        project_pm: data.project_pm?.map((it: any) => it.user_id).join(),
      });
      await getList();
    };
    Modal.confirm({
      title: '复制提示：',
      width: 500,
      okText: '复制',
      cancelText: '取消复制',
      maskClosable: false,
      centered: true,
      onCancel: () => modifyDutyForm.resetFields(),
      onOk: async () => {
        const value = await modifyDutyForm.validateFields();
        update(value.duty_name);
      },
      content: (
        <Form
          form={modifyDutyForm}
          initialValues={{
            duty_name: data.duty_name,
          }}
        >
          <Form.Item
            label={'值班名单标题'}
            name={'duty_name'}
            rules={[{ required: true, message: '请填写值班名称标题！' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      ),
    });
  };

  const getDutyNumber = async () => {
    if (!hasPermission) return;
    const res = await DutyListServices.getDutyNum();
    return res.ready_release_num;
  };

  // 新增 & 编辑
  const onAdd = async (data?: any) => {
    let release_num = '';
    if (!isEmpty(data)) {
      release_num = data.person_duty_num;
    } else release_num = await getDutyNumber();
    // 加锁（当前行未锁定）
    const lockedNode = lockList.find((it) => it.param.replace('duty_', '') == release_num);
    if (isEmpty(lockedNode) && isEmpty(data)) {
      await updateLockStatus(release_num, 'post');
    }
    history.push(`/onDutyAndRelease/dutyCatalog/${release_num}`);
  };

  // 值班名单权限： 超级管理员、开发经理/总监、前端管理人员、测试部门与业务经理
  const hasPermission = useMemo(
    () =>
      ['superGroup', 'devManageGroup', 'frontManager', 'projectListMG'].includes(
        currentUser?.group || '',
      ),
    [currentUser?.group],
  );
  const getRowStyle = (params: any) => {
    const lockNode = lockList.map((it) => it.param.replace('duty_', ''));
    return lockNode.includes(params.data.person_duty_num)
      ? { border: '1px solid red', background: '#FFF6F6' }
      : null;
  };
  useEffect(() => {
    form.setFieldsValue({
      time: [moment().startOf('month'), moment().endOf('month')],
    });
    getAllLock('duty');
    getProjects();
    getList();
  }, []);
  useEffect(() => {
    let timer = setInterval(() => {
      getAllLock('duty');
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <PageContainer>
      <div className={styles.dutyList}>
        <Form className={styles.dutyListForm} form={form}>
          <Row justify={'space-between'} style={{ marginBottom: 5 }} gutter={4}>
            <Col span={5}>
              <Form.Item>
                <Button
                  type={'text'}
                  disabled={!hasPermission}
                  icon={
                    <FolderAddTwoTone
                      style={hasPermission ? {} : { filter: 'grayscale(1)', cursor: 'not-allowed' }}
                    />
                  }
                  onClick={() => onAdd()}
                >
                  新增
                </Button>
                <Button
                  type={'text'}
                  disabled={!hasPermission}
                  icon={
                    <CopyTwoTone
                      style={hasPermission ? {} : { filter: 'grayscale(1)', cursor: 'not-allowed' }}
                    />
                  }
                  onClick={onCopy}
                >
                  复制
                </Button>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name={'pro_id'} label={'项目名称'}>
                <Select
                  showSearch
                  mode={'multiple'}
                  optionFilterProp="label"
                  options={projects}
                  onBlur={getList}
                  onDeselect={getList}
                  allowClear
                  filterOption={(input, option) =>
                    (option!.label as unknown as string)?.includes(input)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item name={'time'} label={'值班周期'}>
                <DatePicker.RangePicker style={{ width: '100%' }} onChange={getList} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div style={{ height: 600, width: '100%' }}>
          <AgGridReact
            className="ag-theme-alpine"
            columnDefs={dutyColumn}
            rowData={list}
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              suppressMenu: true,
              cellStyle: { 'line-height': '30px' },
            }}
            getRowStyle={getRowStyle as any}
            rowHeight={30}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onGridReady}
            onGridSizeChanged={onGridReady}
            frameworkComponents={{
              dutyCatalog: (params: CellClickedEvent) => (
                <div
                  style={{ color: '#1890ff', textDecoration: 'underline' }}
                  onClick={() => onAdd(params.data)}
                >
                  {params.value}
                </div>
              ),
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
};
export default DutyList;
