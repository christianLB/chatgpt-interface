import usePayloadCollection from "../hooks/usePayloadCollection";
import "semantic-ui-css/semantic.min.css";
import Block from "../components/Block";

import React, { useState } from "react";
import { useDrop } from "react-dnd";

export default function Whiteboard() {
  const { fetchAllData, fetchAllLoading } = usePayloadCollection({
    collection: "bloques",
  });
  const { docs: blocks } = fetchAllData;

  const [positions, setPositions] = useState({});

  const [, drop] = useDrop(() => ({
    accept: "block",
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      setPositions((positions) => ({
        ...positions,
        [item.id]: { left, top },
      }));
      return undefined;
    },
  }));

  return (
    <div ref={drop} id={"whiteboard"} className={"h-full"}>
      {blocks?.map((block: any, index: number) => {
        const pos = positions[block.id] || {
          left: 100 * index,
          top: 100 * index,
        };
        return (
          <Block key={block.id} block={block} left={pos.left} top={pos.top} />
        );
      })}
    </div>
  );
}
