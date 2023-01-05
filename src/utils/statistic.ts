import { intersection, isEmpty, isEqual, uniq, isArray } from 'lodash';
import moment from 'moment';
import { getMonthWeek } from '@/publicMethods/timeMethods';

// 测试指标-不显示 管理会计研发部，供应链研发部 及子部门
export const checkTesterGroup = (groups: string[]) =>
  intersection(groups, ['管理会计研发部', '供应链研发部'])?.length > 0;

const findParent = (departments: any[], dept: any, result: any, isSpecial = false) => {
  const deptName = dept.deptName;
  departments.forEach((item: any) => {
    if (isSpecial) {
      if (dept.dept == dept.parent) {
        result.unshift(dept.deptName);
        findParent(departments, item, result, isSpecial);
      }
    } else if (item['deptName'] && deptName) {
      if (dept.dept == item.dept) {
        const parentName = item['parent']?.deptName;
        if (parentName !== '北京企企科技有限公司') {
          // 过滤 北京企企科技有限公司
          result.unshift(parentName);
          findParent(departments, item['parent'], result, isSpecial);
        }
      }
    }
  });
};
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
const side = { 1: '前端', 2: '后端' };
const developCenter = '研发中心';

export const mergeArray = (origin: any) => {
  const source: any[] = [];
  for (let index = 0; index < origin.length; index += 1) {
    let repeat = false;
    // 判断原有数组是否包含有名字
    for (let i = 0; i < source.length; i++) {
      if (isEqual(source[i].Group, origin[index].Group)) {
        repeat = true;
        break;
      }
    }

    if (repeat === false) {
      const tempData = {};
      for (let i = 0; i < origin.length; i++) {
        tempData['Group'] = origin[index].Group;
        if (isEqual(origin[index].Group, origin[i].Group)) {
          Object.entries(origin[i]).forEach(([k, v]) => {
            tempData[k] = v;
          });
        }
      }
      source.push(tempData);
    }
  }
  return source;
};
interface Iparam {
  origin: any[]; // 原数据
  showDenominator?: boolean; // 展示分子，分母
  percent?: number; // 格式化数据
  showSide?: boolean; // 显示前后端
  isMulti?: boolean; // 默认为乘以
  isTest?: boolean; // 测试-指标模块
}

