import React, {useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {getHeight} from "@/publicMethods/pageSet";
import {setCellStyle} from "./columns";
import {gridDiv} from "./style.css"
import {myUrls} from "./gridComponents/myUrls";
import {BaseLineSelect} from "./gridComponents/BaseLineSelect";
import {BaseFlag} from "./gridComponents/BaseFlag";
import {useModel} from "@@/plugin-model/useModel";
import {useRequest} from "ahooks";
import {getIterDetailsData} from "./gridData";
import {modifyGridCells, deteleBaselinieTime} from "./cellEdit";
import {sucMessage, warnMessage} from "@/publicMethods/showMessages";

const GridList: React.FC<any> = (props: any) => {
  const {
    detailsData, setDetailsData, columns,
    setColumns, gridApi, setGridApi
  } = useModel("iterateList.index");

  /* region 表格事件 */
  const [gridHeight, setGridHeight] = useState(getHeight());
  // const gridApi = useRef<GridApi>();
  window.onresize = function () {
    setGridHeight(getHeight() + 36);
    // @ts-ignore
    gridApi.sizeColumnsToFit();
  };

  /* endregion 表格事件 */

  const prjInfo = props.hrefParams;
  const detailsInfo: any = useRequest(() => getIterDetailsData(prjInfo.storyId, prjInfo.iterID)).data;

  // 编辑表格
  const cellEditedStoped = async (params: any) => {

    // 需要判断是否是修改基线时间（是否为空，只有为空，才是删除）

    const currentColumn = params.column.colId;
    if (currentColumn.indexOf("_time") > -1) {
      if (params.newValue.trim() === "") { // 只有为空时才是删除
        const currentSaveIdString = currentColumn.replace("_time", "_saveTimeId");
        const currentSaveId = (params.data)[currentSaveIdString];
        // 根据列名获取saveid
        const result = await deteleBaselinieTime(currentSaveId);

        if (result.code === 200) {
          sucMessage("基线时间成功！");
        }

        const gridData: any = await getIterDetailsData(prjInfo.storyId, prjInfo.iterID);
        setColumns(gridData?.columnsData); // 设置列
        setDetailsData(gridData?.gridData); // 设置数据

      } else {
        warnMessage("不能修改基线时间，只能进行删除！");
      }
    } else {
      const data = {
        "version_id": params.data?.version_id,
        "is_save_version": params.data?.is_save_version,
        "zt_num": params.data?.zt_num,
        "remark": params.data?.remark,
        "execution_id": prjInfo.iterID
      };

      if (params.column?.colId === "zt_num") {
        data.zt_num = params.newValue;
      } else if (params.column?.colId === "remark") {
        data.remark = params.newValue;
      }
      const result = await modifyGridCells(data);

      if (result.code === 200) {
        sucMessage("保存成功！");
      }
    }


  };

  useEffect(() => {
    setColumns(detailsInfo?.columnsData); // 设置列
    setDetailsData(detailsInfo?.gridData); // 设置数据
  }, [detailsInfo]);

  return (
    <div className={gridDiv}>
      <div className="ag-theme-alpine" style={{height: gridHeight, width: '100%'}}>
        <AgGridReact
          columnDefs={columns} // 定义列
          rowData={detailsData} // 数据绑定
          debounceVerticalScrollbar={true}
          defaultColDef={{
            resizable: true,
            filter: true,
            suppressMenu: true,
            cellStyle: setCellStyle
          }}
          rowHeight={28}
          headerHeight={30}
          onGridReady={(params: any) => {
            params.api.sizeColumnsToFit();
            setGridApi(params.api);
          }}
          frameworkComponents={{
            myUrl: myUrls,
            baseLine: (params: any) => {
              return BaseLineSelect(params, prjInfo)
            }
            ,
            baseFlag: (params: any) => {
              return BaseFlag(params, prjInfo)
            }
          }}
          rowSelection={'multiple'}
          onCellEditingStopped={cellEditedStoped}
          onColumnEverythingChanged={() => {
            if (gridApi) {
              // @ts-ignore
              gridApi.sizeColumnsToFit();
            }
          }}
        >
        </AgGridReact>
      </div>
    </div>
  );
};


export default GridList;
