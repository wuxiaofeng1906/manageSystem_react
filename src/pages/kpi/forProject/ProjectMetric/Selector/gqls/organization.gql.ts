/*
 * @Description: 查询企业微信组织架构
 * @Author: jieTan
 * @Date: 2021-11-29 17:14:58
 * @LastEditTime: 2021-11-29 17:16:51
 * @LastEditors: jieTan
 * @LastModify:
 */

import { GQL_PARAMS } from '../../../gql.query';

export default (args: GQL_PARAMS, funcWithParams: Function): [string, string] => {
  //
  const query = `
  {
    ${funcWithParams(args)}{
      organization{
        id
        name
        parent
        parentName
      }
    }
  }
  `;

  return [query, args.func];
};
