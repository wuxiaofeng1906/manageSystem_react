import {axiosGet} from "@/publicMethods/axios";
import dayjs from "dayjs";

// 获取迭代数据
const getIterListData = async (params: any) => {

  const {dept, iterName, SQA, iterRange} = params;
  const queryData = {
    depart: dept === "" ? "" : dept.join(","),
    exec_id: iterName === "" ? "" : iterName.join(","),
    sqa_user: SQA === "" ? "" : SQA.join(","),
    start_time: dayjs(iterRange[0]).format("YYYY-MM-DD"),
    end_time: dayjs(iterRange[1]).format("YYYY-MM-DD"),
  };

  const deptData = await axiosGet("/api/verify/shimo/executions", queryData);
  return deptData;
};

export {getIterListData};
