import React, { useRef } from 'react';
import { checkDetailColumn } from '../../column';
import { AgGridReact } from 'ag-grid-react';
import type { CellClickedEvent, GridApi } from 'ag-grid-community';
import { initGridTable } from '@/pages/systemOnline/constants';
import OnlineServices from '@/services/online';
import { useLocation, useModel } from 'umi';
import { Modal, Spin } from 'antd';
import { isArray } from 'lodash';
import { useCheckDetail } from '@/hooks/online';
import { omit } from '@/utils/utils';

const Detail = () => {
  const gridApi = useRef<GridApi>();
  const {
    query: { idx },
  } = useLocation() as any;

  const { getList, formatCheckStatus, checkSource, spinning } = useCheckDetail();
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const [disabled] = useModel('systemOnline', (system) => [system.disabled]);

  // 手动触发检查
  const handleCheck = async (data: any) => {
    if (!idx && !user?.userid) return;
    let params = { user_id: user?.userid, release_num: idx, side: data.side };
    let request;
    switch (data.key) {
      case 'test_unit':
        request = OnlineServices.handleCheckTestUnit;
        break;
      case 'icon_check':
        request = OnlineServices.handleCheckIcon;
        break;
      case 'check_env':
        request = OnlineServices.handleCheckEnv;
        break;
      case 'version_check':
        request = OnlineServices.handleCheckOnline;
        break;
      // case 'library_data':
      //   break;
      default:
        request = OnlineServices.handleCheckSealing;
    }

    await request(params.side ? params : omit(params, ['side']));
    await getList();
  };

  const handleLog = ({ data, rowIndex }: CellClickedEvent) => {
    if (!data.check_log) return;
    if (['version_check', 'check_env'].includes(data.key)) {
      window.open(data.check_log);
      return;
    }
    Modal.info({
      width: 600,
      title: '检查日志',
      centered: true,
      closable: true,
      okButtonProps: { style: { display: 'none' } },
      content: (
        <div style={{ maxHeight: 400, overflow: 'auto', margin: '10px 0', whiteSpace: 'pre-line' }}>
          {/*<div>检查状态： {formatCheckStatus({ data: data, rowIndex: rowIndex || 0 })}</div>*/}
          <div>
            {isArray(data?.check_log) ? (
              <div>
                <p>{`检查时间：${
                  data.start_time && data.end_time ? data.start_time + '~' + data.end_time : '-'
                }`}</p>
                {data.check_log?.map((it: any) => {
                  return <p>{`【${it.name_path}】【${it.sealing_version}】`}</p>;
                })}
              </div>
            ) : (
              data?.check_log
            )}
          </div>
        </div>
      ),
    });
  };

  return (
    <Spin spinning={spinning} tip={'数据加载中...'}>
      <div className={'AgGridReactTable'} style={{ height: 510 }}>
        <AgGridReact
          columnDefs={checkDetailColumn}
          {...initGridTable(gridApi)}
          rowData={checkSource}
          frameworkComponents={{
            checkStatus: formatCheckStatus,
            operation: (it: CellClickedEvent) => {
              const showLog =
                ['unknown', 'wait'].includes(it.data.status || 'unknown') || !it.data.check_log;
              const refreshed = ['doing', 'running'].includes(it.data.status) || disabled;
              const isLibrary = it.data.key == 'library_data';
              return (
                <div className={'operation'}>
                  {it.data?.refresh && (
                    <img
                      src={require('../../../../../public/excute.png')}
                      onClick={() => {
                        if (refreshed || isLibrary) return;
                        handleCheck(it.data);
                      }}
                      style={
                        refreshed || isLibrary
                          ? { filter: 'grayscale(1)', cursor: 'not-allowed' }
                          : {}
                      }
                    />
                  )}
                  <img
                    src={require('../../../../../public/logs.png')}
                    style={
                      showLog || isLibrary ? { filter: 'grayscale(1)', cursor: 'not-allowed' } : {}
                    }
                    onClick={() => {
                      if (showLog || isLibrary) return;
                      handleLog(it);
                    }}
                  />
                </div>
              );
            },
          }}
        />
      </div>
    </Spin>
  );
};
export default Detail;
