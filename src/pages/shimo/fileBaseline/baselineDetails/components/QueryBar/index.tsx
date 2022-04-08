import React, {useEffect} from "react";
import {Form, Row, Col, Select, Button, Input} from 'antd';
import {queryCondition, queryRow, SQA} from "./style.css";
import {CheckSquareTwoTone} from "@ant-design/icons";
import {useRequest} from "ahooks";
import {useModel} from "@@/plugin-model/useModel";
import {getIterSelect} from "./selector";
import {getSqaByIterName, setBaseLineFor} from "./dataAlaysis";

let selected_sqa = -1; // 记录选中的sqaID
const QueryBar: React.FC<any> = () => {
  const {listParams} = useModel("iterateList.index");

  const iterateList: any = useRequest(() => getIterSelect()).data;
  const [iterDetailsForm] = Form.useForm();

  // 基线按钮点击
  const BaseLineClicked = async () => {
    const iterInfo = iterDetailsForm.getFieldValue("iterName");

    const result = await setBaseLineFor({
      iterId: iterInfo,
      sqaId: selected_sqa
    });
  };

  // 迭代名称修改
  const iterNameChanged = async (iterId: any) => {

    const sqaInfo = await getSqaByIterName(iterId);
    selected_sqa = sqaInfo.user_id
    iterDetailsForm.setFieldsValue({
      iterName: iterId,
      SQA: sqaInfo.user_name
    });
  };

  useEffect(() => {
    iterDetailsForm.setFieldsValue({
      iterName: listParams.iterId,
      SQA: listParams.SQA
    });
  }, [iterateList])

  return (
    <div className={queryCondition}>
      <Form form={iterDetailsForm}>
        <Row gutter={5} className={queryRow}>
          <Col span={8}>
            <Form.Item label="迭代名称" name={"iterName"} style={{marginLeft: 10}}>
              <Select className={"iterName"} onChange={iterNameChanged} showSearch
                      filterOption={(inputValue: string, option: any) =>
                        !!option.children.includes(inputValue)}>
                {iterateList}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="SQA" name={"SQA"}>
              <Input className={SQA} disabled={true} style={{color: "black"}}/>
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
