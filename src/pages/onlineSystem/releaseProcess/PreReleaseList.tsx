import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Modal, Form, Select, Spin, Row, Col } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent, CellClickedEvent } from 'ag-grid-community';
import DragIcon from '@/components/DragIcon';
import { releaseListColumn } from '@/pages/onlineSystem/releaseProcess/column';
import { getHeight } from '@/publicMethods/pageSet';
import styles from './index.less';
import PreReleaseServices from '@/services/preRelease';
import DutyListServices from '@/services/dutyList';
import { isEmpty } from 'lodash';
import { history, useLocation } from 'umi';
import DemandListModal from '@/pages/onlineSystem/components/DemandListModal';

const PreReleaseList = ({ disabled }: { disabled?: boolean }) => {
  const gridRef = useRef<GridApi>();
  const query = useLocation()?.query;
  const [rowData, setRowData] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [gridHeight, setGridHeight] = useState(getHeight() - 80);
  const [spinning, setSpinning] = useState(false);

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  window.onresize = function () {
    setGridHeight(Number(getHeight()) - 80);
  };

  const onDrag = async () => {
    const sortArr: any = [];
    gridRef.current?.forEachNode(function (node, index) {
      sortArr.push({
        release_index: index + 1,
        release_num: node.data.release_num,
      });
    });
    await PreReleaseServices.releaseOrder(sortArr);
    await getTableList();
  };

  const onFinish = async (data: any) => {
    if (!isEmpty(data)) {
      let href = '/onlineSystem/releaseOrder';
      let param = data?.release_num;
      if (data.type == '1') {
        href = '/onlineSystem/prePublish';
        param = data?.branch;
      }
      history.push(`${href}/${param}`);
    }
    setVisible(false);
  };

  const getTableList = async () => {
    setSpinning(true);
    try {
      const res = await PreReleaseServices.releaseList();
      setRowData(
        res.map((it: any) => ({
          ...it,
          project: it.project?.map((pro: any) => pro.pro_name)?.join(',') ?? '',
        })),
      );
      setSpinning(false);
    } catch (e) {
      setSpinning(false);
    }
  };

  useEffect(() => {
    if (query.key == 'pre') getTableList();
  }, [query.key]);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <div className={styles.preReleaseList}>
        <Button
          type={'primary'}
          size={'small'}
          disabled={disabled}
          onClick={() => setVisible(true)}
          className={'btn'}
        >
          新增发布
        </Button>
        <div className="ag-theme-alpine" style={{ height: gridHeight, width: '100%' }}>
          <AgGridReact
            columnDefs={releaseListColumn('pre')}
            rowData={rowData}
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
            onRowDragEnd={onDrag}
            onGridReady={onGridReady}
            frameworkComponents={{
              drag: DragIcon,
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
                    className={styles.links}
                    onClick={() => {
                      let href = `/onlineSystem/prePublish/${p.data.release_num}/${p.data.branch}`;
                      if (p.data.release_type == 'backlog_release') {
                        href = `/onlineSystem/releaseOrder${p.data.release_num}`;
                      }
                      history.push(href);
                    }}
                  >
                    {p.value}
                  </div>
                );
              },
            }}
          />
        </div>
        <DemandListModal visible={visible} onOk={onFinish} />
      </div>
    </Spin>
  );
};
export default PreReleaseList;
