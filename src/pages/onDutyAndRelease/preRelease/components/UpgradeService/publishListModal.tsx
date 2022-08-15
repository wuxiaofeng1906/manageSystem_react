import { Modal, Form, Select, ModalProps } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { useRef } from 'react';
import { publishListColumn } from './grid/columns';

const PublishListModal = (props: ModalProps) => {
  const gridRef = useRef<GridApi>();
  const [form] = Form.useForm();

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const onConfirm = () => {
    const selected = gridRef.current?.getSelectedRows();
    console.log(selected);
  };

  return (
    <Modal
      title={'待发布需求列表'}
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={onConfirm}
      width={1200}
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
          rowData={[]}
          defaultColDef={{
            resizable: true,
            sortable: true,
            suppressMenu: true,
            minWidth: 90,
            cellStyle: { 'line-height': '25px' },
          }}
          headerHeight={25}
          onGridReady={onGridReady}
        />
      </div>
      <div>提示：如本次发布不涉及的需求，请将对应需求前勾选的复选框去掉</div>
    </Modal>
  );
};
export default PublishListModal;
