import React, {useEffect} from "react";
import {Form, Row, Col, Select, Button, Input} from 'antd';
import {queryCondition, queryRow, SQA, baseLineButton} from "./style.css";
import {EditTwoTone} from "@ant-design/icons";
import {useRequest} from "ahooks";
import {getIterSelect, getIterSelectedValue} from "./selector";
import {getSqaByIterName, setBaseLineFor} from "./dataAlaysis";
import {useModel} from "@@/plugin-model/useModel";
import {errorMessage, sucMessage} from "@/publicMethods/showMessages";
import {getIterDetailsData} from "@/pages/shimo/fileBaseline/baselineDetails/components/GridList/gridData";

const QueryBar: React.FC<any> = (props: any) => {
  const userLogins: any = localStorage.getItem('userLogins');
  const usersInfo = JSON.parse(userLogins);

  const {gridApi, setDetailsData, setColumns} = useModel("iterateList.index");
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

    // @ts-ignore
    const sel_rows: any = gridApi.getSelectedRows();
    if (sel_rows.length === 0) {
      errorMessage("请选中需要基线的数据！");
      return;
    }

    const iterInfoId = iterDetailsForm.getFieldValue("iterName");
    const iterName = await getIterSelectedValue(iterInfoId);
    const data: any = [];
    sel_rows.forEach((ele: any) => {
      data.push({
        "guid": ele.guid,
        "file_name": getFileName(ele),
        "file_type": ele.file_type,
        "execution_name": iterName,
        "user_id": usersInfo.userid === "test" ? "ChenHuan" : usersInfo.userid,
      });
    });

    const result = await setBaseLineFor(data);
    if (JSON.stringify(result) !== "{}") {
      if (result.code === 200) {
        sucMessage("基线成功！");
        //  基线成功后要刷新数据
        const gridData: any = await getIterDetailsData(prjInfo.storyId);
        setColumns(gridData?.columnsData); // 设置列
        setDetailsData(gridData?.gridData); // 设置数据

      } else {
        errorMessage(result.msg);
      }
    }
  };

  // 迭代名称修改
  const iterNameChanged = async (iterId: any) => {

    const sqaInfo = await getSqaByIterName(iterId);

    let sqa_user = "";
    if (sqaInfo && sqaInfo.user_name) {
      sqa_user = sqaInfo.user_name;
    }
    iterDetailsForm.setFieldsValue({
      iterName: iterId,
      SQA: sqa_user
    });
  };

  useEffect(() => {

    iterDetailsForm.setFieldsValue({
      iterName: Number(prjInfo.iterID),
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
                      filterOption={(inputValue: string, option: any) =>
                        !!option.children.includes(inputValue)}
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
              <Button icon={<EditTwoTone/>} className={baseLineButton}
                      onClick={BaseLineClicked}>基线</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>

  );

}

export default QueryBar
