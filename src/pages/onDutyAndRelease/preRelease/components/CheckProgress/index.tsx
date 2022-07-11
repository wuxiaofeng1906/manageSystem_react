import React, {useState} from 'react';
import {Progress, Row, Select, Modal, Button, Form, Checkbox} from 'antd';
import {useModel} from '@@/plugin-model/useModel';
import {saveProcessResult, executeAutoCheck} from './axiosRequest';
import {errorMessage, sucMessage} from "@/publicMethods/showMessages";
import {getAutoResult} from "./processAnalysis";

const {Option} = Select;

const CheckProgress: React.FC<any> = () => {
  // 获取当前页面的进度数据
  const {tabsData, processStatus, modifyProcessStatus, operteStatus} = useModel('releaseProcess');
  const [isModalVisible, setModalVisible] = useState({
    show: false,
    result: "",
    hintMsg: {message1: "", message2: ""},
    autoCheckDisabled: true
  });

  const [pulishResultForm] = Form.useForm();

  // 发布结果修改
  const pulishResulttChanged = async (params: any) => {

    // 需要验证前面的检查是否全部成功(前三个成功即可)。
    if (processStatus.releaseProject === 'Gainsboro' ||
      processStatus.upgradeService === 'Gainsboro' ||
      processStatus.dataReview === 'Gainsboro') {
      errorMessage('检查未全部完成，不能保存发布结果！');
      return;
    }

    let autoDisable = true;
    let hintMsgs = {
      message1: "请确认是否修改服务发布结果为空！",
      message2: ""
    };
    if (params === "1") {
      hintMsgs.message1 = "请确认服务是否发布成功?";
      hintMsgs.message2 = "如有自动化也执行通过!确认通过，会自动开放所有租户。";
      autoDisable = false;
    } else if (params === "2") {
      hintMsgs.message1 = "请确认服务是否发布失败！";
    }
    setModalVisible({
      autoCheckDisabled: autoDisable,
      hintMsg: hintMsgs,
      result: params,
      show: true
    });

    pulishResultForm.resetFields();
  };

  // 确认发布
  const handleOk = async () => {
    let checkResult: any;
    const formData = pulishResultForm.getFieldsValue();
    // 如果是发布成功，则需要判断下面自动化选项是否勾选
    if (!isModalVisible.autoCheckDisabled) { // 是发布成功
      if (formData.ignoreAfterCheck === undefined || (formData.ignoreAfterCheck).length === 0) { // 不忽略的时候
        if (formData.checkResult === undefined || (formData.checkResult).length === 0) { // 一个结果都没选中
          errorMessage("检查结果必须至少勾选一项！")
          return;
        }
      }

      // 发布成功才调用自动化检查接口
      const result = await executeAutoCheck(formData, tabsData.activeKey);
      if (result) {
        errorMessage(`发布成功后自动化检查失败：${result}`);
      } else {
        checkResult = await getAutoResult(tabsData.activeKey)
      }
    }

    const result = await saveProcessResult(tabsData.activeKey, isModalVisible.result);
    if (result === '') {
      sucMessage('发布结果保存成功！')
      modifyProcessStatus({
        ...processStatus,
        releaseResult: isModalVisible.result,
        autoCheckResult: checkResult
      });
      setModalVisible({
        ...isModalVisible,
        result: "",
        show: false
      });
    } else {
      errorMessage(result.toString())
    }
  };

  // 取消发布
  const handleCancel = () => {
    setModalVisible({
      ...isModalVisible,
      result: "",
      show: false
    });
  };

  return (
    <div>
      {/* 检查进度 */}
      <div style={{marginTop: -10}}>
        <div>
          <Row>
            <label style={{marginLeft: 5, fontWeight: 'bold'}}>检查进度：</label>
            <Progress
              strokeColor={'#2BF541'}
              style={{width: 800}}
              percent={processStatus.processPercent}
            />
          </Row>
        </div>

        {/* 检查总览 */}
        <div style={{marginTop: 5, marginLeft: 5}}>
          <label style={{fontWeight: 'bold'}}>检查总览：</label>
          <label>
            <button
              style={{
                height: 13,
                width: 13,
                border: 'none',
                backgroundColor: processStatus.releaseProject,
              }}
            ></button>
            &nbsp;预发布项目已填写完成
          </label>

          <label style={{marginLeft: 10}}>
            <button
              style={{
                height: 13,
                width: 13,
                border: 'none',
                backgroundColor: processStatus.upgradeService,
              }}
            ></button>
            &nbsp;升级服务已确认完成
          </label>

          <label style={{marginLeft: 10}}>
            <button
              style={{
                height: 13,
                width: 13,
                border: 'none',
                backgroundColor: processStatus.dataReview,
              }}
            ></button>
            &nbsp;数据Review确认完成
          </label>

          <label style={{marginLeft: 10}}>
            <button
              style={{
                height: 13,
                width: 13,
                border: 'none',
                backgroundColor: processStatus.onliineCheck,
              }}
            ></button>
            &nbsp;分支检查已完成
          </label>

          <label style={{marginLeft: 10}}>
            <label style={{fontWeight: 'bold'}}>发布结果：</label>
            <Select
              size={'small'}
              style={{width: 100}}
              onChange={pulishResulttChanged}
              value={processStatus.releaseResult}
              disabled={operteStatus}
            >
              <Option key={'1'} value={'1'}>
                发布成功
              </Option>
              <Option key={'2'} value={'2'}>
                发布失败
              </Option>
              <Option key={'9'} value={'9'}>
                {' '}
              </Option>
            </Select>
          </label>

          <label style={{marginLeft: 10}}>
            {processStatus.autoCheckResult}
          </label>
        </div>
      </div>

      {/* 发布结果确认弹出窗   */}
      <Modal title="发布结果确认" visible={isModalVisible.show} width={400}
             onCancel={handleCancel} centered={true}
             bodyStyle={{height: 145}}
             footer={[
               <Button key="cancle" onClick={handleCancel} style={{borderRadius: 5}}>
                 取消
               </Button>,
               <Button key="submit" type="primary" onClick={handleOk}
                       style={{
                         color: '#46A0FC', backgroundColor: '#ECF5FF',
                         borderRadius: 5
                       }}>
                 确定
               </Button>,
             ]}>

        <Form form={pulishResultForm} style={{marginTop: -15}}>
          <Form.Item>
            {isModalVisible.hintMsg.message1}
          </Form.Item>
          <Form.Item
            style={{marginTop: -25, display: isModalVisible.hintMsg.message2 === "" ? "none" : "inline-block"}}>
            {isModalVisible.hintMsg.message2}
          </Form.Item>
          <Form.Item label="是否忽略发布成功后自动化检查:" name="ignoreAfterCheck" style={{marginTop: -25}}>
            <Checkbox.Group style={{width: '100%'}} disabled={isModalVisible.autoCheckDisabled}>
              <Checkbox value="yes">忽略检查</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="检查结果:" name="checkResult" style={{marginTop: -25}}>
            <Checkbox.Group style={{width: '100%'}} disabled={isModalVisible.autoCheckDisabled}>
              <Checkbox value="ui">UI执行通过</Checkbox>
              <Checkbox value="applet">小程序执行通过</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default CheckProgress;
