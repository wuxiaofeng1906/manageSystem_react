import { useState, useEffect, useRef } from 'react';
import { history } from 'umi';
import { Form, DatePicker, Row, Col, Button, Select } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import dayjs from 'dayjs';
import { AgGridReact } from 'ag-grid-react';
import { FolderAddTwoTone } from '@ant-design/icons';
import dutyColumn from '@/pages/onDutyAndRelease/dutyDirectory/column';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import styles from './index.less';
import DutyListServices from '@/services/dutyList';
const DutyList = () => {
  const [list, setList] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [form] = Form.useForm();
  const gridRef = useRef<GridApi>();
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
    getProjects();
    getList();
  }, []);

  return (
    <PageContainer>
      <div className={styles.dutyList}>
        <Form className={styles.dutyListForm} form={form}>
          <Row justify={'space-between'} style={{ marginBottom: 5 }}>
            <Col>
              <Form.Item>
                <Button
                  type={'text'}
                  icon={<FolderAddTwoTone />}
                  onClick={async () => {
                    const res = await DutyListServices.getDutyNum();
                    history.push(`/onDutyAndRelease/dutyCatalog/${res.ready_release_num}`);
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
