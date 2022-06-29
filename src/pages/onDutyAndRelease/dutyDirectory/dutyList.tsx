import React, { useState, useEffect, useRef, useMemo } from 'react';
import { history, useModel } from 'umi';
import { Form, DatePicker, Row, Col, Button, Select } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import dayjs from 'dayjs';
import { AgGridReact } from 'ag-grid-react';
import { FolderAddTwoTone } from '@ant-design/icons';
import dutyColumn from '@/pages/onDutyAndRelease/dutyDirectory/column';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import styles from './index.less';
import DutyListServices from '@/services/dutyList';
import moment from 'moment';

const DutyList = () => {
  const [list, setList] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [form] = Form.useForm();
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
      start_time: values.time?.length > 0 ? dayjs(values.time[0]).format('YYYY-MM-DD') : '',
      end_time: values.time?.length > 0 ? dayjs(values.time[1]).format('YYYY-MM-DD') : '',
    });
    setList(res);
  };

  const getProjects = async () => {
    const res = await DutyListServices.getProject();
    setProjects(
      res?.map((it: any) => ({ key: it.project_id, value: it.project_id, label: it.project_name })),
    );
  };
  useEffect(() => {
    form.setFieldsValue({
      time: [moment().startOf('month'), moment().endOf('month')],
    });
    getProjects();
    getList();
  }, []);

  // 值班名单权限： 超级管理员、开发经理/总监、前端管理人员、测试部门与业务经理
  const hasPermission = useMemo(
    () =>
      ['superGroup', 'devManageGroup', 'frontManager', 'projectListMG'].includes(
        currentUser?.group || '',
      ),
    [currentUser?.group],
  );

  return (
    <PageContainer>
      <div className={styles.dutyList}>
        <Form className={styles.dutyListForm} form={form}>
          <Row justify={'space-between'} style={{ marginBottom: 5 }}>
            <Col>
              <Form.Item>
                <Button
                  type={'text'}
                  disabled={!hasPermission}
                  icon={
                    <FolderAddTwoTone
                      style={hasPermission ? {} : { filter: 'grayscale(1)', cursor: 'not-allowed' }}
                    />
                  }
                  onClick={async () => {
                    if (!hasPermission) return;
                    const res = await DutyListServices.getDutyNum();
                    history.push(`/onDutyAndRelease/dutyCatalog/${res.ready_release_num}/no`);
                  }}
                >
                  新增
                </Button>
              </Form.Item>
            </Col>
            <Col span={12}>
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
            <Col span={10}>
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
            rowHeight={30}
            headerHeight={35}
            suppressRowTransform={true}
            onGridReady={onGridReady}
            onGridSizeChanged={onGridReady}
          />
        </div>
      </div>
    </PageContainer>
  );
};
export default DutyList;
