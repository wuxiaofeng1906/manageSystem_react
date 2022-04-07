import React, {useEffect} from "react";
import {Form, Row, Col, TreeSelect, DatePicker} from 'antd';
import {queryCondition} from "./style.css";
import {errorMessage, infoMessage, sucMessage} from "@/publicMethods/showMessages";
import {useRequest} from "ahooks";
import {getDeptName,getIterateName, getSQAName} from "./selector";
import defaultTreeSelectParams from "../../defaultSetting";
import dayjs from "dayjs";
import moment from "moment";
import {useModel} from "@@/plugin-model/useModel";

const {RangePicker} = DatePicker;
const QueryBar: React.FC<any> = () => {
  const {queryInfo, setQueryInfo} = useModel("iterateList.index");
  const [iterForm] = Form.useForm();
  iterForm.setFieldsValue(queryInfo);

  const deptList: any = useRequest(() => getDeptName()).data;
  const iterateList: any = useRequest(() => getIterateName()).data;
  const sqaList: any = useRequest(() => getSQAName()).data;

  /* region 条件changed */
  // 部门改变
  const iterDeptChanged = () => {

  }
  // 迭代名称改变
  const iterNameChanged = (iterIds: any) => {

    setQueryInfo({
      ...queryInfo,
      iterName: iterIds
    });
  };

  // SQA改变
  const iterSQAChanged = (sqaId: string) => {
    setQueryInfo({
      ...queryInfo,
      SQA: sqaId
    });
  };

  // 迭代周期改变
  const iterRangeChanged = (timeRange: any) => {
    setQueryInfo({
      ...queryInfo,
      iterRange: timeRange
    });
  };

  /* endregion 条件changed */

  return (
    <div className={queryCondition}>
      <Form form={iterForm}>
        <Row gutter={5}>
          <Col span={6}>
            <Form.Item label="部门/组" name={"dept"}>
              <TreeSelect className={"deptTree"}
                          {...defaultTreeSelectParams} treeData={deptList}
                          onChange={iterDeptChanged}/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="迭代名称" name={"iterName"}>
              <TreeSelect className={"iterName"}
                          {...defaultTreeSelectParams} treeData={iterateList}
                          onChange={iterNameChanged}/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="SQA" name={"SQA"}>
              <TreeSelect className={"SQA"}
                          {...defaultTreeSelectParams} treeData={sqaList}
                          onChange={iterSQAChanged}/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="迭代周期" name={"iterRange"}>
              <RangePicker className={"iterRange"} allowClear={false} onChange={iterRangeChanged}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>

    </div>

  );

}

export default QueryBar
