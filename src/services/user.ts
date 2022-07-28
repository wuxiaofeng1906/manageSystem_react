import { request } from '@@/plugin-request/request';
import { GqlClient } from '@/hooks';
export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

export async function queryCurrent() {
  return request<API.CurrentUser>('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}

// export async function getTestUser() {
//   const client = GqlClient;
//   const { data } = await client.query(
//     `{
//             WxDeptUsers(deptNames:["测试","业务"], techs:[TEST]){
//                 id
//                 userName
//               }
//           }`,
//   );
// }
