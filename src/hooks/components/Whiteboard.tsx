import usePayloadCollection from "../usePayloadCollection";
import "semantic-ui-css/semantic.min.css";
import Block, { IBlock } from "./Block";

import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import useConnection from "../useConnection";
import ConnectionList from "./ConnectionList";

export default function Whiteboard() {
  const { fetchAllData, update, create, fetchAll } = usePayloadCollection({
    collection: "bloques",
  });
  const { fetchAllData: connections, getConnectionDataInfo } = useConnection();
  const [selectedBlocks, setSelectedBlocks] = useState<any>([]);
  const [focused, setFocus] = useState<any>();

  const { docs: blocks } = fetchAllData;

  const defaultPositions: any = {};

  const [positions, setPositions] = useState<any>({});

  const [, drop] = useDrop(() => ({
    accept: "block",
    drop: (item: any, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.max(0, Math.round(item.left + delta?.x));
      const top = Math.max(0, Math.round(item.top + delta?.y));
      setPositions((positions: any) => ({
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
    await create({ body: { content: "new", x: 0, y: 0, w: 400, h: 141 } });
    fetchAll();
  };

  const handleConnect = async () => {
    const connection = await getConnectionDataInfo(selectedBlocks);
    if (connection?.error) {
      console.log({ error: connection.error });
      setSelectedBlocks([]);
    }
  };

  const handleToggleCollapse = (block: IBlock) => {
    update({
      id: block.id,
      body: {
        collapsed: !block.collapsed,
      },
    });
  };

  const isSelected = (block: IBlock) =>
    !!selectedBlocks.find((b: IBlock) => b.id === block.id);

  const handleSelectBlock = (block: IBlock) => {
    setSelectedBlocks((selectedBlocks: any) =>
      selectedBlocks.find((b: IBlock) => b.id === block.id)
        ? selectedBlocks.filter((b: any) => b.id !== block.id)
        : selectedBlocks.length < 2
        ? [...selectedBlocks, block]
        : selectedBlocks
    );
  };

  const handleBlockCLick = (ref: any, block: IBlock) => {
    setFocus(block);
    const z = blocks.length + 1;
    ref.current.style.zIndex = z;
    update({
      id: block.id,
      body: {
        z,
      },
    });
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
      <button
        className={"ui button absolute top-0 left-0"}
        onClick={handleConnect}
        disabled={selectedBlocks.length < 2}
      >
        conectar
      </button>
      <ConnectionList connections={connections} />
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
            onSelect={handleSelectBlock}
            selectable={selectedBlocks.length < 2}
            selected={isSelected(block)}
            onClick={handleBlockCLick}
            isFocused={focused === block}
            onToggleCollapse={handleToggleCollapse}
            //positions={positions}
          />
        );
      })}
    </div>
  );
}
