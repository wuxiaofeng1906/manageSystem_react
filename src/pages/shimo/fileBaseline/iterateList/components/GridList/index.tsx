import React, {useEffect, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {GridApi} from 'ag-grid-community';
import {getHeight} from "@/publicMethods/pageSet";
import {columns, setCellStyle} from "./columns";
import {gridDiv} from "./style.css";
import {ShimoStoryContent} from "./gridComponents/ShimoStoryContent";
import {Operate} from "./gridComponents/Operate";
import {myUrls} from "./gridComponents/myUrls";
import {NameUrl} from "./gridComponents/NameUrl";
import {useModel} from "@@/plugin-model/useModel";
import {getIterListData} from "./gridData";
import {useRequest} from "ahooks";

const GridList: React.FC<any> = () => {

  /* region 表格事件 */
  const [gridHeight, setGridHeight] = useState(getHeight() + 30);
  const gridApi = useRef<GridApi>();
  window.onresize = function () {
    setGridHeight(getHeight() + 30);
    gridApi.current?.sizeColumnsToFit();
  };
  /* endregion 表格事件 */

  const {setListData, listData, queryInfo} = useModel("iterateList.index");
  const deptList: any = useRequest(() => getIterListData(queryInfo)).data;

  useEffect(() => {
    setListData(deptList);
  }, [deptList]);

  return (
    <div className={gridDiv}>
      <div className="ag-theme-alpine" style={{height: gridHeight, width: '100%'}}>
        <AgGridReact
          columnDefs={columns} // 定义列
          rowData={listData} // 数据绑定
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            cellStyle: setCellStyle
          }}
          rowHeight={28}
          headerHeight={30}
          onGridReady={(params: any) => {
            gridApi.current = params.api;
            params.api.sizeColumnsToFit();
          }}
          frameworkComponents={{
            myUrl: myUrls,
            nameUrl: NameUrl,
            shimoContent: ShimoStoryContent,
            operate: Operate
          }}
        >
        </AgGridReact>
      </div>
    </div>
  );
};


export default GridList;
