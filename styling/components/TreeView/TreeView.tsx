import React, { useCallback, useState } from "react";
import Tree, { TreeProps } from "rc-tree";
import "./TreeView.scss";
import { ReactComponent as RightArrow } from "styling/assets/icons/chevron.svg";
import { NodeDragEventParams } from "rc-tree/lib/contextTypes";
import { EventDataNode, Key } from "rc-tree/lib/interface";

interface TreeData {
  title: string;
  key: string;
  children?: TreeData[];
}

interface TreeViewProps {
  treeData: TreeData[];
  expandedKeys?: string[];
  onDrop?: (newState, droppedNode) => void;
  isDraggable?: boolean;
}

interface DropInfo extends NodeDragEventParams{
  dragNode: EventDataNode;
  dragNodesKeys: Key[];
  dropPosition: number;
  dropToGap: boolean;
}

export const TreeView: React.FC<TreeViewProps> = ({
  treeData,
  onDrop = () => {},
  expandedKeys = [],
  isDraggable = true
}) => {
  const [stateData, setStateData] = useState<TreeData[]>(treeData);

  const onObjectDrop: TreeProps["onDrop"] = (info: DropInfo) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          callback(item, index, arr);
          return;
        }
        if (item.children) {
          loop(item.children, key, callback);
        }
      });
    };
    const data = [...stateData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Node is dropped on another node
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // insert the drag object to the last on the list
        item.children.push(dragObj);
      });
    } else {
      // Node is dropped on the gap
      let refArray;
      let refIdx;
      loop(data, dropKey, (item, index, arr) => {
        refArray = arr;
        refIdx = index;
      });
      refArray.splice(refIdx + 1, 0, dragObj);
    }

    setStateData(data);
    onDrop(data, dragObj);
  };

  const switcherIcon = ({ expanded }) => {
    return (
      <div className={`icon-wrapper ${expanded ? "rotate" : ""}`}>
        <RightArrow />
      </div>
    );
  };

  const dropIndicator = (data) => {
    const { dropPosition } = data;
    // dropPosition === 0 means it will be dropped on a leaf node
    return (
      <div
        className={`drop-indicator ${dropPosition === 0 ? "indentation" : ""}`}
      ></div>
    );
  };

  const motion = {
    // this handles the motion animation when a node is being dropped, extended, or collapsed
    motionName: "node-motion",
    motionAppear: false,
    onAppearStart: () => {
      return { height: 0 };
    },
    onAppearActive: (node) => ({ height: node.scrollHeight }),
    onLeaveStart: (node) => ({ height: node.offsetHeight }),
    onLeaveActive: () => ({ height: 0 })
  };

  return (
    <div>
      <Tree
        defaultExpandedKeys={expandedKeys}
        showIcon={false}
        switcherIcon={switcherIcon}
        dropIndicatorRender={dropIndicator}
        draggable={isDraggable}
        onDrop={onObjectDrop}
        treeData={stateData}
        motion={motion}
      />
    </div>
  );
};
