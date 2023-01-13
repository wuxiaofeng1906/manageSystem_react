import { isArray } from 'lodash';

const managers = [
  '宋永强',
  '郑江',
  '万星',
  '吴生祥',
  '刘黎明',
  '蒲姣',
  '欧治成',
  '刘云鹏',
  '任航',
  '胡敬华',
  '何羽',
];
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

// 转化为ag-grid能被显示的格式（添加了前后端以及人员数据）
const converseFormatForAgGrid = (oraDatas: any) => {
  if (!oraDatas) {
    return [];
  }

  const resultArray: any = [];

  // 解析部门数据
  oraDatas.forEach((elements: any) => {
    const starttime = elements.range.start;

    // 新增研发中心数据
    resultArray.push(
      {
        Group: ['研发中心'],
        [starttime]: elements.total.kpi,
        isDept: true,
      },
      {
        Group: ['研发中心', '前端'],
        [starttime]: elements.side.front,
        isDept: true,
      },
      {
        Group: ['研发中心', '后端'],
        [starttime]: elements.side.backend,
        isDept: true,
      },
    );

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

      // 需要判断部门有没有前后端：

      // 没有前端：应用架构部==>如果不是应用架构部，就添加前端数据
      if (depts.deptName !== '应用架构部' && depts.deptName !== '供应链后端') {
        // 新增部门的前端
        const frontGroup: any = JSON.parse(JSON.stringify(groups)); // 如果对原数组groups进行直接赋值，再对frontGroup进行修改，groups也会被修改（数组所指向的是内存地址，直接赋值会使它们指向同一地址）
        frontGroup.push('前端');
        resultArray.push({
          Group: frontGroup,
          [starttime]: depts.side.front,
          isDept: true,
        });
      }

      // 没有后端：前端应用平台，基础技术=》如果不是前端应用平台和基础技术就添加后端数据
      if (
        depts.deptName !== '前端应用平台' &&
        depts.deptName !== '基础技术' &&
        depts.deptName !== '供应链前端'
      ) {
        // 新增部门的后端
        const backendGroup: any = JSON.parse(JSON.stringify(groups));
        backendGroup.push('后端');
        resultArray.push({
          Group: backendGroup,
          [starttime]: depts.side.backend,
          isDept: true,
        });
      }
      /* endregion 部门数据 */

      /* region 人员数据 */

      const usersArray = depts.users;
      if (usersArray) {
        usersArray.forEach((user: any) => {
          const usersGroup = JSON.parse(JSON.stringify(groups));
          if (!managers.includes(user.userName)) {
            // 对管理人员的部门不加前后端，直接显示在部门下面即可。
            if (user.tech === '1') {
              usersGroup.push('前端');
            } else if (user.tech === '2') {
              usersGroup.push('后端');
            }
          }

          usersGroup.push(user.userName);
          resultArray.push({
            Group: usersGroup,
            [starttime]: user.kpi,
            isDept: false,
          });
        });
      }

      /* endregion 人员数据 */
    });
  });

  return converseArrayToOne(resultArray);
};

// 转化为ag-grid能被显示的格式（覆盖率专用格式转化）
const converseCoverageFormatForAgGrid = (oraDatas: any) => {
  if (!oraDatas) {
    return [];
  }
  const resultArray: any = [];
  // 解析部门数据
  oraDatas.forEach((elements: any) => {
    const endtime = elements.range.end;

    // 新增研发中心数据
    resultArray.push(
      {
        Group: ['研发中心'],
        [`instCove${endtime}`]: elements.total.instCove,
        [`branCove${endtime}`]: elements.total.branCove,
        isDept: true,
      },
      {
        Group: ['研发中心', '前端'],
        [`instCove${endtime}`]: elements.side.front.instCove,
        [`branCove${endtime}`]: elements.side.front.branCove,
        isDept: true,
      },
      {
        Group: ['研发中心', '后端'],
        [`instCove${endtime}`]: elements.side.backend.instCove,
        [`branCove${endtime}`]: elements.side.backend.branCove,
        isDept: true,
      },
    );

    const departDatas = elements.datas;

    // 部门数据
    departDatas.forEach((depts: any) => {
      /* region 部门数据 */

      const groups: any = [depts.deptName];
      findParent(departDatas, depts, groups);

      // 新增部门
      resultArray.push({
        Group: groups,
        [`instCove${endtime}`]: depts.instCove,
        [`branCove${endtime}`]: depts.branCove,
        isDept: true,
      });

      // 需要判断部门有没有前后端：

      // 没有前端：应用架构部==>如果不是应用架构部，就添加前端数据
      if (depts.deptName !== '应用架构部' && depts.deptName !== '供应链后端') {
        // 新增部门的前端
        const frontGroup: any = JSON.parse(JSON.stringify(groups)); // 如果对原数组groups进行直接赋值，再对frontGroup进行修改，groups也会被修改（数组所指向的是内存地址，直接赋值会使它们指向同一地址）
        frontGroup.push('前端');
        resultArray.push({
          Group: frontGroup,
          [`instCove${endtime}`]: depts.side.front.instCove,
          [`branCove${endtime}`]: depts.side.front.branCove,
          isDept: true,
        });
      }

      // 没有后端：前端应用平台，基础技术=》如果不是前端应用平台和基础技术就添加后端数据
      if (
        depts.deptName !== '前端应用平台' &&
        depts.deptName !== '基础技术' &&
        depts.deptName !== '供应链前端'
      ) {
        // 新增部门的后端
        const backendGroup: any = JSON.parse(JSON.stringify(groups));
        backendGroup.push('后端');
        resultArray.push({
          Group: backendGroup,
          [`instCove${endtime}`]: depts.side.backend.instCove,
          [`branCove${endtime}`]: depts.side.backend.branCove,
          isDept: true,
        });
      }
      /* endregion 部门数据 */

      /* region 人员数据 */

      const usersArray = depts.users;
      if (usersArray) {
        usersArray.forEach((user: any) => {
          const usersGroup = JSON.parse(JSON.stringify(groups));
          if (!managers.includes(user.userName)) {
            // 对管理人员的部门不加前后端，直接显示在部门下面即可。
            if (user.tech === '1') {
              usersGroup.push('前端');
            } else if (user.tech === '2') {
              usersGroup.push('后端');
            }
          }
          usersGroup.push(user.userName);
          resultArray.push({
            Group: usersGroup,
            [`instCove${endtime}`]: user.instCove,
            [`branCove${endtime}`]: user.branCove,
            isDept: false,
          });
        });
      }

      /* endregion 人员数据 */
    });
  });

  return converseArrayToOne(resultArray);
};

