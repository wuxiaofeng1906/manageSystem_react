import { useState, useEffect, useRef, useMemo } from 'react';
import { history, useModel } from 'umi';
import { Form, DatePicker, Row, Col, Button, Select, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import { FolderAddTwoTone, CopyTwoTone } from '@ant-design/icons';
import dutyColumn from '@/pages/onDutyAndRelease/dutyDirectory/column';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import styles from './index.less';
import DutyListServices from '@/services/dutyList';
import moment from 'moment';
import { isEmpty, debounce } from 'lodash';
import LockServices from '@/services/lock';
import { CustomTooltip } from './customTooltip';

const DutyList = () => {
  const [list, setList] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [editer, setEditer] = useState('');
  const [current, setCurrent] = useState<any>(null);
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

    await DutyListServices.addDuty({
      ...data,
      person_duty_num: releaseNum,
      project_pm: data.project_pm?.map((it: any) => it.user_name).join(),
    });
    await getList();
  };
  const mouse = async () => {
    const num = current?.data.person_duty_num;
    if (!num) return;
    const rowNode = gridRef.current?.getRowNode(current?.rowIndex);
    const editer = await getLockStatus(num);
    if (editer && num) {
      rowNode?.setData({ ...rowNode.data, editer: editer });
    } else {
      rowNode?.setData(rowNode.data);
    }
  };
  useEffect(() => {
    mouse();
  }, [current?.data.person_duty_num]);

  const getDutyNumber = async () => {
    if (!hasPermission) return;
    const res = await DutyListServices.getDutyNum();
    return res.ready_release_num;
  };
  const getLockStatus = async (lockId: string) => {
    const data = await LockServices.lockStatus(
      { user_id: currentUser?.userid, user_name: currentUser?.name, param: lockId },
      'post',
    );
    return data?.user_name;
  };

  useEffect(() => {
    form.setFieldsValue({
      time: [moment().startOf('month'), moment().endOf('month')],
    });
    getProjects();
    getList();
  }, []);

  // 值班名单权限： 超级管理员、开发经理/总监、前端管理人员
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
          <Row justify={'space-between'} style={{ marginBottom: 5 }} gutter={9}>
            <Col span={3}>
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
                    const release_num = await getDutyNumber();
                    history.push(`/onDutyAndRelease/dutyCatalog/${release_num}`);
                  }}
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
            <Col span={11}>
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
            components={{ customTooltip: CustomTooltip }}
            tooltipShowDelay={0}
            tooltipMouseTrack={true}
            onCellMouseOver={debounce((e) => setCurrent(e.node), 500)}
            onCellMouseOut={() => {
              setCurrent(null);
              gridRef.current?.setRowData(list);
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
