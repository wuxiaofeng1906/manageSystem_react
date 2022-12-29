import { intersection, isEmpty, isEqual, isNumber, uniq } from 'lodash';
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
const side = {
  1: '前端',
  2: '后端',
};

export const converseArrayToOne = (origin: any) => {
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
  origin: any[];
  showDenominator?: boolean;
  percent?: number;
  showSide?: boolean;
  isMulti?: boolean;
  isTest?: boolean;
}

export const formatTreeData = ({
  origin = [],
  showDenominator = false,
  percent = 1,
  showSide = false,
  isMulti = true, // 默认为乘以
  isTest = false, // 测试-指标模块
}: Iparam) => {
  if (!origin) return null;
  const result: any = [];
  origin.forEach((elements: any) => {
    const startTime = elements.range.start;
    result.push({
      Group: ['研发中心'],
      isDept: true,
      [startTime]: isMulti ? elements.total.kpi * percent : elements.total.kpi / percent,
      ...(showDenominator
        ? {
            [`${startTime}_numerator`]: elements.total.sideKpi.numerator,
            [`${startTime}_denominator`]: elements.total.sideKpi.denominator,
          }
        : {}),
    });
    // 显示前后端
    if (showSide) {
      result.push(
        {
          Group: ['研发中心', '前端'],
          isDept: true,
          ...(showDenominator
            ? {
                [`${startTime}_numerator`]: elements.total.sideKpi.numerator,
                [`${startTime}_denominator`]: elements.total.sideKpi.denominator,
              }
            : { [startTime]: elements.side.front }),
        },
        {
          Group: ['研发中心', '后端'],
          isDept: true,
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
        [startTime]: isMulti ? dept.kpi * percent : dept.kpi / percent,
        ...denominator,
      });
      // 判断部门有没有前后端：
      if (!['供应链后端', '应用架构部'].includes(dept.deptName) && showSide) {
        const frontGroup: any = JSON.parse(JSON.stringify(groups));
        frontGroup.push('前端');
        result.push({
          Group: frontGroup,
          [startTime]: dept.side.front,
          isDept: true,
          ...denominator,
        });
      }

      if (!['前端应用平台', '基础技术', '供应链前端'].includes(dept.deptName) && showSide) {
        const backendGroup: any = JSON.parse(JSON.stringify(groups));
        backendGroup.push('后端');
        result.push({
          Group: backendGroup,
          [startTime]: dept.side.backend,
          isDept: true,
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

  return converseArrayToOne(result);
};

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
      result.push({ Group: ['研发中心'], total: 0, title });
    } else
      data?.forEach((obj: any) => {
        const startTime = obj.range.start;
        const departments = obj.datas;
        result.push({
          title,
          Group: ['研发中心'],
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
        : kind == 3
        ? `${moment(start).format('YYYY年')}${moment(start).quarter()}季`
        : moment(start).format('YYYY');
    column.push({
      headerName: title,
      children: [
        { headerName: '自动化覆盖率执行完成时间', field: `execution${start}` },
        {
          headerName: '结构覆盖率',
          field: `instCove${start}`,
          cellRenderer: (p) => renderFormat({ params: p, len: 2 }),
        },
        {
          headerName: '分支覆盖率',
          field: `branCove${start}`,
          cellRenderer: (p) => renderFormat({ params: p, len: 2 }),
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
            Group: [...Group, tech.name == '1' ? '前端' : '后端'],
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
  return { rowData: converseArrayToOne(result) || [], column, project: uniq(project) };
};

export const formatActual = (data: any[]) => {
  let result: any[] = [];
  data?.forEach((it) => {
    it.datas?.forEach((o: any) => {
      result.push({
        Group: [o.execName?.name],
        [`total${it.range.start}`]: o.total?.kpi,
        [`story${it.range.start}`]: o.stageDatas?.story?.kpi,
        [`detail${it.range.start}`]: o.stageDatas?.detail?.kpi,
        [`develop${it.range.start}`]: o.stageDatas?.develop?.kpi,
        [`test${it.range.start}`]: o.stageDatas?.test?.kpi,
        [`overview${it.range.start}`]: o.stageDatas?.overView?.kpi,
      });
    });
  });
  return result;
};

export const formatActualColumn = (date: string[], type: number) => {
  return (
    date?.map((it) => {
      return {
        headerName: it,
        children: [
          { headerName: '总产出率', field: `total${it}` },
          {
            headerName: '需求',
            field: `story${it}`,
            cellRenderer: (p: any) => renderFormat({ params: p, len: 2 }),
          },
          {
            headerName: '概设',
            field: `overview${it}`,
            cellRenderer: (p: any) => renderFormat({ params: p, len: 2 }),
          },
          {
            headerName: '详设',
            field: `detail${it}`,
            cellRenderer: (p: any) => renderFormat({ params: p, len: 2 }),
          },
          {
            headerName: '开发',
            field: `develop${it}`,
            cellRenderer: (p: any) => renderFormat({ params: p, len: 2 }),
          },
          {
            headerName: '测试',
            field: `test${it}`,
            cellRenderer: (p: any) => renderFormat({ params: p, len: 2 }),
          },
        ],
      };
    }) ?? []
  );
};

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

export const renderFormat = ({
  params,
  showSplit = false,
  len,
}: {
  params: any;
  showSplit?: boolean;
  len?: number;
}) => {
  const node = params.data;
  const result = params.value;
  let numerator = 0; // 分子
  let denominator = 0; // 分母
  if (showSplit) {
    const currentTime = params.column?.colId;
    numerator = node[`${currentTime}_numerator`] ?? 0; // 分子
    denominator = node[`${currentTime}_denominator`] ?? 0; // 分母
  }
  const weight = node?.isDept ? 'bold' : 'initial';
  const data = isNumber(result) && result ? (len ? result.toFixed(len) : result) : 0;
  if (isNumber(result)) {
    if (showSplit)
      return `<span>
                <label style="font-weight: ${weight}">${data}</label>
                <label style="color: gray"> (${numerator},${denominator})</label>
            </span>`;
    return `<span style="font-weight: ${weight}">${data}</span>`;
  }
  return `<span style="font-weight: ${weight};color: ${
    node?.isDept ? 'initial' : 'silver'
  }"> 0</span>`;
};
