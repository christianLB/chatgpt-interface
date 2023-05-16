import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "http://192.168.1.11:3020/api/graphql", //process.env["PAYLOAD_CMS_SERVER_URL"],
  cache: new InMemoryCache(),
});

const GET_BLOCKS = gql`
  query getBlocks {
    Bloques {
      id
    }
  }
`;

// Custom hook
const usePayloadCMS = () => {
  const { loading, error, data } = useQuery(GET_BLOCKS, {
    client,
  });

  return { loading, error, data };
};

export default usePayloadCMS;
