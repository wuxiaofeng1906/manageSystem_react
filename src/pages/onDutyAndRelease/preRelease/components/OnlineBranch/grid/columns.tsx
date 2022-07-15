import { getTechSide } from '../../../comControl/converse';
import dayjs from 'dayjs';
import { message } from 'antd';
import { isEmpty } from 'lodash';

// 渲染单元测试运行是否通过字段
const rendererUnitTest = (params: any) => {
  const values = params.value;
  if (!values) {
    return '';
  }

  let frontValue = '';
  let frontTime = '';
  let backendValue = '';
  let backendTime = '';

  // 循环解析前后端的数据
  values.forEach((ele: any) => {
    // 解析是否成功
    let passFlag = '';
    if (ele.ignore_check === '1') {
      passFlag = '忽略';
    } else if (ele.test_case_status === 'success') {
      passFlag = '是';
    } else if (ele.test_case_status === 'error') {
      passFlag = '否';
    } else if (ele.test_case_status === 'skip') {
      passFlag = '构建时跳过用例'; // 运维人工忽略
    } else if (ele.test_case_status === 'running') {
      passFlag = '执行中';
    } else {
      passFlag = '未知';
    }

    // 解析时间
    let start = '';
    if (ele.test_case_start_time) {
      start = dayjs(ele.test_case_start_time).format('HH:mm:ss');
    }

    let end = '';
    if (ele.test_case_end_time) {
      end = dayjs(ele.test_case_end_time).format('HH:mm:ss');
    }
    let timeRange = '';
    if (start) {
      timeRange = end ? `${start}~${end}` : start;
    }
    if (ele.test_case_technical_side === '1') {
      // 前端
      frontValue = passFlag;
      frontTime = timeRange;
    } else {
      // 后端
      backendValue = passFlag;
      backendTime = timeRange;
    }
  });
  const renderColor = { 是: '#2BF541', 否: '#8B4513', 忽略: 'blue' };
  // 前端的颜色
  const frontColor = renderColor[frontValue] ?? 'black';
  // 后端的颜色
  const bacnkendColor = renderColor[backendValue] ?? 'black';

  const front = `
    <div>
      前端： <label style="color: ${frontColor}"> ${frontValue}</label> &nbsp;${frontTime}
    </div>`;

  const backend = `
    <div style="margin-top: -20px">
      后端：
      <label style="color: ${bacnkendColor}"> ${backendValue}</label>
      &nbsp;${backendTime}
    </div>`;

  return `
        <div>
        <img src="../执行.png" width="16" height="16" alt="执行" title="执行"
                  style="margin-top: -15px;margin-left:100px;cursor: pointer"
                  onclick='refreshStatus(${JSON.stringify({
                    ready_release_num: params.data.ready_release_num,
                    refresh_param: 'test_unit',
                  })})'/>
            <div style="font-size: 10px;margin-top: -30px">
              ${['1', '3'].includes(params.data?.technical_side) ? front : ''}
              ${['2', '3'].includes(params.data?.technical_side) ? backend : ''}
            </div>
        </div>
    `;
};

// 图标一致性检查
const iconCheckRender = (params: any) => {
  const values = params.value;
  const technical = params.data?.technical_side === '2';

  let result = values?.check_status;
  let Color = 'black';
  if (isEmpty(values)) {
    if (technical) {
      result = '忽略';
      Color = 'blue';
    } else result = '';
  } else {
    if (values?.check_status === 'done') {
      // done  doing（执行中） wait（未开始）
      // check_result:  暂无分支、是、否
      if (values?.check_result === '是') {
        Color = '#2BF541';
        result = '通过';
      } else if (values.check_result === '否') {
        Color = '#8B4513';
        result = '不通过';
      } else {
        result = values.check_result;
      }
    } else if (values.check_status === 'doing') {
      result = '执行中';
      Color = '#46A0FC';
    } else if (values.check_status === 'wait') {
      result = '未开始';
    }
  }
  const logs = !isEmpty(values) && JSON.stringify(values?.check_log).replaceAll("'", '***'); // 如果包含单引号，解析会报错。需要用特殊符号替换掉，传过去之后再解析出来。
  return `
       <div>
          <div style="margin-top: ${!result ? '-10px' : '-5px'};margin-left: 60px">
          ${
            !result
              ? ''
              : `<div>
                  <img src="../执行.png" width="16" height="16" alt="执行" title="执行"
                    style="margin-right: 10px;cursor: pointer"
                    onclick='refreshStatus(${JSON.stringify({
                      ready_release_num: params.data.ready_release_num,
                      refresh_param: 'icon',
                    })})'/>
                  <Button  style="margin-left: -10px;border: none; background-color: transparent; font-size: small; color: #46A0FC;cursor: pointer"
                          onclick='showIconCheckLog(${logs})'>
                    <img src="../taskUrl.png" width="14" height="14" alt="日志" title="日志">
                  </Button>
              </div>`
          }
          </div>
          <div style="width: 210px;margin-top: ${result ? '-15px' : '0px'};">
                <div style="color:${Color};font-size: 10px">${result}</div>
          </div>
       </div>`;
};

