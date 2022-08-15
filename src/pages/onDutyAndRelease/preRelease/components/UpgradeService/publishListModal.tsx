import { Modal, Form, Select, ModalProps } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { useEffect, useRef, useState } from 'react';
import { publishListColumn } from './grid/columns';

const PublishListModal = (props: ModalProps) => {
  const gridRef = useRef<GridApi>();
  const [form] = Form.useForm();
  const [rowData, setRowData] = useState<any[]>([]);

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const onConfirm = () => {
    const selected = gridRef.current?.getSelectedRows();
    console.log(selected);
  };

  const getList = async () => {
    // const res = await
    const mock = [
      {
        id: 1,
        ztNo: 1234,
        content: 'ceshi',
        env: '12',
        level: 1,
        module: '对对对',
        hot_update: '是',
        point: 'sss',
        create: 'aaa',
        checked: false,
      },
      {
        id: 2,
        ztNo: 1234,
        content: 'ceshi',
        env: '12',
        level: 1,
        module: '对对asda对',
        hot_update: '是',
        point: 'sdddss',
        create: 'bb',
        checked: true,
      },
    ];
    setRowData(mock);
  };
  const onUpdate = () => {
    gridRef.current?.forEachNode((node) => {
      node.setSelected(node.data.checked ?? false);
    });
  };
  useEffect(() => {
    if (!props.visible) return;
    getList();
  }, [props.visible]);

  return (
    <Modal
      title={'待发布需求列表'}
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={onConfirm}
      width={1200}
      destroyOnClose
    >
      <Form form={form} size={'small'} layout={'inline'}>
        <Form.Item name={''} label={'所属执行'}>
          <Select style={{ width: 500 }} />
        </Form.Item>
        <Form.Item name={''} label={'需求编号'}>
          <Select style={{ width: 400 }} />
        </Form.Item>
      </Form>
      <div style={{ height: 500, width: '100%', margin: '4px 0' }}>
        <AgGridReact
          className="ag-theme-alpine"
          columnDefs={publishListColumn}
          rowData={rowData}
          defaultColDef={{
            resizable: true,
            sortable: true,
            suppressMenu: true,
            minWidth: 90,
            cellStyle: { 'line-height': '25px' },
          }}
          rowHeight={25}
          headerHeight={25}
          onGridReady={onGridReady}
          onRowDataChanged={onUpdate}
        />
      </div>
      <div>提示：如本次发布不涉及的需求，请将对应需求前勾选的复选框去掉</div>
    </Modal>
  );
};
export default PublishListModal;
