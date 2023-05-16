import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "http://192.168.1.11:3020/api/graphql",
  cache: new InMemoryCache(),
});

const GET_BLOCKS = gql`
  query getBloques {
    Bloques {
      content
      connections
    }
  }
`;

const SCHEMA_INTROSPECTION = gql`
  {
    __schema {
      types {
        name
        fields {
          name
        }
      }
    }
  }
`;

// Custom hook
const usePayloadCMS = () => {
  const { loading, error, data } = useQuery(GET_BLOCKS, {
    client,
  });

  const { data: introspectionData } = useQuery(SCHEMA_INTROSPECTION, {
    client,
  });

  console.log(introspectionData);

  return { loading, error, data };
};

export default usePayloadCMS;
