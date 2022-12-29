import { IRecord } from '@/namespaces/interface';
import { isEmpty, omit } from 'lodash';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import cls from 'classnames';
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

export const checkLogin = () => {
  const token = localStorage.getItem('accessId');
  if (token) return { flag: true, redirect: '' };
  const href = location.pathname + location.search;
  return { flag: false, redirect: `/user/myLogin?redirect=${encodeURIComponent(href)}` };
};

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