(window as any).visitCommenLog = (logUrl: string) => {
  if (logUrl && logUrl !== 'null') {
    return true;
  }
  message.error({
    content: '无检查日志，请执行后在查看！',
    duration: 1,
    style: {
      marginTop: '50vh',
    },
  });
  return false;
};

// 渲染上线前版本检查是否通过
const beforeOnlineVersionCheck = (params: any) => {
  if (!params.value || params.value.length === 0) {
    return '';
  }

  const values: any = params.value[0]; // 本数组只会有一条数据
  // 解析所属端
  let side = '忽略：';
  if (values.technical_side === 'front') {
    side = '前端：';
  } else if (values.technical_side === 'backend') {
    side = '后端：';
  } else if (
    values.technical_side === 'front,backend' ||
    values.technical_side === 'backend,front'
  ) {
    side = '前后端：';
  }

  // 解析结果
  let result = '';
  let frontColor = 'black';

  // 解析时间
  let start = '';
  let end = '';

  if (values.check_status === '1') {
    result = '未开始';
  } else if (values.check_status === '2') {
    result = '执行中';
    frontColor = '#46A0FC';
  } else if (values.check_status === '3') {
    //  result = "已结束";

    if (values.check_start_time && values.check_start_time !== '-') {
      start = dayjs(values.check_start_time).format('HH:mm:ss');
    }
    if (values.check_end_time) {
      end = dayjs(values.check_end_time).format('HH:mm:ss');
    }
    if (values.check_result === '1') {
      result = '是';
      frontColor = '#2BF541';
    } else if (values.check_result === '2') {
      result = '否';
      frontColor = '#8B4513';
    }
  }

  let timeRange = '';
  if (start) {
    timeRange = end ? `${start}~${end}` : start;
  }

  const checkNum = JSON.stringify(params.data?.check_num);

  // if (side === '') {
  //   return `
  //     <div>
  //         <div style="width: 210px">
  //             <div style="font-size: 10px">
  //                 <div>
  //                   <button style="text-align: left; color: ${frontColor};width: 40px;border: none;background-color: transparent"> ${result}</button>
  //                   <lable style="margin-left: -20px">${timeRange}</lable>
  //                 </div>
  //             </div>
  //         </div>
  //     </div>
  //   `;
  // }

  // <Button  style="margin-left: -10px;border: none; background-color: transparent; font-size: small; color: #46A0FC"
  //   onclick='versionCheckLogUrlClick(${JSON.stringify(values.check_url)})'>
  //     <img src="../taskUrl.png" width="14" height="14" alt="日志" title="日志">
  //  </Button>
  // let gotoUrl = "";
  // if (values.check_url) {
  //   gotoUrl = `
  //           <a href="${values.check_url}" target={'_black'} onClick="">
  //               <img src="../taskUrl.png" width="14" height="14" alt="日志" title="日志">
  //           </a>`;
  // }
  return `
        <div>
          <div style="margin-top: -10px;margin-left: 120px">

            <Button  style="padding-bottom: 5px; margin-left: -10px; border: none; background-color: transparent; font-size: small; color: #46A0FC;cursor: pointer"
            onclick='excuteCheckData("versionCheck",${checkNum},${JSON.stringify(result)})'>
              <img src="../执行.png" width="16" height="16" alt="执行" title="执行">
            </Button>
           <Button  style="margin-left: -10px;border: none; background-color: transparent; font-size: small; color: #46A0FC;cursor: pointer"
                onclick='versionCheckLogUrlClick(${JSON.stringify(values.check_url)})'>
                <img src="../taskUrl.png" width="14" height="14" alt="日志" title="日志">
            </Button>
          </div>
          <div style="margin-top: -20px;width: 210px">
              <div style="font-size: 10px">
                  <div>${side} <button style="text-align: left;margin-left: -10px; color: ${frontColor};width: 40px;border: none;background-color: transparent"> ${result}</button>
                  <lable style="margin-left: -20px">${timeRange}</lable>
                  </div>
              </div>
          </div>
      </div>
    `;
};

