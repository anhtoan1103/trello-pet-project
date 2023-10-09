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
  getFirstCollision,
  pointerWithin,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null);

  // the last intersection point
  const lastOverId = useRef(null);

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
  // update state incase move card between different columns
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
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

        // update the columnId value when dragging card
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        };
        // add the dragging card to new column by the new index
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        );

        // update the cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }
      console.log("nextOverColumn.cards: ", nextOverColumn.cards);
      console.log(
        "nextOverColumn.columnOrderIds: ",
        nextOverColumn.columnOrderIds
      );
      console.log("nextColumns: ", nextColumns);

      return nextColumns;
    });
  };

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);

    // only set oldColumn if the card is dragging
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
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
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      );
    }
  };

  const handleDragEnd = (event) => {
    // console.log("handleDragEnd: ", event);

    const { active, over } = event;

    // if over not exist (drag to wrong column) then return
    if (!active || !over) return;

    // handle for card dragging
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
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
      console.log("oldcolumn: ", oldColumnWhenDraggingCard);
      console.log("overColumn: ", overColumn);
      // check if this is two different columns
      if (activeDragItemData.columnId !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        );
      } else {
        // drag within the same column
        // get old position from oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        );
        // get new position from overColumn
        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        );
        // use arrayMove because we dragging within the same column, the same logic with dragging columns
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard.cards,
          oldCardIndex,
          newCardIndex
        );
        setOrderedColumns((prevColumns) => {
          // clone OrderedColumnState array to a new array for data handling
          const nextColumns = cloneDeep(prevColumns);

          // find the column we are dragging
          const targetColumn = nextColumns.find(
            (c) => c._id === overColumn._id
          );

          // update the new value for card and cardOrderIds in targetColumn
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCards.map((c) => c._id);

          // return the new state
          return nextColumns;
        });
      }
    }

    // handle for column dragging
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // if the new pos different with the old pos, handle the drag event
      if (active.id != over.id) {
        // get old pos from active
        const oldColumnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        );
        // get new pos from over
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        );
        // dùng arrayMove để sắp xếp lại column ban đầu
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        );
        // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
        // console.log(dndOrderedColumns);
        // console.log(dndOrderedColumnsIds);

        // update the state of the column after drag
        setOrderedColumns(dndOrderedColumns);
      }
    }

    // these attribute must set to null after drag
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnWhenDraggingCard(null);
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

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }

      // find the intersection with pointer
      const pointerIntersections = pointerWithin(args);

      // check the case we drag the card out of the table
      if (!pointerIntersections?.length) return;
      // return the list of collisions
      // const intersections =
      //   pointerIntersections?.length > 0
      //     ? pointerIntersections
      //     : rectIntersection(args);
      // find the first pointerIntersections
      let overId = getFirstCollision(pointerIntersections, "id");
      if (overId) {
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        );
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) =>
                container.id !== overId &&
                checkColumn?.cardOrderIds?.includes(container.id)
            )[0]?.id,
          });
        }

        lastOverId.current = overId;
        return [{ id: overId }];
      }

      // if overId is null then return empty array
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType, orderedColumns]
  );

  return (
    <DndContext
      sensors={sensors}
      // this attribute will handle for case the object is too big, because the conflict between column and card
      // collisionDetection={closestCorners}
      // fix_ui_bug, customize collision detection algorithm
      collisionDetection={collisionDetectionStrategy}
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
