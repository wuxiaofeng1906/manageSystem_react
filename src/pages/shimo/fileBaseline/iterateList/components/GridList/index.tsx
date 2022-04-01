import React, {useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {GridApi} from 'ag-grid-community';
import {getHeight} from "@/publicMethods/pageSet";
import {columns, testData, setCellStyle} from "./columns";
import "./style.css"
import {ShimoOverviewContent} from "./gridComponents/ShimoOverviewContent";
import {ShimoStoryContent} from "./gridComponents/ShimoStoryContent";
import {Operate} from "./gridComponents/Operate";
import {myUrls} from "./gridComponents/myUrls";

const GridList: React.FC<any> = () => {

  /* region 表格事件 */
  const [gridHeight, setGridHeight] = useState(getHeight() + 36);
  const gridApi = useRef<GridApi>();
  window.onresize = function () {
    setGridHeight(getHeight() + 36);
    gridApi.current?.sizeColumnsToFit();
  };
  /* endregion 表格事件 */

  return (
    <div className={"gridDiv"}>
      <div className="ag-theme-alpine" style={{height: gridHeight, width: '100%'}}>
        <AgGridReact
          columnDefs={columns} // 定义列
          rowData={testData} // 数据绑定
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
            shimoStoryContent: ShimoStoryContent,
            shimoOverviewContent: ShimoOverviewContent,
            operate: Operate
          }}
        >
        </AgGridReact>
      </div>
    </div>
  );
};


export default GridList;
