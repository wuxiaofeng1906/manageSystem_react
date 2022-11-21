import React, { useRef, useState } from 'react';
import { Button } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { preProcessColumn } from '@/pages/onlineSystem/config/column';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { history, useLocation, useParams } from 'umi';
import DemandListModal from '@/pages/onlineSystem/components/DemandListModal';
import { initGridTable } from '@/utils/utils';

const ProcessList = () => {
  const query = useParams() as { branch: string };
  const gridRef = useRef<GridApi>();
  const [showModal, setShowModal] = useState(false);
  const [tableHeight, setTableHeight] = useState(window.innerHeight - 300);

  const onConfirm = (v: any) => {
    console.log(v);
    setShowModal(false);
  };
  window.onresize = function () {
    setTableHeight(window.innerHeight - 300);
  };

  return (
    <div>
      <Button size={'small'} onClick={(e) => setShowModal(true)}>
        新增发布过程
      </Button>
      <div style={{ height: tableHeight, width: '100%', marginTop: 8 }}>
        <AgGridReact
          columnDefs={preProcessColumn}
          {...initGridTable({ ref: gridRef, height: 30 })}
          rowData={[{ name: '202209190001灰度发布', release_num: '202209190001' }]}
          frameworkComponents={{
            link: (p: CellClickedEvent) => {
              return (
                <div
                  style={{
                    color: '#1890ff',
                    cursor: 'pointer',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  onClick={() => {
                    history.push(`/onlineSystem/prePublish/${query.branch}/${p.data.release_num}`);
                  }}
                >
                  {p.value}
                </div>
              );
            },
          }}
        />
      </div>
      <DemandListModal visible={showModal} onOk={onConfirm} />
    </div>
  );
};
export default ProcessList;
