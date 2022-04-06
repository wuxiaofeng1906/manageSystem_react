import {useCallback, useState} from 'react';
import moment from "moment";
import dayjs from "dayjs";

export default () => {

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

  // 设置Tab的数据
  // const setConditionInfo = useCallback((condition: any) => {
  //   setQueryInfo(condition);
  // }, []);

  /* endregion */

  /* region 迭代列表grid 数据 */
  const [listData, setListData] = useState([]);
  /* endregion */

  return {
    tabsInfo, setTabsData, // tabs
    queryInfo, setQueryInfo, // 查询条件
    listData, setListData, // 迭代列表数据
  };
};
