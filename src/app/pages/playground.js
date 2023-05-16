import { usePayloadCMS } from "../../hooks/usePayloadCMS";

export default function Playground() {
  const { data, error, loading } = usePayloadCMS(`
    query {
      blocks {
        id
        content
        connections {
          id
          content
        }
      }
    }
  `);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Payload CMS Page</h1>
      {data.blocks.map((block) => (
        <div key={block.id}>
          <h2>Block ID: {block.id}</h2>
          <p>Content: {block.content}</p>
          <h3>Connections:</h3>
          {block.connections.map((connection) => (
            <div key={connection.id}>
              <p>Connection ID: {connection.id}</p>
              <p>Content: {connection.content}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