// 上线前环境检查
const beforeOnlineEnvCheck = (params: any) => {
  if (!params.value || params.value.length === 0) {
    return '';
  }
  const values = params.value[0]; // 也只会有一条数据

  // 显示结果和颜色
  let result = '';
  let Color = 'black';
  if (values.ignore_check === '1') {
    // 忽略
    result = '忽略';
    Color = 'blue';
  } else if (values.ignore_check === '2') {
    // 不忽略
    if (values.check_result === null) {
      result = '未开始';
    } else if (values.check_result === 'success') {
      result = '是';
      Color = '#2BF541';
    } else if (values.check_result === 'failed') {
      result = '否';
      Color = '#8B4513';
    } else if (values.check_result === 'running') {
      result = '执行中';
      Color = '#46A0FC';
    }
  }

  // 解析时间
  let start = '';
  if (values.check_start_time) {
    start = dayjs(values.check_start_time).format('HH:mm:ss');
  }

  let end = '';
  if (values.check_end_time) {
    end = dayjs(values.check_end_time).format('HH:mm:ss');
  }

  let timeRange = '';
  if (start) {
    timeRange = end ? `${start}~${end}` : start;
  }

  const checkNum = JSON.stringify(params.data?.check_num);

  return `
        <div style="margin-top: -12px">
            <div style="margin-left: 120px" >
              <Button  style="margin-left: -10px; border: none; background-color: transparent; font-size: small; color: #46A0FC;cursor: pointer"
              onclick='excuteCheckData("envCheck",${checkNum},${JSON.stringify(result)})'>
                <img src="../执行.png" width="16" height="16" alt="执行" title="执行">
              </Button>

              <a href="${values.check_url}" target="_blank"  onclick="return visitCommenLog('${
    values.check_url
  }')" >
               <img src="../taskUrl.png" width="14" height="14" alt="日志" title="日志">
             </a>
            </div>
            <div style=" margin-top: -25px;font-size: 10px;width: 200px">
                <div><label style="color: ${Color}"> ${result}</label> &nbsp;${timeRange}</div>
            </div>

        </div>
    `;
};
// 上线前自动化检查
const beforeOnlineAutoCheck = (params: any, type: string) => {
  const values = params.value;
  if (!values) {
    return '';
  }

  let value = '';
  let Color = 'black';
  let timeRange = '';
  let checkType = '';
  let logUrl = '';
  // 解析时间
  let start = '';

  let end = '';
  values.forEach((ele: any) => {
    if (ele.check_time === type) {
      // 如果是1 ，则代表是上线前检查,如果是2 ，则代表是上线后检查
      // // 解析结果和颜色：需要判断是否忽略，是的话显示忽略，否的话继续显示状态
      if (ele.ignore_check === '1') {
        value = '忽略';
        Color = 'blue';
      } else if (ele.check_status === '1') {
        value = '未开始';
      } else if (ele.check_status === '2') {
        value = '执行中';
        Color = '#46A0FC';
      } else if (ele.check_status === '3') {
        // 检查完毕，已结束
        if (ele.check_start_time) {
          start = dayjs(ele.check_start_time).format('HH:mm:ss');
        }
        if (ele.check_end_time) {
          end = dayjs(ele.check_end_time).format('HH:mm:ss');
        }
        if (ele.check_result === '1') {
          value = '成功';
          Color = '#2BF541';
        } else if (ele.check_result === '2') {
          value = '失败';
          Color = '#8B4513';
        }
      }
      if (start) {
        timeRange = end ? `${start}~${end}` : start;
      }
      checkType = ele.check_type;
      logUrl = ele.check_log_url;
    }
  });

  // 判断是上下前检查还是上线后检查
  let title = 'afterOnlineCheck';
  if (type === '1') {
    title = 'beforeOnlineCheck';
  }

  return `
        <div style="margin-top: -10px">
            <div style="margin-left: 120px" >
              <Button  style="margin-left: -10px; border: none; background-color: transparent; font-size: small; color: #46A0FC;cursor: pointer"
              onclick='excuteCheckData(${JSON.stringify(title)},${JSON.stringify(
    params.data?.check_num,
  )},${JSON.stringify(value)})'>
                <img src="../执行.png" width="16" height="16" alt="执行" title="执行">
              </Button>
              <Button  style="margin-left: -10px;border: none; background-color: transparent; font-size: small; color: #46A0FC;cursor: pointer"
              onclick='autoLogUrlClick(${JSON.stringify(checkType)},${JSON.stringify(logUrl)})'>
                <img src="../taskUrl.png" width="14" height="14" alt="日志" title="日志">
              </Button>
            </div>
            <div style=" margin-top: -20px;font-size: 10px;width: 200px">
                <div><label style="color: ${Color}"> ${value}</label> &nbsp;${timeRange}</div>
            </div>

        </div>
    `;
};

