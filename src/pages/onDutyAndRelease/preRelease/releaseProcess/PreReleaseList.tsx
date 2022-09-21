import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import DragIcon from '@/components/DragIcon';
import { releaseListColumn } from '@/pages/onDutyAndRelease/preRelease/releaseProcess/column';

const PreReleaseList = () => {
  const gridRef = useRef<GridApi>();
  const [rowData, setRowData] = useState<any[]>([]);
  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };

  const onDrag = () => {
    const sortArr: any = [];
    gridRef.current?.forEachNode(function (node, index) {
      sortArr.push({ sort: index, id: node.data.num });
    });
    console.log(sortArr);
  };
  useEffect(() => {
    setRowData([
      {
        id: '202209190031',
        name: '2022091898发布',
        project: 'sprint效果文化',
        number: '2344',
        services: 'apps,h5',
        pm: '张三，李四',
        branch: 'release20220822',
        type: '灰度推线上',
        method: '停服',
        env: '集群1',
      },
      {
        id: '202209190031',
        name: '2022091-global发布',
        project: '效果文化',
        number: '2342',
        services: 'apps',
        pm: '李四',
        branch: 'release20220822',
        type: '灰度推线上',
        method: '停服',
        env: '集群2345',
      },
    ]);
  }, []);

  return (
    <div>
      <Button type={'primary'} size={'small'}>
        新增发布
      </Button>
      <div className="ag-theme-alpine" style={{ height: 800, width: '100%' }}>
        <AgGridReact
          columnDefs={releaseListColumn('pre')} // 定义列
          rowData={rowData} // 数据绑定
          defaultColDef={{
            resizable: true,
            filter: true,
            flex: 1,
            suppressMenu: true,
            cellStyle: { 'line-height': '28px' },
          }}
          rowHeight={28}
          headerHeight={30}
          rowDragManaged={true}
          animateRows={true}
          frameworkComponents={{ drag: DragIcon }}
          onRowDragEnd={onDrag}
          onGridReady={onGridReady}
          onGridSizeChanged={onGridReady}
        />
      </div>
    </div>
  );
};
export default PreReleaseList;
