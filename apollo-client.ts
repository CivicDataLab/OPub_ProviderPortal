import { ApolloClient, InMemoryCache, DefaultOptions } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { getSession } from 'next-auth/react';
import { useProviderStore } from 'services/store';

const authLink = setContext(async (_, { headers }) => {
  const org = useProviderStore.getState().org;
  const session = await getSession();

  return {
    headers: {
      ...headers,
      authorization:
        session && session['access']?.token ? session['access'].token : '',
      organization: org?.org_id || null,
    },
  };
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

export const getGraphQLClient = new ApolloClient({
  link: authLink.concat(
    createUploadLink({
      uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
    })
  ),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions: defaultOptions,
  ssrMode: typeof window === 'undefined',
});

export const getInternalGraphQLClient = new ApolloClient({
  link: authLink.concat(
    createUploadLink({
      uri: `${process.env.BACKEND_URL}/graphql`,
    })
  ),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions: defaultOptions,
  ssrMode: typeof window === 'undefined',
});

// export default getGraphQLClient;

