import { IRecord } from "@/namespaces/interface";

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
 * 从对象中排除某些属性
 * @param obj
 * @param keys
 * @example obj: {a:1,b:2,c:3} keys: ['a'] => {b:2,c:3}
 */
export const omit = <T extends IRecord,K extends keyof T = keyof T>
(obj: T,keys: K[]): Omit<T, K> => {
  return (Object.keys(obj) as K[])
    .filter((v) => !keys.includes(v))
    .reduce((a, b) => {
      a[b] = obj[b];
      return a;
    }, {} as T);
};

/**
 * 从对象中选择某些属性
 * @param obj
 * @param keys
 * @example obj: {a:1,b:2,c:3} keys: ['a'] => {a:1}
 */

export const pick = <T extends IRecord,K extends keyof T = keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => keys.reduce((a, b) => {
  a[b] = obj[b];
  return a;
}, {} as T);

 /**
 * 从数组对象中将key值修改为指定key
 * @param arr
 * @param keys
 * @example arr: [{a:1,b:2,c:3,...}], keys: [{a:'key',b:'value',c:'label'}] => [{key:1,value:2,label:3,...}]
 */ 

export const replaceKeyMap = <T extends IRecord, K extends keyof T = keyof T>(arr: T[], replaceKeys: Record<K,string>[]): IRecord[]=>{
  const result: IRecord[] =[];
  arr?.forEach((item)=>{
    let obj: IRecord ={};
    
    if(Object.keys(replaceKeys[0])?.length < Object.keys(item)?.length){
        obj = omit(item,Object.keys(replaceKeys[0]))
    }
    for (let i = 0; i < replaceKeys.length; i++) {
      Object.entries(replaceKeys[i]).forEach(([k,v])=>{      
        if(item.hasOwnProperty(k)){
          obj[v as string] = (item[k])?.toString()
        }
      })
    }  
    result.push(obj)
  })
  return result;
}

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
  if (Reflect.has(localStorage,key)) {
    return Boolean(get(key));
  }
  return false;
}
export const storage = { set, get, remove, has };