// 使用界面：开发缺陷排除率
const converseForAgGrid_defectRate = (oraDatas: any) => {
  if (!oraDatas) return [];

  const resultArray: any = [];

  // 解析部门数据
  oraDatas.forEach((elements: any) => {
    const starttime = elements.range.start;

    // 新增研发中心数据
    resultArray.push(
      {
        Group: ['研发中心'],
        [starttime]: elements.total.kpi * 100,
        isDept: true,
      },
      {
        Group: ['研发中心', '开发自测加权bug数'],
        [starttime]: elements.total.sideKpi?.devkpi,
      },
      {
        Group: ['研发中心', '测试发现加权bug数'],
        [starttime]: elements.total.sideKpi?.testKpi,
      },
    );

    // 部门数据
    const departDatas = elements.datas;
    departDatas.forEach((depts: any) => {
      // 不显示自动化平台和平台产品以及供应链研发部（供应链测试要展示）
      // if (depts.deptName !== "自动化平台" && depts.deptName !== "平台产品" && depts.deptName !== "供应链研发部") {
      const groups: any = [depts.deptName];
      // 如果是供应链测试，那么就不寻找父部门了，研发中心直接为父部门
      // if (depts.deptName === "供应链测试") {
      //   groups.unshift("研发中心");
      // } else {
      findParent(departDatas, depts, groups);
      // }

      // 新增部门
      resultArray.push({
        Group: groups,
        [starttime]: depts.kpi * 100,
        isDept: true,
      });

      // 部门下面区分测试和开发

      const devGroup: any = JSON.parse(JSON.stringify(groups));
      devGroup.push('开发自测加权bug数');
      resultArray.push({
        Group: devGroup,
        [starttime]: depts.sideKpi.devkpi,
      });

      const testGroup: any = JSON.parse(JSON.stringify(groups));
      testGroup.push('测试发现加权bug数');
      resultArray.push({
        Group: testGroup,
        [starttime]: depts.sideKpi.testKpi,
      });

      // }
    });
  });

  return converseArrayToOne(resultArray);
};

// 使用界面：项目计划偏差率、提测计划偏差率（只显示部门数据，数据*100）
const converseForAgGrid_projectPlanDevition = (oraDatas: any, percent = 100) => {
  if (!oraDatas) return [];
  const resultArray: any = [];
  // 解析部门数据
  oraDatas.forEach((elements: any) => {
    const starttime = elements.range.start;
    // 新增研发中心数据
    if (isArray(elements.total)) {
      elements.total?.forEach((o: any) => {
        resultArray.push({
          Group: o.deptName.includes('全部') ? ['研发中心'] : ['研发中心', o.deptName],
          isDept: true,
          dept: o.dept,
          [starttime]: o.kpi * percent,
        });
      });
    } else
      resultArray.push({
        Group: ['研发中心'],
        [starttime]: elements.total?.kpi * percent,
        isDept: true,
      });

    // 部门数据
    const departDatas = elements.datas;
    departDatas?.forEach((depts: any) => {
      const groups: any = [depts.deptName];
      findParent(departDatas, depts, groups);
      // 新增部门
      resultArray.push({
        Group: groups,
        [starttime]: depts?.kpi * percent,
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

// 使用界面：管理事务偏差率（显示人员数据，并且数据*100）
const converseForAgGrid_manageWorkDeviRate = (oraDatas: any) => {
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

      /* region 人员数据 */
      const usersArray = depts.users;
      if (usersArray) {
        usersArray.forEach((user: any) => {
          const usersGroup = JSON.parse(JSON.stringify(groups));
          usersGroup.push(user.userName);
          resultArray.push({
            Group: usersGroup,
            [starttime]: user.kpi * 100,
            isDept: false,
          });
        });
      }

      /* endregion 人员数据 */
    });
  });
  return converseArrayToOne(resultArray);
};

// 使用界面：开发A类客户服务投入比（展示分子和分母）
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
  converseCoverageFormatForAgGrid,
  converseForAgGrid_defectRate,
  converseForAgGrid_projectPlanDevition,
  converseForAgGrid_manageWorkDeviRate,
  converseForAgGrid_cusInputRate,
  converseForAgGrid_showDepts,
};
