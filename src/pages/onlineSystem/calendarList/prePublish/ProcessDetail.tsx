import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Form, Select, Checkbox, Table, Row, Col, Input, DatePicker, Button, Modal } from 'antd';
import {
  preServerColumn,
  repaireColumn,
  serverConfirmColumn,
  upgradeServicesColumn,
} from '@/pages/onlineSystem/common/column';
import { groupBy, isEmpty, uniq } from 'lodash';
import { mergeCellsTable } from '@/utils/utils';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import DemandListModal from '@/pages/onlineSystem/components/DemandListModal';
import styles from '@/pages/onlineSystem/common/common.less';
import { infoMessage } from '@/publicMethods/showMessages';
import { InfoCircleOutlined } from '@ant-design/icons';
import { history, useModel } from 'umi';
import IPagination from '@/components/IPagination';

const ProcessDetail = (props: any, ref: any) => {
  const [serverData, setServerData] = useState<any[]>([]);
  const [interfaceData, setInterfaceData] = useState<any[]>([]);
  const [repaireData, setRepaireData] = useState<any[]>([]);
  const [confirmData, setConfirmData] = useState<any[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [checked, setChecked] = useState(false);
  const [checkBoxOpt, setCheckBoxOpt] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const confirmRef = useRef<GridApi>();
  const interfaceRef = useRef<GridApi>();
  const repaireRef = useRef<GridApi>();
  const [pages, setPages] = useState({
    page_size: 20,
    total: 0,
    page: 1,
  });

  useImperativeHandle(
    ref,
    () => ({
      onShow: () => setShow(true),
      onCancelPublish: () => {
        Modal.confirm({
          okText: '确认',
          cancelText: '取消',
          centered: true,
          title: '取消发布提示',
          content: '请确认是否取消发布？',
          closable: false,
          onOk: async () => {
            console.log('取消');
            history.replace('/onlineSystem/calendarList');
          },
        });
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

  const onGridReady = (
    params: GridReadyEvent,
    ref: React.MutableRefObject<GridApi | undefined>,
  ) => {
    ref.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const onSeal = async () => {
    if (isEmpty(selectedRowKeys)) return infoMessage('请先选择需封板项目');
    const selected = serverData.flatMap((it) => (selectedRowKeys.includes(it.id) ? [it] : []));
    if (selected?.some((it) => it.flag)) return infoMessage('请选择未封板项目进行封板');
    Modal.confirm({
      title: '封板提示',
      content: '请确认是否封板该项目?',
      onOk: async () => {
        // 1.校验用例是否通过
        console.log();
      },
    });
  };

  const onUnseal = async () => {
    if (isEmpty(selectedRowKeys)) return infoMessage('请先选择需解除封板项目');
    const selected = serverData.flatMap((it) => (selectedRowKeys.includes(it.id) ? [it] : []));
    if (selected?.some((it) => !it.flag)) return infoMessage('请选择封板项目进行解除封板');
    Modal.confirm({
      title: '解除封板提示',
      content: '请确认是否解除封板该项目?',
      onOk: async () => {
        console.log();
      },
    });
  };

  const onDelete = async (type: 'server' | 'interface' | 'repaire') => {
    const gridSelected =
      type == 'interface'
        ? interfaceRef?.current?.getSelectedRows()
        : type == 'repaire'
        ? repaireRef?.current?.getSelectedRows()
        : serverData.flatMap((it) => (selectedRowKeys.includes(it.id) ? [it] : []));
    if (isEmpty(gridSelected)) return infoMessage('请先选择需移除的项目！');
    if (type == 'server' && gridSelected?.some((it) => it.flag))
      return infoMessage('已封板项目不能移除！');
    Modal.confirm({
      title: '移除提示',
      icon: <InfoCircleOutlined style={{ color: 'red' }} />,
      content: `请确认是否要移除该项目?`,
      onOk: async () => {
        console.log(gridSelected);
      },
    });
  };

  const getTableList = async (page = 1, page_size = 20) => {};
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
      <Form size={'small'} className={styles.resetForm}>
        <Row justify={'space-between'} gutter={8}>
          <Col span={10}>
            <Form.Item label={'批次名称'} name={'name'} required>
              <Input placeholder={'批次名称'} />
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item label={'发布项目'} name={'project'}>
              <Select disabled placeholder={'发布项目'} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={'space-between'} gutter={8}>
          <Col span={5}>
            <Form.Item label={'上线分支'} name={'branch'}>
              <Select disabled placeholder={'上线分支'} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label={'发布集群类型'} name={'cluster'}>
              <Select disabled placeholder={'发布集群类型'} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={'发布集群'} name={'env'}>
              <Select disabled placeholder={'发布集群'} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label={'镜像环境绑定'} name={'online_env'} required>
              <Select placeholder={'镜像环境绑定'} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label={'发布时间'} name={'time'} required>
              <DatePicker
                style={{ width: '100%' }}
                placeholder={'发布时间'}
                showTime
                format="YYYY-MM-DD HH:mm"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles.tableHeader}>
        <h4>二、应用服务</h4>
        <Button size={'small'} onClick={onSeal}>
          封板
        </Button>
        <Button size={'small'} onClick={onUnseal}>
          解除封板
        </Button>
        <Button size={'small'} className={styles.remove} onClick={() => onDelete('server')}>
          移除
        </Button>
      </div>
      <Checkbox
        checked={checked}
        style={{ marginLeft: 8 }}
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
          scroll={{ y: 400, x: 1200 }}
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
      <div className={styles.tableHeader}>
        <h4>三、升级接口</h4>
        <Button size={'small'} className={styles.remove} onClick={() => onDelete('interface')}>
          移除
        </Button>
      </div>
      <div style={{ height: 300, width: '100%' }}>
        <AgGridReact
          className="ag-theme-alpine"
          columnDefs={upgradeServicesColumn}
          rowData={interfaceData}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            suppressMenu: true,
          }}
          rowHeight={30}
          headerHeight={35}
          onGridReady={(p) => onGridReady(p, interfaceRef)}
        />
      </div>
      <div className={styles.tableHeader}>
        <h4>四、数据修复/升级</h4>
        <Button size={'small'} className={styles.remove} onClick={() => onDelete('repaire')}>
          移除
        </Button>
      </div>
      <div style={{ height: 300, width: '100%' }}>
        <AgGridReact
          className="ag-theme-alpine"
          columnDefs={repaireColumn}
          rowData={repaireData}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            suppressMenu: true,
          }}
          rowHeight={30}
          headerHeight={35}
          onGridReady={(p) => onGridReady(p, repaireRef)}
        />
      </div>
      <IPagination
        page={pages}
        onChange={getTableList}
        showQuickJumper={getTableList}
        onShowSizeChange={(size) => getTableList(1, size)}
      />
      <div>
        <h4>五、服务确认</h4>
      </div>
      <div style={{ height: 300, width: '100%' }}>
        <AgGridReact
          className="ag-theme-alpine"
          columnDefs={serverConfirmColumn}
          rowData={confirmData}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            suppressMenu: true,
          }}
          rowHeight={30}
          headerHeight={35}
          onGridReady={(p) => onGridReady(p, confirmRef)}
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
