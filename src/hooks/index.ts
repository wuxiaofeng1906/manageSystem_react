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

    return this.apolloClient.query({
      query: gql(query),
      context: {
        headers: {"Authorization": `Bearer ${localStorage.getItem("accessId")}`},
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
