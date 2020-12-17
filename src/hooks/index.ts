import {ApolloClient} from "@apollo/client/core";
import {useModel} from "@@/plugin-model/useModel";

export function useApolloClient(): ApolloClient<object> {
  const { initialState: { apolloClient }  } = useModel('@@initialState') as any;
  return apolloClient;
}
