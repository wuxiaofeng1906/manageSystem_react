import React from "react";
import {Form, Row, Col, TreeSelect, DatePicker} from 'antd';
import "./style.css";
import {errorMessage, infoMessage, sucMessage} from "@/publicMethods/showMessages";

const {RangePicker} = DatePicker;
const QueryBar: React.FC<any> = () => {

  return (
    <div className={"queryCondition"}>
      <Form>
        <Row gutter={5}>
          <Col span={6}>
            <Form.Item label="部门/组" name={"dept"}>
              <TreeSelect className={"deptTree"} placeholder="默认选择全部"/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="迭代名称" name={"iterName"}>
              <TreeSelect className={"iterName"} placeholder="默认选择全部"/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="SQA" name={"SQA"}>
              <TreeSelect className={"SQA"} placeholder="默认选择全部"/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="迭代周期" name={"iterRange"}>
              <RangePicker className={"iterRange"} allowClear={false}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>


    </div>

  );

}

export default QueryBar
