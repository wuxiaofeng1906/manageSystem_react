import React, { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button, Space } from 'antd';
import { deployColumn } from '@/pages/systemOnline/column';
import type { CellClickedEvent, GridApi } from 'ag-grid-community';
import DeploySetting from '@/pages/systemOnline/prePublish/deploy/DeploySetting';
import OneKeyDeploy from '@/pages/systemOnline/prePublish/deploy/OneKeyDeploy';
import { initGridTable } from '@/pages/systemOnline/constants';
import OnlineServices from '@/services/online';
import { useLocation } from 'umi';
const Deploy = () => {
  const {
    query: { idx },
  } = useLocation() as any;
  const gridApi = useRef<GridApi>();
  const [deploySetting, setDeploySetting] = useState(false);
  const [oneKeyDeploy, setOneKeyDeploy] = useState(false);
  const [list, setList] = useState([]);

  const getTableList = async () => {
    if (idx) return;
    const result = await OnlineServices.deployList(idx);
    setList(result);
  };

  useEffect(() => {
    getTableList();
  }, []);

  return (
    <div>
      <Space size={16}>
        <Button type={'primary'} onClick={() => setDeploySetting(true)}>
          部署参数设置
        </Button>
        <Button type={'primary'} onClick={() => setOneKeyDeploy(true)}>
          一键部署
        </Button>
      </Space>
      <div className={'AgGridReactTable'}>
        <AgGridReact
          {...initGridTable(gridApi)}
          columnDefs={deployColumn}
          rowData={list}
          frameworkComponents={{
            operation: ({ data }: CellClickedEvent) => {
              return (
                <div
                  className="color-prefix"
                  onClick={() => {
                    if (data.logUrl) {
                      window.open(data.log_url);
                    }
                  }}
                >
                  日志
                </div>
              );
            },
          }}
        />
      </div>
      <DeploySetting
        visible={deploySetting}
        title={'部署参数设置'}
        onCancel={() => setDeploySetting(false)}
        onOk={(v) => {
          console.log(v);
        }}
      />
      <OneKeyDeploy
        visible={oneKeyDeploy}
        onCancel={() => setOneKeyDeploy(false)}
        onOk={(it) => {
          setOneKeyDeploy(false);
          console.log(it);
        }}
      />
    </div>
  );
};
export default Deploy;
