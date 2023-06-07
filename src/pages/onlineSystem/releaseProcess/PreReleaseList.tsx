import React, {useEffect, useRef, useState} from 'react';
import {Button, Spin} from 'antd';
import {AgGridReact} from 'ag-grid-react';
import {GridApi, GridReadyEvent, CellClickedEvent} from 'ag-grid-community';
import DragIcon from '@/components/DragIcon';
import {releaseListColumn} from '@/pages/onlineSystem/releaseProcess/column';
import styles from './index.less';
import PreReleaseServices from '@/services/preRelease';
import {isEmpty, orderBy} from 'lodash';
import {history, useLocation} from 'umi';
import DemandListModal from '@/pages/onlineSystem/components/DemandListModal';
import {WarningOutlined} from '@ant-design/icons';
import {setTabsLocalStorage} from "@/pages/onlineSystem/commonFunction";

const PreReleaseList = ({disabled, height}: { disabled?: boolean; height: number }) => {
  const gridRef = useRef<GridApi>();
  const query = useLocation()?.query;
  const [rowData, setRowData] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [warnTip, setWarnTip] = useState(false);

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
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
      let href = `/onlineSystem/releaseOrder/${data?.release_num}/false/${data?.release_name}`;
      if (data.type == '1') {
        href = `/onlineSystem/prePublish/${data?.release_num}/${data?.branch}/false/${data?.release_name}`;
      }
      history.push(href);
    }
    setVisible(false);
  };

  const getTableList = async () => {
    setSpinning(true);
    try {
      const res = await PreReleaseServices.releaseList();
      let formatData: any[] = [];
      const sortData = orderBy(res, 'plan_release_time', 'asc');
      sortData.forEach((it, i) => {
        let data = res[i];
        formatData.push({
          ...data,
          tip: res[i].release_num != it.release_num,
          project: data.project?.map((pro: any) => pro.pro_name)?.join(',') ?? '',
        });
      });
      setRowData(formatData);
      setSpinning(false);
      setWarnTip(
        sortData?.map((it: any) => it.release_num)?.toString() !==
        formatData?.map((it) => it.release_num)?.toString(),
      );
    } catch (e) {
      setSpinning(false);
    }
  };

  useEffect(() => {
    if (query.key == 'pre') {
      getTableList();
    }
  }, [query.key]);

  return (
    <Spin spinning={spinning} tip="数据加载中...">
      <div className={styles.preReleaseList}>
        <div className={styles.box}>
          <Button
            type={'primary'}
            size={'small'}
            disabled={disabled}
            onClick={() => setVisible(true)}
            className={'btn'}
          >
            新增发布
          </Button>
          {warnTip && (
            <div className={styles.warnWrap}>
              <WarningOutlined style={{fontSize: 18, marginRight: 8}}/>
              提示：当前预发布列表，红色标记<span style={{margin: '0 5px'}}>“计划发布时间”</span>
              顺序有误，请确认后及时调整
            </div>
          )}
        </div>
        <div className="ag-theme-alpine" style={{height: height - 80, width: '100%'}}>
          <AgGridReact
            columnDefs={releaseListColumn('pre')}
            rowData={rowData}
            defaultColDef={{
              resizable: true,
              filter: true,
              flex: 1,
              suppressMenu: true,
              cellStyle: {'line-height': '28px'},
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
                      let href = `/onlineSystem/prePublish/${p.data.release_num}/${p.data.branch}/${p.data.is_delete}/${p.data.release_name}`;
                      if (p.data.release_type == 'backlog_release') {
                        href = `/onlineSystem/releaseOrder/${p.data.release_num}/${p.data.is_delete}/${p.data.release_name}`;
                      }

                      setTabsLocalStorage({
                        "release_num": p.data.release_num,
                        "release_name": p.data.release_name,
                      });
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
        <DemandListModal visible={visible} onOk={onFinish}/>
      </div>
    </Spin>
  );
};
export default PreReleaseList;
