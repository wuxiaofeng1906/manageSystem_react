import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { history, useModel } from 'umi';
import { Form, DatePicker, Row, Col, Button, Select, message, Modal, Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import { FolderAddTwoTone, CopyTwoTone } from '@ant-design/icons';
import dutyColumn from '@/pages/onDutyAndRelease/dutyDirectory/column';
import { CellClickedEvent, CellMouseOverEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import styles from './index.less';
import DutyListServices from '@/services/dutyList';
import moment from 'moment';
import { intersection, isEmpty, replace } from 'lodash';
import useLock from '@/hooks/lock';
import { getHeight } from '@/publicMethods/pageSet';

const DutyList = () => {
  const [currentUser] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [list, setList] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const { updateLockStatus, getAllLock, lockList } = useLock();
  const [form] = Form.useForm();
  const [modifyDutyForm] = Form.useForm();
  const gridRef = useRef<GridApi>();
  const [gridHeight, setGridHeight] = useState(getHeight() - 20);

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
  const copyReplaceTitle = (data: any) => {
    const duty_date = moment().format('YYYY-MM-DD');
    const release_time = moment().hour(23).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
    const time = moment().format('YYYYMMDD');
    const date = moment(data.duty_date).format('YYYYMMDD');
    const greyEnv = ['cn-northwest-0', 'cn-northwest-1'];
    const env = data.release_env;
    const greyLength = intersection(env, greyEnv).length;
    let type = ''; // 集群
    let newTitle = ''; // 新生成值班标题
    const specifyFormat = data.duty_name?.indexOf(date) > -1;
    // 标题包含指定格式的日期，直接替换为当前日期，否则重新生成标题
    if (specifyFormat) {
      newTitle = replace(data.duty_name, moment(data.duty_date).format('YYYYMMDD'), time);
    } else {
      if (isEmpty(data.release_env) || data.release_env == 'unknown') type = '';
      else if (env?.split()?.length == 1 && greyLength == 1) {
        type = `${env?.split()?.[0].replace('cn-northwest-', '')}级灰度发布`;
      } else if (env?.split()?.length == 2 && greyLength == 2) type = '灰度发布';
      else type = '线上发布';
      newTitle = `${time}_${type}值班名单`;
    }

    modifyDutyForm.setFieldsValue({ duty_name: newTitle });
    return { release_time, duty_date, newTitle };
  };

  const onCopy = async () => {
    const selected: any = gridRef.current?.getSelectedRows();
    if (isEmpty(selected)) return message.warning('请先选择需复制的行数据！');
    const releaseNum = await getDutyNumber();
    const data = await DutyListServices.getDutyDetail({
      person_duty_num: selected[0].person_duty_num,
    });
    const { duty_date, release_time, newTitle } = copyReplaceTitle(data);

    const update = async (value: string) => {
      await DutyListServices.addDuty({
        ...data,
        is_push_msg: 'no',
        person_duty_num: releaseNum,
        duty_name: value ?? newTitle,
        duty_date,
        release_time,
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
        modifyDutyForm.resetFields();
      },
      content: (
        <Form form={modifyDutyForm}>
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
    if (!hasPermission.part) return;
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
  const onDelete = async () => {
    const selected: any = gridRef.current?.getSelectedRows();
    if (isEmpty(selected)) return message.warning('请先选择需删除的行！');
    const lock = lockList.find(
      (it) => it.param.replace('duty_', '') == selected[0].person_duty_num,
    );
    if (!isEmpty(lock)) return message.warning(`当前【${lock.user_name}】正在编辑，不能删除该行！`);
    if (selected[0].is_push_msg == 'yes') return message.warning('当前数据已发送，不能删除！');
    await DutyListServices.deleteDuty({
      person_duty_num: selected[0].person_duty_num,
      user_id: currentUser?.userid,
    });
    getList();
  };

  // 值班名单权限： 超级管理员、开发经理/总监、前端管理人员、测试部门与业务经理
  const hasPermission = useMemo(
    () => ({
      part: ['superGroup', 'devManageGroup', 'frontManager', 'projectListMG'].includes(
        currentUser?.group || '',
      ),
      super: (currentUser?.group || '') == 'superGroup',
    }),
    [currentUser?.group],
  );

  const getRowStyle = (params: any) => {
    const lockNode = lockList.map((it) => it.param.replace('duty_', ''));
    return lockNode.includes(params.data.person_duty_num) ? { background: '#FFF6F6' } : null;
  };

  const onCellMouseOver = (param: CellMouseOverEvent) => {
    const id = param.data.person_duty_num;
    const lock = lockList.find((it) => it.param.replace('duty_', '') == id);
    if (isEmpty(lock)) return;
    param.colDef.tooltipComponentParams = {
      value: `${lock?.user_name}正在编辑`,
    };
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
    }, 3000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    gridRef?.current?.forEachNode((rowNode, index) => {
      const lock = lockList.find(
        (it) => it.param.replace('duty_', '') == rowNode.data.person_duty_num,
      );
      const row = gridRef.current?.getRowNode(index.toString());
      row?.setData({ ...rowNode.data, bg: !isEmpty(lock) });
    });
  }, [JSON.stringify(lockList)]);

  window.onresize = function () {
    setGridHeight(Number(getHeight()) - 20);
    gridRef.current?.sizeColumnsToFit();
  };

  return (
    <PageContainer>
      <div className={styles.dutyList}>
        <Form className={styles.dutyListForm} form={form}>
          <Row justify={'space-between'} style={{ marginBottom: 5 }} gutter={4}>
            <Col span={6}>
              <Form.Item>
                <Button
                  type={'text'}
                  disabled={!hasPermission.part}
                  icon={
                    <FolderAddTwoTone
                      style={
                        hasPermission.part ? {} : { filter: 'grayscale(1)', cursor: 'not-allowed' }
                      }
                    />
                  }
                  onClick={() => onAdd()}
                >
                  新增
                </Button>
                <Button
                  type={'text'}
                  disabled={!hasPermission.super}
                  icon={
                    <CopyTwoTone
                      style={
                        hasPermission.super ? {} : { filter: 'grayscale(1)', cursor: 'not-allowed' }
                      }
                    />
                  }
                  onClick={onDelete}
                >
                  删除
                </Button>
                <Button
                  type={'text'}
                  disabled={!hasPermission.part}
                  icon={
                    <CopyTwoTone
                      style={
                        hasPermission.part ? {} : { filter: 'grayscale(1)', cursor: 'not-allowed' }
                      }
                    />
                  }
                  onClick={onCopy}
                >
                  复制
                </Button>
              </Form.Item>
            </Col>
            <Col span={9}>
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
        <div style={{ height: gridHeight, width: '100%' }}>
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
            onGridReady={onGridReady}
            onGridSizeChanged={onGridReady}
            onRowDataChanged={onGridReady}
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
            tooltipMouseTrack={true}
            onCellMouseOver={onCellMouseOver}
            onCellMouseOut={(e) => {
              // e.colDef.tooltipField = undefined;
              e.colDef.tooltipComponentParams = '';
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
};
export default DutyList;
