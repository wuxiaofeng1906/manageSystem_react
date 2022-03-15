import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {useRequest} from 'ahooks';
import {Card, Button, message, Form, Select, Row, Col, InputNumber, Spin, TreeSelect} from 'antd';
import {
  getZentaoUserSelect, getPositionSelect, getExcuteTypeForTree, getExcutionForTree
} from './component';
import {excuteDistributeOperate, saveDistributeOperate} from './excute';
import {getDistributeDetails, getExcuteLogs} from './axiosRequest';

const {SHOW_PARENT} = TreeSelect;
let performID = -1; // 用于记录全局的保存记录ID，在页面加载时和保存后赋值，保存和执行时需要使用

// 组件初始化
const PeopleExcuteSetting: React.FC<any> = () => {

  /* region 下拉列表 */
  // 人员列表
  const zentaoUserList = useRequest(() => getZentaoUserSelect()).data;
  // 职位
  const positionsList = useRequest(() => getPositionSelect()).data;
  // 分配执行类型
  const disExcuteTypeTreeData = useRequest(() => getExcuteTypeForTree("distribute")).data;
  // 排除执行类型
  const ExExcuteTypeListTreeData = useRequest(() => getExcuteTypeForTree("exclude")).data;
  // 已经保存的分配详情
  const distributeDetails = useRequest(() => getDistributeDetails()).data;

  /* endregion */

  const [formForExcuteSetting] = Form.useForm();
  const [excuteState, setExcuteState] = useState(false); // 点击执行后的状态（是否执行完）
  const [logHeight, setLogHeight] = useState((window.innerHeight) - 270);


  // 日志显示
  const [logs, setLogs] = useState(<div></div>);
  const showLogs = (logData: any) => {
    if (!logData || logData.length === 0) {
      return;
    }
    const logsArray: any = [];
    logData.forEach((log: string, index: number) => {
      const logInfo = log.split("->");
      let fontColor = "black";
      if (logInfo[1] === "失败") {
        fontColor = "red";
      }
      logsArray.push(
        <p>
          <label id="title">{index + 1}. {logInfo[0]}{"->"}</label>
          <label id="result" style={{color: fontColor}}>{logInfo[1]}</label>
        </p>
      );
    });
    setLogs(<div>{logsArray}</div>);
    setExcuteState(false);
  };

  // 执行权限分配
  const excuteAuthorityDistribute = async () => {
    setLogs(<div></div>);
    setExcuteState(true);
    // 获取界面上配置的属性值。
    const formData = formForExcuteSetting.getFieldsValue();

    // 第一步，调用保存接口保存设置的数据。
    const saveResult = await saveDistributeOperate(formData, performID);
    if (saveResult.message !== "") {
      setExcuteState(false);
      message.error({
        content: saveResult.message,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return;
    }
    performID = saveResult.performID;

    // 第二步，调用执行接口
    const excuteResult = await excuteDistributeOperate(formData, performID);
    if (excuteResult.message !== "") {
      setExcuteState(false);
      message.error({
        content: excuteResult.message,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }

    // 第三步，根据执行接口返回的id再获取执行日志，延时执行。因为有时候项目太多执行时间有延时。。
    setTimeout(async () => {
      const logResult = await getExcuteLogs((excuteResult.distributionNum).toString());

      if (JSON.stringify(logResult) !== "{}") {
        if (logResult.message !== "") {
          setExcuteState(false);
          message.error({
            content: logResult.message,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
          return;
        }

        showLogs(logResult?.data);
      }

    }, 2000);
  };

  // 点击保存
  const saveExcute = async () => {
    const formData = formForExcuteSetting.getFieldsValue();
    const saveResult = await saveDistributeOperate(formData, performID);

    if (saveResult.message === "") {
      performID = saveResult.performID;
      message.info({
        content: "保存成功！",
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    } else {
      message.error({
        content: saveResult.message,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }
  };

  /* region 需要根据执行类型动态更新执行下拉框的数据 */
  const [excute, setExcute] = useState({
    distributeExcute: [],// 分配
    excludeExcute: [] // 排除
  });

  // 获取执行下拉框列表
  const getExcuteSelect = async (changedData: any) => {

    let typeData = "all";
    if (changedData && changedData.length > 0) {
      const typeId: any = [];
      changedData.forEach((types: any) => {
        typeId.push(types.split("&")[0]);
      });
      typeData = typeId.join();
    }
    const selectData = await getExcutionForTree(typeData);

    return selectData;
  };

  // 分配执行类型下拉框选项变化
  const disExcuteTypeChanged = async () => {

    const disExcuteTypeData = formForExcuteSetting.getFieldValue("distributeExcuteType");
    const selectData = await getExcuteSelect(disExcuteTypeData);
    setExcute({
      ...excute,
      distributeExcute: selectData
    });
  };

  // 分配执行下拉框选择
  const distributeExcuteChange = () => {
    // const disExcuteData = formForExcuteSetting.getFieldValue("distributeExcute");
    //
    // // 如果选中全部之后，其他项不能进行选择(disExcuteTypeData.length = 1,表示里面只有一个全部选项)
    // if (currentValue.key === "all" && disExcuteData.length > 1) {
    //   const noAllArray: any = [];
    //   //   判断选择框内是否有其他除了全部以外的项目。
    //   disExcuteData.forEach((ele: any) => {
    //     const ty_dt = ele.split("&");
    //     if (ty_dt[0] !== "all") {
    //       noAllArray.push(ele);
    //     }
    //   });
    //
    //   if (noAllArray.length > 0) {
    //     message.error({
    //       content: " ”全部“选项和其他具体项目不能同时存在！",
    //       duration: 1,
    //       style: {
    //         marginTop: '50vh',
    //       },
    //     });
    //     formForExcuteSetting.setFieldsValue({
    //       distributeExcute: noAllArray
    //     });
    //   }
    //
    // } else {
    //   // 需要判断原有数据中有没有包含全部选项，如果有的话，则提醒不能添加其他项目
    //   const noAllArray: any = [];
    //   const allArray: any = [];
    //   //   判断选择框内是否有其他除了全部以外的项目。
    //   disExcuteData.forEach((ele: any) => {
    //     const ty_dt = ele.split("&");
    //     if (ty_dt[0] === "all") {
    //       allArray.push(ele);
    //     } else {
    //       noAllArray.push(ele);
    //     }
    //   });
    //
    //   if (noAllArray.length > 0 && allArray.length > 0) {
    //     message.error({
    //       content: "”全部“选项和其他具体项目不能同时存在！",
    //       duration: 1,
    //       style: {
    //         marginTop: '50vh',
    //       },
    //     });
    //
    //     formForExcuteSetting.setFieldsValue({
    //       distributeExcute: allArray
    //     });
    //
    //   }
    // }
  };

  // 排除执行类型下拉框选项变化
  const excExcuteTypeChanged = async () => {
    const excExcuteTypeData = formForExcuteSetting.getFieldValue("excludeExcuteType");

    let changeFlage = true;

    if (excExcuteTypeData && excExcuteTypeData.length > 1) {

      for (let index = 0; index < excExcuteTypeData.length; index += 1) {
        if ((excExcuteTypeData[index].toString()).indexOf("空") > -1) {
          message.error({
            content: " ”空“选项和其他具体项目不能同时存在！",
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
          changeFlage = false;
          formForExcuteSetting.setFieldsValue({
            excludeExcuteType: `''&空`
          });
          break;
        }
      }
    }

     if(changeFlage){
      const selectData = await getExcuteSelect(excExcuteTypeData);
      setExcute({
        ...excute,
        excludeExcute: selectData
      });
    }


  };

  // 排除执行下拉框选择
  const excludeExcuteChanged = () => {
    // const exExcuteData = formForExcuteSetting.getFieldValue("excludeExcute");
    //
    // // 如果选中全部之后，其他项不能进行选择(disExcuteTypeData.length = 1,表示里面只有一个全部选项)
    // if (currentValue.key === "all" && exExcuteData.length > 1) {
    //   const noAllArray: any = [];
    //   //   判断选择框内是否有其他除了全部以外的项目。
    //   exExcuteData.forEach((ele: any) => {
    //     const ty_dt = ele.split("&");
    //     if (ty_dt[0] !== "all") {
    //       noAllArray.push(ele);
    //     }
    //   });
    //
    //   if (noAllArray.length > 0) {
    //     message.error({
    //       content: " ”全部“选项和其他具体项目不能同时存在！",
    //       duration: 1,
    //       style: {
    //         marginTop: '50vh',
    //       },
    //     });
    //     formForExcuteSetting.setFieldsValue({
    //       excludeExcute: noAllArray
    //     });
    //   }
    //
    // } else {
    //   // 需要判断原有数据中有没有包含全部选项，如果有的话，则提醒不能添加其他项目
    //   const noAllArray: any = [];
    //   const allArray: any = [];
    //   //   判断选择框内是否有其他除了全部以外的项目。
    //   exExcuteData.forEach((ele: any) => {
    //     const ty_dt = ele.split("&");
    //     if (ty_dt[0] === "all") {
    //       allArray.push(ele);
    //     } else {
    //       noAllArray.push(ele);
    //     }
    //   });
    //
    //   if (noAllArray.length > 0 && allArray.length > 0) {
    //     message.error({
    //       content: "”全部“选项和其他具体项目不能同时存在！",
    //       duration: 1,
    //       style: {
    //         marginTop: '50vh',
    //       },
    //     });
    //
    //     formForExcuteSetting.setFieldsValue({
    //       excludeExcute: allArray
    //     });
    //
    //   }
    // }
  };

  /* endregion  */

  /* region 页面初始化显示  */
  // 页面数据显示
  const showPagesData = async () => {
    if (distributeDetails && distributeDetails.data && JSON.stringify(distributeDetails.data) !== "{}") {

      const disData = distributeDetails.data;
      performID = disData.perform_id;
      // 显示分配执行类型的值
      const disExcuteType: any = [];
      if ((disData.to_perform_type).length > 0) {
        const excuteType: any = disData.to_perform_type;
        excuteType.forEach((types: any) => {
          if (types.to_perform_type_id === "all") {
            disExcuteType.push(`${types.to_perform_type_id}&全部`);
          } else {
            disExcuteType.push(`${types.to_perform_type_id}&${types.to_perform_type}`);
          }
        });

      }
      // 显示分配执行的值
      const disExcute: any = [];// 分配执行
      if ((disData.to_perform).length > 0) {
        const excuteID: any = disData.to_perform;
        excuteID.forEach((id: any) => {
          if (id.project_id === "all") {
            disExcute.push(`${id.project_id}&全部`);
          } else {
            disExcute.push(`${id.project_id}&${id.project_name}`);
          }
        });
      }
      // 显示排除执行类型的值
      const exExcuteType: any = [];//
      if ((disData.out_perform_type).length > 0) {
        const outType: any = disData.out_perform_type;
        outType.forEach((types: any) => {
          if (types.out_perform_type_id === "''") {
            exExcuteType.push(`${types.out_perform_type_id}&空`);
          } else {
            exExcuteType.push(`${types.out_perform_type_id}&${types.out_perform_type}`);
          }
        });
      } else {
        exExcuteType.push("''&空");
      }
      // 显示排除执行的值
      const exExcute = [];//
      if ((disData.out_perform).length > 0) {
        const outID: any = disData.out_perform;
        outID.forEach((id: any) => {
          exExcute.push(`${id.project_id}&${id.project_name}`);
        });
      } else {
        exExcute.push("all&全部");
      }

      //  分配执行和排除执行下拉框选项需要根据类型的值重新加载
      setExcute({
        distributeExcute: await getExcuteSelect(disExcuteType),// 分配
        excludeExcute: await getExcuteSelect(exExcuteType)// 排除
      });

      // 有数据的显示
      formForExcuteSetting.setFieldsValue({
        position: disData.position,
        workDay: disData.work_days,
        workHours: disData.work_hours,
        distributeExcuteType: disExcuteType, // 分配执行类型
        distributeExcute: disExcute, // 分配执行
        excludeExcuteType: exExcuteType,
        excludeExcute: exExcute,
      });

    } else { // 无数据的东西
      formForExcuteSetting.setFieldsValue({
        position: "研发",
        workDay: 720,
        workHours: 8,
        distributeExcuteType: "all&全部",
        distributeExcute: "all&全部",
        excludeExcuteType: "''&空",
        excludeExcute: "''&空",
      });
    }
  };

  useEffect(() => {
    showPagesData();
  }, [distributeDetails]);

  /* endregion  页面初始化显示 */
  // 根据页面调整日志窗口的大小。
  window.onresize = function () {
    setLogHeight((window.innerHeight) - 270);
  };

  return (
    <PageContainer style={{marginTop: -30}}>
      <Spin spinning={excuteState} tip="执行中..." size={"large"}>
        <div style={{marginTop: -20}}>
          <div>
            <Form form={formForExcuteSetting}>
              <Row>
                <Col span={7}>
                  <Form.Item label="人员选择" name="usersName" required={true}>
                    <Select mode="multiple" showSearch style={{width: '100%'}}
                    >
                      {zentaoUserList}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="职位" name="position" required={true}>
                    <Select style={{width: '100%'}} showSearch>
                      {positionsList}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="可用工日[天]" name="workDay" required={true}>
                    <InputNumber style={{width: '100%'}} min={1}/>
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="可用工时/天" name="workHours" required={true}>
                    <InputNumber style={{width: '100%'}} min={1}/>
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Button
                    type="primary"
                    style={{
                      color: '#46A0FC', backgroundColor: '#ECF5FF',
                      borderRadius: 5, marginLeft: 10,
                      marginTop: 3, minWidth: "110px", width: "100%"
                    }}
                    onClick={excuteAuthorityDistribute}>

                    执行权限分配
                  </Button>
                </Col>

              </Row>
              <Row style={{marginTop: -20}}>
                <Col span={11}>
                  <Form.Item label="分配执行类型筛选" name="distributeExcuteType" required={true}>
                    <TreeSelect
                      showSearch
                      style={{width: '100%'}}
                      treeCheckable={true}
                      dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                      allowClear
                      treeDefaultExpandAll
                      treeData={disExcuteTypeTreeData}
                      showCheckedStrategy={SHOW_PARENT}
                      maxTagCount={'responsive'}
                      onChange={disExcuteTypeChanged}
                    >
                    </TreeSelect>

                  </Form.Item>
                  <Form.Item label="排除执行类型筛选" name="excludeExcuteType" style={{marginTop: -20, marginLeft: 12}}>
                    <TreeSelect
                      showSearch
                      style={{width: '100%'}}
                      treeCheckable={true}
                      dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                      allowClear
                      treeDefaultExpandAll
                      treeData={ExExcuteTypeListTreeData}
                      showCheckedStrategy={SHOW_PARENT}
                      maxTagCount={'responsive'}
                      onChange={excExcuteTypeChanged}
                    >
                    </TreeSelect>

                  </Form.Item>
                </Col>

                <Col span={10}>
                  <Form.Item label="分配执行" name="distributeExcute" required={true}>
                    <TreeSelect
                      showSearch
                      style={{width: '100%'}}
                      treeCheckable={true}
                      dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                      allowClear
                      treeDefaultExpandAll
                      treeData={excute.distributeExcute}
                      showCheckedStrategy={SHOW_PARENT}
                      maxTagCount={'responsive'}
                      onChange={distributeExcuteChange}
                    >
                    </TreeSelect>

                  </Form.Item>
                  <Form.Item label="排除执行" name="excludeExcute" style={{marginTop: -20, marginLeft: 12}}>
                    <TreeSelect
                      showSearch
                      style={{width: '100%'}}
                      treeCheckable={true}
                      dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                      allowClear
                      treeDefaultExpandAll
                      treeData={excute.excludeExcute}
                      showCheckedStrategy={SHOW_PARENT}
                      maxTagCount={'responsive'}
                      onChange={excludeExcuteChanged}
                    >
                    </TreeSelect>

                  </Form.Item>
                </Col>

                <Col span={3}>

                  <Button
                    type="primary"
                    style={{
                      color: '#46A0FC', backgroundColor: '#ECF5FF',
                      borderRadius: 5, marginLeft: 10,
                      marginTop: 10, height: 50, minWidth: "110px", width: "100%"
                    }} onClick={saveExcute}>
                    点击保存
                  </Button>

                </Col>
              </Row>

            </Form>
          </div>
          {/* 执行日志 */}
          <Card size="small" title="执行日志"
                style={{width: '100%', height: logHeight, marginTop: -20, overflow: "scroll"}}>
            {logs}
          </Card>
        </div>
      </Spin>

    </PageContainer>
  );
};


export default PeopleExcuteSetting;
