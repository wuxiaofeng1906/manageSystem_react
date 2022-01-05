// 查找父部门
const findParent = (departDatas: any, depts: any, result: any) => {
  const idx = depts.deptName;
  departDatas.forEach((item: any) => {
    if (idx === item['deptName']) {
      const pidName = item['parent'].deptName;
      result.unshift(pidName);
      findParent(departDatas, item['parent'], result);
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

  if (!oraDatas) {
    return [];
  }

  const resultArray: any = [];

  // 解析部门数据
  oraDatas.forEach((elements: any) => {

    const starttime = elements.range.start;

    // 新增研发中心数据
    resultArray.push({
      Group: ['研发中心'],
      [starttime]: elements.total.kpi,
      isDept: true
    }, {
      Group: ['研发中心', '前端'],
      [starttime]: elements.side.front,
      isDept: true
    }, {
      Group: ['研发中心', '后端'],
      [starttime]: elements.side.backend,
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


      // 需要判断部门有没有前后端：

      // 没有前端：应用架构部==>如果不是应用架构部，就添加前端数据
      if (depts.deptName !== "应用架构部") {
        // 新增部门的前端
        const frontGroup: any = JSON.parse(JSON.stringify(groups)); // 如果对原数组groups进行直接赋值，再对frontGroup进行修改，groups也会被修改（数组所指向的是内存地址，直接赋值会使它们指向同一地址）
        frontGroup.push("前端")
        resultArray.push({
          Group: frontGroup,
          [starttime]: depts.side.front,
          isDept: true
        });
      }

      // 没有后端：前端应用平台，基础技术=》如果不是前端应用平台和基础技术就添加后端数据
      if (depts.deptName !== "前端应用平台" && depts.deptName !== "基础技术") {
        // 新增部门的后端
        const backendGroup: any = JSON.parse(JSON.stringify(groups));
        backendGroup.push("后端")
        resultArray.push({
          Group: backendGroup,
          [starttime]: depts.side.backend,
          isDept: true
        });
      }
      /* endregion 部门数据 */

      /* region 人员数据 */

      const usersArray = depts.users;
      if (usersArray) {
        usersArray.forEach((user: any) => {

          const usersGroup = JSON.parse(JSON.stringify(groups));
          if (user.tech === "1") {
            usersGroup.push("前端");
          } else if (user.tech === "2") {
            usersGroup.push("后端");
          }
          usersGroup.push(user.userName);
          resultArray.push({
            Group: usersGroup,
            [starttime]: user.kpi,
            isDept: false
          });
        });
      }

      /* endregion 人员数据 */
    });

  });


  return converseArrayToOne(resultArray);
};


export {converseFormatForAgGrid};
