import React, { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button, message, Space } from 'antd';
import { deployColumn } from '@/pages/systemOnline/column';
import type { CellClickedEvent, GridApi } from 'ag-grid-community';
import DeploySetting from '@/pages/systemOnline/prePublish/deploy/DeploySetting';
import OneKeyDeploy from '@/pages/systemOnline/prePublish/deploy/OneKeyDeploy';
import { initGridTable } from '@/pages/systemOnline/constants';
import OnlineServices from '@/services/online';
import { useLocation } from 'umi';
import { useModel } from '@@/plugin-model/useModel';
const Deploy = () => {
  const {
    query: { idx },
  } = useLocation() as any;
  const gridApi = useRef<GridApi>();
  const [deploySetting, setDeploySetting] = useState(false);
  const [oneKeyDeploy, setOneKeyDeploy] = useState(false);
  const [list, setList] = useState([]);
  const [release_project] = useModel('systemOnline', (system) => [system.proInfo?.release_project]);
  const getTableList = async () => {
    const result = await OnlineServices.deployList(idx);
    setList(result);
  };

  useEffect(() => {
    if (!idx) return;
    getTableList();
  }, [idx]);

  return (
    <div>
      <Space size={16}>
        <Button
          type={'primary'}
          onClick={() => {
            if (!release_project?.release_env) return message.info('请先设置部署环境!');
            setDeploySetting(true);
          }}
        >
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
                    if (data.log_url) {
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
      />
      <OneKeyDeploy
        visible={oneKeyDeploy}
        onCancel={() => setOneKeyDeploy(false)}
        onOk={(it) => {
          setOneKeyDeploy(false);
          getTableList();
        }}
      />
    </div>
  );
};
export default Deploy;
