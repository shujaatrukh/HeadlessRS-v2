"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { getSessionToken, setSessionToken } from "./session";

const WORDPRESS_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://cms.rukhsolutions.com";

// WooCommerce (wp-graphql-woocommerce) session handling: the server returns a
// `woocommerce-session` response header containing a JWT that must be echoed
// back as `woocommerce-session: Session <token>` on subsequent requests so
// the cart persists across page loads for a guest shopper.
const wooFetch: typeof fetch = async (input, init) => {
  const token = getSessionToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("woocommerce-session", `Session ${token}`);

  const response = await fetch(input, { ...init, headers });

  const newToken = response.headers.get("woocommerce-session");
  if (newToken) setSessionToken(newToken);

  return response;
};

let client: ApolloClient<unknown> | null = null;

export function getWooClient() {
  if (client) return client;
  client = new ApolloClient({
    link: new HttpLink({
      uri: `${WORDPRESS_URL}/graphql`,
      fetch: wooFetch,
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: "no-cache" },
      mutate: { fetchPolicy: "no-cache" },
      watchQuery: { fetchPolicy: "no-cache" },
    },
  });
  return client;
}
