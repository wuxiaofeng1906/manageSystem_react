import { AgGridReact } from 'ag-grid-react';
import { PageContainer } from '@ant-design/pro-layout';

import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Select, DatePicker, Button } from 'antd';
import type { CellClickedEvent, CellDoubleClickedEvent, GridApi } from 'ag-grid-community';

import { history, useModel } from 'umi';
import moment from 'moment';
import IPagination from '@/components/IPagination';
import OnlineServices from '@/services/online';
import { omit } from '@/utils/utils';
import { publishColumn } from '../column';
import { initGridTable, PUBLISH_RESULT } from '../constants';
import { IRecord, MOMENT_FORMAT } from '@/namespaces';
import './index.less';

const PublishList: React.ReactNode = () => {
  const gridApi = useRef<GridApi>();

  const { typeSelectors, projectSelectors, methodSelectors } = useModel('systemOnline');

  const [publishSource, setPublishSource] = useState<IRecord[]>([]);
  const [form] = Form.useForm();
  const [pages, setPages] = useState({
    page_size: 20,
    total: 0,
    page: 0,
  });
  const getList = async (page = 0, page_size = 20) => {
    const values = await form.getFieldsValue();
    const data = {
      ...values,
      page,
      page_size,
    };
    if (values.time) {
      data.release_start_time = values.time[0].startOf('years').format(MOMENT_FORMAT.utc);
      data.release_end_time = values.time[1].endOf('day').format(MOMENT_FORMAT.utc);
    }
    const list = await OnlineServices.releaseList(omit(data, ['time']));
    setPublishSource(
      list?.data?.map((it: any, index: number) => ({ ...it, num: page * page_size + index + 1 })) ||
        [],
    );
    setPages({
      page: list?.page || 0,
      total: list?.total || 0,
      page_size: list?.page_size || 20,
    });
  };

  const onAdd = async () => {
    const res = await OnlineServices.getReleaseNum();
    if (res?.ready_release_num) {
      history.push({
        pathname: '/systemOnline/prePublish/projectServices',
        query: { idx: res?.ready_release_num, disable: '' },
      });
    }
  };

  useEffect(() => {
    form.setFieldsValue({ time: [moment().startOf('years'), moment()] });
    getList();
  }, []);

  return (
    <PageContainer>
      <Form form={form} onValuesChange={() => getList()}>
        <Row justify={'space-between'}>
          <Col span={4}>
            <Form.Item label="发布项目:" name="pro_id">
              <Select
                showSearch
                showArrow
                style={{ width: '100%' }}
                mode="multiple"
                maxTagCount="responsive"
                optionFilterProp="label"
                options={projectSelectors}
                filterOption={(input, option) =>
                  ((option!.label as unknown) as string)?.includes(input)
                }
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="发布结果:" name="result">
              <Select
                showArrow
                showSearch={false}
                mode="multiple"
                style={{ width: '100%' }}
                options={PUBLISH_RESULT}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="发布类型:" name="release_type">
              <Select
                showArrow
                mode="multiple"
                showSearch={false}
                style={{ width: '100%' }}
                options={typeSelectors}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="发布方式:" name="release_method">
              <Select
                showArrow
                showSearch={false}
                mode="multiple"
                style={{ width: '100%' }}
                options={methodSelectors}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="发布日期:" name="time">
              <DatePicker.RangePicker format={'YYYY-MM-DD HH:mm'} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Button onClick={onAdd} type="primary" style={{ marginBottom: 10 }}>
        新增发布
      </Button>
      <div style={{ height: '400px', width: '100%' }}>
        <AgGridReact
          {...initGridTable(gridApi)}
          rowData={publishSource}
          columnDefs={publishColumn}
          onCellDoubleClicked={({ data }: CellDoubleClickedEvent) => {
            history.push({
              pathname: '/systemOnline/prePublish/projectServices',
              query: { idx: data.release_num, disable: data.release_result || '' },
            });
          }}
          frameworkComponents={{
            typeFormat: ({ data }: CellClickedEvent) => (
              <Select disabled bordered={false} options={typeSelectors} value={data.release_type} />
            ),
            methodFormat: ({ data }: CellClickedEvent) => (
              <Select
                disabled
                bordered={false}
                options={methodSelectors}
                value={data.release_method}
              />
            ),
          }}
        />
      </div>
      <IPagination
        page={pages}
        onChange={(page) => getList(page - 1)}
        showQuickJumper={(page) => getList(page - 1)}
        onShowSizeChange={(size) => getList(0, size)}
      />
    </PageContainer>
  );
};
export default PublishList;
