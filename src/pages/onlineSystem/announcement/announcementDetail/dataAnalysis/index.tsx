// 解析从语雀获取的数据，返回界面可以展示的格式
export const analysisSpecialTitle = (source: any) => {

  // const example = [{first: "一级标题", seconds: [{"second": "2324234"}, {"second": "dfdsfd"}, {"second": "22222"}]}]
  const result: any = [];
  source.map((v: any) => {
    const childs: any = [];
    const specialChild = v.children;
    if (specialChild && specialChild.length > 0) {
      specialChild.map((v2: any) => childs.push({"second": v2.speciality}));
    }

    result.push({
      first: v.speciality,
      seconds: childs
    });

  });
  return result;
}
