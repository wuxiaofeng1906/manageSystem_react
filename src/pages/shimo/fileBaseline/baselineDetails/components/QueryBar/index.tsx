import React, {useEffect} from "react";
import {Form, Row, Col, TreeSelect, DatePicker, Button, Input} from 'antd';
import {queryCondition, queryRow, iterName, SQA} from "./style.css";
import {errorMessage, infoMessage, sucMessage} from "@/publicMethods/showMessages";
import {CheckSquareTwoTone} from "@ant-design/icons";
import {useRequest} from "ahooks";
import {getIterateName} from "@/pages/shimo/fileBaseline/iterateList/components/QueryBar/selector";
import defaultTreeSelectParams from "@/pages/shimo/fileBaseline/iterateList/defaultSetting";
import {useModel} from "@@/plugin-model/useModel";

const QueryBar: React.FC<any> = () => {
  const {queryDetailsInfo, setQueryDetailsInfo} = useModel("iterateList.index");

  const iterateList: any = useRequest(() => getIterateName()).data;
  const [iterDetailsForm] = Form.useForm();

  // 基线按钮点击
  const BaseLineClicked = () => {

  };

  // 迭代名称修改
  const iterNameChanged = () => {

  };

  useEffect(() => {
    iterDetailsForm.setFieldsValue({
      iterName: queryDetailsInfo.iterName,
      SQA: queryDetailsInfo.SQA
    });
  }, [iterateList])

  return (
    <div className={queryCondition}>
      <Form form={iterDetailsForm}>
        <Row gutter={5} className={queryRow}>
          <Col span={8}>
            <Form.Item label="迭代名称" name={"iterName"} style={{marginLeft: 10}}>
              <TreeSelect className={"iterName"}
                          {...defaultTreeSelectParams}
                          treeData={iterateList}
                          onChange={iterNameChanged}
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
                      onClick={BaseLineClicked}>基线</Button>
            </Form.Item>
          </Col>

        </Row>
      </Form>


    </div>

  );

}

export default QueryBar