export const formatTreeData = ({
  origin = [],
  showDenominator = false,
  percent = 1,
  showSide = false,
  isMulti = true,
  isTest = false,
}: Iparam) => {
  if (!origin) return null;
  const result: any = [];
  origin.forEach((elements: any) => {
    const startTime = elements.range.start;
    if (isArray(elements.total)) {
      elements.total?.forEach((o: any) => {
        result.push({
          Group: o.deptName.includes('全部') ? [developCenter] : [developCenter, o.deptName],
          isDept: true,
          dept: o.dept,
          [`${startTime}range`]: elements.range,
          [startTime]: isMulti ? o.kpi * percent : o?.kpi / percent,
        });
      });
    } else {
      result.push({
        Group: [developCenter],
        isDept: true,
        dept: elements.total.dept,
        [`${startTime}range`]: elements.range,
        [startTime]: isMulti ? elements.total.kpi * percent : elements.total.kpi / percent,
        ...(showDenominator
          ? {
              [`${startTime}_numerator`]: elements.total.sideKpi.numerator,
              [`${startTime}_denominator`]: elements.total.sideKpi.denominator,
            }
          : {}),
      });
    }
    // 显示前后端
    if (showSide) {
      result.push(
        {
          Group: [developCenter, side['1']],
          isDept: true,
          dept: elements.total?.dept,
          [`${startTime}range`]: elements.range,
          ...(showDenominator
            ? {
                [`${startTime}_numerator`]: elements.total.sideKpi.numerator,
                [`${startTime}_denominator`]: elements.total.sideKpi.denominator,
              }
            : { [startTime]: elements.side.front }),
        },
        {
          Group: [developCenter, side['2']],
          isDept: true,
          dept: elements.total?.dept,
          [`${startTime}range`]: elements.range,
          ...(showDenominator
            ? {
                [`${startTime}_numerator`]: elements.total.sideKpi.numerator,
                [`${startTime}_denominator`]: elements.total.sideKpi.denominator,
              }
            : { [startTime]: elements.side.backend }),
        },
      );
    }

    // department
    const departments = elements.datas;
    departments?.forEach((dept: any) => {
      // 显示分子分母
      const denominator = showDenominator
        ? {
            [`${startTime}_numerator`]: dept.sideKpi.numerator,
            [`${startTime}_denominator`]: dept.sideKpi.denominator,
          }
        : {};
      let groups: string[] = [dept.deptName];
      findParent(departments, dept, groups);
      if (checkTesterGroup(groups) && isTest) return;
      result.push({
        Group: groups,
        isDept: true,
        dept: dept.dept,
        [`${startTime}range`]: elements.range,
        [startTime]: isMulti ? dept.kpi * percent : dept.kpi / percent,
        ...denominator,
      });
      // 判断部门有没有前后端：
      if (!['供应链后端', '应用架构部'].includes(dept.deptName) && showSide) {
        const frontGroup: any = JSON.parse(JSON.stringify(groups));
        frontGroup.push(side['1']);
        result.push({
          Group: frontGroup,
          [startTime]: dept.side.front,
          isDept: true,
          dept: dept.dept,
          [`${startTime}range`]: elements.range,
          ...denominator,
        });
      }

      if (!['前端应用平台', '基础技术', '供应链前端'].includes(dept.deptName) && showSide) {
        const backendGroup: any = JSON.parse(JSON.stringify(groups));
        backendGroup.push(side['2']);
        result.push({
          Group: backendGroup,
          [startTime]: dept.side.backend,
          isDept: true,
          dept: dept.dept,
          [`${startTime}range`]: elements.range,
          ...denominator,
        });
      }
      // user
      const users = dept.users;
      if (users) {
        users.forEach((user: any) => {
          if (user?.hired != '0') {
            const usersGroup = JSON.parse(JSON.stringify(groups));
            if (!managers.includes(user.userName) && showSide) {
              // 对管理人员的部门不加前后端，直接显示在部门下面
              if (['1', '2'].includes(user.tech)) {
                usersGroup.push(side[user.tech]);
              }
            }
            usersGroup.push(user.userName);
            result.push({
              Group: usersGroup,
              isDept: false,
              dept: dept.dept,
              [`${startTime}range`]: elements.range,
              [startTime]: user.kpi * percent,
              ...(showDenominator
                ? {
                    [`${startTime}_numerator`]: user.sideKpi.numerator,
                    [`${startTime}_denominator`]: user.sideKpi.denominator,
                  }
                : {}),
            });
          }
        });
      }
    });
  });

  return mergeArray(result);
};

// 上线后emergency占比
export const formatPivotMode = (origin: any[], kind: number) => {
  let result: any[] = [];
  if (isEmpty(origin)) return result;
  origin?.reverse()?.forEach((it) => {
    const data = it.datas;
    const title =
      kind == 2
        ? moment(it.range.start).format('MM月YYYY年')
        : `${moment(it.range.start).format('YYYY')}年Q${moment(it.range.start).quarter()}`;

    if (isEmpty(data)) {
      result.push({ Group: [developCenter], total: 0, title });
    } else
      data?.forEach((obj: any) => {
        const startTime = obj.range.start;
        const departments = obj.datas;
        result.push({
          title,
          Group: [developCenter],
          isDept: true,
          total: obj.total.kpi,
          subTitle: moment(startTime).format('YYYYMMDD'),
        });
        departments?.forEach((dept: any) => {
          let groups: string[] = [dept.deptName];
          if (checkTesterGroup(groups)) return;
          result.push({
            title,
            Group: dept.deptName,
            isDept: true,
            total: dept.kpi,
            subTitle: moment(startTime).format('YYYYMMDD'),
          });
        });
      });
  });
  return result;
};

