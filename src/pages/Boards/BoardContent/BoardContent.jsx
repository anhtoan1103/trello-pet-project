import ListColumns from "./ListColumns/ListColumns";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { mapOrder } from "~/utils/sorts";

import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

function BoardContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor, {
  //   // require mouse move 10px for active
  //   activationConstraint: { distance: 10 },
  // });
  const mouseSensor = useSensor(MouseSensor, {
    // require mouse move 10px for active
    activationConstraint: { distance: 10 },
  });

  const touchSensor = useSensor(TouchSensor, {
    // require hold for 250ms and tolerance (dung sai: if we use hold the item and move for more than 500px that will make the action be canceled) 500px for active
    activationConstraint: { delay: 250, tolerance: 500 },
  });
  // highly recommend for using mouseSensor and touchSensor for better experiment in Mobile
  // const sensors = useSensors(pointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  BoardContent.propTypes = {
    board: PropTypes.board,
  };

  const [orderedColumns, setOrderedColumns] = useState([]);

  // point out that the dragging item is card or column, at the same time there is only one element is dragging (column or card)
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // if over not exist (drag to wrong column) then return
    if (!over) return;

    // if the new pos different with the old pos, handle the drag event
    if (active.id != over.id) {
      // get old pos from active
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      // get new pos from over
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);
      // dùng arrayMove để sắp xếp lại column ban đầu
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
      // console.log(dndOrderedColumns);
      // console.log(dndOrderedColumnsIds);

      // update the state of the column after drag
      setOrderedColumns(dndOrderedColumns);
    }
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
  };

  // add animation when drop element
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      sensors={sensors}
      onDragStart={handleDragStart}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          height: (theme) => theme.trello.boardContentHeight,
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          p: "10px",
        }}
      >
        <ListColumns columns={orderedColumns}></ListColumns>;
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData}></Column>
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData}></Card>
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
