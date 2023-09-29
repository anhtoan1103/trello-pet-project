import ListColumns from "./ListColumns/ListColumns";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { mapOrder } from "~/utils/sorts";

function BoardContent({ board }) {
  BoardContent.propTypes = {
    board: PropTypes.board,
  };
  const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, "_id");

  return (
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
  );
}

export default BoardContent;
