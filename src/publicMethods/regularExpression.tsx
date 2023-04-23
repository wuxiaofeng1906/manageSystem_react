// 匹配语雀地址
export const matchYuQueUrl = (url: string) => {
  // const pattern = /^https:\/\/.*/g;
  // const result = url.match(pattern);
  const urlP= /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  const result = url.match(urlP)
  if (result && result.length) {
    return true;
  }
  return false;
}
