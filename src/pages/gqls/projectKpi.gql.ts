/*
 * @Description: 项目度量指标
 * @Author: jieTan
 * @Date: 2021-12-02 11:41:52
 * @LastEditTime: 2022-01-05 01:52:44
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
        projectplan
      }
      scaleProductivity{
        actualValue
        actualRatio
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
        uePreview
        uiPreview
        uiReview
      }
    }
  }
  `;

  return [query, args.func];
};