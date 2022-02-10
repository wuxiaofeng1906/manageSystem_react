import React from 'react';
import {Button, Form, Input, message, Modal} from 'antd';
import {useModel} from '@@/plugin-model/useModel';
import {getLockedId, getLockStatus} from "../../lock/rowLock";
import {delUpgradeItems} from "./axiosRequest";
import {vertifyModifyFlag} from '../../operate';
import {alalysisInitData} from "../../datas/dataAnalyze";
import {getGridRowsHeight} from "../../components/gridHeight";
import {showReleasedId} from "@/pages/onDutyAndRelease/preRelease/components/UpgradeService/idDeal/dataDeal";

const DeleteRow: React.FC<any> = () => {
  // 获取当前页面的进度数据
  const {
    tabsData, delModal, setDelModal, modifyReleasedID, setRelesaeItem, setUpgradeApi, setDataReview, setOnlineBranch
  } = useModel('releaseProcess');

  // 删除事件
  (window as any).deleteGridRows = async (item: any, params: any) => {

    const flag = await vertifyModifyFlag(item, tabsData.activeKey);
    if (!flag) {
      message.error({
        content: `服务确认已完成，不能进行删除！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return;
    }

    setDelModal({
      type: item,
      shown: true,
      datas: params,
    });
  };

  // 显示删除后的数据
  const showdeletedNewData = async () => {
    const {type} = delModal;
    const currentListNo = tabsData.activeKey;
    switch (type) {
      case 1: {
        const newDatas = await alalysisInitData('pulishItem', currentListNo);
        setRelesaeItem({
          gridHight: getGridRowsHeight((newDatas.upService_releaseItem)),
          gridData: newDatas.upService_releaseItem
        });
        // firstUpSerGridApi.current?.setRowData(newDatas.upService_releaseItem);
        const ids = await showReleasedId(newDatas?.upService_releaseItem);
        modifyReleasedID(ids.showIdArray, ids.queryIdArray);

        // modifyReleasedID(newDatas?.upService_releaseItem); // 也要刷新一键部署ID
      }
        break;
      case 2: {
        const newDatas: any = await alalysisInitData('pulishApi', currentListNo);
        setUpgradeApi({
          gridHight: getGridRowsHeight((newDatas.upService_interface)),
          gridData: newDatas.upService_interface
        });
      }
        break;
      case 3: {
        const newDatas: any = await alalysisInitData('dataReview', currentListNo);
        setDataReview({
          gridHight: getGridRowsHeight((newDatas.reviewData_repaire)),
          gridData: newDatas.reviewData_repaire
        });
      }
        break;
      case 4: {
        const newDatas: any = await alalysisInitData('onlineBranch', currentListNo);
        setOnlineBranch({
          gridHight: getGridRowsHeight((newDatas.onlineBranch), true),
          gridData: newDatas.onlineBranch
        });
      }
        break;
      default:
        break;
    }
  };

  // 数据删除
  const delDetailsInfo = async () => {
    const lockInfo = await getLockStatus(getLockedId(delModal.type, tabsData.activeKey, delModal.datas));

    if (lockInfo.errMessage) {
      message.error({
        content: `删除失败：${lockInfo.errMessage}`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return;
    }
    // 删除数据
    const result: string = await delUpgradeItems(delModal.type, delModal.datas);
    if (result === '') {
      message.info({
        content: '删除成功！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      showdeletedNewData();
    } else {
      message.error({
        content: `${result}`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }

    setDelModal({
      shown: false,
      type: -1,
      datas: {},
    });
  };

  // 取消删除
  const delCancel = () => {
    setDelModal({
      shown: false,
      type: -1,
      datas: {},
    });
  };

  return (
    <div>

      <Modal
        title={'删除'}
        visible={delModal.shown}
        onCancel={delCancel}
        centered={true}
        footer={null}
        width={400}
        bodyStyle={{height: 130}}
      >
        <Form>
          <Form.Item>
            <label style={{marginLeft: '100px'}}>确定删除本条数据吗？</label>
          </Form.Item>

          <Form.Item>
            <Button style={{borderRadius: 5, marginLeft: 20, float: 'right'}} onClick={delCancel}>
              取消
            </Button>

            <Button
              type="primary"
              style={{
                color: '#46A0FC',
                backgroundColor: '#ECF5FF',
                borderRadius: 5,
                marginLeft: 100,
                float: 'right',
              }}
              onClick={delDetailsInfo}
            >
              确定
            </Button>
          </Form.Item>

          <Form.Item
            name="groupId"
            style={{display: 'none', width: '32px', marginTop: '-55px', marginLeft: '270px'}}
          >
            <Input/>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default DeleteRow;
