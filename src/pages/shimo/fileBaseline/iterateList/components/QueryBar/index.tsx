import React, {useEffect} from "react";
import {Form, Row, Col, TreeSelect, DatePicker} from 'antd';
import {queryCondition} from "./style.css";
import {useRequest} from "ahooks";
import {getDeptName, getIterateName, getIterateStatus, getSQAName} from "./selector";
import defaultTreeSelectParams from "../../defaultSetting";
import {useModel} from "@@/plugin-model/useModel";
import {getIterListData} from "../GridList/gridData";

const {RangePicker} = DatePicker;
const QueryBar: React.FC<any> = () => {

  const {queryInfo, setQueryInfo, setListData} = useModel("iterateList.index");
  const [iterForm] = Form.useForm();
  iterForm.setFieldsValue(queryInfo);

  const deptList: any = useRequest(() => getDeptName()).data;
  const iterateList: any = useRequest(() => getIterateName()).data;
  const iterateStatusList: any = useRequest(() => getIterateStatus()).data;
  const sqaList: any = useRequest(() => getSQAName()).data;

  /* region 条件changed */

  // 部门改变
  const iterDeptChanged = (deptsId: any) => {

    setQueryInfo({
      ...queryInfo,
      dept: deptsId
    });
  };

  // 迭代名称改变
  const iterNameChanged = (iterIds: any) => {

    setQueryInfo({
      ...queryInfo,
      iterName: iterIds
    });
  };

  const iterStatusChanged = (iterStatusIds: any) => {
    setQueryInfo({
      ...queryInfo,
      iterStatus: iterStatusIds
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
  const updateGrid = async () => {
    // 条件选择完成后会进行调用，刷新数据界面
    const dts = await getIterListData(queryInfo);
    setListData(dts);
  }

  useEffect(() => {
    updateGrid();
  }, [queryInfo]);
  return (
    <div className={queryCondition}>
      <Form form={iterForm}>
        <Row gutter={5}>
          <Col span={8}>
            <Form.Item label="部门/组" name={"dept"}>
              <TreeSelect className={"deptTree"}
                          {...defaultTreeSelectParams}
                          showCheckedStrategy={'SHOW_PARENT'}
                          treeData={deptList}
                          onChange={iterDeptChanged}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="迭代名称" name={"iterName"}>
              <TreeSelect className={"iterName"}
                          {...defaultTreeSelectParams}
                          showCheckedStrategy={'SHOW_PARENT'}
                          treeData={iterateList}
                          onChange={iterNameChanged}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="迭代状态" name={"iterStatus"}>
              <TreeSelect className={"iterStatus"}
                          {...defaultTreeSelectParams}
                          showCheckedStrategy={'SHOW_PARENT'}
                          placeholder="默认选择未关闭"
                          treeData={iterateStatusList}
                          onChange={iterStatusChanged}/>
            </Form.Item>
          </Col>

        </Row>
        <Row gutter={5} style={{marginTop: -20}}>

          <Col span={8}>
            <Form.Item label="SQA" name={"SQA"} style={{marginLeft: 20}}>
              <TreeSelect className={"SQA"}
                          {...defaultTreeSelectParams}
                          showCheckedStrategy={'SHOW_PARENT'}
                          treeData={sqaList}
                          onChange={iterSQAChanged}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="迭代周期" name={"iterRange"}>
              <RangePicker style={{width: "100%"}} allowClear={false} onChange={iterRangeChanged}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>

    </div>

  );

}

export default QueryBar