// 上线前自动化检查
const autoCheckRenderer = (params: any) => {
  const autoValue = params.value;
  if (!autoValue || autoValue.length === 0) {
    return '';
  }

  let ignoreCheck = '';
  let ui_result = '';
  let ui_color = 'black';
  let api_result = '';
  let api_color = 'black';
  let applet_result = '';
  let applet_color = 'black';

  if (autoValue && autoValue.length > 0) {
    autoValue.forEach((ele: any) => {
      const result =
        ele.check_result === 'yes'
          ? { color: '#2BF541', value: '通过' }
          : { color: '#8B4513', value: '不通过' };

      if (ele.ignore_check === 'yes') {
        ignoreCheck = '忽略';
      } else if (ele.ignore_check === 'no' && ele.check_time === 'before') {
        if (ele.check_type === 'ui') {
          ui_result = result.value;
          ui_color = result.color;
        } else if (ele.check_type === 'api') {
          api_result = result.value;
          api_color = result.color;
        } else if (ele.check_type === 'applet') {
          applet_result = result.value;
          applet_color = result.color;
        }
      }
    });
  }

  if (ignoreCheck === '忽略') {
    return `<label style="color: blue;font-size: 10px">忽略</label>`;
  }

  return `
  <div>
      <div style="margin-top: -3px;font-size: 10px;">UI:<label style="color: ${ui_color};padding-left: 22px"> ${ui_result}</label></div>
      <div style="margin-top: -20px;font-size: 10px">接口:<label style="color: ${api_color};padding-left: 13px"> ${api_result}</label></div>
      <div style="margin-top: -20px;font-size: 10px">小程序:<label style="color: ${applet_color}"> ${applet_result}</label></div>
  </div>`;
};
// 封板状态
const sealStatusRenderer = (params: any) => {
  // console.log(params.data.ready_release_num);
  if (!params.value) {
    return `<div></div>`;
  }

  const values = params.value;
  const datas = params.data;
  // 代表只有前端或者只有后端
  if (datas.technical_side === '1' || datas.technical_side === '2') {
    let side = '';
    let status = '';
    let sideColor = 'black';
    let time = '';
    const arrayData = values[0];
    values.forEach((ele: any) => {
      if (ele.technical_side === datas.technical_side) {
        if (arrayData.technical_side === '1') {
          // 是前端
          side = '前端：';
        } else if (arrayData.technical_side === '2') {
          // 是后端
          side = '后端：';
        }
        // status = arrayData.sealing_version === '1' ? '已封版' : '未封版';
        status = arrayData.sealing_version;
        if (status === '已封版') {
          sideColor = '#2BF541';
        } else if (status === '未封版') {
          sideColor = 'orange';
        }
        time =
          arrayData.sealing_version_time === ''
            ? ''
            : dayjs(arrayData.sealing_version_time).format('HH:mm:ss');
      }
    });

    return `
          <div>
            <div style="margin-left: 100px;margin-top: -13px" >
            <img src="../执行.png" width="16" height="16" alt="执行" title="执行"
            style="margin:4px 10px 0 0;cursor: pointer"
            onclick='refreshStatus(${JSON.stringify({
              ready_release_num: params.data.ready_release_num,
              refresh_param: 'sealing_version',
            })})'/>
              <Button  style="margin-left: -10px;border: none; background-color: transparent; font-size: small; color: #46A0FC;cursor: pointer"
                onclick='showCoverStatusLog(${JSON.stringify(params.value)})'>
                  <img src="../taskUrl.png" width="14" height="14" alt="日志" title="日志" style="background-color: white;padding-top: -10px">
               </Button>
            </div>

              <div style=" font-size: 10px;background-color: transparent;margin-top: -20px" >
                   ${side} <label style="color: ${sideColor}"> ${status}</label> &nbsp;${time}
              </div>
          </div>
    `;
  }

  // 证明有前后端
  if (datas.technical_side === '3') {
    let frontValue = '';
    let frontTime = '';
    let frontColor = 'black';

    let backendValue = '';
    let backendTime = '';
    let bacnkendColor = 'black';
    values.forEach((ele: any) => {
      if (ele.technical_side === '1') {
        // 前端
        // frontValue = ele.sealing_version === '1' ? '已封版' : '未封版';
        frontValue = ele.sealing_version;
        frontTime =
          ele.sealing_version_time === '' ? '' : dayjs(ele.sealing_version_time).format('HH:mm:ss');
        if (frontValue === '已封版') {
          frontColor = '#2BF541';
        } else if (frontValue === '未封版') {
          frontColor = 'orange';
        }
      } else if (ele.technical_side === '2') {
        // 后端
        // backendValue = ele.sealing_version === '1' ? '已封版' : '未封版';
        backendValue = ele.sealing_version;
        backendTime =
          ele.sealing_version_time === '' ? '' : dayjs(ele.sealing_version_time).format('HH:mm:ss');
        if (backendValue === '已封版') {
          bacnkendColor = '#2BF541';
        } else if (backendValue === '未封版') {
          bacnkendColor = 'orange';
        }
      }
    });
    return `
          <div>
            <div style="margin-left: 100px">
            <img src="../执行.png" width="16" height="16" alt="执行" title="执行"
            style="margin:-16px 10px 0 0;cursor: pointer"
            onclick='refreshStatus(${JSON.stringify({
              ready_release_num: params.data.ready_release_num,
              refresh_param: 'sealing_version',
            })})'/>
              <Button style="margin-top: 10px; margin-left: -10px;border: none; background-color: transparent; font-size: small; color: #46A0FC;height: 25px;cursor: pointer"
                onclick='showCoverStatusLog(${JSON.stringify(params.value)})'>
                  <img src="../taskUrl.png" width="14" height="14" alt="日志" title="日志" style="margin-top: -20px" >
               </Button>
            </div>
            <div style="margin-top: -25px;font-size: 9px">
              <div>前端：<label style="color: ${frontColor}"> ${frontValue}</label> &nbsp;${frontTime}</div>
              <div style="margin-top: -20px">后端：<label style="color: ${bacnkendColor}"> ${backendValue}</label>&nbsp;${backendTime}</div>
            </div>

          </div>
    `;
  }
  return `<div></div>`;
};

