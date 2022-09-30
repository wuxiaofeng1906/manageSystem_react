import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Form, Select } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import DragIcon from '@/components/DragIcon';
import { releaseListColumn } from '@/pages/onDutyAndRelease/releaseProcess/column';
import { getHeight } from '@/publicMethods/pageSet';
import styles from './index.less';
import PreReleaseServices from '@/services/preRelease';
import DutyListServices from '@/services/dutyList';
import { isEmpty } from 'lodash';
import { history, useLocation } from 'umi';

const PreReleaseList = () => {
  const gridRef = useRef<GridApi>();
  const query = useLocation()?.query;
  const [rowData, setRowData] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [gridHeight, setGridHeight] = useState(getHeight() - 80);

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  window.onresize = function () {
    setGridHeight(Number(getHeight()) - 80);
  };

  const onDrag = () => {
    const sortArr: any = [];
    gridRef.current?.forEachNode(function (node, index) {
      sortArr.push({ sort: index, id: node.data.id });
    });
    console.log(sortArr);
  };

  const onFinish = async (v: any) => {
    if (v) {
      const res = await DutyListServices.getDutyNum();
      if (!isEmpty(res)) {
        let href = `/onDutyAndRelease/preRelease?releasedNum=${res.ready_release_num}`;
        if (v == '2') {
          href = `/onDutyAndRelease/releaseOrder/${res.ready_release_num}`;
        }
        history.push(href);
      }
    }
    setVisible(false);
  };
  const getTableList = async () => {
    const res = await PreReleaseServices.releaseList();
    setRowData(res);
  };

  useEffect(() => {
    if (query.key == 'pre') getTableList();
  }, [query.key]);

  return (
    <div className={styles.preReleaseList}>
      <Button type={'primary'} size={'small'} onClick={() => setVisible(true)} className={'btn'}>
        新增发布
      </Button>
      <div className="ag-theme-alpine" style={{ height: gridHeight, width: '100%' }}>
        <AgGridReact
          columnDefs={releaseListColumn('pre')}
          rowData={rowData}
          defaultColDef={{
            resizable: true,
            filter: true,
            flex: 1,
            suppressMenu: true,
            cellStyle: { 'line-height': '28px' },
          }}
          rowHeight={28}
          headerHeight={30}
          rowDragManaged={true}
          animateRows={true}
          frameworkComponents={{ drag: DragIcon }}
          onRowDragEnd={onDrag}
          onGridReady={onGridReady}
        />
      </div>
      <AddModal visible={visible} onConfirm={onFinish} />
    </div>
  );
};
export default PreReleaseList;

const AddModal = ({
  visible,
  onConfirm,
}: {
  visible: boolean;
  onConfirm: (v?: string) => void;
}) => {
  const [form] = Form.useForm();

  const onOk = async () => {
    const value = await form.validateFields();
    onConfirm(value.type);
  };
  useEffect(() => {
    !visible && form.resetFields();
  }, [visible]);

  return (
    <Modal
      title={'新增发布'}
      visible={visible}
      maskClosable={false}
      centered={true}
      okText={'确定'}
      onOk={onOk}
      onCancel={() => onConfirm()}
    >
      <Form form={form}>
        <Form.Item
          label={'类型选择'}
          name={'type'}
          rules={[{ required: true, message: '请选择发布类型！' }]}
        >
          <Select
            options={[
              { label: '非积压发布', value: '1' },
              { label: '灰度推线上', value: '2' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
