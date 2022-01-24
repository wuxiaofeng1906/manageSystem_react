import {
  getApiMethod, getDatabseAndApiUpgrade, getIfOrNot, getOnlineDev,
  getPassOrNot, getReleaseItem, getRepaireType, getTechSide, getUpgradeApi
} from "@/pages/onDutyAndRelease/preRelease/supplementFile/comControl/converse";
import dayjs from "dayjs";
import {message} from "antd";

// 获取表格高度
const getGridHeight = (gridRowCount: number, moreHigh: boolean = false) => {
  if (gridRowCount === 0) {
    return 100;
  }
  let height = gridRowCount * 25 + 50;
  if (moreHigh) {
    height += 100;
  }

  if (height > 300) {
    return 300;
  }

  return height;
};

// 渲染表格行的颜色(正在修改的行)
const releaseAppChangRowColor = (allLockedArray: any, type: string, idFlag: number) => {

  const lockInfoArray = allLockedArray;
  let returnValue = {'background-color': 'transparent'};
  if (!idFlag) {
    return returnValue;
  }
  if (lockInfoArray && lockInfoArray.length > 0) {
    for (let index = 0; index < lockInfoArray.length; index += 1) {

      const paramsArray = (lockInfoArray[index].param).split("-");
      if (type === `${paramsArray[1]}-${paramsArray[2]}`) { // 判断是不是属于当前渲染表格的数据
        if (idFlag.toString() === paramsArray[3]) { // 判断有没有对应id
          returnValue = {'background-color': '#FFF6F6'};
          break;

        }
      }
    }
  }
  return returnValue;
};

