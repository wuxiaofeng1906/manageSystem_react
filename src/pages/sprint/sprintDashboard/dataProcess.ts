const statusDeal = (itemArray: any) => {

  // const storyStatusCount: any = {
  //
  //   // 规范检查
  //   status_draft: 22,  // 草稿
  //   status_no_task: 22, // 无任务
  //   status_lack_task: 22, // 缺任务
  //   status_no_deadline: 22, // 无排期
  //   status_no_assign: 11, // 无指派
  //   status_un_modify: 22, // 未更新
  //   status_proj_error: 22, // 项目错误
  //   status_over_area: 22,// 超范围
  //
  //   // 开发进展
  //   status_devtask_delay: 1, // 任务延期
  //   status_dev_wait: 2, // 未开始
  //   status_developing: 2, // 开发中
  //   status_dev_done: 2, // 开发完
  //
  //   // 提测进展
  //   status_raisetest_delay: 2, // 提测延期
  //   status_un_raisetest: 1,// 未提测
  //   status_raisetest_done: 2,// 已提测
  //
  //   // 测试进展
  //   status_testtask_delay: 1, // 任务延期
  //   status_test_wait: 1, // 未开始
  //   status_testing: 1, // 测试中
  //   status_test_done: 1 // 测试完
  //
  // };
  const storyStatusCount = Object();
  for (let i = 0; i < itemArray.length; i += 1) {
    const count = itemArray[i].value;
    switch (itemArray[i].item) {
      // 规范检查
      case "draft":
        storyStatusCount.status_draft = count;
        break;
      case "no_task":
        storyStatusCount.status_no_task = count;
        break;
      case "lack_task":
        storyStatusCount.status_lack_task = count;
        break;
      case "no_deadline":
        storyStatusCount.status_no_deadline = count;
        break;
      case "no_assign":
        storyStatusCount.status_no_assign = count;
        break;
      case "un_modify":
        storyStatusCount.status_un_modify = count;
        break;
      case "proj_error":
        storyStatusCount.status_proj_error = count;
        break;
      case "over_area":
        storyStatusCount.status_over_area = count;
        break;

      // 开发进展
      case "devtask_delay":
        storyStatusCount.status_devtask_delay = count;
        break;
      case "dev_wait":
        storyStatusCount.status_dev_wait = count;
        break;
      case "developing":
        storyStatusCount.status_developing = count;
        break;
      case "dev_done":
        storyStatusCount.status_dev_done = count;
        break;

      // 提测进展
      case "raisetest_delay":
        storyStatusCount.status_raisetest_delay = count;
        break;
      case "un_raisetest":
        storyStatusCount.status_un_raisetest = count;
        break;
      case "raisetest_done":
        storyStatusCount.status_raisetest_done = count;
        break;

      // 测试进展
      case "testtask_delay":
        storyStatusCount.status_testtask_delay = count;
        break;
      case "test_wait":
        storyStatusCount.status_test_wait = count;
        break;
      case "testing":
        storyStatusCount.status_testing = count;
        break;
      case "test_done":
        storyStatusCount.status_test_done = count;
        break;

      default:
        break;
    }

  }

  return storyStatusCount;
};

const bugDeal = (itemArray: any) => {

  // const storyBugCount: any = {
  //
  //   // 规范检查
  //   Bug_no_assign: 0, // 无指派
  //   Bug_no_deadline: 0, // 无排期
  //   Bug_no_bug: 0, // 无bug
  //   Bug_proj_error: 0, // 项目错误
  //   Bug_over_area: 0,// 超范围
  //
  //   // bug状态
  //   Bug_actived: 0, // 激活
  //   Bug_resolved: 0, // 已解决
  //   Bug_verified: 0, // 已验证
  //   Bug_closed: 0, // 已关闭
  //
  //   // 激活时长
  //   Bug_ac_24: 0, // >24H
  //   Bug_ac_1624: 0,// 16-24H
  //   Bug_ac_0816: 0, // 8-16H
  //   Bug_ac_08: 0,// <8H
  //
  //   // 待回验
  //   Bug_ve_24: 0,// >24H
  //   Bug_ve_1624: 0,// 16-24H
  //   Bug_ve_0816: 0,// 8-16H
  //   Bug_ve_08: 0 // <8H
  //
  // };

  const storyBugCount = Object();
  for (let i = 0; i < itemArray.length; i += 1) {
    const count = itemArray[i].value;
    switch (itemArray[i].item) {
      // 规范检查
      case "bug_no_assign":
        storyBugCount.Bug_no_assign = count;
        break;
      case "bug_no_deadline":
        storyBugCount.Bug_no_deadline = count;
        break;
      case "bug_no_bug":
        storyBugCount.Bug_no_bug = count;
        break;
      case "bug_proj_error":
        storyBugCount.Bug_proj_error = count;
        break;
      case "bug_over_area":
        storyBugCount.Bug_over_area = count;
        break;


      // bug状态
      case "bug_actived":
        storyBugCount.Bug_actived = count;
        break;
      case "bug_resolved":
        storyBugCount.Bug_resolved = count;
        break;
      case "bug_verified":
        storyBugCount.Bug_verified = count;
        break;
      case "bug_closed":
        storyBugCount.Bug_closed = count;
        break;

      // 激活时长
      case "bug_ac_>24H":
        storyBugCount.Bug_ac_24 = count;
        break;
      case "bug_ac_16-24H":
        storyBugCount.Bug_ac_1624 = count;
        break;
      case "bug_ac_8-16H":
        storyBugCount.Bug_ac_0816 = count;
        break;
      case "bug_ac_<8H":
        storyBugCount.Bug_ac_08 = count;
        break;

      // 待回验进展
      case "bug_ve_>24H":
        storyBugCount.Bug_ac_24 = count;
        break;
      case "bug_ve_16-24H":
        storyBugCount.Bug_ac_1624 = count;
        break;
      case "bug_ve_8-16H":
        storyBugCount.Bug_ac_0816 = count;
        break;
      case "bug_ve_<8H":
        storyBugCount.Bug_ac_08 = count;
        break;

      default:
        break;
    }

  }

  return storyBugCount;
};

const storyResultDeals = (countArray: any) => {
  let statusData = Object();
  let bugData = Object();

  for (let index = 0; index < countArray.length; index += 1) {
    const itemArray = countArray[index].data;
    if (countArray[index].name === "status") {
      statusData = statusDeal(itemArray);

    } else {
      bugData = bugDeal(itemArray);
    }
  }

  return {status: statusData, bug: bugData};
};


export {storyResultDeals};
