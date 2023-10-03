import Box from "@mui/material/Box";
import Card from "./Card/Card";
import PropTypes from "prop-types";

function ListCards({ listCards }) {
  ListCards.propTypes = {
    listCards: PropTypes.listCards,
    card: PropTypes.func,
  };

  return (
    <Box
      sx={{
        p: "0 5px",
        m: "0 5px",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        overflowX: "hidden",
        overflowY: "auto",
        maxHeight: (theme) =>
          `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} - ${
            theme.trello.columnHeaderHeight
          } - ${theme.trello.columnFooterHeight})`,
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ced0da",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#bfc2cf",
        },
      }}
    >
      {listCards?.map((card) => (
        <Card key={card._id} card={card}></Card>
      ))}
    </Box>
  );
}

export default ListCards;
