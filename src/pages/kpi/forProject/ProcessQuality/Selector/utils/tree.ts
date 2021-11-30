/*
 * @Description:
 * @Author: jieTan
 * @Date: 2021-11-30 16:00:58
 * @LastEditTime: 2021-11-30 17:39:55
 * @LastEditors: jieTan
 * @LastModify:
 */

export const toTree = (data: any[], idName?: string, parentIdName?: string) => {
  const id = idName || 'id';
  const parentId = parentIdName || 'parentId';
  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  const map = {};
  data.forEach(function (item) {
    map[item[id]] = item;
  });
  const menu: any[] = [];
  data.forEach(function (item) {
    // 在map中找到当前项的父级菜单
    const parent = map[item[parentId]];
    if (parent) {
      // 如果父级菜单存在，则将当前项存入父级的children
      // 如果父级的children不存在，初始化为空数组[]后再存入
      (parent.children || (parent.children = [])).push(item);
    } else {
      // 如果父级菜单不存在，则做为顶级菜单存入
      menu.push(item);
    }
  });
  return menu;
};

export const toTree2 = (data: any[], idName?: string, parentIdName?: string) => {
  const id = idName || 'id';
  const parentId = parentIdName || 'parentId';
  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  const map = {};
  data.forEach(function (item) {
    item['title'] = item['name'];
    item['value'] = item['id'];
    map[item[id]] = item;
  });
  var menu = [];
  data.forEach(function (item) {
    // 在map中找到当前项的父级菜单
    const parent = map[item[parentId]];
    if (parent) {
      // 如果父级菜单存在，则将当前项存入父级的children
      // 如果父级的children不存在，初始化为空数组[]后再存入
      item['title'] = item['name'];
      item['value'] = item['id'];
      (parent.children || (parent.children = [])).push(item);
    } else {
      // 如果父级菜单不存在，则做为顶级菜单存入
      item['title'] = item['name'];
      item['value'] = item['id'];
      menu.push(item);
    }
  });
  return menu;
};
