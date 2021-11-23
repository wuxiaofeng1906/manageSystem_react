import { GQL_PARAMS } from '../../gql.query';

/*
 * @Description: 查询的gql
 * @Author: jieTan
 * @Date: 2021-11-23 10:14:10
 * @LastEditTime: 2021-11-23 11:29:55
 * @LastEditors: jieTan
 * @LastModify:
 */

export default (args: GQL_PARAMS, funcWithParams: Function): [string, string] => {
  //
  const query = `
  {
    ${funcWithParams(args)}{
      project{
        id
        name
      }
      bugNumber
      reopenRatio
      bugResolveDura
      codes
      thouslineRatio
      unitCover
      effectiveBugRatio
      bugFlybackDura
      caseNumber
      autoCoverRatio
    }
  }
  `;

  return [query, args.func];
};
