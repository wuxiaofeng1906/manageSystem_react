import {ApolloClient, QueryOptions} from "@apollo/client/core";
import {useModel} from "@@/plugin-model/useModel";
import {useRequest} from "ahooks";

export function useApolloClient(): ApolloClient<object> {
  const { initialState: { apolloClient }  } = useModel('@@initialState') as any;
  return apolloClient;
}

export function useQuery(gql: QueryOptions['query']): { data: any, loading: boolean, error: any } {
  const client = useApolloClient();

  return useRequest(async () => {
    const { data } = await client.query({
      query: gql
    });

    return data;
  });

}
