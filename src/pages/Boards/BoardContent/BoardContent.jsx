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
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";

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

  // find a column by cardId
  const findColumnByCardId = (cardId) => {
    // get the list cardId by the cardId of current column
    return orderedColumns.find((column) =>
      column.cards.map((card) => card._id)?.includes(cardId)
    );
  };

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);
  };

  // trigger when dragging an object
  const handleDragOver = (event) => {
    // do nothing if we are dragging column
    if (activeDragItemData === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    // handle incase we are dragging card
    const { active, over } = event;

    // if active or over is not exist then exit
    if (!active || !over) return;

    // object destructuring: data: { current: activeDraggingCardData} ~ data.current = activeDraggingCardData
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    // overCard: the object that we target to drag
    const { id: overCardId } = over;

    // find two columns by cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    // check the columns exist or not
    if (!activeColumn || !overColumn) return;

    // check if this is two different columns
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumns) => {
        // find the position (index) of the overCard in the destination column
        const overCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id == overCardId
        );
        // calculate for the new card index
        let newCardIndex;
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        newCardIndex =
          overCardIndex >= 0
            ? overCardIndex + modifier
            : overColumn?.cards?.length + 1;

        // clone orderedColumn to new array to handle data
        const nextColumns = cloneDeep(prevColumns);
        const nextActiveColumn = nextColumns.find(
          (column) => column._id === activeColumn._id
        );
        const nextOverColumn = nextColumns.find(
          (column) => column._id === overColumn._id
        );

        // old column
        if (nextActiveColumn) {
          // remove the active card in column, prevent the duplicate of card in column
          // the function filter here is to get all the card in active column
          nextActiveColumn.cards = nextActiveColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId
          );
          // update the cardOrderIds
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
            (card) => card._id
          );
        }

        // new column
        if (nextOverColumn) {
          // remove the active card is in destination, remove if it exists
          nextOverColumn.cards = nextOverColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId
          );

          // add the dragging card to new column by the new index
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            newCardIndex,
            0,
            activeDraggingCardData
          );

          // update the cardOrderIds
          nextOverColumn.columnOrderIds = nextOverColumn.cards.map(
            (card) => card._id
          );
        }
        console.log("nextColumns: ", nextColumns);

        return nextColumns;
      });
    }
  };

  const handleDragEnd = (event) => {
    console.log("handleDragEnd: ", event);

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      console.log("Dragging Card - No action needed!");
    }

    const { active, over } = event;

    // if over not exist (drag to wrong column) then return
    if (!active || !over) return;

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
      sensors={sensors}
      // this attribute will handle for case the object is too big, because the conflict between column and card
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
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
