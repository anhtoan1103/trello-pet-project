import ListColumns from "./ListColumns/ListColumns";
import Box from "@mui/material/Box";

function BoardContent() {
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
      <ListColumns></ListColumns>;
    </Box>
  );
}

export default BoardContent;
