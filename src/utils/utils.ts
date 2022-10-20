import { IRecord } from '@/namespaces/interface';
import { isEmpty, isEqual, omit } from 'lodash';

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

// 合并行数据【可隐藏子项】
export const mergeCellsTable = (data: any[], field: string, hide = false) => {
  let repeat = 0; //重复项的第一项
  let nextCurrent = 1; //下一项
  let number = 1; // 序号【表格thead】
  while (nextCurrent < data.length) {
    let item = data.slice(repeat, repeat + 1)[0];
    if (!item['rowSpan']) {
      item['rowSpan'] = 1; //初始化为1
      item['num'] = number;
    }
    //第一个对象与后面的对象相比，有相同项就累加，并且后面相同项设置为0
    if (item[field] === data[nextCurrent][field]) {
      if (hide) {
        item['rowSpan'] = 1;
      } else {
        item['rowSpan']++;
      }
      data[nextCurrent]['rowSpan'] = 0;
    } else {
      number++;
      data[nextCurrent]['num'] = number;
      repeat = nextCurrent;
    }
    nextCurrent++;
  }
  return data;
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

export const formatTreeData = (origin: any[], showDenominator = false, percent: number = 1) => {
  if (!origin) return null;
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
  return converseArrayToOne(result);
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
