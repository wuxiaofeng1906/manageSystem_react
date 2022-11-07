// 查找父部门
const findParent = (departDatas: any, depts: any, result: any) => {
  const idx = depts.deptName;
  departDatas.forEach((item: any) => {
    if (item['deptName'] && idx) {
      if (depts.dept == item.dept) {
        const pidName = item['parent'].deptName;
        if (pidName !== '北京企企科技有限公司') {
          // 不显示北京企企科技有限公司
          result.unshift(pidName);
          findParent(departDatas, item['parent'], result);
        }
      }
    }
  });
};

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
        tempData['Group'] = data[index].Group;

        if (JSON.stringify(data[index].Group) === JSON.stringify(data[index2].Group)) {
          const key = Object.keys(data[index2]); // 获取所有的Key值
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

    // 新增代码量数据
    if (elements.code) {
      // 如果有代码量这项则新增代码量这一行
      resultArray.push({
        Group: ['代码量'],
        [starttime]: elements.code,
        isDept: false,
      });
    }

    resultArray.push({
      Group: ['研发中心'],
      [starttime]: elements.total.kpi,
      isDept: true,
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
        isDept: true,
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
            isDept: false,
          });
        });
      }

      /* endregion   */
    });
  });

  return converseArrayToOne(resultArray);
};

// 使用界面：测试千行bug率
const converseDataForAgGrid_code = (oraDatas: any) => {
  if (!oraDatas) {
    return [];
  }

  const resultArray: any = [];
  // 解析部门数据
  oraDatas.forEach((elements: any) => {
    const starttime = elements.range.start;

    resultArray.push({
      Group: ['研发中心'],
      // [starttime]: elements.total.kpi,
      [`${starttime}_kpi`]: elements.total.kpi,
      [`${starttime}_codes`]: elements.code,
      [`${starttime}_bugs`]: 0,
      [`${starttime}_weightBugs`]: 0,

      isDept: true,
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
        [`${starttime}_kpi`]: depts.kpi,
        [`${starttime}_codes`]: depts.codes,
        [`${starttime}_bugs`]: 0,
        [`${starttime}_weightBugs`]: 0,
        isDept: true,
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
            [`${starttime}_kpi`]: user.kpi,
            [`${starttime}_codes`]: 0,
            [`${starttime}_bugs`]: 0,
            [`${starttime}_weightBugs`]: 0,
            isDept: false,
          });
        });
      }

      /* endregion   */
    });
  });

  return converseArrayToOne(resultArray);
};

// 使用界面：千行bug率收敛
const converseForAgGrid_Convergency = (oraDatas: any) => {
  if (!oraDatas) return [];

  const resultArray: any = [];

  // 解析部门数据
  oraDatas.forEach((elements: any) => {
    const starttime = elements.range.start;

    // 新增研发中心数据
    resultArray.push({
      Group: ['研发中心'],
      [starttime]: elements.total.kpi,
      isDept: true,
    });

    // 部门数据
    const departDatas = elements.datas;
    departDatas.forEach((depts: any) => {
      // 不显示自动化平台和平台产品以及供应链研发部（供应链测试要展示）
      if (
        depts.deptName !== '自动化平台' &&
        depts.deptName !== '平台产品' &&
        depts.deptName !== '供应链研发部'
      ) {
        const groups: any = [depts.deptName];
        // 如果是供应链测试，那么就不寻找父部门了，研发中心直接为父部门
        if (depts.deptName === '供应链测试') {
          groups.unshift('研发中心');
        } else {
          findParent(departDatas, depts, groups);
        }

        // 新增部门
        resultArray.push({
          Group: groups,
          [starttime]: depts.kpi,
          isDept: true,
        });

        // 部门下面区分测试和开发
        const testGroup: any = JSON.parse(JSON.stringify(groups));
        testGroup.push('测试-线上千行bug率');
        resultArray.push({
          Group: testGroup,
          [starttime]: depts.sideKpi.testKpi,
        });

        const devGroup: any = JSON.parse(JSON.stringify(groups));
        devGroup.push('开发-千行bug率');
        resultArray.push({
          Group: devGroup,
          [starttime]: depts.sideKpi.devkpi,
        });
      }
    });
  });

  return converseArrayToOne(resultArray);
};

