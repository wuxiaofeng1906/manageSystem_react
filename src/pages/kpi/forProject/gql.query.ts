/*
 * @Description: gqlc查询
 * @Author: jieTan
 * @Date: 2021-11-23 10:01:28
 * @LastEditTime: 2021-11-23 14:29:42
 * @LastEditors: jieTan
 * @LastModify:
 */

import { GqlClient } from '@/hooks';
import { JS_PROTOTYPE_TYPE } from '@/namespaces';

export interface GQL_PARAMS {
  func: string;
  params?: object;
}

const funcWithParams = (args: GQL_PARAMS): string => {
  //
  if (args.params === undefined) return args.func;

  // 参数解析
  const kvs: string[] = [];
  for (const [k, v] of Object.entries(args.params)) {
    //
    switch (Object.prototype.toString.call(v)) {
      case JS_PROTOTYPE_TYPE['Array']:
        //
        const elems: any[] = [];
        for (const elem of v) elems.push(elem instanceof String ? `"${elem}"` : elem);
        kvs.push(`${k}:[${elems}]`);
        break;
      case JS_PROTOTYPE_TYPE['String']:
        kvs.push(`${k}:"${v}"`);
        break;

      default:
        kvs.push(`${k}:${v}`);
        break;
    }
  }

  // 返回结果
  return kvs.length === 0 ? args.func : `${args.func}(${kvs.join()})`;
};

export const queryGQL = async (client: GqlClient<object>, mygql: Function, params: GQL_PARAMS) => {
  //
  const [GQL, funcName] = mygql(params, funcWithParams);
  console.log(funcName);
  
  const { data } = await client.query(GQL);
  // if (!(data instanceof Object)) return;
  return data[funcName];
};
