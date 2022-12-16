import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'ahooks';
import {
  Button,
  DatePicker,
  Checkbox,
  Card,
  message,
  Table,
  Modal,
  Form,
  Select,
  Row,
  Col,
  Divider,
  Input,
} from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import dayjs from 'dayjs';
import { getAllProject } from '@/publicMethods/verifyAxios';
import {
  loadUserSelect,
  loadPrjNameSelect,
  loadPrjTypeSelect,
  loadBanchSelect,
  loadEnvironmentSelect,
  loadAllUserSelect,
} from './data/selector';
import {
  queryDutyCardInfo,
  getPlanDetails,
  sendMessageToApi,
  submitModifyData,
} from './data/axiosApi';
import { judgeAuthorityByName } from '@/publicMethods/authorityJudge';
import { errorMessage, sucMessage } from '@/publicMethods/showMessages';
import { parseSaveCardData } from './data/cardDataAlaysis';

const { RangePicker } = DatePicker;
// 已选中的事件
const selectedProject: any = [];
// 保存被修改项的相关ID，用于修改时
const oldDutyTask = {
  personNum: '',
  firstFrontId: '',
  secondFrontId: '',
  firstBackendId: '',
  secondBackendId: '',
  firstTesterId: '',
  secondTesterId: '',
  firstFlowId: '',
  secondFlowId: '',
  firstSQAId: '',
  secondSQAId: '',
  firstGlobalId: '',
  secondGlobalId: '',
  firstOpenApiId: '',
  secondOpenApiId: '',
  firstQbosStoreId: '',
  secondQbosStoreId: '',
  firstJsfId: '',
  secondJsfId: '',
  firstDevopsId: '',
  secondDevopsId: '',
  firstEmitterId: '',
  secondEmitterId: '',
};
// 保存需要被删除的数据
const deletedData: any = [];
const DutyPlan: React.FC<any> = () => {
  /* region useState定义 */

  // 查询条件
  const [choicedCondition, setChoicedCondition] = useState({ start: '', end: '' });
  // 值班人员动态Card
  const [dutyCard, setDutyCart] = useState(<div></div>);
  // 弹出层是否可见
  const [isPlanVisble, setIsPlanVisble] = useState(false);
  // 动态生成的弹出层表单
  const [projects, setProjects] = useState([
    {
      prjName: '',
      prjType: '',
      branch: '',
      testEnv: '',
      upgradeEnv: '',
      prjManager: '',
      planGrayTime: '',
      planOnlineTime: '',
      proId: '',
      managerId: '',
    },
  ]);
  // 值班人下拉框
  const [allUsers, setAllUsers] = useState({
    front: [],
    backend: [],
    tester: [],
    flow: [],
    SQA: [],
    my_global: [],
    openApi: [],
    qbos_store: [],
    jsf: [],
    devops: [],
    emitter: [],
  });
  // 动态表单的下拉框
  const [projectInfo, setProjectInfo] = useState({
    prjName: [],
    prjType: [],
    branch: [],
    testEnv: [],
    upgradeEnv: [],
  });

  /* endregion */

  /* region 消息推送事件 */

  // 勾选需要推送的值班计划
  const onPlanChanged = (params: any) => {
    const selectedId = params.target.id;
    const isChecked = params.target.checked;
    if (isChecked) {
      selectedProject.push(selectedId);
    } else {
      // 如果取消掉则设置为空
      selectedProject.forEach(function (item: any, index: any, arr: any) {
        if (item === selectedId) {
          arr.splice(index, 1);
        }
      });
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (selectedProject.length === 0) {
      //   提醒选中一条
      errorMessage('请选中你要推送的数据！');
      return;
    }

    if (selectedProject.length > 1) {
      errorMessage('一次只能推送一条数据！');
      return;
    }

    const sendResult = await sendMessageToApi(selectedProject[0]);
    if (sendResult) {
      errorMessage(sendResult.toString());
    } else {
      sucMessage('消息推送成功！');
    }
  };
  /*  endregion */

  /* region 弹出项目框相关事件 */

  const [formForPlanModify] = Form.useForm();
  const showExitData = (hisData: any) => {
    // 值班人详细信息显示
    const userData = hisData.user;
    if (userData) {
      // 用于保存修改时需要用到的字段
      oldDutyTask.personNum = userData[0].person_num;
      formForPlanModify.setFieldsValue({
        ...formForPlanModify,
        dutyTime: [moment(userData[0].duty_start_time), moment(userData[0].duty_end_time)],
      });

      userData.forEach((users: any) => {
        let usersAccount = null;
        if (users.user_name === '免') {
          usersAccount = `""&免`;
        } else if (users.user_id) {
          usersAccount = `${users.user_id}&${users.user_name}`;
        }

        switch (users.user_tech) {
          case '前端':
            if (users.duty_order === '1') {
              oldDutyTask.firstFrontId = users.person_id;

              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                firstFront: usersAccount,
              });
            } else {
              oldDutyTask.secondFrontId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                secondFront: usersAccount,
              });
            }
            break;
          case '后端':
            if (users.duty_order === '1') {
              oldDutyTask.firstBackendId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                firstBackend: usersAccount,
              });
            } else {
              oldDutyTask.secondBackendId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                secondBackend: usersAccount,
              });
            }
            break;
          case '测试':
            if (users.duty_order === '1') {
              oldDutyTask.firstTesterId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                firstTester: usersAccount,
              });
            } else {
              oldDutyTask.secondTesterId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                secondTester: usersAccount,
              });
            }
            break;
          case '流程':
            if (users.duty_order === '1') {
              oldDutyTask.firstFlowId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                firstFlow: usersAccount,
              });
            } else {
              oldDutyTask.secondFlowId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                secondFlow: usersAccount,
              });
            }
            break;
          case 'SQA':
            if (users.duty_order === '1') {
              oldDutyTask.firstSQAId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                firstSQA: usersAccount,
              });
            } else {
              oldDutyTask.secondSQAId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                secondSQA: usersAccount,
              });
            }
            break;
          case 'global':
            if (users.duty_order === '1') {
              oldDutyTask.firstGlobalId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                firstGlobal: usersAccount,
              });
            } else {
              oldDutyTask.secondGlobalId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                secondGlobal: usersAccount,
              });
            }
            break;
          case 'openapi':
            if (users.duty_order === '1') {
              oldDutyTask.firstOpenApiId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                firstOpenApil: usersAccount,
              });
            } else {
              oldDutyTask.secondOpenApiId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                secondOpenApi: usersAccount,
              });
            }
            break;
          case 'qbos与store':
            if (users.duty_order === '1') {
              oldDutyTask.firstQbosStoreId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                firstQbosStore: usersAccount,
              });
            } else {
              oldDutyTask.secondQbosStoreId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                secondQbosStore: usersAccount,
              });
            }
            break;
          case 'jsf':
            if (users.duty_order === '1') {
              oldDutyTask.firstJsfId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                firstJsf: usersAccount,
              });
            } else {
              oldDutyTask.secondJsfId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                secondJsf: usersAccount,
              });
            }
            break;
          case '运维':
            if (users.duty_order === '1') {
              oldDutyTask.firstDevopsId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                firstDevops: usersAccount,
              });
            } else {
              oldDutyTask.secondDevopsId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                secondDevops: usersAccount,
              });
            }
            break;
          case 'emitter':
            if (users.duty_order === '1') {
              oldDutyTask.firstEmitterId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                firstEmitter: usersAccount,
              });
            } else {
              oldDutyTask.secondEmitterId = users.person_id;
              formForPlanModify.setFieldsValue({
                ...formForPlanModify,
                secondEmitter: usersAccount,
              });
            }
            break;
          default:
            break;
        }
      });
    }

    // 项目详细信息显示
    const projectData = hisData.project;
    if (projectData.length === 0) {
      const emptyValue = [
        {
          prjName: '',
          prjType: '',
          branch: '',
          testEnv: '',
          upgradeEnv: '',
          prjManager: '',
          managerId: '',
          planGrayTime: '',
          planOnlineTime: '',
          proId: '',
        },
      ];
      formForPlanModify.setFieldsValue({ projects: emptyValue });
      setProjects(emptyValue);
      return;
    }

    const detailsInfo: any = [];
    projectData.forEach((dts: any) => {
      detailsInfo.push({
        prjName: `${dts.project_id}&${dts.project_name}`,
        prjType: dts.project_type,
        branch: dts.project_branch,
        testEnv: dts.project_test_environment,
        upgradeEnv: dts.project_upgrade_environment,
        prjManager: dts.project_head,
        managerId: dts.project_head_id,
        planGrayTime: dts.project_plan_gray_time === '' ? null : moment(dts.project_plan_gray_time),
        planOnlineTime:
          dts.project_plan_online_time === '' ? null : moment(dts.project_plan_online_time),
        proId: dts.pro_id,
      });
    });
    formForPlanModify.setFieldsValue({ projects: detailsInfo });
    setProjects(detailsInfo);
  };
  // 表格双击事件
  const doubleClickRow = async (tableData: any) => {
    /* region 显示已有数据  */
    const hisData = await getPlanDetails(tableData[0].person_num);
    if (hisData.message) {
      errorMessage(hisData.message.toString());
      return;
    }
    showExitData(hisData.datas);
    /* endregion  */
    setIsPlanVisble(true);

    /* region 下拉框中选项加载  */
    // 生成值班人下拉框
    const frontUserInfo = await loadUserSelect('1');
    const backendUserInfo = await loadUserSelect('2');
    const testerUserInfo = await loadUserSelect('3');
    const sqaUserInfo = await loadUserSelect('7');
    const wx_allUsers = await loadAllUserSelect();
    // const openApiUserInfo = await loadUserSelect("10");
    // const abosStoreUserInfo = await loadUserSelect("11");
    // const jsfUserInfo = await loadUserSelect("12");
    setAllUsers({
      front: frontUserInfo,
      backend: backendUserInfo,
      tester: testerUserInfo,
      flow: backendUserInfo,
      SQA: sqaUserInfo,
      my_global: wx_allUsers,
      openApi: wx_allUsers,
      qbos_store: wx_allUsers,
      jsf: wx_allUsers,
      devops: wx_allUsers,
      emitter: wx_allUsers,
    });

    // 生成项目名称、项目类型、对应分支、对应测试环境、对应升级环境、项目负责人的下拉框
    const projectName = await loadPrjNameSelect();
    const projectType = await loadPrjTypeSelect();
    const branchs = await loadBanchSelect();
    const environment = await loadEnvironmentSelect();

    setProjectInfo({
      prjName: projectName,
      prjType: projectType,
      branch: branchs,
      testEnv: environment,
      upgradeEnv: environment,
    });
    /* endregion  */
  };

  // 弹出层取消
  const planModalCancel = () => {
    setIsPlanVisble(false);
  };

  // 新增项目
  const addProject = () => {
    const exitDatas = formForPlanModify.getFieldsValue();
    const addValue = exitDatas.projects;
    addValue.push({
      prjName: '',
      prjType: '',
      branch: '',
      testEnv: '',
      upgradeEnv: '',
      prjManager: '',
      planGrayTime: '',
      planOnlineTime: '',
      proId: '',
      managerId: '',
    });

    formForPlanModify.setFieldsValue({
      projects: addValue,
    });
    return setProjects(addValue);
  };

  // 删除项目
  const delProject = (index: any) => {
    if (projects.length === 1) {
      errorMessage('删除失败:至少需要保留一个项目!');
      return;
    }
    const delData = projects[index];
    // 如果被删除的有数据
    if (delData.prjName.split('&')[0]) {
      deletedData.push({
        pro_id: delData.proId, // project id  新增的时候不需要这个id（为空的时候则不需要）
        person_num: oldDutyTask.personNum, // 值班计划编号
        project_id: delData.prjName.split('&')[0], // 项目id
        project_name: delData.prjName.split('&')[1], // 项目名称
        project_type: delData.prjType, // 项目类型
        project_branch: delData.branch, // 对应分支
        project_test_environment: delData.testEnv, // 对应测试环境
        project_upgrade_environment: delData.upgradeEnv, // 对应升级环境
        project_head: delData.prjManager, // 项目负责人
        project_head_id: delData.managerId, // 项目负责人
        project_plan_gray_time: moment(delData.planGrayTime).format('YYYY/MM/DD'), // 计划灰度时间
        project_plan_online_time: moment(delData.planOnlineTime).format('YYYY/MM/DD'), // 计划上线时间
        project_index: (index + 1).toString(), // 界面展示序号
        is_delete: 1, // 是否删除
      });
    }

    formForPlanModify.setFieldsValue({
      projects: [...projects.slice(0, index), ...projects.slice(index + 1)],
    });
    setProjects([...projects.slice(0, index), ...projects.slice(index + 1)]);
  };

  // 根据项目获取负责人
  const getProjectManager = async (project: any) => {
    let returnUser: any = {};

    const proInfo: any = {
      proId: project.split('&')[0],
      proName: project.split('&')[1],
    };

    const projectsInfo = await getAllProject();

    if (projectsInfo.message !== '') {
      errorMessage(projectsInfo.message.toString());
    } else if (projectsInfo.data) {
      const datas = projectsInfo.data;
      for (let index = 0; index < datas.length; index += 1) {
        const ele: any = datas[index];
        if (ele.project_id.toString() === proInfo.proId && ele.project_name === proInfo.proName) {
          returnUser = ele.user;
          break;
        }
      }
    }
    return returnUser;
  };

  // selected 选择事件
  const onPrjTypeChanged = async (index: any, name: any, event: any) => {
    try {
      const dutyInfo = formForPlanModify.getFieldsValue();
      const dutyProject = dutyInfo.projects;
      const tempArray = [...dutyProject];
      if (name === 'prjType' && (event === '2' || event === '3')) {
        // 如果是班车项目,则自动获取上面的后端负责人填入项目负责人选择框
        let firstBackend = '';
        if (dutyInfo.firstBackend) {
          firstBackend = dutyInfo.firstBackend.split('&');
        }
        tempArray[index] = {
          ...tempArray[index],
          managerId: firstBackend[0],
          prjManager: firstBackend[1],
        };
      } else {
        const project = dutyProject[index].prjName;
        const principal = await getProjectManager(project);
        tempArray[index] = {
          ...tempArray[index],
          managerId: principal.user_id,
          prjManager: principal.user_name,
        };
      }

      formForPlanModify.setFieldsValue({
        projects: tempArray,
      });
    } catch (e) {
      errorMessage(`抛出异常：${e.toString()}`);
    }
  };
  // 动态生成项目组件
  const projectItems = projects.map((item: any, index: any) => {
    // 获取项目序号
    const numChar = {
      1: '①',
      2: '②',
      3: '③',
      4: '④',
      5: '⑤',
      6: '⑥',
      7: '⑦',
      8: '⑧',
      9: '⑨',
      10: '⑩',
    };
    const order = `${numChar[index + 1]} 项目名称`;

    return (
      <div>
        <div>
          <Form.Item label={order} name={['projects', index, 'prjName']} style={{ marginLeft: -5 }}>
            <Select style={{ width: '93%', marginLeft: 27 }} showSearch>
              {projectInfo.prjName}
            </Select>
          </Form.Item>

          <Form.Item
            label="项目类型"
            name={['projects', index, 'prjType']}
            style={{ marginTop: -20, marginLeft: 13 }}
          >
            <Select
              style={{ width: '93%', marginLeft: 27 }}
              showSearch
              onChange={(event) => onPrjTypeChanged(index, 'prjType', event)}
            >
              {projectInfo.prjType}
            </Select>
          </Form.Item>

          <Form.Item
            label="对应分支"
            name={['projects', index, 'branch']}
            style={{ marginTop: -20, marginLeft: 13 }}
          >
            <Select style={{ width: '93%', marginLeft: 27 }} showSearch>
              {projectInfo.branch}
            </Select>
          </Form.Item>

          <Form.Item
            label="对应测试环境"
            name={['projects', index, 'testEnv']}
            style={{ marginTop: -20, marginLeft: 13 }}
          >
            <Select style={{ width: '100%' }} showSearch>
              {projectInfo.testEnv}
            </Select>
          </Form.Item>

          <Form.Item
            label="对应升级环境"
            name={['projects', index, 'upgradeEnv']}
            style={{ marginTop: -20, marginLeft: 13 }}
          >
            <Select style={{ width: '100%' }} showSearch>
              {projectInfo.upgradeEnv}
            </Select>
          </Form.Item>

          <Form.Item
            label="项目负责人"
            name={['projects', index, 'prjManager']}
            style={{ marginTop: -20, marginLeft: 13 }}
          >
            <Input style={{ width: '96%', marginLeft: 14, color: 'black' }} disabled />
          </Form.Item>

          <Form.Item
            label="计划灰度时间"
            name={['projects', index, 'planGrayTime']}
            style={{ marginTop: -20, marginLeft: 13 }}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="计划上线时间"
            name={['projects', index, 'planOnlineTime']}
            style={{ marginTop: -20, marginLeft: 13 }}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="修改需要"
            name={['projects', index, 'proId']}
            style={{ display: 'none' }}
          >
            <Input style={{ width: 40 }} />
          </Form.Item>
          <Form.Item
            label="修改需要"
            name={['projects', index, 'managerId']}
            style={{ display: 'none' }}
          >
            <Input style={{ width: 40 }} />
          </Form.Item>

          {/* 增加和删除操作 */}
          <Form.Item style={{ marginLeft: 17, marginTop: -30, marginBottom: -10 }}>
            <table>
              <tr>
                <td>
                  <Button
                    style={{ border: 'none', color: '#D0D0D0', marginLeft: -15 }}
                    onClick={() => addProject()}
                    icon={<PlusOutlined />}
                  />
                </td>
                <td>
                  <Divider style={{ width: '410px' }}></Divider>
                </td>
                <td>
                  <Button
                    style={{ border: 'none', color: '#D0D0D0' }}
                    onClick={() => delProject(index)}
                    icon={<MinusOutlined />}
                  />
                </td>
              </tr>
            </table>
          </Form.Item>
        </div>
      </div>
    );
  });

  /* endregion */

  /* region 保存数据，并刷新界面 */
  const makeCardsDiv = (oraData: any) => {
    const columns: any = [
      {
        title: '所属端',
        dataIndex: 'user_tech',
        align: 'center',
        width: 90,
      },
      {
        title: '姓名',
        dataIndex: 'user_name',
        align: 'center',
        width: 160,
      },
    ];
    const cardDiv: any = [];
    const tdArray: any = [];
    if (!oraData) {
      return [];
    }
    oraData.forEach((ele_data: any, index: number) => {
      const startTime = ele_data[0].duty_start_time;
      const endTime = ele_data[0].duty_end_time;
      let border_color = {};
      if (
        dayjs(startTime).format('YYYY-MM-DD') <= dayjs().format('YYYY-MM-DD') &&
        dayjs().format('YYYY-MM-DD') <= dayjs(endTime).format('YYYY-MM-DD')
      ) {
        border_color = { border: '2px solid #46A0FC' };
      }
      tdArray.push(
        <td>
          <Card
            size="small"
            title={`${startTime}~${endTime}`}
            headStyle={{ textAlign: 'center' }}
            extra={<Checkbox id={`${ele_data[0].person_num}`} onChange={onPlanChanged}></Checkbox>}
            style={border_color}
          >
            <Table
              style={{ marginTop: -10 }}
              size="small"
              columns={columns}
              dataSource={ele_data}
              bordered
              showHeader={false}
              pagination={false}
              onRow={() => {
                return {
                  onDoubleClick: () => {
                    if (judgeAuthorityByName('modifyDutyPlanData') === true) {
                      doubleClickRow(ele_data);
                    }
                  },
                };
              }}
            />
          </Card>
        </td>,
      );

      if ((index + 1) % 5 === 0 || oraData.length - 1 === index) {
        const test = tdArray.map((current: any) => {
          return current;
        });
        cardDiv.push(<tr>{test} </tr>);
        tdArray.length = 0;
      }
    });

    return cardDiv;
  };

  // 界面刷新
  const refreshData = async (startTime: string, endTime: string) => {
    const queryData = await queryDutyCardInfo({
      start: startTime,
      end: endTime,
    });

    if (queryData.message) {
      errorMessage(queryData.message.toString());
      return;
    }

    const newCardDiv = makeCardsDiv(queryData.datas);
    setDutyCart(newCardDiv);
  };

  // 两个为一组。只要一组数据完整，就可以保存
  const checkInputData = (data: any) => {
    const {
      firstFront,
      secondFront,
      firstBackend,
      secondBackend,
      firstTester,
      secondTester,
      firstFlow,
      secondFlow,
      firstSQA,
      secondSQA,
    } = data;
    // 判断所有为空
    if (
      !firstFront &&
      !secondFront &&
      !firstBackend &&
      !secondBackend &&
      !firstTester &&
      !secondTester &&
      !firstFlow &&
      !secondFlow &&
      !firstSQA &&
      !secondSQA
    ) {
      message.error({
        content: '值班人员不能为空！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return false;
    }

    // 判断前端是否为空
    if (!firstFront && secondFront) {
      message.error({
        content: '前端第一值班人不能为空！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return false;
    }
    if (firstFront && !secondFront) {
      message.error({
        content: '前端第二值班人不能为空！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return false;
    }

    // 判断后端是否为空
    if (!firstBackend && secondBackend) {
      message.error({
        content: '后端第一值班人不能为空！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return false;
    }
    if (firstBackend && !secondBackend) {
      message.error({
        content: '后端第二值班人不能为空！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return false;
    }

    // 判断测试是否为空
    if (!firstTester && secondTester) {
      message.error({
        content: '测试第一值班人不能为空！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return false;
    }
    if (firstTester && !secondTester) {
      message.error({
        content: '测试第二值班人不能为空！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return false;
    }

    // 判断流程是否为空
    if (!firstFlow && secondFlow) {
      message.error({
        content: '流程第一值班人不能为空！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return false;
    }
    if (firstFlow && !secondFlow) {
      message.error({
        content: '流程第二值班人不能为空！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return false;
    }

    // 判断SQA是否为空
    if (!firstSQA && secondSQA) {
      message.error({
        content: 'SQA第一值班人不能为空！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return false;
    }
    if (firstSQA && !secondSQA) {
      message.error({
        content: 'SQA第二值班人不能为空！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return false;
    }

    return true;
  };
  // 解析需要保存的值班人员
  const alasysDutyPerson = (data: any) => {
    const startTime = moment(data.dutyTime[0]).format('YYYY/MM/DD');
    const endTime = moment(data.dutyTime[1]).format('YYYY/MM/DD');
    const checkResult = checkInputData(data);
    if (!checkResult) {
      return [];
    }

    return parseSaveCardData(data, oldDutyTask, startTime, endTime);
  };

  // 解析需要保存的值班项目
  const alasysDutyProject = (data: any) => {
    const project_data: any = [];
    let allEmpty = false; // 所有项目都为空
    if (data) {
      for (let index = 0; index < data.length; index += 1) {
        const dts = data[index];
        const proInfo = dts.prjName.split('&');

        // 如果所有项都为空
        if (
          !proInfo[1] &&
          !dts.prjType &&
          !dts.branch &&
          !dts.testEnv &&
          !dts.upgradeEnv &&
          !dts.prjManager &&
          !dts.planGrayTime &&
          !dts.planOnlineTime
        ) {
          allEmpty = true;
        } else {
          allEmpty = false;

          /* region 判断所填项是否为空 */
          // 判断项目名是否为空
          if (!proInfo[1]) {
            errorMessage('项目名不能为空！');
            project_data.length = 0;
            break;
          }
          // 判断项目类型是否为空
          if (!dts.prjType) {
            errorMessage('项目类型不能为空！');
            project_data.length = 0;
            break;
          }

          // 判断对应分支是否为空
          if (!dts.branch) {
            errorMessage('对应分支不能为空！');
            project_data.length = 0;
            break;
          }

          // 判断对应测试环境是否为空
          if (!dts.testEnv) {
            errorMessage('对应测试环境不能为空！');
            project_data.length = 0;
            break;
          }

          // 判断对应升级环境是否为空
          if (!dts.upgradeEnv) {
            errorMessage('对应升级环境不能为空！');
            project_data.length = 0;
            break;
          }

          // 判断项目负责人是否为空
          if (!dts.prjManager) {
            errorMessage('项目负责人不能为空！');
            project_data.length = 0;
            break;
          }

          /* endregion */

          let planGrayTime = '';
          if (dts.planGrayTime) {
            planGrayTime = moment(dts.planGrayTime).format('YYYY/MM/DD');
          }

          let planOnlineTime = '';
          if (dts.planOnlineTime) {
            planOnlineTime = moment(dts.planOnlineTime).format('YYYY/MM/DD');
          }
          const items = {
            person_num: oldDutyTask.personNum, // 值班计划编号
            project_id: proInfo[0], // 项目id
            project_name: proInfo[1], // 项目名称
            project_type: dts.prjType, // 项目类型
            project_branch: dts.branch, // 对应分支
            project_test_environment: dts.testEnv, // 对应测试环境
            project_upgrade_environment: dts.upgradeEnv, // 对应升级环境
            project_head: dts.prjManager, // 项目负责人
            project_head_id: dts.managerId,
            project_plan_gray_time: planGrayTime, // 计划灰度时间
            project_plan_online_time: planOnlineTime, // 计划上线时间
            project_index: (index + 1).toString(), // 界面展示序号
            is_delete: 0, // 是否删除
          };
          if (dts.proId) {
            items['pro_id'] = dts.proId; // project id  新增的时候不需要这个id（为空的时候则不需要）
          }

          project_data.push(items);
        }
      }
    }

    // const allProject = project_data.concat(deletedData); // 将修改、新增和删除的数组连在一起进行保存
    return { allProject: project_data, allEmpty };
  };

  const requestAPpiToSaveData = async (person_data: any, allProject: any) => {
    const saveResult = await submitModifyData(person_data, allProject);
    if (saveResult) {
      errorMessage(saveResult.toString());
    } else {
      sucMessage('值班计划修改成功！');
      setIsPlanVisble(false);
      refreshData(choicedCondition.start, choicedCondition.end);
    }
  };

  // 提交事件
  const submitForm = async () => {
    const formData = formForPlanModify.getFieldsValue();
    // 解析值班人数据
    const person_data = alasysDutyPerson(formData);
    // 解析项目数据
    const project_data = alasysDutyProject(formData.projects);

    // 值班人员名单必须有数据
    if (person_data && person_data.length > 0) {
      // 判断项目是否为空
      if (
        deletedData.length > 0 &&
        project_data.allEmpty === true &&
        project_data.allProject.length === 0
      ) {
        await requestAPpiToSaveData(person_data, deletedData);
      } else if (project_data.allEmpty && project_data.allProject.length === 0) {
        await requestAPpiToSaveData(person_data, []);
      } else if (project_data.allProject.length > 0) {
        const allProjects = project_data.allProject.concat(deletedData);
        await requestAPpiToSaveData(person_data, allProjects);
      }
    }
  };

  /* endregion */

  /* region 时间数据查询以及展示 */
  let cardDatas: any = [];
  const { data } = useRequest(() => queryDutyCardInfo(choicedCondition));

  if (data) {
    if (data.message) {
      message.error({
        content: data.message,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    } else {
      cardDatas = data.datas;
    }
  }

  // 时间选择
  const onTimeSelected = async (params: any, dateString: any) => {
    let startTime = dateString[0];
    let endTime = dateString[1];
    setChoicedCondition({ start: startTime, end: endTime });
    if (dateString[0] !== '' && dateString[1] !== '') {
      startTime = dayjs(dateString[0]).format('YYYY/MM/DD');
      endTime = dayjs(dateString[1]).format('YYYY/MM/DD');
    }

    await refreshData(startTime, endTime);
  };
  /* endregion */

  /* region useEffect 使用 */
  useEffect(() => {
    let cardDiv: any = [];
    if (cardDatas) {
      cardDiv = makeCardsDiv(cardDatas);
    }
    setDutyCart(cardDiv);
  }, [data]);

  /* endregion */

  return (
    <PageContainer>
      {/* 时间查询条件 */}
      <div style={{ width: '100%', backgroundColor: 'white', marginTop: -15 }}>
        <label style={{ marginLeft: '10px' }}>计划筛选：</label>
        <RangePicker
          className={'times'}
          style={{ width: '18%' }}
          onChange={onTimeSelected}
          value={[
            choicedCondition.start === '' ? null : moment(choicedCondition.start),
            choicedCondition.end === '' ? null : moment(choicedCondition.end),
          ]}
        />

        <Button
          type="text"
          onClick={sendMessage}
          style={{
            marginLeft: 10,
            padding: 10,
            display: judgeAuthorityByName('addDutyMsgPush') === true ? 'inline' : 'none',
          }}
        >
          <img src="../pushMessage.png" width="25" height="25" alt="一键推送" title="一键推送" />{' '}
          &nbsp;一键推送
        </Button>
      </div>

      <div style={{ marginTop: 5, overflow: 'scroll' }}>
        <table style={{ width: '100%' }}>{dutyCard}</table>
      </div>

      {/* 弹出层界面 */}
      <Modal
        title={'值班计划'}
        visible={isPlanVisble} //
        onCancel={planModalCancel}
        centered={true}
        width={600}
        footer={null}
        maskClosable={false}
      >
        <div style={{ height: 700, overflowY: 'scroll' }}>
          <Form
            name="user_form"
            form={formForPlanModify}
            layout={'horizontal'}
            onFinish={submitForm}
            initialValues={{ projects }}
          >
            <Form.Item label="值班时间" name="dutyTime" required={true}>
              <RangePicker style={{ width: '100%', color: 'red' }} disabled />
            </Form.Item>
            {/* 值班人员Card */}
            <Card
              size="small"
              title="值班人员"
              style={{ marginTop: -15 }}
              bodyStyle={{ height: 500 }}
            >
              {/* 前端 */}
              <Row gutter={40} style={{ marginTop: -10 }}>
                <Col span={10}>
                  <Form.Item name="firstFront" label="前端" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.front}</Select>
                  </Form.Item>
                </Col>
                <Col span={14}>
                  <Form.Item name="secondFront" label="前端第二值班人" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.front}</Select>
                  </Form.Item>
                </Col>
              </Row>

              {/*  后端 */}
              <Row gutter={40} style={{ marginTop: -25 }}>
                <Col span={10}>
                  <Form.Item name="firstBackend" label="后端" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.backend}</Select>
                  </Form.Item>
                </Col>

                <Col span={14}>
                  <Form.Item name="secondBackend" label="后端第二值班人" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.backend}</Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* 测试 */}
              <Row gutter={40} style={{ marginTop: -25 }}>
                <Col span={10}>
                  <Form.Item name="firstTester" label="测试" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.tester}</Select>
                  </Form.Item>
                </Col>
                <Col span={14}>
                  <Form.Item name="secondTester" label="测试第二值班人" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.tester}</Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* 流程 */}
              <Row gutter={40} style={{ marginTop: -25 }}>
                <Col span={10}>
                  <Form.Item name="firstFlow" label="流程" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.flow}</Select>
                  </Form.Item>
                </Col>

                <Col span={14}>
                  <Form.Item name="secondFlow" label="流程第二值班人" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.flow}</Select>
                  </Form.Item>
                </Col>
              </Row>
              {/* 运维 */}
              <Row gutter={40} style={{ marginTop: -25 }}>
                <Col span={10}>
                  <Form.Item name="firstDevops" label="运维" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.devops}</Select>
                  </Form.Item>
                </Col>

                <Col span={14}>
                  <Form.Item name="secondDevops" label="运维第二值班人" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.devops}</Select>
                  </Form.Item>
                </Col>
              </Row>
              {/* SQA */}
              <Row gutter={40} style={{ marginTop: -25 }}>
                <Col span={10}>
                  <Form.Item name="firstSQA" label="SQA" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.SQA}</Select>
                  </Form.Item>
                </Col>

                <Col span={14}>
                  <Form.Item name="secondSQA" label="SQA第二值班人" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.SQA}</Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* global  */}
              <Row gutter={40} style={{ marginTop: -25 }}>
                <Col span={10}>
                  <Form.Item name="firstGlobal" label="global" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.my_global}</Select>
                  </Form.Item>
                </Col>

                <Col span={14}>
                  <Form.Item name="secondGlobal" label="global第二值班人" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.my_global}</Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* openApi  */}
              <Row gutter={40} style={{ marginTop: -25 }}>
                <Col span={10}>
                  <Form.Item name="firstOpenApil" label="openApi&qtms" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.openApi}</Select>
                  </Form.Item>
                </Col>

                <Col span={14}>
                  <Form.Item
                    name="secondOpenApi"
                    label="openApi&qtms第二值班人"
                    style={{ marginTop: 7 }}
                  >
                    <Select showSearch>{allUsers.openApi}</Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* qbos与store  */}
              <Row gutter={40} style={{ marginTop: -25 }}>
                <Col span={10}>
                  <Form.Item name="firstQbosStore" label="qbos&Store" style={{ marginTop: 7 }}>
                    <Select showSearch>{allUsers.qbos_store}</Select>
                  </Form.Item>
                </Col>

                <Col span={14}>
                  <Form.Item
                    name="secondQbosStore"
                    label="qbos&Store第二值班人"
                    style={{ marginTop: 7 }}
                  >
                    <Select showSearch>{allUsers.qbos_store}</Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* jsf  */}
              <Row gutter={40} style={{ marginTop: -25 }}>
                <Col span={10}>
                  <Form.Item name="firstJsf" label="jsf" style={{ marginTop: 7 }}>
                    <Select showSearch style={{ width: 100, marginLeft: 60 }}>
                      {allUsers.jsf}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={14}>
                  <Form.Item name="secondJsf" label="jsf第二值班人" style={{ marginTop: 7 }}>
                    <Select showSearch style={{ width: 122, marginLeft: 60 }}>
                      {allUsers.jsf}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              {/* emitter  */}
              <Row gutter={40} style={{ marginTop: -25 }}>
                <Col span={10}>
                  <Form.Item name="firstEmitter" label="emitter" style={{ marginTop: 7 }}>
                    <Select showSearch style={{ width: 100, marginLeft: 22 }}>
                      {allUsers.emitter}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={14}>
                  <Form.Item
                    name="secondEmitter"
                    label="emitter第二值班人"
                    style={{ marginTop: 7 }}
                  >
                    <Select showSearch style={{ width: 122, marginLeft: 22 }}>
                      {allUsers.emitter}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 项目明细Card */}
            <Card size="small" title="项目" style={{ marginTop: 10 }}>
              <Form.Item>{projectItems}</Form.Item>

              {/* 备注显示  */}
              <div>
                <label style={{ color: 'orange' }}> 备注： </label>
                <label>
                  {' '}
                  需要当天紧急修复的请走emergency申请 <br />
                  对应分支：emergency/stage-emergency
                  <br />
                  对应测试环境:nx-hotfix（如有变动，由测试负责人临时调配环境）{' '}
                </label>
              </div>
            </Card>

            {/* 取消和保存按钮 */}
            <Form.Item style={{ marginTop: 10, marginBottom: -10 }}>
              <Button
                style={{ float: 'right', borderRadius: 5, marginLeft: 20 }}
                onClick={planModalCancel}
              >
                取消
              </Button>
              <Button
                type="primary"
                style={{
                  float: 'right',
                  color: '#46A0FC',
                  backgroundColor: '#ECF5FF',
                  borderRadius: 5,
                }}
                htmlType="submit"
              >
                保存
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default DutyPlan;