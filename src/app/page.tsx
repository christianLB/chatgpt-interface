"use client";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "semantic-ui-css/semantic.min.css";
import Whiteboard from "@/components/Whiteboard";

export default function Playground() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Whiteboard />
    </DndProvider>
  );
}
