// 查找父部门
const findParent = (departDatas: any, depts: any, result: any) => {
  const idx = depts.deptName;
  departDatas.forEach((item: any) => {
    if (item['deptName'] && idx) {
      if (idx === item['deptName']) {
        const pidName = item['parent'].deptName;
        if(pidName !== "北京企企科技有限公司"){  // 不显示北京企企科技有限公司
          result.unshift(pidName);
          findParent(departDatas, item['parent'], result);
        }

      }
    }

  });
}

// 根据部门，将不同时间的数据放到同一个对象中
const converseArrayToOne = (data: any) => {

  const resultData = new Array();
  for (let index = 0; index < data.length; index += 1) {
    let repeatFlag = false;
    // 判断原有数组是否包含有名字
    for (let m = 0; m < resultData.length; m += 1) {
      if (JSON.stringify(resultData[m].Group) === JSON.stringify(data[index].Group)) {
        repeatFlag = true;
        break;
      }
    }

    if (repeatFlag === false) {
      const tempData = {};
      for (let index2 = 0; index2 < data.length; index2 += 1) {
        tempData["Group"] = data[index].Group;

        if (JSON.stringify(data[index].Group) === JSON.stringify(data[index2].Group)) {
          const key = Object.keys(data[index2]);  // 获取所有的Key值
          key.forEach(function (item) {
            tempData[item] = data[index2][item];
          });
        }
      }
      resultData.push(tempData);
    }
  }

  return resultData;
};

// 转化为ag-grid能被显示的格式
const converseFormatForAgGrid = (oraDatas: any) => {

  debugger;
  if (!oraDatas) {
    return [];
  }

  const resultArray: any = [];
  // 解析部门数据
  oraDatas.forEach((elements: any) => {

    const starttime = elements.range.start;

    // 新增代码量数据
    if (elements.code) {  // 如果有代码量这项则新增代码量这一行
      resultArray.push({
        Group: ['代码量'],
        [starttime]: elements.code
      });
    }

    resultArray.push({
      Group: ['研发中心'],
      [starttime]: elements.total.kpi,
      isDept: true
    });

    const departDatas = elements.datas;

    // 部门数据
    departDatas.forEach((depts: any) => {

      /* region 部门数据 */

      const groups: any = [depts.deptName];
      findParent(departDatas, depts, groups);

      // 新增部门
      resultArray.push({
        Group: groups,
        [starttime]: depts.kpi,
        isDept: true
      });


      /* endregion   */

      /* region 人员数据 */

      const usersArray = depts.users;
      if (usersArray) {
        usersArray.forEach((user: any) => {

          const usersGroup = JSON.parse(JSON.stringify(groups));
          usersGroup.push(user.userName);
          resultArray.push({
            Group: usersGroup,
            [starttime]: user.kpi,
            isDept: false
          });
        });
      }

      /* endregion   */

    });

  });

  return converseArrayToOne(resultArray);
};

export {converseFormatForAgGrid};
