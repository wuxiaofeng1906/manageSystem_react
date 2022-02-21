/*
 * @Description: 项目度量指标
 * @Author: jieTan
 * @Date: 2021-12-02 11:41:52
 * @LastEditTime: 2022-02-21 10:04:43
 * @LastEditors: jieTan
 * @LastModify:
 */

import { GQL_PARAMS } from '@/namespaces';

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
        branch
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
        bugResolvedDura
        weightedLegacyDefect
        weightedLegacyDI
        carryTestPass
      }
      progressDeviation{
        storyplan
        designplan
        devplan
        testplan
        releaseplan
        projectplan
      }
      stageWorkload{
        storyplan
        designplan
        devplan
        testplan
        releaseplan
        total
      }
      scaleProductivity{
        planValue
        planRatio
      }
      reviewDefect {
        storyPreReview
        ueReview
        overviewReview
        detailReview
        caseReview
        codeReview
        testPresentation
        integrationTest
        systemTest
        releaseTest
        total
      }
      storyStable{
        devplan
        testplan
        releaseplan
        processcycle
      }
      serviceAbout{
        releaseSucc
      }
    }
  }
  `;

  return [query, args.func];
};
