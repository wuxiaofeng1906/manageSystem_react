import React, { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Form, Select, DatePicker, Input, Row, Col, Button, Space } from 'antd';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { PageContainer } from '@ant-design/pro-layout';
import { FolderAddTwoTone } from '@ant-design/icons';
import { announcementListColumn } from './column';
import styles from './index.less';

const announcementList = () => {
  const [list, setList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const gridRef = useRef<GridApi>();

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  useEffect(() => {
    setList([
      {
        num: '1',
        name: '202210100009',
        beforeTime: '2022-01-10 19:20:22',
        beforeContent: '测试测试',
        afterTime: '2022-01-10 19:20:29',
        afterContent: '测试测试',
        creater: '测试测试',
        editer: '测试测试',
        editeTime: '2022-01-10 19:20:29',
        createTime: '2022-10-10 12:12:12',
      },
      {
        num: '2',
        name: '202210100009',
        beforeTime: '2022-01-10 19:20:22',
        beforeContent: '测试测试',
        afterTime: '2022-01-10 19:20:29',
        afterContent: '测试测试',
        creater: '测试测试',
        editer: '测试测试',
        editeTime: '2022-01-10 19:20:29',
        createTime: '2022-10-10 12:12:12',
      },
    ]);
  }, []);

  return (
    <PageContainer>
      <div className={styles.announcementList}>
        <Form form={form} className={styles.resetForm}>
          <Row justify={'space-around'} style={{ marginBottom: 5 }}>
            <Col span={3}>
              <Button type={'text'} icon={<FolderAddTwoTone />}>
                新增
              </Button>
            </Col>
            <Col span={5}>
              <Form.Item label={'创建人'} name={'creater'}>
                <Select options={[]} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={'创建日期'} name={'createTime'}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label={'公告内容'} name={'content'}>
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div style={{ height: 500 }}>
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
                      onClick={(e) => {
                        // jump
                      }}
                    />
                    <img
                      width={16}
                      height={17}
                      style={{ cursor: 'pointer' }}
                      src={require('../../../../public/delete_red.png')}
                      onClick={(e) => {
                        // delete
                      }}
                    />
                  </Space>
                );
              },
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
};
export default announcementList;
