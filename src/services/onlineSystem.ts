import request from './request';
import { GqlClient } from '@/hooks';
const baseUrl = '/api/verify';
export const OnlineSystemServices = {
  async getProjects() {
    return request(`${baseUrl}/duty/project`);
  },
  async getEnvs() {
    return request(`${baseUrl}/release/online_environment`);
  },
  async getOrgList(client: GqlClient<object>) {
    const { data } = await client.query(`
      {
        data:organization{
          organization{
            id
            name
            parent
            parentName
          }
        }
      }
  `);
    return data.data;
  },
};