// 自动化单元测试覆盖率
export const formatAutoTestCover = (origin: any[], kind: number = 2) => {
  let result: any[] = [];
  let column: any[] = [];
  let project: any[] = [];
  origin?.reverse()?.forEach((it: any) => {
    const start = it.range.start;
    const title =
      kind == 1
        ? getMonthWeek(start)
        : kind == 2
        ? moment(start).format('MM月YYYY年')
        : `${moment(start).format('YYYY年')}${kind == 3 ? moment(start).quarter() + '季' : ''}`;
    column.push({
      headerName: title,
      children: [
        { headerName: '自动化覆盖率执行完成时间', field: `execution${start}`, minWidth: 120 },
        {
          headerName: '结构覆盖率',
          field: `instCove${start}`,
          minWidth: 120,
          cellRenderer: 'wrapperkpi',
        },
        {
          headerName: '分支覆盖率',
          field: `branCove${start}`,
          minWidth: 120,
          cellRenderer: 'wrapperkpi',
        },
      ],
    });
    it.datas?.forEach((node: any) => {
      let Group = [node.deptName];
      if (node.dept != 59) {
        findParent(it.datas, node, Group, true);
      }

      result.push({
        Group,
        branch: '',
        isDept: true,
        [`branCove${start}`]:
          ((node?.branchCover?.numerator || 0) / (node.branchCover?.denominator || 0)) * 100,
        [`execution${start}`]: '',
        [`instCove${start}`]:
          ((node.instCover?.numerator || 0) / (node.instCover?.denominator || 0)) * 100,
      });
      if (!isEmpty(node.tech)) {
        node.tech.forEach((tech: any) => {
          result.push({
            Group: [...Group, side[tech.name]],
            branch: tech?.branch,
            isDept: false,
            [`branCove${start}`]:
              ((tech?.branchCover?.numerator || 0) / (tech?.branchCover?.denominator || 0)) * 100,
            [`execution${start}`]: tech?.runtime,
            [`instCove${start}`]:
              ((tech?.instCover?.numerator || 0) / (tech?.instCover?.denominator || 0)) * 100,
          });
        });
      }
      if (!isEmpty(node.execution)) {
        node.execution.forEach((exec: any) => {
          project.push(exec.name);
          result.push(
            {
              Group: [...Group, exec.name],
              branch: exec?.branch,
              isDept: false,
              isProject: true,
              [`branCove${start}`]:
                ((exec?.branchCover?.numerator || 0) / (exec?.branchCover?.denominator || 0)) * 100,
              [`execution${start}`]: exec?.runtime,
              [`instCove${start}`]:
                ((exec?.instCover?.numerator || 0) / (exec?.instCover?.denominator || 0)) * 100,
            },
            { Group: [...Group, exec.name, ''] },
          );
        });
      }
    });
  });
  return { rowData: mergeArray(result) || [], column, project: uniq(project) };
};

export const formatActual = (data: any[]) => {
  let result: any[] = [];
  data?.forEach((it) => {
    it.datas?.forEach((o: any) => {
      const time = it.range.end;
      const stage = o.stageDatas;
      result.push({
        [`execName${time}`]: o.execName?.name,
        [`total${time}`]: o.total?.kpi * 100,
        [`story${time}`]: ((stage?.story?.numerator || 0) / (stage?.story?.denominator || 0)) * 100,
        [`detail${time}`]:
          ((stage?.detail?.numerator || 0) / (stage?.detail?.denominator || 0)) * 100,
        [`develop${time}`]:
          ((stage?.develop?.numerator || 0) / (stage?.develop?.denominator || 0)) * 100,
        [`test${time}`]: ((stage?.test?.numerator || 0) / (stage?.test?.denominator || 0)) * 100,
        [`overview${time}`]:
          ((stage?.overView?.numerator || 0) / (stage?.overView?.denominator || 0)) * 100,
      });
    });
  });
  return result;
};

// pivot fun
export const aggFunc = (data: any, number = 0, avg = false) => {
  let sum = 0;
  data?.forEach(function (value: any) {
    if (value) {
      sum = sum + parseFloat(value);
    }
  });
  if (!sum) return 0;
  // 求平均
  if (avg) sum = sum / data?.length;
  return number > 0 ? sum.toFixed(number) : sum;
};
