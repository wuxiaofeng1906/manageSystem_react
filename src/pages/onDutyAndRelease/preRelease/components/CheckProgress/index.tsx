import React, {useState} from 'react';
import {message, Progress, Row, Select, Modal, Button} from 'antd';
import {useModel} from '@@/plugin-model/useModel';
import {saveProcessResult} from './axiosRequest';
import {errorMessage, sucMessage} from "@/publicMethods/showMessages";

const {Option} = Select;

const CheckProgress: React.FC<any> = () => {
  // 获取当前页面的进度数据
  const {tabsData, processStatus, modifyProcessStatus, operteStatus} = useModel('releaseProcess');
  const [isModalVisible, setModalVisible] = useState({show: false, result: "", hintMsg: ""});
  // 发布结果修改
  const pulishResulttChanged = async (params: any) => {

    // 需要验证前面的检查是否全部成功(前三个成功即可)。
    if (processStatus.releaseProject === 'Gainsboro' ||
      processStatus.upgradeService === 'Gainsboro' ||
      processStatus.dataReview === 'Gainsboro') {
      errorMessage('检查未全部完成，不能保存发布结果！');
      return;
    }

    let hintMsgs = "请确认是否修改服务发布结果为空！"
    if (params === "1") {
      hintMsgs = "请确认服务是否发布成功，如有自动化也执行通过!";
    } else if (params === "2") {
      hintMsgs = "请确认服务是否发布失败！";
    }
    setModalVisible({
      hintMsg: hintMsgs,
      result: params,
      show: true
    });

  };

  // 确认发布
  const handleOk = async () => {
    const result = await saveProcessResult(tabsData.activeKey, isModalVisible.result);
    if (result === '') {
      sucMessage('发布结果保存成功！')
      modifyProcessStatus({
        ...processStatus,
        releaseResult: isModalVisible.result,
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
        </div>
      </div>

      {/* 发布结果确认弹出窗 */}
      <Modal title="发布结果确认" visible={isModalVisible.show} width={400}
             onCancel={handleCancel} centered={true}
             footer={[
               <Button key="cancle" onClick={handleCancel}>
                 取消
               </Button>,
               <Button key="submit" type="primary" onClick={handleOk}>
                 确定
               </Button>,
             ]}>
        <p>{isModalVisible.hintMsg}</p>
      </Modal>

    </div>
  );
};

export default CheckProgress;
