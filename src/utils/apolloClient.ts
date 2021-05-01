import { ApolloClient, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache();

export const client = new ApolloClient({
  // Provide required constructor fields
  cache: cache,
  uri: "/api/graphql",
  ssrMode: true,
  // Provide some optional constructor fields
  name: "testing-prisma",
  version: "1.0",
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network"
    }
  }
});
