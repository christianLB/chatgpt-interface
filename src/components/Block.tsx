import React, { ChangeEventHandler, useState } from "react";
import { useDrag } from "react-dnd";
import { Resizable } from "re-resizable";
import { Segment } from "semantic-ui-react";
import axios from "axios";
import useLLM from "usellm";
interface IProps {
  block: any;
  top: number;
  left: number;
}

const Block = ({ block, top = 0, left = 0 }: IProps) => {
  const llm = useLLM({ serviceUrl: "/api/llm" });

  const [prompt, setPrompt] = useState();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>("");

  const text = block?.content?.[0]?.children?.[0]?.text || "";

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

  const handleGenerate = async () => {
    try {
      const { message } = await llm.chat({
        messages: [{ role: "user", content: prompt || "" }],
        stream: true,
        onStream: ({ message }) => setResponse(message.content),
        //setResponse((prev) => `${prev}${message.content}`),
      });
      console.log("Received message: ", message.content);
    } catch (error) {
      console.error("Something went wrong!", error);
    }
  };

  // const handleGenerate = async () => {
  //   setLoading(true);
  //   try {
  //     fetch("/api/gptstream", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ prompt }),
  //     })
  //       .then((response) => {
  //         const reader = response?.body?.getReader();
  //         const decoder = new TextDecoder();

  //         reader?.read().then(function processText({ done, value }) {
  //           if (done) {
  //             console.log("Stream complete");
  //             return;
  //           }

  //           console.log(decoder.decode(value));

  //           return reader.read().then(processText);
  //         });
  //       })
  //       .catch((error) => {
  //         console.error("Error while making the request: ", error);
  //       });
  //   } catch (error) {
  //     setLoading(false);
  //     console.error("Error while making the request: ", error);
  //   }
  // };

  return (
    <Resizable
      defaultSize={{
        width: "auto",
        height: "auto",
      }}
      enable={{ bottomRight: true }}
      style={{ position: "absolute", left, top }}
    >
      <div
        ref={drag}
        style={{ height: "100%", opacity: isDragging ? 0.5 : 1 }}
        className={"ui segment block"}
      >
        {text}
        {response}
        <div className={"flex mb-2 justify-between"}>
          <input
            type="text"
            value={prompt}
            onChange={(e: any) => setPrompt(e.target.value)}
            className={"border p-2 mr-5"}
            style={{ width: "-webkit-fill-available" }}
          ></input>
          <button
            className={"ui button"}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Loading..." : "Generate"}
          </button>
        </div>
      </div>
    </Resizable>
  );
};

export default Block;
