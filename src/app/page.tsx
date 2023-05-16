"use client";
//import Image from "next/image";
import usePayloadCMS from "../hooks/usePayloadCMS";
import { useState, useEffect } from "react";

export default function Playground() {
  const [blocks, setBlocks] = useState<any>([]);

  const { data, error, loading } = usePayloadCMS();
  console.log({ data });
  //if (loading) return <div>Loading...</div>;
  //if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Payload CMS Page</h1>
      {blocks.map((block: any) => (
        <div key={block.id}>
          <h2>Block ID: {block.id}</h2>
          <p>Content: {block.content}</p>
          <h3>Connections:</h3>
          {/* {block.connections.map((connection) => (
            <div key={connection.id}>
              <p>Connection ID: {connection.id}</p>
              <p>Content: {connection.content}</p>
            </div>
          ))} */}
        </div>
      ))}
    </div>
  );
}
