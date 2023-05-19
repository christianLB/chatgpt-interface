import usePayloadCollection from "../hooks/usePayloadCollection";
import "semantic-ui-css/semantic.min.css";
import Block from "../components/Block";

import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";

export default function Whiteboard() {
  const { fetchAllData, update, create, fetchAll } = usePayloadCollection({
    collection: "bloques",
  });
  const { docs: blocks } = fetchAllData;

  const defaultPositions: any = {};

  const [positions, setPositions] = useState({});

  const [, drop] = useDrop(() => ({
    accept: "block",
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.max(0, Math.round(item.left + delta.x));
      const top = Math.max(0, Math.round(item.top + delta.y));
      setPositions((positions) => ({
        ...positions,
        [item.id]: { left, top },
      }));
      update({
        id: item.id,
        body: {
          x: left,
          y: top,
        },
      });
      return undefined;
    },
  }));

  const handleNewBlock = async () => {
    await create({ body: { content: "new", x: 0, y: 0, w: 400, h: 128 } });
    fetchAll();
  };

  useEffect(() => {
    if (blocks) {
      const defaultPositions: any = {};
      blocks?.forEach((block: any) => {
        const pos = { left: block.x, top: block.y };
        defaultPositions[block.id] = pos;
      });
      setPositions(defaultPositions);
    }
  }, [blocks]);

  return (
    <div ref={drop} id={"whiteboard"} className={"h-full"}>
      <button
        className={"ui button absolute top-0 left-0"}
        onClick={handleNewBlock}
      >
        iuiu
      </button>
      {blocks?.map((block: any, index: number) => {
        const pos = positions[block.id] || {
          left: 100 * index,
          top: 100 * index,
        };
        return (
          <Block
            key={block.id}
            block={block}
            left={pos.left}
            top={pos.top}
            positions={positions}
          />
        );
      })}
    </div>
  );
}
