import { IRecord } from '@/namespaces/interface';
import { isEmpty, isEqual, omit, intersection, isNumber } from 'lodash';
import moment from 'moment';
import { getMonthWeek } from '@/publicMethods/timeMethods';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import cls from 'classnames';
import { useModel } from 'umi';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

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

/**
 * 从数组对象中将key值修改为指定key
 * @param arr
 * @param keys
 * @example arr: [{a:1,b:2,c:3,...}], keys: [{a:'key',b:'value',c:'label'}] result: [{key:1,value:2,label:3,...}]
 */

export const replaceKeyMap = <T extends IRecord, K extends keyof T = keyof T>(
  arr: T[],
  replaceKeys: Record<K, string>[],
): IRecord[] => {
  const result: IRecord[] = [];
  arr?.forEach((item) => {
    let obj: IRecord = {};

    if (Object.keys(replaceKeys[0])?.length < Object.keys(item)?.length) {
      obj = omit(item, Object.keys(replaceKeys[0]));
    }
    for (let i = 0; i < replaceKeys.length; i++) {
      Object.entries(replaceKeys[i]).forEach(([k, v]) => {
        if (item.hasOwnProperty(k)) {
          obj[v as string] = item[k]?.toString();
        }
      });
    }
    result.push(obj);
  });
  return result;
};

/**
 * 设置
 * @param key 键
 * @param data 值
 */
function set<T>(key: string, data: T) {
  return localStorage.setItem(key, JSON.stringify(data));
}
function get<T = any>(key: string): T | null {
  const result = localStorage.getItem(key);
  if (!result) return null;
  return JSON.parse(result);
}

function remove(key: string) {
  return localStorage.removeItem(key);
}
function has(key: string): boolean {
  if (Reflect.has(localStorage, key)) {
    return Boolean(get(key));
  }
  return false;
}
export const storage = { set, get, remove, has };

export function valueMap(option: IRecord[], values: string[]) {
  const result: IRecord = {};
  if (isEmpty(option)) return {};
  option.forEach((it) => {
    if (it.hasOwnProperty(values[0]) && it.hasOwnProperty(values[1])) {
      result[it[values[0]]] = it[values[1]];
    }
  });
  return result;
}

// 合并行数据
export function mergeCellsTable(data: any[], key: string, rowspan: string = 'rowSpan') {
  if (isEmpty(data)) return [];
  return data
    .reduce((result, item) => {
      // 首先将字段作为新数组result取出
      if (result.indexOf(item[key]) < 0) {
        result.push(item[key]);
      }
      return result;
    }, [])
    .reduce((res: any, name: any) => {
      const children = data.filter((item) => item[key] === name);
      res = res.concat(
        children.map((item, index) => ({
          ...item,
          [rowspan]: index === 0 ? children.length : 0, // 将第一行数据添加rowSpan字段
        })),
      );
      return res;
    }, []);
}

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

const converseArrayToOne = (origin: any) => {
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

export const checkLogin = () => {
  const [user] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);
  const token = localStorage.getItem('accessId');
  if (token && !isEmpty(user?.userid)) return { flag: true, redirect: '' };
  const href = location.pathname + location.search;
  return { flag: false, redirect: `/user/myLogin?redirect=${encodeURIComponent(href)}` };
};
// 测试指标-不显示 管理会计研发部，供应链研发部 及子部门
export const checkTesterGroup = (groups: string[]) =>
  intersection(groups, ['管理会计研发部', '供应链研发部'])?.length > 0;

const initColDef: ColDef = { resizable: true, suppressMenu: true, flex: 1, filter: true };

const onGridReady = (params: GridReadyEvent, ref: React.MutableRefObject<GridApi | undefined>) => {
  ref.current = params.api;
  params.api.sizeColumnsToFit();
};

export const initGridTable = ({
  ref,
  border = false,
  height = 32,
  options,
}: {
  ref: React.MutableRefObject<GridApi | undefined>;
  border?: boolean;
  height?: number;
  options?: ColDef;
}) => ({
  className: cls('ag-theme-alpine', 'ag-initialize-theme'),
  defaultColDef: {
    ...initColDef,
    ...{
      cellStyle: {
        ...(border ? { 'border-right': 'solid 0.5px #E3E6E6' } : {}),
        'line-height': `${height}px`,
      },
    },
    ...options,
  },
  onGridReady: (v: GridReadyEvent) => onGridReady(v, ref),
  onGridSizeChanged: (v: GridReadyEvent) => onGridReady(v, ref),
  rowHeight: height,
  headerHeight: height,
});

export const getkeyFromvalue = (object: Record<any, any>, value: any): any => {
  for (let ob in object) {
    if (object.hasOwnProperty(ob)) {
      if (object[ob] === value) return ob;
    }
  }
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

export const formatAutoTestCover = (origin: any[], kind: number = 2) => {
  let result: any[] = [];
  let column: any[] = [];
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
        [`branCove${start}`]: node?.branchCover?.numerator,
        [`execution${start}`]: 10,
        [`instCove${start}`]: node.instCover?.numerator,
      });
    });
  });
  return { rowData: converseArrayToOne(result) || [], column };
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
