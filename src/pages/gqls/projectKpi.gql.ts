/*
 * @Description: 项目度量指标
 * @Author: jieTan
 * @Date: 2021-12-02 11:41:52
 * @LastEditTime: 2021-12-13 09:40:29
 * @LastEditors: jieTan
 * @LastModify: 
 */

import { GQL_PARAMS } from "@/namespaces";


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
        status
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
      progressDeviation{
        storyplan
        designplan
        devplan
        testplan
        releaseplan
        projectplan
      }
    }
  }
  `;

  return [query, args.func];
};