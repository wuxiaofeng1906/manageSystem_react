import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {useRequest} from 'ahooks';
import {Button, DatePicker, Checkbox, Card, message, Row, Col, Avatar} from "antd";
import {DeleteTwoTone, EditTwoTone, FolderAddTwoTone} from "@ant-design/icons";
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

  const {data, loading} = useRequest(() => queryDevelopViews());

  const [choicedCondition, setChoicedCondition] = useState({start: "", end: ""})
  const onTimeSelected = () => {

  };

  const sendMessage = () => {

  };

  const {Meta} = Card;

  return (
    <PageContainer>

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
      <div style={{marginTop: 5}}>
        <Row gutter={16}>
          <Col className="gutter-row" span={5}>
            <Card size="small" title="2021/01/01~2021/01/07" extra={<Checkbox></Checkbox>}>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </Col>
          <Col className="gutter-row" span={5}>
            <Card size="small" title="2021/01/01~2021/01/07" extra={<Checkbox></Checkbox>}>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </Col>
          <Col className="gutter-row" span={5}>
            <Card size="small" title="2021/01/01~2021/01/07" extra={<Checkbox></Checkbox>}>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </Col>
          <Col className="gutter-row" span={5}>
            <Card size="small" title="2021/01/01~2021/01/07" extra={<Checkbox></Checkbox>}>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </Col>
          <Col className="gutter-row" span={5}>
            <Card size="small" title="2021/01/01~2021/01/07" extra={<Checkbox></Checkbox>}>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </Col>

        </Row>

      </div>


    </PageContainer>
  );
};

export default DutyPlan;
