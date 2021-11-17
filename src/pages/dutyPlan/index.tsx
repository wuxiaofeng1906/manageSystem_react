import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {Button, DatePicker, Checkbox, Card, message, Table} from "antd";
import axios from "axios";
import moment from "moment";

const {RangePicker} = DatePicker;

const queryDevelopViews = async () => {

  let result: any = [];
  const paramData = {
    page: 1,
    page_size: 100
  };


  await axios.get('/api/verify/app_tools/app_list', {params: paramData})
    .then(function (res) {

      if (res.data.code === 200) {
        result = res.data.data;
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

  const {data} = useRequest(() => queryDevelopViews());
  console.log(data)

  // const div

  const [choicedCondition, setChoicedCondition] = useState({start: "", end: ""})
  const onTimeSelected = () => {

  };

  const sendMessage = () => {

  };
  const columns: any = [

    {
      title: '所属端',
      dataIndex: 'money',
      align: 'center'
    },
    {
      title: '姓名',
      dataIndex: 'address',
      align: 'center'
    },
  ];

  const datawww = [
    {

      money: '前端',
      address: '刘黎明',
    },
    {

      money: '后端',
      address: '胡靖华/罗林',
    },
    {

      money: '测试',
      address: '徐睿',
    },
  ];

  // checkbox
  const onPlanChanged = (params: any) => {

    const selectedId = params.target.id;
    const isChecked = params.target.checked;
    console.log(selectedId, isChecked);
    message.info(selectedId);
  };

  const doubleClickRow = (params: any) => {
    const gridValue = params.target.parentElement.parentElement.innerText;
    console.log(gridValue);
    message.info(gridValue);
  };
  return (
    <PageContainer>
      {/* 时间查询条件 */}
      <div style={{width: '100%', backgroundColor: "white", marginTop: -15}}>
        <label style={{marginLeft: '10px'}}>计划筛选：</label>
        <RangePicker
          className={'times'}
          style={{width: '18%'}}
          value={[choicedCondition.start === "" ? null : moment(choicedCondition.start),
            choicedCondition.end === "" ? null : moment(choicedCondition.end)]}
          onChange={onTimeSelected}
        />

        <Button type="text" onClick={sendMessage} style={{marginLeft: 10, padding: 10}}>
          <img src="../pushMessage.png" width="25" height="25" alt="一键推送" title="一键推送"/> &nbsp;一键推送
        </Button>

      </div>

      <div style={{marginTop: 5, overflow: "scroll"}}>
        <table style={{width: "100%"}}>
          <tr>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox id={"2021/01/01~2021/01/07"} onChange={onPlanChanged}></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                  onRow={() => {
                    return {onDoubleClick: doubleClickRow};
                  }}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox id={"2021/01/01~2021/01/07"} onChange={onPlanChanged}></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
          </tr>

          <tr>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
          </tr>

          <tr>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
          </tr>

          <tr>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
            <td>
              <Card size="small"
                    title="2021/01/01~2021/01/07"
                    headStyle={{textAlign: "center"}}  //   {/*  backgroundColor: "#F0F2F5" */}
                    extra={<Checkbox></Checkbox>}>
                <Table
                  style={{marginTop: -10}}
                  size="small"
                  columns={columns}
                  dataSource={datawww}
                  bordered
                  showHeader={false}
                  pagination={false}
                />
              </Card>
            </td>
          </tr>
        </table>


      </div>
    </PageContainer>
  );
};

export default DutyPlan;
