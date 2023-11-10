// Board Details
import Container from "@mui/material/Container";

import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { useState } from "react";
import { fetchBoardDetailsAPI } from "~/apis";
import { useEffect } from "react";

function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const boardId = "654dca0d4fe0dd84c4eba2fd";
    // Call api
    fetchBoardDetailsAPI(boardId).then((board) => {
      setBoard(board);
    });
  }, []);

  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
        <AppBar />
        <BoardBar board={board} />
        <BoardContent board={board} />
      </Container>
    </>
  );
}

export default Board;
