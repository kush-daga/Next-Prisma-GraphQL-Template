import { AppProps } from "next/dist/next-server/lib/router/router";
import "../styles/globals.css";
import { client } from "../utils/apolloClient";
import { ApolloProvider } from "@apollo/client/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
