import ListColumns from "./ListColumns/ListColumns";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { mapOrder } from "~/utils/sorts";

import {
  DndContext,
  //   PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  const handleDragEnd = (event) => {
    console.log("event: ", event);
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
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
      </Box>
    </DndContext>
  );
}

export default BoardContent;
