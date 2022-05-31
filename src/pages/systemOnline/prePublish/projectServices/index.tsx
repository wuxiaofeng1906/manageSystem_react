import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Form, Row, Col, Select, Space, Modal, Table } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import {
  projectUpgradeColumn,
  serviceColumn,
  upgradeSQLColumn,
  dataReviewColumn,
} from '@/pages/systemOnline/column';
import type { CellClickedEvent, GridApi } from 'ag-grid-community';
import { initGridTable } from '@/pages/systemOnline/constants';
import { useModel, useLocation } from 'umi';
import EditUpgrade from './EditUpgrade';
import EditServices from './EditServices';
import EditSql from './EditSql';
import OnlineServices from '@/services/online';
import type { PreServices, PreSql, PreUpgradeItem } from '@/namespaces/interface';

type enumType = 'upgrade' | 'services' | 'sql';
interface Istate<T> {
  visible: boolean;
  data?: T;
}
const ProjectServices = () => {
  const {
    query: { idx, disable },
  } = useLocation() as any;
  const { projectSelectors, branchSelectors, getProInfo, updateColumn, proInfo } = useModel(
    'systemOnline',
  );
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [form] = Form.useForm();

  const gridUpgradeRef = useRef<GridApi>();
  const gridSQLRef = useRef<GridApi>();
  const gridReviewRef = useRef<GridApi>();

  const [editUpgrade, setEditUpgrade] = useState<Istate<PreUpgradeItem> | null>();
  const [editServices, setEditServices] = useState<Istate<PreServices> | null>();
  const [editSql, setEditSql] = useState<Istate<PreSql> | null>();

  const updatePreData = async (value: any) => {
    if (value.release_branch) {
      console.log(value.release_branch);

      // refresh env
    }
    if (value.release_project) {
      await updateColumn({
        ...proInfo?.release_project,
        release_project: value.release_project.join(','),
      });
      getProInfo(idx);
    }
  };

  useEffect(() => {
    if (proInfo?.release_project?.release_project) {
      form.setFieldsValue({
        release_project: proInfo.release_project.release_project.split(',') || [],
      });
    }
  }, [JSON.stringify(proInfo)]);

  // drag
  const onRowDragMove = useCallback(async () => {
    const data: { api_id: string; sort_num: number; user_id: string }[] = [];
    gridSQLRef.current?.forEachNode((node, index) => {
      data.push({ api_id: node.data.id, sort_num: index + 1, user_id: user?.userid || '' });
    });
    await OnlineServices.preInterfaceSort(data);
    // refresh
  }, []);

  // operation
  const OperationDom = (data: any, type: enumType, showLog = true) => {
    return (
      <div className={'operation'}>
        <img
          src={require('../../../../../public/edit.png')}
          onClick={() => {
            if (disable == 'success') return;
            const params = { visible: true, data };
            if (type == 'upgrade') setEditUpgrade(params);
            else if (type == 'services') setEditServices(params);
            else setEditSql(params);
          }}
        />
        {showLog && (
          <img
            src={require('../../../../../public/logs.png')}
            onClick={() => {
              if (data.logUrl) {
                window.open(data.log_url);
              }
            }}
          />
        )}
      </div>
    );
  };

  // sql detail
  const showDetail = ({ colDef, value }: CellClickedEvent) => {
    if (colDef.field == 'sql' && value) {
      Modal.info({
        width: 600,
        title: '详情',
        okText: '好的',
        content: (
          <div
            style={{
              maxHeight: 400,
              overflow: 'auto',
              margin: '10px 0',
              whiteSpace: 'pre-line',
            }}
          >
            {value}
          </div>
        ),
      });
    }
  };

  const formatTable = (arr: any[]) => {
    const obj = {};
    arr.forEach((it) => {
      if (obj[it.cluster_id]) {
        obj[it.cluster_id]++;
      } else {
        obj[it.cluster_id] = 1;
      }
    });
    Object.entries(obj).map(([k, v]) => {
      const index = arr.findIndex((it) => it.cluster_id == k);
      arr[index].rowSpan = v;
    });
    return arr;
  };

  return (
    <div>
      <h4>
        一、预发布项目&环境填写 <span className="color-tips">【由测试人员依次填写】</span>
      </h4>
      <Form form={form} onValuesChange={updatePreData}>
        <Row justify={'space-between'}>
          <Col span={8}>
            <Form.Item label={'预发布项目'} name={'release_project'}>
              <Select
                options={projectSelectors}
                style={{ width: '100%' }}
                mode="multiple"
                maxTagCount="responsive"
                optionFilterProp="label"
                disabled={disable == 'success'}
                filterOption={(input, option) =>
                  ((option!.label as unknown) as string)?.includes(input)
                }
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={'预发布分支'} name={'release_branch'}>
              <Select
                options={branchSelectors}
                style={{ width: '100%' }}
                disabled={disable == 'success'}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={'测试环境绑定'} name={'release_env'}>
              <Select disabled options={[]} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Space className={'flex-row'} size={40} style={{ marginBottom: 40 }}>
        <div>
          填写人： <span>{proInfo?.release_project?.edit_user || '-'}</span>
        </div>
        <div>
          填写时间： <span>{proInfo?.release_project?.edit_time || '-'}</span>
        </div>
      </Space>
      <h4>
        二、项目升级信息填写 <span className="color-tips">【由后端值班/流程值班人员填写】</span>
      </h4>
      <div className={'AgGridReactTable'}>
        <AgGridReact
          {...initGridTable(gridUpgradeRef)}
          columnDefs={projectUpgradeColumn}
          rowData={proInfo?.upgrade_project || []}
          frameworkComponents={{
            operation: ({ data }: CellClickedEvent) => OperationDom(data, 'upgrade'),
          }}
        />
      </div>
      <h4>
        三、发布服务填写
        <span className="color-tips">【由后端负责人/前端值班/后端值班/流程值班人员填写】</span>
      </h4>
      <Table
        rowKey="id"
        bordered
        size="small"
        dataSource={formatTable(proInfo?.upgrade_app || [])}
        pagination={false}
        columns={[
          ...serviceColumn,
          {
            title: '操作',
            align: 'center',
            dataIndex: 'operation',
            width: 120,
            render: (_, record) => OperationDom(record, 'services'),
          },
        ]}
      />
      <h4>
        四、升级接口&升级SQL填写 <span className="color-tips">【前后端值班核对确认】</span>
      </h4>
      <div className={'AgGridReactTable'}>
        <AgGridReact
          animateRows
          rowDragManaged
          suppressAutoSize
          suppressRowTransform
          {...initGridTable(gridSQLRef)}
          columnDefs={upgradeSQLColumn}
          rowData={proInfo?.upgrade_api || []}
          onRowDragEnd={onRowDragMove}
          frameworkComponents={{
            operation: ({ data }: CellClickedEvent) => OperationDom(data, 'sql', false),
          }}
          onCellDoubleClicked={showDetail}
        />
      </div>
      <h4>
        五、数据修复Review <span className="color-tips">【由后端值班人员核对确认】</span>
      </h4>
      <div className={'AgGridReactTable'}>
        <AgGridReact
          {...initGridTable(gridReviewRef)}
          columnDefs={dataReviewColumn}
          rowData={proInfo?.upgrade_review || []}
        />
      </div>
      <EditUpgrade
        {...editUpgrade}
        onCancel={(status) => {
          if (status == true) getProInfo(idx);
          setEditUpgrade(null);
        }}
      />
      <EditServices
        {...editServices}
        onCancel={(status) => {
          if (status == true) getProInfo(idx);
          setEditServices(null);
        }}
      />
      <EditSql
        {...editSql}
        onCancel={(status) => {
          if (status == true) getProInfo(idx);
          setEditSql(null);
        }}
      />
    </div>
  );
};
export default ProjectServices;
