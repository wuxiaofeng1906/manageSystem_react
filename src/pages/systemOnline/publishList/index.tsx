import { AgGridReact } from 'ag-grid-react';
import { PageContainer } from '@ant-design/pro-layout';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Form, Row, Col, Select, DatePicker, Button, Spin } from 'antd';
import { FolderAddTwoTone } from '@ant-design/icons';
import type { CellClickedEvent, CellDoubleClickedEvent, GridApi } from 'ag-grid-community';

import { history, useModel } from 'umi';
import moment from 'moment';
import IPagination from '@/components/IPagination';
import OnlineServices from '@/services/online';
import { omit, valueMap } from '@/utils/utils';
import { publishColumn } from '../column';
import { initGridTable, PUBLISH_RESULT } from '../constants';
import { IRecord, MOMENT_FORMAT } from '@/namespaces';
import './index.less';

const PublishList: React.ReactNode = () => {
  const gridApi = useRef<GridApi>();
  const { typeSelectors, projectSelectors, methodSelectors } = useModel('systemOnline');
  const [form] = Form.useForm();

  const [spinning, setSpinning] = useState(false);
  const [publishSource, setPublishSource] = useState<IRecord[]>([]);
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
      pro_id: values.pro_id?.join(','),
      release_method: values.release_method?.join(','),
      release_result: values.release_result?.join(','),
      release_type: values.release_type?.join(','),
    };
    setSpinning(true);
    if (values.time) {
      data.release_start_time = values.time[0].startOf('years').format(MOMENT_FORMAT.utc);
      data.release_end_time = values.time[1].endOf('day').format(MOMENT_FORMAT.utc);
    }
    const list = await OnlineServices.releaseList(omit(data, ['time'])).finally(() =>
      setSpinning(false),
    );
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
        query: { idx: res?.ready_release_num },
      });
    }
  };

  useEffect(() => {
    form.setFieldsValue({ time: [moment().startOf('years'), moment()], result: ['unknown'] });
    getList();
  }, []);

  const types = useMemo(() => valueMap(typeSelectors || [], ['value', 'label']), [typeSelectors]);
  const methods = useMemo(
    () => valueMap(methodSelectors || [], ['value', 'label']),
    [methodSelectors],
  );

  return (
    <Spin spinning={spinning} tip={'数据加载中...'}>
      <PageContainer>
        <Form form={form} onValuesChange={() => getList()} className={'system-init-form'}>
          <Row justify={'space-between'}>
            <Col span={4} style={{ width: 0 }}>
              <Form.Item label="发布项目:" name="pro_id">
                <Select
                  showSearch
                  showArrow
                  mode="multiple"
                  maxTagCount="responsive"
                  optionFilterProp="label"
                  options={projectSelectors}
                  style={{ width: '100%' }}
                  filterOption={(input, option) =>
                    (option!.label as unknown as string)?.includes(input)
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
                  options={PUBLISH_RESULT}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="发布类型:" name="release_type">
                <Select
                  showArrow
                  mode="multiple"
                  showSearch={false}
                  options={typeSelectors}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="发布方式:" name="release_method">
                <Select
                  showArrow
                  showSearch={false}
                  mode="multiple"
                  options={methodSelectors}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="发布日期:" name="time">
                <DatePicker.RangePicker format={'YYYY-MM-DD'} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div style={{ background: 'rgba(255,255,255,0.53)', borderRadius: '6px 6px 0 0' }}>
          <Button
            icon={<FolderAddTwoTone style={{ fontSize: 18 }} />}
            onClick={onAdd}
            type="text"
            size={'small'}
            style={{ margin: '10px 0', color: '#21aff3' }}
          >
            新增发布
          </Button>
        </div>
        <div style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            {...initGridTable(gridApi)}
            rowData={publishSource}
            columnDefs={publishColumn}
            onCellDoubleClicked={({ data }: CellDoubleClickedEvent) => {
              history.push({
                pathname: '/systemOnline/prePublish/projectServices',
                query: { idx: data.release_num },
              });
            }}
            frameworkComponents={{
              typeFormat: ({ data }: CellClickedEvent) => <span>{types[data.release_type]}</span>,
              methodFormat: ({ data }: CellClickedEvent) => (
                <span>{methods[data.release_method]}</span>
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
    </Spin>
  );
};
export default PublishList;
