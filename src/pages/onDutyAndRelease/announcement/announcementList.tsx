import React, { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Form, Select, DatePicker, Input, Row, Col, Button, Space } from 'antd';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { PageContainer } from '@ant-design/pro-layout';
import { FolderAddTwoTone } from '@ant-design/icons';
import { announcementListColumn } from './column';
import styles from './index.less';
import DutyListServices from '@/services/dutyList';
import AnnouncementServices from '@/services/announcement';
import { isEmpty } from 'lodash';
import IPagination from '@/components/IPagination';
import { getHeight } from '@/publicMethods/pageSet';

const announcementList = () => {
  const [list, setList] = useState<any[]>([]);
  const [gridHeight, setGridHeight] = useState(getHeight() - 60);

  const [pages, setPages] = useState({
    page_size: 20,
    total: 0,
    page: 0,
  });

  const [form] = Form.useForm();
  const gridRef = useRef<GridApi>();

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const getList = async (page = 0, page_size = 20) => {
    const values = form.getFieldsValue();
    const res = await AnnouncementServices.announcementList({ ...values, page, page_size });
    setList(
      res?.data?.map((it: any, index: number) => ({ ...it, num: page * page_size + index + 1 })),
    );
    setPages({
      page: res?.page,
      page_size: res?.page_size,
      total: res?.total || 0,
    });
  };

  // 新增、修改
  const onAdd = async (params?: CellClickedEvent) => {
    let releaseNum = '';
    let type = 'save';
    if (isEmpty(params)) {
      const res = await DutyListServices.getDutyNum();
      releaseNum = res.ready_release_num;
      type = 'add';
    } else releaseNum = params?.data.announcement_num;
    window.open(
      `${location.origin}/onDutyAndRelease/announcementDetail/${releaseNum}/${type}/false`,
    );
  };

  const onDelete = async (params: CellClickedEvent) => {
    await AnnouncementServices.deleteAnnouncement(params.data.announcement_num);
    getList();
  };

  useEffect(() => {
    getList();
  }, []);

  window.onresize = function () {
    setGridHeight(Number(getHeight()) - 60);
    gridRef.current?.sizeColumnsToFit();
  };

  return (
    <PageContainer>
      <div className={styles.announcementList}>
        <Form form={form} className={styles.resetForm}>
          <Row justify={'space-between'} gutter={3} style={{ marginBottom: 5 }}>
            <Col span={3}>
              <Button type={'text'} icon={<FolderAddTwoTone />} onClick={() => onAdd()}>
                新增
              </Button>
            </Col>
            <Col span={5}>
              <Form.Item label={'创建人'} name={'create_user'}>
                <Select options={[]} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={'创建日期'} name={'create_time'}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item label={'公告内容'} name={'content'}>
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
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
            columnDefs={announcementListColumn}
            rowData={list}
            frameworkComponents={{
              operation: (params: CellClickedEvent) => {
                return (
                  <Space size={8}>
                    <img
                      width={16}
                      style={{ cursor: 'pointer' }}
                      src={require('../../../../public/params.png')}
                      onClick={() => onAdd(params)}
                    />
                    <img
                      width={16}
                      height={17}
                      style={{ cursor: 'pointer' }}
                      src={require('../../../../public/delete_red.png')}
                      onClick={() => onDelete(params)}
                    />
                  </Space>
                );
              },
            }}
          />
        </div>
        <IPagination
          page={pages}
          onChange={(page) => getList(page - 1)}
          showQuickJumper={(page) => getList(page - 1)}
          onShowSizeChange={(size) => getList(0, size)}
        />
      </div>
    </PageContainer>
  );
};
export default announcementList;
