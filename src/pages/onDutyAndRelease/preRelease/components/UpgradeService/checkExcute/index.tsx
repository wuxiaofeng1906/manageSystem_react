import {message} from "antd";

const serverConfirmJudge = (currentOperateStatus: any, props: any, autoHitMessage: any) => {

  // 判断发布是否已完成，已完成不能修改
  if (currentOperateStatus) {
    message.error({
      content: `发布已完成，不能修改确认结果！`,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
    return false;
  }

  // 需要判断前后端和流程的数据是否确认，只有都确认了测试才能确认（如果不涉及某一段的，就跳过那一段）
  const confirmData = props?.data;
  if (props.column.colId === 'test_confirm_status') {
    if (confirmData.front_confirm_status === '2' || confirmData.back_end_confirm_status === '2' || confirmData.process_confirm_status === '2') {
      message.error({
        content: '保存失败：请先完成开发确认！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return false;
    }
  }

  // 前端和测试需要判断有没有勾选自动化用例，如果没有，则不能进行修改。。
  if ((props.column.colId === 'front_confirm_status' || props.column.colId === 'test_confirm_status') && autoHitMessage !== "") {
    message.error({
      content: '保存失败：存在未勾选自动化用例参数的一键部署ID！',
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });

    return false;
  }

  return true;
};

export {serverConfirmJudge};
