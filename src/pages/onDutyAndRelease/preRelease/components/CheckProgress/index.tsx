import React from 'react';
import { message, Progress, Row, Select } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import { saveProcessResult } from './axiosRequest';

const { Option } = Select;

const CheckProgress: React.FC<any> = () => {
  // 获取当前页面的进度数据
  const { tabsData, processStatus } = useModel('releaseProcess');

  // 发布结果修改
  const pulishResulttChanged = async (params: any) => {
    // 需要验证前面的检查是否全部成功。

    if (
      processStatus.releaseProject === 'Gainsboro' ||
      processStatus.upgradeService === 'Gainsboro' ||
      processStatus.dataReview === 'Gainsboro' ||
      processStatus.onliineCheck === 'Gainsboro'
    ) {
      message.error({
        content: '检查未全部完成，不能保存发布结果！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return;
    }
    const result = await saveProcessResult(tabsData.activeKey, params);
    if (result === '') {
      message.info({
        content: '保存成功！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      // modifyProcessStatus({
      //   ...processStatus,
      //   releaseResult: params,
      // });
    } else {
      message.error({
        content: result,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }
  };

  return (
    <div>
      {/* 检查进度 */}
      <div style={{ marginTop: -10 }}>
        <div>
          <Row>
            <label style={{ marginLeft: 5, fontWeight: 'bold' }}>检查进度：</label>
            <Progress
              strokeColor={'#2BF541'}
              style={{ width: 800 }}
              percent={processStatus.processPercent}
            />
          </Row>
        </div>

        {/* 检查总览 */}
        <div style={{ marginTop: 5, marginLeft: 5 }}>
          <label style={{ fontWeight: 'bold' }}>检查总览：</label>
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

          <label style={{ marginLeft: 10 }}>
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

          <label style={{ marginLeft: 10 }}>
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

          <label style={{ marginLeft: 10 }}>
            <button
              style={{
                height: 13,
                width: 13,
                border: 'none',
                backgroundColor: processStatus.onliineCheck,
              }}
            ></button>
            &nbsp;上线前检查已完成
          </label>

          <label style={{ marginLeft: 10 }}>
            <label style={{ fontWeight: 'bold' }}>发布结果：</label>
            <Select
              size={'small'}
              style={{ width: 100 }}
              onChange={pulishResulttChanged}
              value={processStatus.releaseResult}
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
    </div>
  );
};

export default CheckProgress;
