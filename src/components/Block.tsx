import React from "react";
import { useDrag } from "react-dnd";
import { Resizable } from "re-resizable";
import { Segment } from "semantic-ui-react";

interface IProps {
  block: any;
  top: number;
  left: number;
}

const Block = ({ block, top = 0, left = 0 }: IProps) => {
  const text = block?.content?.[0]?.children?.[0]?.text || "";

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "block",
    item: { id: block.id, left, top },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Resizable
      defaultSize={{
        width: 200,
        height: "auto",
      }}
      style={{ position: "absolute", left, top }}
    >
      <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <Segment>{text}</Segment>
      </div>
    </Resizable>
  );
};

export default Block;
