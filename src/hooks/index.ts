/*
 * @Description:
 * @Author: jieTan
 * @Date: 2021-11-19 16:33:15
 * @LastEditTime: 2021-11-22 15:56:24
 * @LastEditors: jieTan
 * @LastModify:
 */
import {ApolloClient, gql} from '@apollo/client/core';
// @ts-ignore
import {useModel} from '@@/plugin-model/useModel';
import {useRequest} from 'ahooks';

export class GqlClient<T> {
  // eslint-disable-next-line @typescript-eslint/no-parameter-properties
  constructor(private readonly apolloClient: ApolloClient<T>) {
  }

  query = (query: string) => {
    console.log("query中GQL的token", localStorage.getItem("accessId"));
    // gql 浏览器页面下面的 HTTP HEADERS 下面需要写：{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IuWQtOaZk-WHpCIsInN1YiI6Ild1WGlhb0ZlbmciLCJpYXQiOjE2MjM4MzA2Nzd9.G3EjtMWppClX_E2NN0dFPXgX6OsGSrIXy4ReT_Rs5zI"}

    return this.apolloClient.query({
      query: gql(query),
      context: {
        headers: {"Authorization": `Bearer ${localStorage.getItem("accessId")}`},  // 添加headers请求头，用于权限控制
        // headers: {"Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IuiwreadsCIsInN1YiI6IlRhbkppZSIsImlhdCI6MTYyMzgyOTk4NX0.GqXs9NTJ3ynUzT0w9hkxppaKqvBUa6PDG2TmrfGyN5k`},
      }
    });
  };
}

export function useGqlClient(): GqlClient<object> {
  const {initialState: {gqlClient},} = useModel('@@initialState') as any;
  return gqlClient;
}

export function useQuery(query: string): { data: any; loading: boolean; error: any } {
  const client = useGqlClient();

  return useRequest(async () => {

    const {data} = await client.query(query);

    return data;
  });
}
