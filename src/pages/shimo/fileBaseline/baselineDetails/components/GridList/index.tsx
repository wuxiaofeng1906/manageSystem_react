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
import {useModel} from "@@/plugin-model/useModel";
import {useRequest} from "ahooks";
import {getIterDetailsData} from "./gridData";
import {modifyGridCells} from "./cellEdit";
import {sucMessage} from "@/publicMethods/showMessages";

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
  const detailsInfo: any = useRequest(() => getIterDetailsData(prjInfo.storyId)).data;

  // 编辑表格
  const cellEditedStoped = async (params: any) => {

    const data = {
      "version_id": params.data?.version_id,
      "is_save_version": params.data?.is_save_version,
      "zt_num": params.data?.zt_num,
      "remark": params.data?.remark
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
          defaultColDef={{
            resizable: true,
            suppressMenu: true,
            cellStyle: setCellStyle
          }}
          rowHeight={28}
          headerHeight={30}
          onGridReady={(params: any) => {
            setGridApi(params.api)
            // gridApi.current = params.api;
            params.api.sizeColumnsToFit();
          }}
          frameworkComponents={{
            myUrl: myUrls,
            baseLine: BaseLineSelect
          }}
          rowSelection={'multiple'}
          onCellEditingStopped={cellEditedStoped}
          // onRowSelected={(params: any) => {
          //   debugger;
          //   console.log(params);
          //   //   记录被选中的数据
          //   if (params.node?.selected) {  // 被选中的数据
          //     setForBaseLineData();
          //   } else {
          //     //  没被选中，需要去掉这个数据
          //   }
          // }}
        >
        </AgGridReact>
      </div>
    </div>
  );
};


export default GridList;
