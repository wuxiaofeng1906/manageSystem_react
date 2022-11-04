import axios from 'axios';

// 根据发布编号获取对应的数据
const getInitPageData = async (queryReleaseNum: string) => {
  const result: any = {
    message: '',
    data: [],
  };

  await axios
    .get('/api/verify/release/release_detail', { params: { ready_release_num: queryReleaseNum } })
    .then(function (res) {
      if (res.data.code === 200) {
        result.data = res.data.data;
      } else {
        result.message = `错误：${res.data.msg}`;
      }
    })
    .catch(function (error) {
      result.message = `异常信息:${error.toString()}`;
    });

  return result;
};

export { getInitPageData };
