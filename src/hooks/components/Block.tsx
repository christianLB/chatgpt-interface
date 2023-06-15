import React, { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { Resizable } from "re-resizable";
import useLLM from "usellm";
import usePayloadCollection from "@/hooks/usePayloadCollection";
import BlockTitle from "./BlockTitle";
import useToggle from "../useToggle";

export interface IBlock {
  id?: string;
  block: any;
  top: number;
  left: number;
  content?: string;
  onSelect?: (block: IBlock) => void;
  onClick?: (ref: any, block: IBlock) => void;
  onToggleCollapse: (block: IBlock) => void;
  selectable?: boolean;
  selected?: boolean;
  isFocused?: boolean;
  collapsed?: boolean;
}

const Block = ({
  block,
  top = 0,
  left = 0,
  onSelect = () => {},
  onClick = (ref: any) => {},
  onToggleCollapse = (block: IBlock) => {},
  selectable = true,
  selected = false,
  isFocused = false,
}: IBlock) => {
  const llm = useLLM({ serviceUrl: "/api/llm" });
  const { update, updating } = usePayloadCollection({
    collection: "bloques",
  });
  const [prompt, setPrompt] = useState();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [collapsed, toggleCollapse] = useToggle(block.collapsed);

  const text = block?.content || "";

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "block",
      item: { id: block.id, left, top },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [left, top]
  );

  const zIndexRef: any = useRef();
  const resizableRef = useRef<Resizable | null>(null);

  const handleGenerate = async () => {
    try {
      const { message } = await llm.chat({
        messages: [{ role: "user", content: prompt || "" }],
        stream: true,
        onStream: ({ message }) => setResponse(message.content),
        //setResponse((prev) => `${prev}${message.content}`),
      });
      console.log("Received message: ", message.content);
      update({
        id: block.id,
        body: {
          content: message.content,
        },
      });
    } catch (error) {
      console.error("Something went wrong!", error);
    }
  };

  const resizeStopHandler = (e: any, dir: any, ref: any) => {
    console.log("resizeStop");
    update({
      id: block.id,
      body: {
        h: ref.offsetHeight,
        w: ref.offsetWidth,
      },
    });
  };

  useEffect(() => {
    if (!isFocused && zIndexRef?.current?.style) {
      zIndexRef.current.style.zIndex = "";
    }
  }, [isFocused]);

  useEffect(() => {
    if (resizableRef.current) {
      if (collapsed) {
        resizableRef.current.updateSize({ width: block.w, height: 36 });
      } else {
        resizableRef.current.updateSize({ width: block.w, height: block.h });
      }
    }
  }, [collapsed, block.w, block.h]);

  return (
    <div ref={zIndexRef as any} style={{ position: "absolute" }}>
      <Resizable
        ref={resizableRef}
        defaultSize={{
          width: block.w,
          height: block.collapsed ? 36 : block.h,
        }}
        enable={{ bottomRight: !collapsed }}
        style={{ position: "absolute", left: `${left}px`, top: `${top}px` }}
        onResizeStop={resizeStopHandler}
      >
        <div
          ref={drag}
          style={{ height: "100%", opacity: isDragging ? 0.5 : 1 }}
          className={`block b box ${isFocused || selected ? "focused" : ""}`}
          onMouseDown={() => onClick(zIndexRef, block)}
        >
          <BlockTitle
            onSelect={() => onSelect(block)}
            selectable={selectable && !selected}
            selected={selected}
            title={block.title}
            isFocused={isFocused}
            collapsed={collapsed}
            onToggleCollapse={() => {
              toggleCollapse();
              onToggleCollapse(block);
            }}
          />
          {!collapsed && (
            <>
              <div className={"plr"}>
                {text}
                {response}
              </div>
              <div className={"bottom-panel bt"}>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e: any) => setPrompt(e.target.value)}
                  className={"text-box b"}
                  style={{ width: "-webkit-fill-available" }}
                ></input>
                <button
                  className={"ui button ml"}
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading
                    ? "Loading..."
                    : updating
                    ? "Updating..."
                    : "Generate"}
                </button>
              </div>
            </>
          )}
        </div>
      </Resizable>
    </div>
  );
};

export default Block;
