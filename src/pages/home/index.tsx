import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { Select, DatePicker, Card } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { dutyColumn } from '@/pages/home/column';
import * as dayjs from 'dayjs';
import DutyListServices from '@/services/dutyList';
import VisualView from '@/pages/home/VisualView';

const Home = () => {
  const from = dayjs().subtract(1, 'd').startOf('w').subtract(0, 'w');
  const to = from.endOf('w');

  const range = {
    start_time: dayjs(from).add(1, 'day').format('YYYY/MM/DD'),
    end_time: dayjs(to).add(1, 'day').format('YYYY/MM/DD'),
  };

  const gridRef = useRef<GridApi>();
  const [dutyPerson, setDutyPerson] = useState<any[]>([]);

  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit();
  };
  const getFirstDuty = async () => {
    const firstDuty = await DutyListServices.getFirstDutyPerson(range);
    const duty = firstDuty?.data?.flat().filter((it: any) => it.duty_order == '1');
    let obj = {};
    duty?.forEach((it: any) => {
      obj[it.user_tech] = it.user_name;
    });
    setDutyPerson([obj]);
  };
  useEffect(() => {
    getFirstDuty();
  }, []);

  return (
    <div className={styles.homePage}>
      <Card
        className={styles.card}
        title={
          <span>
            值班信息：{dayjs(range.start_time).format('YYYY-MM-DD')}~
            {dayjs(range.end_time).format('YYYY-MM-DD')}
          </span>
        }
      >
        <div className="ag-theme-alpine" style={{ height: 80, width: '100%' }}>
          <AgGridReact
            columnDefs={dutyColumn}
            rowData={dutyPerson}
            defaultColDef={{
              resizable: true,
              filter: true,
              flex: 1,
              suppressMenu: true,
              cellStyle: { 'line-height': '28px' },
              minWidth: 100,
            }}
            rowHeight={28}
            headerHeight={30}
            onGridSizeChanged={onGridReady}
            onGridReady={onGridReady}
          />
        </div>
      </Card>

      <VisualView />
    </div>
  );
};
export default Home;
