/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

const findParent = (departments: any[], dept: any, result: any) => {
  const deptName = dept.deptName;
  departments.forEach((item: any) => {
    if (item['deptName'] && deptName) {
      if (deptName === item['deptName']) {
        const parentName = item['parent'].deptName;
        if (parentName !== '北京企企科技有限公司') {
          // 过滤 北京企企科技有限公司
          result.unshift(parentName);
          findParent(departments, item['parent'], result);
        }
      }
    }
  });
};

export const formatTreeData = (origin: any[], showDenominator = false, percent: number = 100) => {
  if (!origin) return [];
  const result: any = [];
  origin.forEach((elements: any) => {
    const startTime = elements.range.start;
    // 根节点
    result.push({
      Group: ['研发中心'],
      isDept: true,
      ...(showDenominator
        ? {
            [`${startTime}_numerator`]: elements.total.sideKpi.numerator,
            [`${startTime}_denominator`]: elements.total.sideKpi.denominator,
          }
        : { [startTime]: elements.total.kpi * percent }),
    });

    // department
    const departments = elements.datas;
    departments.forEach((dept: any) => {
      const groups: any = [dept.deptName];
      findParent(departments, dept, groups);
      result.push({
        Group: groups,
        isDept: true,
        [startTime]: dept.kpi * percent,
        ...(showDenominator
          ? {
              [`${startTime}_numerator`]: dept.sideKpi.numerator,
              [`${startTime}_denominator`]: dept.sideKpi.denominator,
            }
          : {}),
      });
      // user
      const users = dept.users;
      if (users) {
        users.forEach((user: any) => {
          const usersGroup = JSON.parse(JSON.stringify(groups));
          usersGroup.push(user.userName);
          result.push({
            Group: usersGroup,
            isDept: false,
            [startTime]: user.kpi * percent,
            ...(showDenominator
              ? {
                  [`${startTime}_numerator`]: user.sideKpi.numerator,
                  [`${startTime}_denominator`]: user.sideKpi.denominator,
                }
              : {}),
          });
        });
      }
    });
  });
  return result;
};
