import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
});

// Custom hook
const usePayloadCMS = (query: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    client
      .query({
        query: gql`
          ${query}
        `,
      })
      .then((result) => {
        setData(result.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [query]);

  return { loading, error, data };
};

export default usePayloadCMS;
