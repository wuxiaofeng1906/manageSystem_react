import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
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
  Input
} from "antd";
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import axios from "axios";
import moment from "moment";
import dayjs from "dayjs";
import {
  getAllUsers,
  getAllProject,
  getProjectType,
  getBranchName,
  getEnvironment,
  getPrincipal
} from '@/publicMethods/verifyAxios';

const {RangePicker} = DatePicker;
const {Option} = Select;

// 解析数据
const parseData = (params: any) => {

  const returnValue: any = [];
  if (params) {
    params.forEach((project: any) => {
      const projectItemArray: any = [];
      let username = "";
      project.forEach((ele: any) => {

        const projectItem = {
          person_id: ele.person_id,
          person_num: ele.person_num,
          user_tech: ele.user_tech,
          user_id: ele.user_id,
          user_name: "",
          duty_start_time: ele.duty_start_time,
          duty_end_time: ele.duty_end_time,
          duty_order: ele.duty_order
        };

        if (ele.duty_order === "1") {
          username = ele.user_name === null ? "" : ele.user_name;
        } else {

          if (ele.user_name === null) {
            projectItem.user_name = username;
          } else {
            projectItem.user_name = `${username}/${ele.user_name}`;
          }
          username = "";
          projectItemArray.push(projectItem);
        }
      });
      returnValue.push(projectItemArray);
    });

  }

  return returnValue;
}
const queryDevelopViews = async (params: any) => {

  let result: any = [];
  await axios.get('/api/verify/duty/plan_data', {params: {start_time: params.start, end_time: params.end}})
    .then(function (res) {

      if (res.data.code === 200) {
        result = parseData(res.data.data.data);
      } else {
        message.error({
          content: `错误：${res.data.msg}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }


    }).catch(function (error) {

      message.error({
        content: `异常信息:${error.toString()}`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    });

  return result;
};
const getPlanDetails = async (paln_num: string) => {
  let userInfo: any = [];

  await axios.get('/api/verify/duty/plan_data_detail', {params: {person_num: paln_num}})
    .then(function (res) {

      if (res.data.code === 200) {
        userInfo = res.data.data;

      } else {
        message.error({
          content: `错误：${res.data.msg}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }

    }).catch(function (error) {
      message.error({
        content: `异常信息:${error.toString()}`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    });

  return userInfo;

};

// 已选中的事件
const selectedProject: any = [];
const oldDutyTask = {
  personNum: "",
  firstFrontId: "",
  secondFrontId: "",
  firstBackendId: "",
  secondBackendId: "",
  firstTesterId: "",
  secondTesterId: "",
};
const DutyPlan: React.FC<any> = () => {

  /* region 消息推送事件 */

  // checkbox 选中事件
  const onPlanChanged = (params: any) => {

    const selectedId = params.target.id;
    const isChecked = params.target.checked;
    if (isChecked) {

      if (selectedProject.length >= 1) {// 表示之前已选有数据，一次性只能推送一条数据
        message.error({
          content: `一次只能推送一条数据！`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      }
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
  const sendMessage = () => {
    if (selectedProject.length === 0) {
      //   提醒选中一条
      message.error({
        content: `请选中你要推送的数据！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return;
    }

    if (selectedProject.length > 1) {
      message.error({
        content: `一次只能推送一条数据！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }
    axios.get('/api/verify/duty/msg_push', {params: {person_num: selectedProject[0]}})
      .then(function (res) {

        if (res.data.code === 200) {
          message.info({
            content: `消息推送成功！`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          message.error({
            content: `错误：${res.data.msg}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        }


      }).catch(function (error) {

      message.error({
        content: `异常信息:${error.toString()}`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    });

  };
  /*  endregion */

  /* region 弹出层相关 */
  const [formForPlanModify] = Form.useForm();
  const [isPlanVisble, setIsPlanVisble] = useState(false);
  const [projects, setProjects] = useState([
    {
      prjName: '',
      prjType: '',
      branch: "",
      testEnv: "",
      upgradeEnv: "",
      prjManager: "",
      planGrayTime: "",
      planOnlineTime: "",
      proId: ""

    }]);
  const [allUsers, setAllUsers] = useState({
    front: [],
    backend: [],
    tester: []
  });
  const [projectInfo, setProjectInfo] = useState({
    prjName: [],
    prjType: [],
    branch: [],
    testEnv: [],
    upgradeEnv: [],
    manager: []
  });

  /* region 下拉框获取 */
  const loadUserSelect = async (teach: string) => {

    const teachData: any = [<Option key={""} value={"免"}>免</Option>];

    const userInfo = await getAllUsers(teach);
    if (userInfo.message !== "") {
      message.error({
        content: userInfo.message,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    } else if (userInfo.data) {
      const {data} = userInfo;
      data.forEach((user: any) => {
        teachData.push(
          <Option key={user.user_id} value={`${user.user_id}&${user.user_name}`}>{user.user_name}</Option>);
      });
    }
    return teachData;
  };
  const loadPrjNameSelect = async () => {
    const prjNames = await getAllProject();
    const prjData: any = [];

    if (prjNames.message !== "") {
      message.error({
        content: prjNames.message,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    } else if (prjNames.data) {
      const datas = prjNames.data;
      datas.forEach((project: any) => {
        prjData.push(
          <Option key={project.project_id}
                  value={`${project.project_id}&${project.project_name}`}>{project.project_name}</Option>);
      });
    }

    return prjData;

  };
  const loadPrjTypeSelect = async () => {
    const prjNames = await getProjectType();
    const prjData: any = [];

    if (prjNames.message !== "") {
      message.error({
        content: prjNames.message,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    } else if (prjNames.data) {
      const datas = prjNames.data;
      datas.forEach((project: any) => {
        prjData.push(
          <Option key={project.project_type} value={project.project_type}>{project.project_type_name}</Option>);
      });
    }

    return prjData;

  };
  const loadBanchSelect = async () => {

    const branchInfo = await getBranchName();
    const branchData: any = [];

    if (branchInfo.message !== "") {
      message.error({
        content: branchInfo.message,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    } else if (branchInfo.data) {
      const datas = branchInfo.data;
      datas.forEach((branch: any) => {
        branchData.push(
          <Option key={branch.branch_id} value={branch.branch_name}>{branch.branch_name}</Option>);
      });
    }

    return branchData;

  };
  const loadEnvironmentSelect = async () => {
    const envData = await getEnvironment();
    const environmentData: any = [];

    if (envData.message !== "") {
      message.error({
        content: envData.message,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    } else if (envData.data) {
      const datas = envData.data;
      datas.forEach((env: any) => {
        environmentData.push(
          <Option key={env.env_id} value={env.image_env}>{env.image_env}</Option>);
      });
    }

    return environmentData;

  };
  const loadPrincipalSelect = async () => {
    const principalData = await getPrincipal();
    const prinData: any = [];

    if (principalData.message !== "") {
      message.error({
        content: principalData.message,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    } else if (principalData.data) {
      const datas = principalData.data;
      datas.forEach((users: any) => {
        prinData.push(
          <Option key={users.user_id} value={users.user_name}>{users.user_name}</Option>);
      });
    }

    return prinData;

  };
  /* endregion */

  /* region 弹出项目框相关事件 */
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
        if (users.user_id) {
          usersAccount = `${users.user_id}&${users.user_name}`;
        }
        if (users.user_tech === "前端") {
          if (users.duty_order === "1") {
            oldDutyTask.firstFrontId = users.person_id;

            formForPlanModify.setFieldsValue({
              ...formForPlanModify,
              firstFront: usersAccount
            });
          } else {
            oldDutyTask.secondFrontId = users.person_id;
            formForPlanModify.setFieldsValue({
              ...formForPlanModify,
              secondFront: usersAccount
            });
          }

        } else if (users.user_tech === "后端") {

          if (users.duty_order === "1") {
            oldDutyTask.firstBackendId = users.person_id;
            formForPlanModify.setFieldsValue({
              ...formForPlanModify,
              firstBackend: usersAccount
            });
          } else {
            oldDutyTask.secondBackendId = users.person_id;
            formForPlanModify.setFieldsValue({
              ...formForPlanModify,
              secondBackend: usersAccount
            });
          }
        } else if (users.duty_order === "1") {
          oldDutyTask.firstTesterId = users.person_id;
          formForPlanModify.setFieldsValue({
            ...formForPlanModify,
            firstTester: usersAccount
          });
        } else {
          oldDutyTask.secondTesterId = users.person_id;
          formForPlanModify.setFieldsValue({
            ...formForPlanModify,
            secondTester: usersAccount
          });
        }

      });
    }

    // 项目详细信息显示
    const projectData = hisData.project;
    if (projectData.length === 0) {
      const emptyValue = [{
        prjName: "",
        prjType: "",
        branch: "",
        testEnv: "",
        upgradeEnv: "",
        prjManager: "",
        planGrayTime: "",
        planOnlineTime: "",
        proId: "",
      }];
      formForPlanModify.setFieldsValue({"projects": emptyValue});
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
        planGrayTime: moment(dts.project_plan_gray_time),
        planOnlineTime: moment(dts.project_plan_online_time),
        proId: dts.pro_id,
      });
    });
    formForPlanModify.setFieldsValue({"projects": detailsInfo});
    setProjects(detailsInfo);
  };
  // 表格双击事件
  const doubleClickRow = async (tableData: any) => {

    /* region 显示已有数据  */
    const hisData = await getPlanDetails(tableData[0].person_num);
    showExitData(hisData);
    /* endregion  */

    /* region 下拉框中选项加载  */
    setIsPlanVisble(true);

    // 生成值班人下拉框
    const frontUserInfo = await loadUserSelect("1");
    const backendUserInfo = await loadUserSelect("2");
    const testerUserInfo = await loadUserSelect("3");
    setAllUsers({
      front: frontUserInfo,
      backend: backendUserInfo,
      tester: testerUserInfo
    });

    // 生成项目名称、项目类型、对应分支、对应测试环境、对应升级环境、项目负责人的下拉框
    const projectName = await loadPrjNameSelect();
    const projectType = await loadPrjTypeSelect();
    const branchs = await loadBanchSelect();
    const environment = await loadEnvironmentSelect();
    const principal = await loadPrincipalSelect();
    setProjectInfo({
      prjName: projectName,
      prjType: projectType,
      branch: branchs,
      testEnv: environment,
      upgradeEnv: environment,
      manager: principal
    });
    /* endregion  */
  };

  // 弹出层取消
  const planModalCancel = () => {
    setIsPlanVisble(false);
  };

  // 新增项目
  const add = () => {
    const addValue = [...projects, {
      prjName: "",
      prjType: "",
      branch: "",
      testEnv: "",
      upgradeEnv: "",
      prjManager: "",
      planGrayTime: "",
      planOnlineTime: "",
      proId: "",
    }];

    formForPlanModify.setFieldsValue({
      "projects": addValue
    });
    return setProjects(addValue);
  };

  // 删除项目
  const del = (index: any) => {

    formForPlanModify.setFieldsValue({"projects": [...projects.slice(0, index), ...projects.slice(index + 1)]})
    return setProjects([...projects.slice(0, index), ...projects.slice(index + 1)])
  };

  // 当值被改变
  const onChange = (index: any, name: any, event: any) => {
    const tempArray = [...projects];

    if (name === 'prjName')
      tempArray[index] = {...tempArray[index], prjName: event}
    // else
    //   tempArray[index] = {...tempArray[index], prjType: event.target.value}
    return setProjects(tempArray)
  };

  // 动态生成项目组件
  const projectItems = projects.map((item: any, index: any) => {
    // 获取项目序号
    const numChar = {
      1: "①",
      2: "②",
      3: "③",
      4: "④",
      5: "⑤",
      6: "⑥",
      7: "⑦",
      8: "⑧",
      9: "⑨",
      10: "⑩"
    };
    const order = `${numChar[index + 1]} 项目名称`;

    return <div>
      <div>

        <Form.Item label={order} name={['projects', index, 'prjName']} style={{marginLeft: -5}}>
          <Select style={{width: '93%', marginLeft: 27}} showSearch
                  onChange={(event: any) => onChange(index, 'prjName', event)}>
            {projectInfo.prjName}
          </Select>
        </Form.Item>

        <Form.Item label="项目类型" name={['projects', index, 'prjType']} style={{marginTop: -20, marginLeft: 13}}>
          <Select style={{width: '93%', marginLeft: 27}} showSearch>
            {projectInfo.prjType}
          </Select>
        </Form.Item>

        <Form.Item label="对应分支" name={['projects', index, 'branch']} style={{marginTop: -20, marginLeft: 13}}>
          <Select style={{width: "93%", marginLeft: 27}} showSearch>
            {projectInfo.branch}
          </Select>
        </Form.Item>

        <Form.Item label="对应测试环境" name={['projects', index, 'testEnv']} style={{marginTop: -20, marginLeft: 13}}>
          <Select style={{width: "100%"}} showSearch>
            {projectInfo.testEnv}
          </Select>
        </Form.Item>

        <Form.Item label="对应升级环境" name={['projects', index, 'upgradeEnv']} style={{marginTop: -20, marginLeft: 13}}>
          <Select style={{width: "100%"}} showSearch>
            {projectInfo.upgradeEnv}
          </Select>
        </Form.Item>

        <Form.Item label="项目负责人" name={['projects', index, 'prjManager']} style={{marginTop: -20, marginLeft: 13}}>
          <Select style={{width: "96%", marginLeft: 14}} showSearch>
            {projectInfo.manager}
          </Select>
        </Form.Item>

        <Form.Item label="计划灰度时间" name={['projects', index, 'planGrayTime']} style={{marginTop: -20, marginLeft: 13}}>
          <DatePicker style={{width: '100%'}}/>
        </Form.Item>

        <Form.Item label="计划上线时间" name={['projects', index, 'planOnlineTime']} style={{marginTop: -20, marginLeft: 13}}>
          <DatePicker style={{width: '100%'}}/>
        </Form.Item>

        <Form.Item label="修改需要" name={['projects', index, 'proId']} style={{display: "none"}}>
          <Input style={{width: 40}}/>
        </Form.Item>

        {/* 增加和删除操作 */}
        <Form.Item style={{marginLeft: 17, marginTop: -30, marginBottom: -10}}>
          <table>
            <tr>
              <td>
                <Button style={{border: "none", color: "#D0D0D0", marginLeft: -15}} onClick={() => add()}
                        icon={<PlusOutlined/>}/>
                {/*
                <Button type="text" onClick={() => add()}>
                <img src="../add_black.png" width="20" height="20" alt="新增项目" title="新增项目"/>
                </Button> */}
              </td>
              <td>
                <Divider style={{width: "410px"}}></Divider>
              </td>
              <td>
                <Button style={{border: "none", color: "#D0D0D0"}} onClick={() => del(index)} icon={<MinusOutlined/>}/>
                {/* <Button type="text" block onClick={() => del(index)}>
                <img src="../sub_black.png" width="20" height="20" alt="删除项目" title="删除项目"/>
               </Button> */}
              </td>
            </tr>
          </table>
        </Form.Item>


      </div>

    </div>
  });

  /* endregion */

  /* region 保存数据 */
  const alasysDutyPerson = (data: any) => {

    const person_data_array = [];
    const startTime = moment((data.dutyTime)[0]).format("YYYY/MM/DD");
    const endTime = moment((data.dutyTime)[1]).format("YYYY/MM/DD");

    // 前端第一值班人
    person_data_array.push({
      "peron_num": oldDutyTask.personNum,  // 值班编号id 例如：202111190002
      "duty_start_time": startTime,
      "duty_end_time": endTime,
      "person_id": oldDutyTask.firstFrontId,  // 序号 id
      "user_id": (data.firstFront).split("&")[0],    // 用户id
      "user_name": (data.firstFront).split("&")[1],  // 用户名
      "user_tech": "1",  // 前端还是后端
      "duty_order": "1", // 第几值班人
    });

    // 前端第二值班人
    person_data_array.push({
      "peron_num": oldDutyTask.personNum,
      "duty_start_time": startTime,
      "duty_end_time": endTime,
      "person_id": oldDutyTask.secondFrontId,
      "user_id": (data.secondFront).split("&")[0],
      "user_name": (data.secondFront).split("&")[1],
      "user_tech": "1",
      "duty_order": "2",
    });

    // 后端第一值班人
    person_data_array.push({
      "peron_num": oldDutyTask.personNum,
      "duty_start_time": startTime,
      "duty_end_time": endTime,
      "person_id": oldDutyTask.firstBackendId,
      "user_id": (data.firstBackend).split("&")[0],
      "user_name": (data.firstBackend).split("&")[1],
      "user_tech": "2",
      "duty_order": "1",
    });

    // 后端第二值班人
    person_data_array.push({
      "peron_num": oldDutyTask.personNum,
      "duty_start_time": startTime,
      "duty_end_time": endTime,
      "person_id": oldDutyTask.secondBackendId,
      "user_id": (data.secondBackend).split("&")[0],
      "user_name": (data.secondBackend).split("&")[1],
      "user_tech": "2",
      "duty_order": "2",
    });

    // 测试第一值班人
    person_data_array.push({
      "peron_num": oldDutyTask.personNum,
      "duty_start_time": startTime,
      "duty_end_time": endTime,
      "person_id": oldDutyTask.firstTesterId,
      "user_id": (data.firstTester).split("&")[0],
      "user_name": (data.firstTester).split("&")[1],
      "user_tech": "3",
      "duty_order": "1",
    });

    // 测试第二值班人
    person_data_array.push({
      "peron_num": oldDutyTask.personNum,
      "duty_start_time": startTime,
      "duty_end_time": endTime,
      "person_id": oldDutyTask.secondTesterId,
      "user_id": (data.secondTester).split("&")[0],
      "user_name": (data.secondTester).split("&")[1],
      "user_tech": "3",
      "duty_order": "2",
    });

    return person_data_array;
  };

  const alasysDutyProject = (data: any) => {

    const project_data: any = [];
    if (data) {
      data.forEach((dts: any, index: number) => {
        const items = {
          // "pro_id": dts.proId,  // project id  新增的时候不需要这个id（为空的时候则不需要）
          "person_num": oldDutyTask.personNum, // 值班计划编号
          "project_id": ((dts.prjName).split("&"))[0],// 项目id
          "project_name": ((dts.prjName).split("&"))[1], // 项目名称
          "project_type": dts.prjType,  // 项目类型
          "project_branch": dts.branch, // 对应分支
          "project_test_environment": dts.testEnv, // 对应测试环境
          "project_upgrade_environment": dts.upgradeEnv, // 对应升级环境
          "project_head": dts.prjManager,  // 项目负责人
          "project_plan_gray_time": moment(dts.planGrayTime).format("YYYY/MM/DD"),  // 计划灰度时间
          "project_plan_online_time": moment(dts.planOnlineTime).format("YYYY/MM/DD"), // 计划上线时间
          "project_index": (index + 1).toString(),// 界面展示序号
          "is_delete": 0 // 是否删除
        };
        if (dts.proId) {
          items["pro_id"] = dts.proId;
        }
        project_data.push(items);
      });
    }

    return project_data;
  };
  // 提交事件
  const submitForm = async () => {

    const formData = formForPlanModify.getFieldsValue();

    // 解析值班人数据
    const person_data = alasysDutyPerson(formData);

    console.log("person_data", person_data);

    // 解析项目数据
    const project_data = alasysDutyProject(formData.projects);
    await axios.put("/api/verify/duty/plan_data", {"person": person_data, "project": project_data})
      .then(function (res) {

        if (res.data.code === 200) {

          message.info({
            content: `值班计划修改成功！`,
            duration: 1, // 1S 后自动关闭
            style: {
              marginTop: '50vh',
            },
          });

          setIsPlanVisble(false);

        } else {
          message.error({
            content: `错误：${res.data.msg}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        }


      }).catch(function (error) {
        message.error({
          content: `异常信息:${error.toString()}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      });
  }

  /* endregion */

  /* endregion */

  /* region 数据查询以及展示 */

  const [choicedCondition, setChoicedCondition] = useState({start: "", end: ""});
  const {data} = useRequest(() => queryDevelopViews(choicedCondition));

  const [dutyCard, setDutyCart] = useState(<div></div>);
  const makeCardsDiv = (oraData: any) => {
    const columns: any = [
      {
        title: '所属端',
        dataIndex: 'user_tech',
        align: 'center'
      },
      {
        title: '姓名',
        dataIndex: 'user_name',
        align: 'center'
      },
    ];
    const cardDiv: any = [];
    const tdArray: any = [];
    oraData.forEach((ele_data: any, index: number) => {

      tdArray.push(
        <td>
          <Card size="small"
                title={`${ele_data[0].duty_start_time}~${ele_data[0].duty_end_time}`}
                headStyle={{textAlign: "center"}}
                extra={<Checkbox id={`${ele_data[0].person_num}`} onChange={onPlanChanged}></Checkbox>}>
            <Table
              style={{marginTop: -10}}
              size="small"
              columns={columns}
              dataSource={ele_data}
              bordered
              showHeader={false}
              pagination={false}
              onRow={() => {
                return {
                  onDoubleClick: () => {
                    doubleClickRow(ele_data);
                  },
                };
              }}
            />
          </Card>
        </td>);

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
  // 时间选择
  const onTimeSelected = async (params: any, dateString: any) => {

    setChoicedCondition({start: dateString[0], end: dateString[1]});
    const queryData = await queryDevelopViews({
      start: dayjs(dateString[0]).format("YYYY/MM/DD"),
      end: dayjs(dateString[1]).format("YYYY/MM/DD")
    });

    const newCardDiv = makeCardsDiv(queryData);
    setDutyCart(newCardDiv);
  };
  /* endregion */

  /* region useEffect 使用 */
  useEffect(() => {
    let cardDiv: any = [];
    if (data) {
      cardDiv = makeCardsDiv(data);
    }
    setDutyCart(cardDiv);

  }, [data]);

  /* endregion */
  return (
    <PageContainer>
      {/* 时间查询条件 */}
      <div style={{width: '100%', backgroundColor: "white", marginTop: -15}}>
        <label style={{marginLeft: '10px'}}>计划筛选：</label>
        <RangePicker
          className={'times'}
          style={{width: '18%'}}
          onChange={onTimeSelected}
          value={[
            choicedCondition.start === "" ? null : moment(choicedCondition.start),
            choicedCondition.end === "" ? null : moment(choicedCondition.end)]}
        />

        <Button type="text" onClick={sendMessage} style={{marginLeft: 10, padding: 10}}>
          <img src="../pushMessage.png" width="25" height="25" alt="一键推送" title="一键推送"/> &nbsp;一键推送
        </Button>

      </div>

      <div style={{marginTop: 5, overflow: "scroll"}}>
        <table style={{width: "100%"}}>
          {dutyCard}
        </table>
      </div>

      {/* 弹出层界面 */}
      <Modal
        title={'值班计划'}
        visible={isPlanVisble}
        onCancel={planModalCancel}
        centered={true}
        width={550}
        footer={null}
        maskClosable={false}
      >

        <Form name="user_form" form={formForPlanModify} layout={'horizontal'} onFinish={submitForm}
              initialValues={{projects}}>

          <Form.Item label="值班时间" name="dutyTime" required={true}>
            <RangePicker
              className={'times'}
              style={{width: '100%', color: "black"}}
              disabled
            />
          </Form.Item>
          {/* 值班人员Card */}
          <Card size="small" title="值班人员" style={{marginTop: -15}} bodyStyle={{height: 130}}>
            <Row gutter={40} style={{marginTop: -10}}>
              <Col span={10}>
                <Form.Item name="firstFront" label="前端" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}} showSearch>
                    {allUsers.front}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item name="secondFront" label="前端第二值班人" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}} showSearch>
                    {allUsers.front}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={40} style={{marginTop: -25}}>
              <Col span={10}>
                <Form.Item name="firstBackend" label="后端" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}} showSearch>
                    {allUsers.backend}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={14}>
                <Form.Item name="secondBackend" label="后端第二值班人" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}} showSearch>
                    {allUsers.backend}
                  </Select>
                </Form.Item>
              </Col>

            </Row>

            <Row gutter={40} style={{marginTop: -25}}>
              <Col span={10}>
                <Form.Item name="firstTester" label="测试" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}} showSearch>
                    {allUsers.tester}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item name="secondTester" label="测试第二值班人" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}} showSearch>
                    {allUsers.tester}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 项目明细Card */}
          <Card size="small" title="项目" style={{marginTop: 10}}>
            <Form.Item>
              {projectItems}
            </Form.Item>

            {/* 备注显示  */}
            <div>
              <label style={{color: "orange"}}> 备注： </label>
              <label> 需要当天紧急修复的请走emergency申请 <br/>
                对应分支：emergency/stage-emergency<br/>
                对应测试环境:nx-hotfix（如有变动，由测试负责人临时调配环境） </label>
            </div>

          </Card>

          {/* 取消和保存按钮 */}
          <Form.Item style={{marginTop: 10, marginBottom: -10}}>
            <Button
              style={{float: "right", borderRadius: 5, marginLeft: 20}}
              onClick={planModalCancel}>取消
            </Button>
            <Button type="primary"
                    style={{float: "right", color: '#46A0FC', backgroundColor: "#ECF5FF", borderRadius: 5}}
                    htmlType='submit'>保存
            </Button>

          </Form.Item>
        </Form>
      </Modal>

    </PageContainer>
  );
};

export default DutyPlan;
