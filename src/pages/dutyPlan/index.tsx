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
  Divider
} from "antd";
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import axios from "axios";
import moment from "moment";
import dayjs from "dayjs";

const {RangePicker} = DatePicker;
const {Option} = Select;

// 解析数据
const parseData = (params: any) => {
  debugger;
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

  // return [
  //   [{
  //     module: '前端',
  //     name: '刘黎明',
  //     id: "1",
  //     start: "2021-01-01",
  //     end: "2021-01-07"
  //   }, {
  //     module: '后端',
  //     name: '胡靖华/罗林',
  //     id: "2",
  //     start: "2021-01-01",
  //     end: "2021-01-07"
  //   }, {
  //     module: '测试',
  //     name: '徐睿',
  //     id: "3",
  //     start: "2021-01-01",
  //     end: "2021-01-07"
  //   }], [{
  //     module: '前端',
  //     name: '欧兴阳/王濯',
  //     id: "1",
  //     start: "2021-01-08",
  //     end: "2021-01-014"
  //   }, {
  //     module: '后端',
  //     name: '何宇',
  //     id: "2",
  //     start: "2021-01-08",
  //     end: "2021-01-014"
  //   }, {
  //     module: '测试',
  //     name: '罗天刚',
  //     id: "3",
  //     start: "2021-01-08",
  //     end: "2021-01-014"
  //   }], [{
  //     module: '前端',
  //     name: '陈凯',
  //     id: "1",
  //     start: "2021-01-15",
  //     end: "2021-01-22"
  //   }, {
  //     module: '后端',
  //     name: '刘云鹏',
  //     id: "2",
  //     start: "2021-01-15",
  //     end: "2021-01-22"
  //   }, {
  //     module: '测试',
  //     name: '王鹄',
  //     id: "3",
  //     start: "2021-01-15",
  //     end: "2021-01-22"
  //   }], [{
  //     module: '前端',
  //     name: '陈凯',
  //     id: "1",
  //     start: "2021-01-15",
  //     end: "2021-01-22"
  //   }, {
  //     module: '后端',
  //     name: '刘云鹏',
  //     id: "2",
  //     start: "2021-01-15",
  //     end: "2021-01-22"
  //   }, {
  //     module: '测试',
  //     name: '王鹄',
  //     id: "3",
  //     start: "2021-01-15",
  //     end: "2021-01-22"
  //   }], [{
  //     module: '前端',
  //     name: '陈凯',
  //     id: "1",
  //     start: "2021-01-15",
  //     end: "2021-01-22"
  //   }, {
  //     module: '后端',
  //     name: '刘云鹏',
  //     id: "2",
  //     start: "2021-01-15",
  //     end: "2021-01-22"
  //   }, {
  //     module: '测试',
  //     name: '王鹄',
  //     id: "3",
  //     start: "2021-01-15",
  //     end: "2021-01-22"
  //   }], [{
  //     module: '前端',
  //     name: '陈凯',
  //     id: "1",
  //     start: "2021-01-23",
  //     end: "2021-01-29"
  //   }, {
  //     module: '后端',
  //     name: '刘云鹏',
  //     id: "2",
  //     start: "2021-01-23",
  //     end: "2021-01-29"
  //   }, {
  //     module: '测试',
  //     name: '王鹄',
  //     id: "3",
  //     start: "2021-01-23",
  //     end: "2021-01-29"
  //   }], [{
  //     module: '前端',
  //     name: '陈凯',
  //     id: "1",
  //     start: "2021-01-30",
  //     end: "2021-02-05"
  //   }, {
  //     module: '后端',
  //     name: '刘云鹏',
  //     id: "2",
  //     start: "2021-01-30",
  //     end: "2021-02-05"
  //   }, {
  //     module: '测试',
  //     name: '王鹄',
  //     id: "3",
  //     start: "2021-01-30",
  //     end: "2021-02-05"
  //   }]
  // ];

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


const DutyPlan: React.FC<any> = () => {

  /* region 数据查询 */

  const [choicedCondition, setChoicedCondition] = useState({start: "", end: ""});
  const {data} = useRequest(() => queryDevelopViews(choicedCondition));
  /* endregion */


  /* region 消息推送事件 */

  // checkbox 选中事件
  const onPlanChanged = (params: any) => {

    const selectedId = params.target.id;
    const isChecked = params.target.checked;
    console.log(selectedId, isChecked);
    message.info(selectedId);
  };
  const sendMessage = () => {

  };
  /*  endregion */

  /* region 弹出层事件 */
  const [formForPlanModify] = Form.useForm();
  const [isPlanVisble, setIsPlanVisble] = useState(false);
  const [projects, setProjects] = useState([
    {
      prjName: '哈哈哈哈',
      prjType: '嘻嘻嘻',
      branch: "",
      testEnv: "",
      upgradeEnv: "",
      prjManager: "",
      planGrayTime: "",
      planOnlineTime: ""

    },
  ]);

  // 表格双击事件
  const doubleClickRow = (tableData: any) => {

    console.log(tableData);

    // setIsPlanVisble(true);

  };

  // 弹出层取消
  const planModalCancel = () => {
    setIsPlanVisble(false);
  };

  // 新增项目
  const add = () => {
    formForPlanModify.setFieldsValue({"projects": [...projects, {name: '', mobile: ''}]})
    return setProjects([...projects, {
      prjName: '',
      prjType: '',
      branch: "",
      testEnv: "",
      upgradeEnv: "",
      prjManager: "",
      planGrayTime: "",
      planOnlineTime: ""
    }])
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
    const order = `${numChar[index + 1]}项目名称`;

    return <div>
      <div>

        <Form.Item label={order} name={['projects', index, 'prjName']} style={{marginLeft: -5}}>
          <Select style={{width: '93%', marginLeft: 27}} onChange={(event: any) => onChange(index, 'prjName', event)}>
            <Option value="liming.liu">刘黎明</Option>
          </Select>
        </Form.Item>

        <Form.Item label="项目类型" name={['projects', index, 'prjType']} style={{marginTop: -20, marginLeft: 13}}>
          <Select style={{width: '93%', marginLeft: 27}}>
            <Option value="刘黎明">刘黎明</Option>
          </Select>
        </Form.Item>

        <Form.Item label="对应分支" name={['projects', index, 'branch']} style={{marginTop: -20, marginLeft: 13}}>
          <Select style={{width: "93%", marginLeft: 27}}>
            <Option value="刘黎明">刘黎明</Option>
          </Select>
        </Form.Item>

        <Form.Item label="对应测试环境" name={['projects', index, 'testEnv']} style={{marginTop: -20, marginLeft: 13}}>
          <Select style={{width: "100%"}}>
            <Option value="刘黎明">刘黎明</Option>
          </Select>
        </Form.Item>

        <Form.Item label="对应升级环境" name={['projects', index, 'upgradeEnv']} style={{marginTop: -20, marginLeft: 13}}>
          <Select style={{width: "100%"}}>
            <Option value="刘黎明">刘黎明</Option>
          </Select>
        </Form.Item>

        <Form.Item label="项目负责人" name={['projects', index, 'prjManager']} style={{marginTop: -20, marginLeft: 13}}>
          <Select style={{width: "96%", marginLeft: 14}}>
            <Option value="刘黎明">刘黎明</Option>
          </Select>
        </Form.Item>

        <Form.Item label="计划灰度时间" name={['projects', index, 'planGrayTime']} style={{marginTop: -20, marginLeft: 13}}>
          <RangePicker style={{width: '100%'}}/>
        </Form.Item>

        <Form.Item label="计划上线时间" name={['projects', index, 'planOnlineTime']} style={{marginTop: -20, marginLeft: 13}}>
          <RangePicker style={{width: '100%'}}/>
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

  // 提交事件
  const submitForm = () => {
    const tt = formForPlanModify.getFieldsValue();

    formForPlanModify.validateFields()
      .then((values: any) => {
        console.log("33333333333333333333333333333333333333", values, tt);
      });
  }

  /* endregion */

  /* region 数据查询以及展示 */

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

  useEffect(() => {
    let cardDiv: any = [];
    if (data) {
      cardDiv = makeCardsDiv(data);
    }
    setDutyCart(cardDiv);

  }, [data]);

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
              style={{width: '100%'}}
            />
          </Form.Item>

          {/* 值班人员Card */}
          <Card size="small" title="值班人员" style={{marginTop: -15}} bodyStyle={{height: 130}}>
            <Row gutter={40} style={{marginTop: -10}}>
              <Col span={10}>
                <Form.Item name="firstFront" label="前端" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}}>
                    <Option value="刘黎明">刘黎明</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item name="secondFront" label="前端第二值班人" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}}>
                    <Option value="刘黎明">刘黎明</Option>

                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={40} style={{marginTop: -25}}>
              <Col span={10}>
                <Form.Item name="firstBackend" label="后端" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}}>
                    <Option value="刘黎明">刘黎明</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={14}>
                <Form.Item name="secondBackend" label="后端第二值班人" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}}>
                    <Option value="刘黎明">刘黎明</Option>
                  </Select>
                </Form.Item>
              </Col>

            </Row>

            <Row gutter={40} style={{marginTop: -25}}>
              <Col span={10}>
                <Form.Item name="firstTester" label="测试" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}}>
                    <Option value="刘黎明">刘黎明</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item name="secondTester" label="测试第二值班人" style={{marginTop: 7}}>
                  <Select style={{width: '130px'}}>
                    <Option value="刘黎明">刘黎明</Option>
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
