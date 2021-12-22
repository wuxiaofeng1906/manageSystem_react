/*
 * @Description: 项目的可编辑字段
 * @Author: jieTan
 * @Date: 2021-12-22 06:39:40
 * @LastEditTime: 2021-12-22 07:49:35
 * @LastEditors: jieTan
 * @LastModify:
 */

import { PK_PATH, ProjectKpiInput, PROJ_METRIC } from '@/namespaces';
import { ValueSetterParams } from 'ag-grid-community';
import axios from 'axios';

class ProjectKpiEditables {
  /*  */
  constructor(private readonly pkUrl: string) {}

  /* 项目分支 */
  branch = (key: string, params: ValueSetterParams) => {
    //
    const datas: ProjectKpiInput = {
      projects: [params.data.project.id],
      category: PROJ_METRIC.project.en,
      column: key,
      newValue: params.newValue,
    };
    //
    axios.put(this.pkUrl, datas);
    //
    params.data.project.branch = params.newValue;
  };

  valueSetter = (key: string, params: ValueSetterParams) => {
    //
    const __method = Reflect.get(this, key);
    if (__method === undefined) return false;

    //
    __method(key, params);

    //
    return true;
  };
}

const pkEditValueSetter = new ProjectKpiEditables(PK_PATH).valueSetter;
export default pkEditValueSetter;