// 使用界面：计划偏差率
const converseForAgGrid_planDevition = (oraDatas: any) => {
  if (!oraDatas) return [];
  const resultArray: any = [];
  // 解析部门数据
  oraDatas.forEach((elements: any) => {
    const starttime = elements.range.start;
    // 新增研发中心数据
    resultArray.push({
      Group: ['研发中心'],
      [starttime]: elements.total.kpi * 100,
      isDept: true,
    });

    // 部门数据
    const departDatas = elements.datas;
    departDatas.forEach((depts: any) => {
      const groups: any = [depts.deptName];
      findParent(departDatas, depts, groups);
      // 新增部门
      resultArray.push({
        Group: groups,
        [starttime]: depts.kpi * 100,
        isDept: true,
      });
    });
  });
  return converseArrayToOne(resultArray);
};

// 使用界面：发布引入emergency数（只显示部门数据，显示原始数据）
const converseForAgGrid_showDepts = (oraDatas: any) => {
  if (!oraDatas) return [];
  const resultArray: any = [];
  // 解析部门数据
  oraDatas.forEach((elements: any) => {
    const starttime = elements.range.start;
    // 新增研发中心数据
    resultArray.push({
      Group: ['研发中心'],
      [starttime]: elements.total.kpi,
      isDept: true,
    });

    // 部门数据
    const departDatas = elements.datas;
    departDatas.forEach((depts: any) => {
      const groups: any = [depts.deptName];
      findParent(departDatas, depts, groups);
      // 新增部门
      resultArray.push({
        Group: groups,
        [starttime]: depts.kpi,
        isDept: true,
      });
    });
  });
  return converseArrayToOne(resultArray);
};

// 测试A类客户投入比
const converseForAgGrid_cusInputRate = (oraDatas: any) => {
  if (!oraDatas) return [];
  const resultArray: any = [];
  // 解析部门数据
  oraDatas.forEach((elements: any) => {
    const starttime = elements.range.start;
    // 新增研发中心数据
    resultArray.push({
      Group: ['研发中心'],
      [starttime]: elements.total.kpi * 100,
      [`${starttime}_numerator`]: elements.total.sideKpi.numerator,
      [`${starttime}_denominator`]: elements.total.sideKpi.denominator,
      isDept: true,
    });

    // 部门数据
    const departDatas = elements.datas;
    departDatas.forEach((depts: any) => {
      const groups: any = [depts.deptName];
      findParent(departDatas, depts, groups);
      // 新增部门
      resultArray.push({
        Group: groups,
        [starttime]: depts.kpi * 100,
        [`${starttime}_numerator`]: depts.sideKpi.numerator,
        [`${starttime}_denominator`]: depts.sideKpi.denominator,
        isDept: true,
      });

      /* region 人员数据 */
      const usersArray = depts.users;
      if (usersArray) {
        usersArray.forEach((user: any) => {
          const usersGroup = JSON.parse(JSON.stringify(groups));
          usersGroup.push(user.userName);
          resultArray.push({
            Group: usersGroup,
            [starttime]: user.kpi * 100,
            [`${starttime}_numerator`]: user.sideKpi.numerator,
            [`${starttime}_denominator`]: user.sideKpi.denominator,
            isDept: false,
          });
        });
      }

      /* endregion 人员数据 */
    });
  });
  return converseArrayToOne(resultArray);
};

export {
  converseFormatForAgGrid,
  converseDataForAgGrid_code,
  converseForAgGrid_Convergency,
  converseForAgGrid_planDevition,
  converseForAgGrid_cusInputRate,
  converseForAgGrid_showDepts,
};
