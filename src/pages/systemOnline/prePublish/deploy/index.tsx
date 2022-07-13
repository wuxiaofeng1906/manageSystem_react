import React, { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button, message, Space, Spin } from 'antd';
import dayjs from 'dayjs';
import { deployColumn } from '@/pages/systemOnline/Column';
import type { CellClickedEvent, GridApi } from 'ag-grid-community';
import DeploySetting from '@/pages/systemOnline/prePublish/deploy/DeploySetting';
import OneKeyDeploy from '@/pages/systemOnline/prePublish/deploy/OneKeyDeploy';
import { initGridTable } from '@/pages/systemOnline/constants';
import OnlineServices from '@/services/online';
import { useLocation, useModel } from 'umi';

const Deploy = () => {
  const {
    query: { idx },
  } = useLocation() as any;
  const gridApi = useRef<GridApi>();
  const [release_project, disabled] = useModel('systemOnline', (system) => [
    system.proInfo?.release_project,
    system.disabled,
  ]);

  const [deploySetting, setDeploySetting] = useState(false);
  const [oneKeyDeploy, setOneKeyDeploy] = useState(false);
  const [list, setList] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const getTableList = async () => {
    setSpinning(true);
    const result = await OnlineServices.deployList(idx).finally(() => setSpinning(false));
    setList(result);
  };
  const formatTime = ({ data }: CellClickedEvent) => {
    let str: string = '';
    if (data.start_time && data.end_time) {
      let seconds = dayjs(data.end_time).diff(data.start_time, 'seconds');
      const hours = Math.floor(seconds / 3600);
      seconds = seconds - hours * 3600;
      const minutes = Math.floor(seconds / 60);
      seconds = seconds - minutes * 60;
      if (seconds) str = `${seconds}秒`;
      if (minutes) str = `${minutes}分${seconds}秒`;
      if (hours) str = `${hours}小时${minutes}分${seconds}秒`;
    }
    return str;
  };

  useEffect(() => {
    if (!idx) return;
    getTableList();
  }, [idx]);

  return (
    <Spin spinning={spinning} tip={'数据加载中...'}>
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
        <Button
          type={'primary'}
          loading={spinning}
          disabled={disabled}
          onClick={async () => {
            await OnlineServices.deploymentStatus(idx);
            getTableList();
          }}
        >
          刷新
        </Button>
      </Space>
      <div className={'AgGridReactTable'} style={{ height: 500 }}>
        <AgGridReact
          {...initGridTable(gridApi)}
          columnDefs={deployColumn}
          rowData={list}
          frameworkComponents={{
            deployTime: formatTime,
            operation: ({ data }: CellClickedEvent) => {
              return (
                <img
                  title={'日志'}
                  width={20}
                  src={require('../../../../../public/logs.png')}
                  onClick={() => {
                    if (data.log_url) {
                      window.open(data.log_url);
                    }
                  }}
                />
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
    </Spin>
  );
};
export default Deploy;