// 程序分支拉取时间
const branchGitTime = (params: any) => {
  const datas = params.data;
  // if (datas.branch_front_create_time || datas.branch_create_time) {

  // 只有前端
  if (datas.technical_side === '1') {
    let values = '';
    if (datas.branch_front_create_time) {
      values = datas.branch_front_create_time;
    }
    return `
        <div style="margin-top: -20px">
            <div style=" margin-top: 20px;font-size: 10px">
                <div>前端： <label> ${values}</label> </div>
            </div>

        </div>
    `;
  }
  // 只有后端
  if (datas.technical_side === '2') {
    let values = '';
    if (datas.branch_create_time) {
      values = datas.branch_create_time;
    }
    return `
        <div style="margin-top: -20px">
            <div style=" margin-top: 20px;font-size: 10px">
                <div>后端： <label> ${values}</label> </div>
            </div>

        </div>
    `;
  }

  // 有前后端
  // if (datas.branch_front_create_time && datas.branch_create_time) {
  if (datas.technical_side === '3') {
    let front_value = '';
    if (datas.branch_front_create_time) {
      front_value = datas.branch_front_create_time;
    }

    let backend_value = '';
    if (datas.branch_create_time) {
      backend_value = datas.branch_create_time;
    }

    return `
        <div style="margin-top: -20px">
            <div style=" margin-top: 20px;font-size: 10px">
                <div>前端：<label> ${front_value}</label></div>
                <div style="margin-top: -20px">
                后端：<label  > ${backend_value}</label></div>
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
      minWidth: 90,
    },
    {
      headerName: '技术侧',
      field: 'technical_side',
      cellRenderer: (params: any) => {
        return `<span style="font-size: smaller">${getTechSide(params.value)}</span>`;
      },
    },
    {
      headerName: '单元测试运行是否通过',
      field: 'test_unit',
      cellRenderer: rendererUnitTest,
      minWidth: 170,
    },
    {
      headerName: '图标一致性检查',
      field: 'icon_check',
      minWidth: 130,
      cellRenderer: iconCheckRender,
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
      cellRenderer: autoCheckRenderer,
    },
    // {
    //   headerName: '升级后自动化检查是否通过',
    //   field: 'automation_check',
    //   minWidth: 200,
    //   cellRenderer: (param: any) => {
    //     return beforeOnlineAutoCheck(param, '2');
    //   },
    // },
    {
      headerName: '封板状态',
      field: 'branch_sealing_check',
      minWidth: 160,
      cellRenderer: sealStatusRenderer,
    },
    // {     // 暂时不显示
    //   headerName: '程序分支拉取时间',
    //   // field: 'branch_create_time',
    //   minWidth: 160,
    //   cellRenderer: branchGitTime,
    // },
    {
      headerName: '操作',
      pinned: 'right',
      field: 'branch_sealing_check',
      minWidth: 100,
      maxWidth: 100,
      cellRenderer: (params: any) => {
        const paramData = JSON.stringify(params.data).replace(/'/g, '’');
        if (paramData === '{}') {
          // 当上线分支没数据时，只显示新增按钮，其余按钮不显示
          return `
        <div style="margin-top: -5px;cursor: pointer">
            <Button  style="border: none; background-color: transparent; cursor: pointer" onclick='showOnlineBranchForm("add",${paramData})'>
              <img src="../add_1.png" width="15" height="15" alt="新增" title="新增">
            </Button>
        </div>
           `;
        }
        return `
        <div style="margin-top: -5px">
            <Button  style="border: none; background-color: transparent; cursor: pointer" onclick='showOnlineBranchForm("add",${paramData})'>
              <img src="../add_1.png" width="15" height="15" alt="新增" title="新增">
            </Button>
             <Button  style="border: none; background-color: transparent;cursor: pointer;  margin-left: -10px; " onclick='showOnlineBranchForm("modify",${paramData})'>
              <img src="../edit.png" width="15" height="15" alt="修改" title="修改">
            </Button>
            <Button  style="border: none; background-color: transparent; margin-left: -10px ; cursor: pointer" onclick='deleteGridRows(4,${paramData})'>
              <img src="../delete_2.png" width="15" height="15" alt="删除" title="删除">
            </Button>
        </div>
           `;
      },
    },
  ];
  return firstOnlineBranchColumn;
};

export { getOnlineBranchColumns };
