import React, { useEffect, useRef, useState } from 'react';
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

  const { getList, formatCheckStatus, source, spinning } = useCheckDetail();
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

  return (
    <Spin spinning={spinning} tip={'数据加载中...'}>
      <div className={'AgGridReactTable'} style={{ height: 510 }}>
        <AgGridReact
          columnDefs={checkDetailColumn}
          {...initGridTable(gridApi)}
          rowData={source}
          frameworkComponents={{
            checkStatus: formatCheckStatus,
            operation: (it: CellClickedEvent) => {
              const showLog = ['unknown', 'wait'].includes(it.data.status || 'unknown');
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
                      if (it.data.check_log) {
                        window.open(it.data.check_log);
                        return;
                      }
                      Modal.info({
                        width: 600,
                        title: '检查详情',
                        okText: '好的',
                        content: (
                          <div
                            style={{
                              maxHeight: 400,
                              overflow: 'auto',
                              margin: '10px 0',
                              whiteSpace: 'pre-line',
                            }}
                          >
                            <div>
                              检查状态：{' '}
                              {formatCheckStatus({ data: it.data, rowIndex: it.rowIndex || 0 })}
                            </div>
                            <div>
                              日志信息：
                              {isArray(it.data?.check_log)
                                ? it.data?.check_log.join(',')
                                : it.data?.check_log}
                            </div>
                          </div>
                        ),
                      });
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
