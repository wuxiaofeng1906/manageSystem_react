import React from "react";
import {Form, Row, Col, TreeSelect, DatePicker, Button, Input} from 'antd';
import {queryCondition, queryRow, iterName, SQA} from "./style.css";
import {errorMessage, infoMessage, sucMessage} from "@/publicMethods/showMessages";
import {CheckSquareTwoTone} from "@ant-design/icons";
import {useRequest} from "ahooks";
import {getIterateName} from "@/pages/shimo/fileBaseline/iterateList/components/QueryBar/selector";
import defaultTreeSelectParams from "@/pages/shimo/fileBaseline/iterateList/defaultSetting";

const QueryBar: React.FC<any> = () => {
  const iterateList: any = useRequest(() => getIterateName()).data;

  const BaseLine = () => {

  };

  return (
    <div className={queryCondition}>
      <Form>
        <Row gutter={5} className={queryRow}>
          <Col span={8}>
            <Form.Item label="迭代名称" name={"iterName"} style={{marginLeft: 10}}>
              <TreeSelect className={"iterName"}
                          {...defaultTreeSelectParams}
                          treeData={iterateList}
              />
            </Form.Item>

          </Col>
          <Col span={8}>
            <Form.Item label="SQA" name={"SQA"}>
              <Input className={SQA} disabled={true}/>
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