// 操作按钮
const operateRenderer = (type: number, params: any) => {

  const typeStr = JSON.stringify(type);
  const paramData = JSON.stringify(params.data).replace(/'/g, "’");
  if (type === 1) {  // 发布项没有新增功能
    return `
        <div style="margin-top: -5px">
             <Button  style="border: none; background-color: transparent;  margin-left: -10px; "  onclick='modifyRows(${typeStr},${paramData})'>
              <img src="../edit.png" width="15" height="15" alt="修改" title="修改">
            </Button>
            <Button  style="border: none; background-color: transparent; margin-left: -10px ; " onclick='deleteRows(${typeStr},${paramData})'>
              <img src="../delete_2.png" width="15" height="15" alt="删除" title="删除">
            </Button>
        </div>
           `;
  }

  return `
        <div style="margin-top: -5px">
            <Button  style="border: none; background-color: transparent; " onclick='addRows(${typeStr},${paramData})'>
              <img src="../add_1.png" width="15" height="15" alt="新增" title="新增">
            </Button>
             <Button  style="border: none; background-color: transparent;  margin-left: -10px; " onclick='modifyRows(${typeStr},${paramData})'>
              <img src="../edit.png" width="15" height="15" alt="修改" title="修改">
            </Button>
            <Button  style="border: none; background-color: transparent; margin-left: -10px ; " onclick='deleteRows(${typeStr},${paramData})'>
              <img src="../delete_2.png" width="15" height="15" alt="删除" title="删除">
            </Button>
        </div>
           `;

};

// 发布项表格定义
const getReleasedItemColumns = () => {
  const firstUpSerColumn: any = [
    {
      headerName: '上线环境',
      field: 'online_environment',
      cellRenderer: (params: any) => {

        return `<span>${getOnlineDev(params.value)}</span>`
      }

    },
    {
      headerName: '发布项',
      field: 'release_item',
      minWidth: 95,
      cellRenderer: (params: any) => {
        const item = getReleaseItem(params.value);
        return `<span>${item}</span>`
      }
    },
    {
      headerName: '应用',
      field: 'app',
      minWidth: 65
    },
    {
      headerName: '是否支持热更新',
      field: 'hot_update',
      minWidth: 130,
      cellRenderer: (params: any) => {
        return `<span>${getIfOrNot(params.value)}</span>`
      }
    },
    {
      headerName: '是否涉及接口与数据库升级',
      field: 'is_upgrade_api_database',
      minWidth: 196,
      cellRenderer: (params: any) => {
        return `<span>${getDatabseAndApiUpgrade(params.value)}</span>`
      }
    },
    {
      headerName: '分支和环境',
      field: 'branch_environment',
      minWidth: 105,
    },
    {
      headerName: '编辑人',
      field: 'edit_user_name',
      minWidth: 75
    },
    {
      headerName: '编辑时间',
      field: 'edit_time',
    },
    {
      headerName: '说明',
      field: 'instructions',
    },
    {
      headerName: '备注',
      field: 'remarks',
    },
    {
      headerName: '操作',
      pinned: "right",
      minWidth: 115,
      maxWidth: 115,
      cellRenderer: (params: any) => {
        return operateRenderer(1, params)
      }
    }];
  return firstUpSerColumn;
};

//  发布接口表格定义
const getReleasedApiColumns = () => {
  const secondUpSerColumn: any = [
    {
      headerName: '上线环境',
      field: 'online_environment',
      cellRenderer: (params: any) => {
        return `<span>${getOnlineDev(params.value)}</span>`
      }
    },
    {
      headerName: '升级接口',
      field: 'update_api',
      cellRenderer: (params: any) => {
        return `<span>${getUpgradeApi(params.value)}</span>`
      }

    },
    {
      headerName: '接口服务',
      field: 'api_name',
    },
    {
      headerName: '是否支持热更新',
      field: 'hot_update',
      cellRenderer: (params: any) => {
        return `<span>${getIfOrNot(params.value)}</span>`
      }
    },
    {
      headerName: '接口Method',
      field: 'api_method',
      cellRenderer: (params: any) => {
        return `<span>${getApiMethod(params.value)}</span>`
      }

    },
    {
      headerName: '接口URL',
      field: 'api_url',
    },
    {
      headerName: '编辑人',
      field: 'edit_user_name',
      minWidth: 75
    },
    {
      headerName: '编辑时间',
      field: 'edit_time',
    },
    {
      headerName: '涉及租户',
      field: 'related_tenant',
    },
    {
      headerName: '备注',
      field: 'remarks',
    },
    {
      headerName: '操作',
      pinned: "right",
      minWidth: 100,
      maxWidth: 100,
      cellRenderer: (params: any) => {
        return operateRenderer(2, params)
      }
    }];
  return secondUpSerColumn;
};

// 发布任务-服务确认
const getReleaseServiceComfirmColumns = () => {

  const thirdUpSerColumn = [
    {
      headerName: '前端值班',
      field: 'front_user_name',
      minWidth: 90,
    },
    {
      headerName: '服务确认完成',
      field: 'front_confirm_status',
      minWidth: 115,
      // editable: true,
      // cellEditor: "agSelectCellEditor",
      // cellEditorParams: {values: confirmRender()},
      // filterParams: {
      //   valueFormatter: (params: any) => {
      //     return confirmMappings[params.value];
      //   },
      // },
      // valueFormatter: (params: any) => {
      //   return confirmMappings[params.value];
      // },
      cellRenderer: "confirmSelectChoice",
    },
    {
      headerName: '确认时间',
      field: 'front_confirm_time',
    },
    {
      headerName: '后端值班',
      field: 'back_end_user_name',
    },
    {
      headerName: '服务确认完成',
      field: 'back_end_confirm_status',
      minWidth: 115,
      // editable: true,
      // cellEditor: "agSelectCellEditor",
      // cellEditorParams: {values: confirmRender()},
      // filterParams: {
      //   valueFormatter: (params: any) => {
      //     return confirmMappings[params.value];
      //   },
      // },
      // valueFormatter: (params: any) => {
      //   return confirmMappings[params.value];
      // },
      // cellRenderer: selectColorRenderer
      cellRenderer: "confirmSelectChoice",

    },
    {
      headerName: '确认时间',
      field: 'back_end_confirm_time',
    },
    {
      headerName: '流程值班',
      field: 'process_user_name',
    },
    {
      headerName: '服务确认完成',
      field: 'process_confirm_status',
      minWidth: 115,
      // editable: true,
      // cellEditor: "agSelectCellEditor",
      // cellEditorParams: {values: confirmRender()},
      // filterParams: {
      //   valueFormatter: (params: any) => {
      //     return confirmMappings[params.value];
      //   },
      // },
      // valueFormatter: (params: any) => {
      //   return confirmMappings[params.value];
      // },
      // cellRenderer: selectColorRenderer
      cellRenderer: "confirmSelectChoice",

    },
    {
      headerName: '确认时间',
      field: 'process_confirm_time',
    },
    {
      headerName: '测试值班',
      field: 'test_user_name',
    },
    {
      headerName: '服务确认完成',
      field: 'test_confirm_status',
      minWidth: 115,
      // editable: true,
      // cellEditor: "agSelectCellEditor",
      // cellEditorParams: {values: confirmRender()},
      // filterParams: {
      //   valueFormatter: (params: any) => {
      //     return confirmMappings[params.value];
      //   },
      // },
      // valueFormatter: (params: any) => {
      //   return confirmMappings[params.value];
      // },
      // cellRenderer: selectColorRenderer
      cellRenderer: "confirmSelectChoice",

    },
    {
      headerName: '确认时间',
      field: 'test_confirm_time',
    }];
  return thirdUpSerColumn;
};

// 数据修复review
const getReviewColumns = () => {

  const firstDataReviewColumn: any = [
    {
      headerName: '序号',
      field: 'No',
      minWidth: 65,
      maxWidth: 70,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '提交ID',
      field: 'commit_id',
      minWidth: 100,
      maxWidth: 100
    },
    {
      headerName: '数据修复内容',
      field: 'repair_data_content',
      minWidth: 120
    },
    {
      headerName: '涉及租户',
      field: 'related_tenant',
    },
    {
      headerName: '类型',
      field: 'type',
      minWidth: 80,
      cellRenderer: (params: any) => {
        return `<span>${getRepaireType(params.value)}</span>`
      }

    },
    {
      headerName: '修复提交人',
      field: 'commit_user_name',
      minWidth: 105
    },
    {
      headerName: '分支',
      field: 'branch',
    },
    {
      headerName: '是否可重复执行',
      field: 'is_repeat',
      minWidth: 130,
      cellRenderer: (params: any) => {
        return `<span>${getIfOrNot(params.value)}</span>`
      }
    },
    {
      headerName: '编辑人',
      field: 'edit_user_name',
      minWidth: 75
    },
    {
      headerName: '编辑时间',
      field: 'edit_time',
    },
    {
      headerName: '评审结果',
      field: 'review_result',
      cellRenderer: (params: any) => {
        return `<span>${getPassOrNot(params.value)}</span>`
      }

    },
    {
      headerName: '操作',
      pinned: "right",
      minWidth: 100,
      maxWidth: 100,
      cellRenderer: (params: any) => {
        return operateRenderer(3, params);
      }
    }];
  return firstDataReviewColumn;
};

// 数据review确认
const getReviewConfirmColums = () => {
  const secondDataReviewColumn = [
    {
      headerName: '后端值班',
      field: 'confirm_user_name',
    },
    {
      headerName: '服务确认完成',
      field: 'confirm_status',
      cellRenderer: 'selectChoice'
    },
    {
      headerName: '确认时间',
      field: 'confirm_time',
    }];
  return secondDataReviewColumn;
};

// 渲染单元测试运行是否通过字段
const rendererUnitTest = (params: any) => {

  const values = params.value;
  if (!values) {
    return "";
  }

  let frontValue = "";
  let frontTime = "";
  let backendValue = "";
  let backendTime = "";

  // 循环解析前后端的数据
  values.forEach((ele: any) => {

    // 解析是否成功
    let passFlag = "";
    if (ele.ignore_check === "1") {
      passFlag = "忽略";
    } else if (ele.test_case_status === "success") {
      passFlag = "是";
    } else if (ele.test_case_status === "error") {
      passFlag = "否";
    } else if (ele.test_case_status === "skip") {
      passFlag = "忽略";
    } else if (ele.test_case_status === "running") {
      passFlag = "运行中";
    } else {
      passFlag = "未知";
    }

    // 解析时间
    let start = "";
    if (ele.test_case_start_time) {
      start = dayjs(ele.test_case_start_time).format("HH:mm:ss");
    }

    let end = "";
    if (ele.test_case_end_time) {
      end = dayjs(ele.test_case_end_time).format("HH:mm:ss");
    }
    let timeRange = "";
    if (start) {
      timeRange = `${start}~${end}`;
    }
    if (ele.test_case_technical_side === "1") { // 前端
      frontValue = passFlag;
      frontTime = timeRange;
    } else {  // 后端
      backendValue = passFlag;
      backendTime = timeRange;
    }

  });

  // 前端的颜色
  let frontColor = "black";
  if (frontValue === "是") {
    frontColor = "#2BF541";
  } else if (frontValue === "否") {
    frontColor = "#8B4513";
  } else if (frontValue === "忽略") {
    frontColor = "blue";
  }

  // 后端的颜色
  let bacnkendColor = "black";
  if (backendValue === "是") {
    bacnkendColor = "#2BF541";
  } else if (backendValue === "否") {
    bacnkendColor = "#8B4513";
  } else if (backendValue === "忽略") {
    bacnkendColor = "blue";
  }

  if (params.data?.technical_side === "1") {  // 前端

    return `
        <div style="margin-top: -10px">
            <div style=" margin-top: 20px;font-size: 10px">
                <div>前端： <label style="color: ${frontColor}"> ${frontValue}</label> &nbsp;${frontTime}</div>
            </div>

        </div>
    `;

  }
  if (params.data?.technical_side === "2") {   // 后端
    return `
        <div style="margin-top: -10px">
            <div style=" margin-top: 20px;font-size: 10px">
                <div> 后端：<label style="color: ${bacnkendColor}"> ${backendValue}</label>
                &nbsp;${backendTime}</div>
            </div>
        </div>
    `;
  }
  return `
        <div style="margin-top: -10px">
            <div style=" margin-top: 20px;font-size: 10px">
                <div>前端： <label style="color: ${frontColor}"> ${frontValue}</label> &nbsp;${frontTime}</div>
                <div style="margin-top: -20px"> 后端：
                <label style="color: ${bacnkendColor}"> ${backendValue}</label>
                &nbsp;${backendTime}</div>
            </div>

        </div>
    `;

};

(window as any).goCommenLog = (logUrl: string) => {

  if (logUrl && logUrl !== "null") {
    return true;
  }
  message.error({
    content: "无检查日志，请执行后在查看！",
    duration: 1,
    style: {
      marginTop: '50vh',
    },
  });
  return false;
};

// 渲染上线前版本检查是否通过
const beforeOnlineVersionCheck = (params: any) => {

  if (!params.value || (params.value).length === 0) {
    return "";
  }

  const values: any = (params.value)[0];// 本数组只会有一条数据
  // 解析所属端
  let side = "";
  if (values.technical_side === "front") {
    side = "前端：";
  } else if (values.technical_side === "backend") {
    side = "后端：";
  } else if (values.technical_side === "front,backend" || values.technical_side === "backend,front") {
    side = "前后端：";
  }

  // 解析时间
  let start = "";
  if (values.check_start_time && values.check_start_time !== "-") {
    start = dayjs(values.check_start_time).format("HH:mm:ss");
  }

  let end = "";
  if (values.check_end_time) {
    end = dayjs(values.check_end_time).format("HH:mm:ss");
  }

  let timeRange = "";
  if (start) {
    timeRange = `${start}~${end}`;
  }

  // 解析结果
  let result = "";
  let frontColor = "black";

  if (values.check_result === "9") {  // 9是未结束，然后就获取检查状态

    if (values.check_status === "1") {
      result = "未开始";
    } else if (values.check_status === "2") {
      result = "检查中";
      frontColor = "#46A0FC";
    } else if (values.check_status === "3") {
      result = "已结束";
    }

  } else if (values.check_result === "1") {
    result = "是";
    frontColor = "#2BF541";
  } else if (values.check_result === "2") {
    result = "否";
    frontColor = "#8B4513";
  }

  const checkNum = JSON.stringify(params.data?.check_num);


  // let targetUrl = values.check_url;
  // if(values.check_url){
  //   targetUrl = ""
  // }
  if (side === "") {
    return `
         <div>
          <div style="width: 210px">
              <div style="font-size: 10px">
                  <div>${side}
                    <button style="margin-left: -20px;color: ${frontColor};width: 40px;border: none;background-color: transparent"> ${result}</button>
                    <lable style="margin-left: -10px">${timeRange}</lable>
                  </div>
              </div>
          </div>
      </div>
    `;
  }
  return `
         <div>
          <div style="margin-top: -10px;text-align: right">

            <Button  style="margin-left: -10px; border: none; background-color: transparent; font-size: small; color: #46A0FC"
            onclick='excuteDataCheck("versionCheck",${checkNum})'>
              <img src="../执行.png" width="14" height="14" alt="执行" title="执行">
            </Button>

              <a href="${values.check_url}" target="_blank"  onclick="return goCommenLog('${values.check_url}')" >
               <img src="../taskUrl.png" width="14" height="14" alt="日志" title="日志">
             </a>

          </div>
          <div style="margin-top: -20px;width: 210px">
              <div style="font-size: 10px">
                  <div>${side} <button style="margin-left: -10px; color: ${frontColor};width: 40px;border: none;background-color: transparent"> ${result}</button>
                  <lable style="margin-left: -10px">${timeRange}</lable>
                  </div>
              </div>

          </div>
      </div>
    `;

};

// 上线前环境检查
const beforeOnlineEnvCheck = (params: any) => {

  if (!params.value || (params.value).length === 0) {
    return "";
  }
  const values = (params.value)[0]; // 也只会有一条数据

  // 显示结果和颜色
  let result = "";
  let Color = "black";
  if (values.ignore_check === "1") {// 忽略
    result = "忽略";
    Color = "blue";

  } else if (values.ignore_check === "2") {  // 不忽略
    if (values.check_result === "success") {
      result = "是";
      Color = "#2BF541";
    } else {
      result = "否";
      Color = "#8B4513";
    }
  }

  // 解析时间
  let start = "";
  if (values.check_start_time) {
    start = dayjs(values.check_start_time).format("HH:mm:ss");
  }

  let end = "";
  if (values.check_end_time) {
    end = dayjs(values.check_end_time).format("HH:mm:ss");
  }

  let timeRange = "";
  if (start) {
    timeRange = `${start}~${end}`;
  }

  const checkNum = JSON.stringify(params.data?.check_num);

  return `
        <div style="margin-top: -10px">
            <div style="text-align: right" >
              <Button  style="margin-left: -10px; border: none; background-color: transparent; font-size: small; color: #46A0FC" onclick='excuteDataCheck("envCheck",${checkNum})'>
                <img src="../执行.png" width="14" height="14" alt="执行" title="执行">
              </Button>

              <a href="${values.check_url}" target="_blank"  onclick="return goCommenLog('${values.check_url}')" >
               <img src="../taskUrl.png" width="14" height="14" alt="日志" title="日志">
             </a>
            </div>
            <div style=" margin-top: -20px;font-size: 10px;width: 200px">
                <div><label style="color: ${Color}"> ${result}</label> &nbsp;${timeRange}</div>
            </div>

        </div>
    `;

};
// 上线前自动化检查
const beforeOnlineAutoCheck = (params: any, type: string) => {
  const values = params.value;
  if (!values) {
    return "";
  }

  let value = "";
  let Color = "black";
  let timeRange = "";
  let checkType = "";
  let logUrl = "";


  values.forEach((ele: any) => {
    if (ele.check_time === type) {  // 如果是1 ，则代表是上线前检查,如果是2 ，则代表是上线后检查
      // // 解析结果和颜色：需要判断是否忽略，是的话显示忽略，否的话继续显示状态
      if (ele.ignore_check === "1") {
        value = "忽略";
        Color = "blue";
      } else if (ele.check_status === "1") {
        value = "未开始";
      } else if (ele.check_status === "2") {
        value = "检查中";
        Color = "#46A0FC";
      } else if (ele.check_status === "3") {
        value = "已结束";
        Color = "#2BF541";
      }

      checkType = ele.check_type;
      logUrl = ele.check_log_url;
      // 解析时间
      let start = "";
      if (ele.check_start_time) {
        start = dayjs(ele.check_start_time).format("HH:mm:ss");
      }

      let end = "";
      if (ele.check_end_time) {
        end = dayjs(ele.check_end_time).format("HH:mm:ss");
      }
      if (start) {
        timeRange = `${start}~${end}`;
      }
    }

  });

  // 判断是上下前检查还是上线后检查
  let title = "afterOnlineCheck";
  if (type === "1") {
    title = "beforeOnlineCheck";
  }


  return `
        <div style="margin-top: -10px">
            <div style="text-align: right" >
              <Button  style="margin-left: -10px; border: none; background-color: transparent; font-size: small; color: #46A0FC"
              onclick='excuteDataCheck(${JSON.stringify(title)},${JSON.stringify(params.data?.check_num)})'>
                <img src="../执行.png" width="14" height="14" alt="执行" title="执行">
              </Button>
              <Button  style="margin-left: -10px;border: none; background-color: transparent; font-size: small; color: #46A0FC" onclick='urlClick(${JSON.stringify(checkType)},${JSON.stringify(logUrl)})'>
                <img src="../taskUrl.png" width="14" height="14" alt="日志" title="日志">
              </Button>
            </div>
            <div style=" margin-top: -20px;font-size: 10px;width: 200px">
                <div><label style="color: ${Color}"> ${value}</label> &nbsp;${timeRange}</div>
            </div>

        </div>
    `;

};

// 封板状态
const sealStatusRenderer = (params: any) => {
  if (!params.value) {
    return `<div></div>`;
  }

  const values = params.value;
  // 代表只有前端或者只有后端
  if (values.length === 1) {
    const arrayData = values[0];
    let side = "";
    if (arrayData.technical_side === "1") { // 是前端
      side = "前端：";
    } else if (arrayData.technical_side === "2") { // 是后端
      side = "后端：";
    }

    const status = arrayData.sealing_version === "1" ? "已封板" : "未封板";
    const sideColor = arrayData.sealing_version === "1" ? "#2BF541" : "orange";
    const time = arrayData.sealing_version_time === "" ? "" : dayjs(arrayData.sealing_version_time).format("HH:mm:ss");

    return `
        <div style="margin-top: -10px">
            <div style=" margin-top: 20px;font-size: 10px">
                <div>${side} <label style="color: ${sideColor}"> ${status}</label> &nbsp;${time}</div>
            </div>

        </div>
    `;
  }

  // 证明有前后端
  if (values.length === 2) {
    let frontValue = "";
    let frontTime = "";
    let frontColor = "orange";

    let backendValue = "";
    let backendTime = "";
    let bacnkendColor = "orange";
    values.forEach((ele: any) => {
      if (ele.technical_side === "1") {  // 前端
        frontValue = ele.sealing_version === "1" ? "已封板" : "未封板";
        frontTime = ele.sealing_version_time === "" ? "" : dayjs(ele.sealing_version_time).format("HH:mm:ss");
        frontColor = ele.sealing_version === "1" ? "#2BF541" : "orange";
      } else if (ele.technical_side === "2") {  // 后端
        backendValue = ele.sealing_version === "1" ? "已封板" : "未封板";
        backendTime = ele.sealing_version_time === "" ? "" : dayjs(ele.sealing_version_time).format("HH:mm:ss");
        bacnkendColor = ele.sealing_version === "1" ? "#2BF541" : "orange";
      }
    });

    return `
        <div style="margin-top: -10px">
            <div style=" margin-top: 20px;font-size: 10px">
                <div>前端：<label style="color: ${frontColor}"> ${frontValue}</label> &nbsp;${frontTime}</div>
                <div style="margin-top: -20px">
                后端：<label style="color: ${bacnkendColor}"> ${backendValue}</label>${backendTime}</div>
            </div>

        </div>
    `;
  }
  return `<div></div>`;
};

// 上线分支
const getOnlineBranchColumns = () => {
  const firstOnlineBranchColumn: any = [
    {
      headerName: '序号',
      field: 'No',
      minWidth: 65,
      maxWidth: 70,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '分支名称',
      field: 'branch_name',
      minWidth: 100,
    },
    {
      headerName: '技术侧',
      field: 'technical_side',
      cellRenderer: (params: any) => {
        return `<span>${getTechSide(params.value)}</span>`
      }
    },
    {
      headerName: '单元测试运行是否通过',
      field: 'test_unit',
      cellRenderer: rendererUnitTest,
      minWidth: 190,
    },
    {
      headerName: '上线前版本检查是否通过',
      field: 'version_check',
      cellRenderer: beforeOnlineVersionCheck,
      minWidth: 190,
    },
    {
      headerName: '上线前环境检查是否通过',
      field: 'env_check',
      minWidth: 190,
      cellRenderer: beforeOnlineEnvCheck,
    },
    {
      headerName: '上线前自动化检查是否通过',
      field: 'automation_check',
      minWidth: 200,
      cellRenderer: (param: any) => {
        return beforeOnlineAutoCheck(param, "1")
      },
    },
    {
      headerName: '升级后自动化检查是否通过',
      field: 'automation_check',
      minWidth: 200,
      cellRenderer: (param: any) => {
        return beforeOnlineAutoCheck(param, "2")
      },
    },
    {
      headerName: '封板状态',
      field: 'branch_sealing_check',
      minWidth: 160,
      cellRenderer: sealStatusRenderer
    },
    {
      headerName: '程序分支拉取时间',
      field: 'branch_create_time',
      minWidth: 160,
    },
    {
      headerName: '操作',
      pinned: "right",
      field: 'branch_sealing_check',
      minWidth: 100,
      maxWidth: 100,
      cellRenderer: (params: any) => {
        return operateRenderer(4, params);
      }
    }];
  return firstOnlineBranchColumn;

};

// 工单信息
const getWorkOrderColumns = () => {

  const firstListColumn: any = [
    {
      headerName: '序号',
      field: 'No',
      minWidth: 65,
      maxWidth: 70,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '工单类型',
      field: 'repair_order_type',
    },
    {
      headerName: '工单编号',
      field: 'repair_order_num',
    },
    {
      headerName: '审批名称',
      field: 'approval_name',
    },
    {
      headerName: '审批说明',
      field: 'approval_instructions',
    },
    {
      headerName: '申请人',
      field: 'applicant_name',
    },
    {
      headerName: '创建时间',
      field: 'apply_create_time',
    },
    {
      headerName: '更新时间',
      field: 'apply_update_time',
    },
    {
      headerName: '工单状态',
      field: 'repair_order_status',
    },
    {
      headerName: '上步已审批人',
      field: 'before_approval_name',
      minWidth: 120
    }, {
      headerName: '当前待审批人',
      field: 'current_approval_name',
      minWidth: 120
    }];
  return firstListColumn;
};
export {
  getGridHeight,
  releaseAppChangRowColor,
  getReleasedItemColumns,
  getReleasedApiColumns,
  getReleaseServiceComfirmColumns,
  getReviewColumns,
  getReviewConfirmColums,
  getOnlineBranchColumns,
  getWorkOrderColumns
}
