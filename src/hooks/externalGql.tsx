import {ApolloClient, gql} from '@apollo/client/core';
import {InMemoryCache} from "@apollo/client";

// 外部GQL查询
export class ExternalGqlClient<T> {

  // 公告相关数据查询接口
  static async noticeGQLQuery(gqlString: string) {
    const apolloClient = new ApolloClient({
      cache: new InMemoryCache(),
      uri: 'http://identity.nx-hotfix-k8s.e7link.com/identity/graphql/withoutAuth', //  // 正式发布需要换地址 hotfix
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      },
    });

    return apolloClient.query({
      query: gql(gqlString)
    })
  }
}





