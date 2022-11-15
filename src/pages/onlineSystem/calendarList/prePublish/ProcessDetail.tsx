import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Form, Select, Checkbox, Table, Row, Col, Input, DatePicker, Button } from 'antd';
import {
  preServerColumn,
  repaireColumn,
  serverConfirmColumn,
  upgradeServicesColumn,
} from '@/pages/onlineSystem/common/column';
import { groupBy, isEmpty, uniq } from 'lodash';
import { mergeCellsTable } from '@/utils/utils';
import { AgGridReact } from 'ag-grid-react';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import DemandListModal from '@/pages/onlineSystem/components/DemandListModal';
import styles from '@/pages/onlineSystem/common/common.less';

const ProcessDetail = (props: any, ref: any) => {
  const [serverData, setServerData] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [checked, setChecked] = useState(false);
  const [checkBoxOpt, setCheckBoxOpt] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const upgradeRef = useRef<GridApi>();
  useImperativeHandle(
    ref,
    () => ({
      onShow: () => setShow(true),
      onCancelPublish: () => {
        console.log('cancel');
      },
      onRefresh: () => {
        console.log('refresh');
      },
    }),
    [],
  );

  useEffect(() => {
    const mock = [
      { project_name: '笑果文化', release_num: '202209190001', applicant: 'h5' },
      { project_name: '薪资提计', release_num: '202209190003', applicant: 'h5' },
      { project_name: '笑果文化', release_num: '202209190004', applicant: 'web' },
      { project_name: 'stage-patch20220919', release_num: '202209190009', applicant: 'app' },
    ];
    setServerData(mock);
  }, []);

  const onGridReady = (params: GridReadyEvent) => {
    upgradeRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const memoGroup = useMemo(() => {
    const table = mergeCellsTable(serverData ?? [], 'applicant');
    return {
      opts: uniq(serverData?.map((it) => it.applicant)),
      table,
    };
  }, [serverData]);
  return (
    <div className={styles.processDetail}>
      <h4>一、基础信息</h4>
      <Form size={'small'}>
        <Row justify={'space-between'} gutter={8}>
          <Col span={12}>
            <Form.Item
              label={'批次名称'}
              name={'name'}
              rules={[{ message: '请填写批次名称', required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={'发布项目'} name={'project'}>
              <Select disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={'space-between'} gutter={8}>
          <Col span={6}>
            <Form.Item label={'上线分支'} name={'branch'}>
              <Select disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={'发布集群类型'} name={'cluster'}>
              <Select disabled />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={'发布集群'} name={'env'}>
              <Select disabled />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label={'镜像环境绑定'}
              name={'online_env'}
              rules={[{ message: '请填写镜像环境', required: true }]}
            >
              <Select />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label={'发布时间'}
              name={'time'}
              rules={[{ message: '请填写发布时间', required: true }]}
            >
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles.step2}>
        <h4>二、应用服务</h4>
        <Button size={'small'}>封板</Button>
        <Button size={'small'}>解除封板</Button>
        <Button size={'small'}>移除</Button>
      </div>

      <Checkbox
        checked={checked}
        onChange={({ target }) => {
          setSelectedRowKeys(target.checked ? serverData : []);
          setChecked(target.checked);
        }}
      >
        全部项目
      </Checkbox>
      <Checkbox.Group
        options={memoGroup.opts}
        value={checked ? memoGroup.opts : uniq(checkBoxOpt)}
        onChange={(v) => {
          setCheckBoxOpt(v as string[]);
          setChecked(v?.length == memoGroup.opts?.length);
          setSelectedRowKeys(serverData?.flatMap((it) => (v.includes(it.applicant) ? [it] : [])));
        }}
      />
      <div className={styles.onlineTable}>
        <Table
          size={'small'}
          rowKey={(record) => String(record.release_num)}
          dataSource={memoGroup.table}
          columns={preServerColumn}
          pagination={false}
          scroll={{ y: 400, x: 300 }}
          style={{ wordBreak: 'keep-all' }}
          rowSelection={{
            selectedRowKeys: selectedRowKeys?.map((it) => it.release_num),
            onChange: (v, arr) => {
              let group: string[] = [];
              let compare = groupBy(arr, 'applicant');
              let compareAll = groupBy(serverData, 'applicant');
              Object.entries(compareAll).forEach(([k, v]) => {
                if (compare[k]?.length == v?.length) group.push(k);
              });
              setCheckBoxOpt(group);
              setChecked(arr.length == serverData?.length);
              setSelectedRowKeys(arr);
            },
          }}
        />
      </div>
      <div>
        <h4>升级接口</h4>
        <Button>移除</Button>
      </div>
      <div style={{ height: 300, width: '100%' }}>
        <AgGridReact
          className="ag-theme-alpine"
          columnDefs={upgradeServicesColumn}
          rowData={[]}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            suppressMenu: true,
          }}
          rowHeight={30}
          headerHeight={35}
          onGridReady={onGridReady}
        />
      </div>
      <div>
        <h4>四、数据修复/升级</h4>
        <Button>移除</Button>
      </div>
      <div style={{ height: 300, width: '100%' }}>
        <AgGridReact
          className="ag-theme-alpine"
          columnDefs={repaireColumn}
          rowData={[]}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            suppressMenu: true,
          }}
          rowHeight={30}
          headerHeight={35}
          onGridReady={onGridReady}
        />
      </div>
      <div>
        <h4>五、服务确认</h4>
      </div>
      <div style={{ height: 300, width: '100%' }}>
        <AgGridReact
          className="ag-theme-alpine"
          columnDefs={serverConfirmColumn}
          rowData={[]}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            suppressMenu: true,
          }}
          rowHeight={30}
          headerHeight={35}
          onGridReady={onGridReady}
        />
      </div>
      <DemandListModal
        visible={show}
        onOk={(v) => {
          setShow(false);
        }}
      />
    </div>
  );
};
export default forwardRef(ProcessDetail);
