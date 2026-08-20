import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const WORDPRESS_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.rukhsolutions.com";

export function getClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: `${WORDPRESS_URL}/graphql`,
      fetch,
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: "no-cache" },
    },
  });
}
