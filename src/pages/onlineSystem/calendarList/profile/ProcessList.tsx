import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { preProcessColumn } from '@/pages/onlineSystem/config/column';
import { CellClickedEvent, GridApi } from 'ag-grid-community';
import { history, useParams } from 'umi';
import DemandListModal from '@/pages/onlineSystem/components/DemandListModal';
import { initGridTable } from '@/utils/utils';
import { OnlineSystemServices } from '@/services/onlineSystem';

const ProcessList = () => {
  const query = useParams() as { branch: string };
  const gridRef = useRef<GridApi>();
  const [showModal, setShowModal] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableHeight, setTableHeight] = useState(window.innerHeight - 300);

  const onConfirm = (v: any) => {
    setShowModal(false);
    if (v) {
      getTableList();
    }
  };

  const getTableList = async () => {
    const res = await OnlineSystemServices.getReleaseList({ branch: query.branch });
    setTableData(res);
  };
  useEffect(() => {
    getTableList();
  }, []);

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
          rowData={tableData}
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
                    history.push(`/onlineSystem/prePublish/${p.data.release_num}`);
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
