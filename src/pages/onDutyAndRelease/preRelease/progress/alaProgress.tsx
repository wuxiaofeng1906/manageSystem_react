// 解析进度条相关数据来显示
const showProgressData = (datas: any) => {
  const results = {
    releaseProject: "Gainsboro",  // #2BF541
    upgradeService: "Gainsboro",
    dataReview: "Gainsboro",
    onliineCheck: "Gainsboro",
    releaseResult: "9",
    processPercent: 0
  };
  let successCount = 0;
  if (datas.project_edit === "1") {
    results.releaseProject = "#2BF541";
    successCount += 1;
  }

  if (datas.update_service === "1") {
    results.upgradeService = "#2BF541";
    successCount += 1;
  }
  if (datas.review_confirm === "1") {
    results.dataReview = "#2BF541";
    successCount += 1;
  }

  if (datas.release_check === "1") {
    results.onliineCheck = "#2BF541";
    successCount += 1;
  }

  results.releaseResult = datas.release_result;
  results.processPercent = (successCount / 4) * 100;

  return results;
};


export {showProgressData};
