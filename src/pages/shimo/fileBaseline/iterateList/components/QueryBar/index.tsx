import React from "react";
import {Form, Row, Col, TreeSelect, DatePicker} from 'antd';
import {queryCondition} from "./style.css";
import {errorMessage, infoMessage, sucMessage} from "@/publicMethods/showMessages";
import {useRequest} from "ahooks";
import {getIterateName, getSQAName} from "./selector";
import defaultTreeSelectParams from "../../defaultSetting";

const {RangePicker} = DatePicker;
const QueryBar: React.FC<any> = () => {

  const iterateList: any = useRequest(() => getIterateName()).data;
  const sqaList: any = useRequest(() => getSQAName()).data;

  const iterChanged = (iterId: string) => {
    console.log(iterId);
  };

  return (
    <div className={queryCondition}>
      <Form>
        <Row gutter={5}>
          <Col span={6}>
            <Form.Item label="部门/组" name={"dept"}>
              <TreeSelect className={"deptTree"} placeholder="默认选择全部"/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="迭代名称" name={"iterName"}>
              <TreeSelect className={"iterName"}
                          {...defaultTreeSelectParams} treeData={iterateList}
                          onChange={iterChanged}/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="SQA" name={"SQA"}>
              <TreeSelect className={"SQA"}  {...defaultTreeSelectParams} treeData={sqaList}
                          onChange={iterChanged}/>
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
