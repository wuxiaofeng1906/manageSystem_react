/*
 * @Description: gqlc查询
 * @Author: jieTan
 * @Date: 2021-11-23 10:01:28
 * @LastEditTime: 2021-12-28 08:49:52
 * @LastEditors: jieTan
 * @LastModify:
 */

import { GqlClient } from '@/hooks';
import { GQL_PARAMS, JS_PROTOTYPE_TYPE } from '@/namespaces';

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
      case JS_PROTOTYPE_TYPE['Object']:
        // FIXME: 要适配number的情况，可以写一个递归来调用自身的判断
        const _kvs = Object.entries(v)?.map((_vs) => `${_vs[0]}:"${_vs[1]}"`);
        kvs.push(`${k}:{${_kvs.join()}}`);
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
  const { data } = await client.query(GQL);
  if (!(data instanceof Object)) return;
  return data[funcName];
};
