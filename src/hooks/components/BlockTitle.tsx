import React from "react";
import { Checkbox } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import useLLM from "usellm";

export interface IBlockTitle {
  onSelect: () => void;
  onToggleCollapse: () => void;
  selected: boolean;
  selectable: boolean;
  title: string;
  isFocused?: boolean;
  collapsed: boolean;
}

const BlockTitle = ({
  onSelect,
  onToggleCollapse,
  selectable,
  selected,
  title,
  isFocused = false,
  collapsed,
}: IBlockTitle) => {
  //const llm = useLLM({ serviceUrl: "/api/llm" });

  return (
    <div className={"block-title plr mb"}>
      {((isFocused && selectable) || selected) && (
        <Checkbox
          onChange={onSelect}
          disabled={!selectable && !selected}
          checked={selected}
          className="mr"
        />
      )}
      <div className={"title"}>Title {title}</div>
      {isFocused && (
        <>
          <Icon className={"trash-icon"} fitted name="trash" />
        </>
      )}
      <Icon
        name={`angle ${collapsed ? "down" : "up"}`}
        size="large"
        onClick={onToggleCollapse}
      />
    </div>
  );
};

export default BlockTitle;
