import {useCallback, useState} from 'react';
import moment from "moment";
import dayjs from "dayjs";

export default () => {
  // /////////迭代列表数据
  /* region tab 数据 */
  const [tabsInfo, setTabsInfo] = useState({activeKey: '需求基线'});

  // 设置Tab的数据
  const setTabsData = useCallback((activeKey: string) => {
    setTabsInfo({activeKey});
  }, []);

  /* endregion */

  /* region 查询条件 数据 */
  const [queryInfo, setQueryInfo] = useState({
    dept: "",
    iterName: "",
    SQA: "",
    iterRange: [moment(dayjs().startOf("year").format("YYYYMMDD")), moment(dayjs().endOf("year").format("YYYYMMDD"))]
  });
  /* endregion */

  /* region 迭代列表grid 数据 */
  const [listData, setListData] = useState([]);
  /* endregion */

  const [initStoryTree, setInitStoryTree] = useState([]);
  const [initDesignTree, setInitDesignTree] = useState([]);


  // /////////迭代详情数据

  const [gridApi, setGridApi] = useState(null);

  /* region 列 */
  const [columns, setColumns] = useState([]);
  /* endregion */

  /* region 详情列表数据 */
  const [detailsData, setDetailsData] = useState([]);
  /* endregion */


  return {
    initStoryTree, setInitStoryTree,
    initDesignTree, setInitDesignTree,
    tabsInfo, setTabsData, // tabs
    queryInfo, setQueryInfo, // 查询条件
    listData, setListData, // 迭代列表数据

    columns, setColumns,
    detailsData, setDetailsData,
    gridApi, setGridApi
  };
};
