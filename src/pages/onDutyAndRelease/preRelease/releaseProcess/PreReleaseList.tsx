import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Form, Select } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import DragIcon from '@/components/DragIcon';
import { releaseListColumn } from '@/pages/onDutyAndRelease/preRelease/releaseProcess/column';
import { getHeight } from '@/publicMethods/pageSet';
import styles from './index.less';
const PreReleaseList = () => {
  const gridRef = useRef<GridApi>();
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
  const onFinish = (v: any) => {
    if (v) console.log(v);
    setVisible(false);
  };

  useEffect(() => {
    setRowData([
      {
        id: '202209190031',
        name: '2022091898发布',
        project: 'sprint效果文化',
        number: '2344',
        services: 'apps,h5',
        pm: '张三，李四',
        branch: 'release20220822',
        type: '灰度推线上',
        method: '停服',
        env: '集群1',
      },
      {
        id: '202209190031',
        name: '2022091-global发布',
        project: '效果文化',
        number: '2342',
        services: 'apps',
        pm: '李四',
        branch: 'release20220822',
        type: '灰度推线上',
        method: '停服',
        env: '集群2345',
      },
    ]);
  }, []);

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
