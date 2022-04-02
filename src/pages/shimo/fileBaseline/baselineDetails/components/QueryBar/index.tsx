import React from "react";
import {Form, Row, Col, TreeSelect, DatePicker, Button, Input} from 'antd';
import "./style.css";
import {errorMessage, infoMessage, sucMessage} from "@/publicMethods/showMessages";
import {CheckSquareTwoTone} from "@ant-design/icons";

const QueryBar: React.FC<any> = () => {
  const BaseLine = () => {

  };

  return (
    <div className={"queryCondition"}>
      <Form>
        <Row gutter={5}>

          <Col span={8}>
            <Form.Item label="迭代名称" name={"iterName"}>
              <TreeSelect className={"iterName"} placeholder="默认选择全部"/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="SQA" name={"SQA"}>
              <Input className={"SQA"} disabled={true}/>
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item>
              <Button type="text" icon={<CheckSquareTwoTone/>}
                      onClick={BaseLine}>基线</Button>
            </Form.Item>
          </Col>

        </Row>
      </Form>


    </div>

  );

}

export default QueryBar
