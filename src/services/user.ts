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
export async function userSelfAuthority({ client }: { client: GqlClient<object> }) {
  const { data } = await client.query(`
      {
         data:userSelfAuthority{
          name
          description
          authorities{
            id
            name
            description
            parent{
              id
              name
              description
            }
          }
        }
      }
  `);
  return { data: data.data };
}
