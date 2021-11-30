/*
 * @Description:
 * @Author: jieTan
 * @Date: 2021-11-30 16:00:58
 * @LastEditTime: 2021-11-30 18:42:52
 * @LastEditors: jieTan
 * @LastModify:
 */

const extraConverter = <T>(item: T, extraMaps?: [string, string][]) => {
  //
  if (extraMaps) extraMaps.map(([source, target]) => (item[target] = item[source]));
  //
  return item;
};

export const toTree = (
  datas: any[],
  idKey: string = 'id',
  parentKey: string = 'parentId',
  extraMap?: [string, string][],
) => {
  //
  if (datas === undefined) return;
  // 将数据存储为 以id为KEY的map索引数据列
  const map = {};
  datas.map((da) => (map[da[idKey]] = extraConverter<any>(da, extraMap)));
  //
  const treeData: any[] = [];
  for (const da of datas) {
    const parent = map[da[parentKey]];
    // 如果父级菜单存在，则将当前项存入父级的children
    // 如果父级的children不存在，初始化为空数组[]后再存入
    if (parent) (parent.children || (parent.children = [])).push(extraConverter<any>(da, extraMap));
    // 如果父级菜单不存在，则做为顶级菜单存入
    else treeData.push(extraConverter<any>(da, extraMap));
  }
  //
  return treeData;
};
