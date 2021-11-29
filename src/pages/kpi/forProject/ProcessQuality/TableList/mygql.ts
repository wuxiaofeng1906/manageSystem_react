/*
 * @Description: 查询的gql
 * @Author: jieTan
 * @Date: 2021-11-23 10:14:10
 * @LastEditTime: 2021-11-29 16:56:36
 * @LastEditors: jieTan
 * @LastModify:
 */

import { GQL_PARAMS } from '../../gql.query';

export default (args: GQL_PARAMS, funcWithParams: Function): [string, string] => {
  //
  const query = `
  {
    ${funcWithParams(args)}{
      project{
        id
        name
        start
        end
      }
      user{
        id
        name
      }
      dept{
        id
        name
      }
      projectQuality{
        reopenRatio
        bugFlybackDura
      }
    }
  }
  `;

  return [query, args.func];
};
