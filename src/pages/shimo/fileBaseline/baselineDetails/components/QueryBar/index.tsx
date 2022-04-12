import React, {useEffect} from "react";
import {Form, Row, Col, Select, Button, Input} from 'antd';
import {queryCondition, queryRow, SQA} from "./style.css";
import {CheckSquareTwoTone} from "@ant-design/icons";
import {useRequest} from "ahooks";
import {getIterSelect} from "./selector";
import {getSqaByIterName, setBaseLineFor} from "./dataAlaysis";
import {useModel} from "@@/plugin-model/useModel";
import {errorMessage, sucMessage} from "@/publicMethods/showMessages";


const QueryBar: React.FC<any> = (props: any) => {
  const userLogins: any = localStorage.getItem('userLogins');
  const usersInfo = JSON.parse(userLogins);

  const {gridApi} = useModel("iterateList.index");
  const prjInfo = props.hrefParams;
  const iterateList: any = useRequest(() => getIterSelect()).data;
  const [iterDetailsForm] = Form.useForm();

  // 获取最后一个文件名称
  const getFileName = (rows: any) => {
    let fileKey: any = []; // 保存是文件列的数据
    const keyArray = Object.keys(rows);
    keyArray.forEach((key: string) => {
      if (key.endsWith("_file")) {
        fileKey.push(Number(key.split("_")[0]));
      }
    });
    fileKey = fileKey.sort();

    const lastFIleName = rows[`${fileKey.length}_file`]
    return lastFIleName;

  };
  // 基线按钮点击
  const BaseLineClicked = async () => {
    const iterInfo = iterDetailsForm.getFieldValue("iterName");

    // @ts-ignore
    const sel_rows: any = gridApi.getSelectedRows();

    if (sel_rows.length === 0) {
      errorMessage("请选中需要基线的数据！");
      return;
    }

    const data: any = [];
    sel_rows.forEach((ele: any) => {
      data.push({
        "guid": ele.guid,
        "file_name": getFileName(ele),
        "file_type": ele.file_type,
        "execution_name": iterInfo,
        "user_id": usersInfo.userid,
      });
    });

    const result = await setBaseLineFor(data);
    if (JSON.stringify(result) !== "{}") {
      if (result.code === 200) {
        sucMessage("基线成功！");
      } else {
        errorMessage(result.msg);
      }
    }
  };

  // 迭代名称修改
  const iterNameChanged = async (iterId: any) => {

    const sqaInfo = await getSqaByIterName(iterId);

    iterDetailsForm.setFieldsValue({
      iterName: iterId,
      SQA: sqaInfo.user_name
    });
  };

  useEffect(() => {

    iterDetailsForm.setFieldsValue({
      iterName: prjInfo.iterName,
      SQA: prjInfo.SQA === "null" ? "" : prjInfo.SQA
    });
  }, [iterateList])

  return (
    <div className={queryCondition}>
      <Form form={iterDetailsForm}>
        <Row gutter={5} className={queryRow}>
          <Col span={8}>
            <Form.Item label="迭代名称" name={"iterName"} style={{marginLeft: 10}}>
              <Select className={"iterName"} onChange={iterNameChanged} showSearch
                // filterOption={(inputValue: string, option: any) =>
                //   !!option.children.includes(inputValue)}
              >
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
