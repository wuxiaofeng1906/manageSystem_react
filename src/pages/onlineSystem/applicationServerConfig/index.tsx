import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { Button, Spin } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { getHeight } from '@/publicMethods/pageSet';
import { applicationConfigColumn } from './column';

const ApplicationServerConfig = () => {
  const [gridHeight, setGridHeight] = useState(getHeight() - 60);
  const [list, setList] = useState<any[]>([]);
  const [spinning, setSpinning] = useState(false);
  const gridRef = useRef<GridApi>();

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  window.onresize = function () {
    setGridHeight(Number(getHeight()) - 60);
    gridRef.current?.sizeColumnsToFit();
  };

  useEffect(() => {
    setList([{ name: 'web', side: '前端', type: '前端业务应用', env: '租户集群', apk: 'yes' }]);
  }, []);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <PageContainer>
        <div className={styles.applicationServerConfig}>
          <div>
            <Button>新增</Button>
            <Button>删除</Button>
          </div>
          <div style={{ height: gridHeight }}>
            <AgGridReact
              className="ag-theme-alpine"
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: true,
                suppressMenu: true,
                cellStyle: { 'line-height': '30px' },
              }}
              rowHeight={30}
              headerHeight={35}
              suppressRowTransform={true}
              onGridReady={onGridReady}
              onGridSizeChanged={onGridReady}
              columnDefs={applicationConfigColumn}
              rowData={[]}
            />
          </div>
        </div>
      </PageContainer>
    </Spin>
  );
};
export default ApplicationServerConfig;
