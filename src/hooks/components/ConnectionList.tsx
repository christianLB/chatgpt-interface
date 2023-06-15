import React, { useState } from "react";

interface IConnectionsList {
  connections: any;
}

const ConnectionList = ({
  connections: { docs: connections = [] },
}: IConnectionsList) => {
  return (
    <div>
      {connections.map((connection: any, index: number) => {
        return (
          <div key={index} className={"connection box b"}>
            {++index} {connection.intensity}% {connection.keywords}
          </div>
        );
      })}
    </div>
  );
};

export default ConnectionList;
