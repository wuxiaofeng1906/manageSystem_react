// 测试环境
export const Notice_Env_Test = "hotfix-aws-1"; // 传给后端的环境(测试环境)
export const Notice_Common_Test = `http://identity.${Notice_Env_Test}-global.e7link.com/`;   // 测试环境上传图片之前的鉴权获取，以及公告GQL查询（测试环境）

// 正式环境
export const Notice_Env = "cn-northwest-global"; // 传给后端的环境（正式环境）
export const Notice_Common = `http://identity.${Notice_Env}.77hub.com/graphiql/index.html`;   // 上传图片之前的鉴权获取，以及公告GQL查询（正式环境）

export const Notice_ImageView = "http://s3.cn-northwest-1.amazonaws.com.cn/cn-northwest-1-q7link-test/"; // 图片上传后，通过这个链接拼接上传后的图片ID就可以访问到图片。
export const Notice_PostImage = "http://s3.cn-northwest-1.amazonaws.com.cn/";   // 将选中的图片发送到该地址对应的服务器
export const Notice_PreviewEnv = "http://ops.q7link.com:8080/api/qqsystem/busenv/?page=1&limit=1000"; // 从运维那里查询预览地址



