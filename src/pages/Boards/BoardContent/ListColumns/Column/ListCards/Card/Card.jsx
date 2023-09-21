import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import GroupIcon from "@mui/icons-material/Group";
import CommentIcon from "@mui/icons-material/Comment";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { Card as MuiCard } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
function Card({ temporaryHideMedia }) {
  if (temporaryHideMedia) {
    return (
      <MuiCard
        sx={{
          cursor: "pointer",
          boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
          overflow: "unset",
        }}
      >
        <CardContent
          sx={{
            p: 1.5,
            "&:last-child": { p: 1.5 },
          }}
        >
          <Typography>undefined</Typography>
        </CardContent>
      </MuiCard>
    );
  }
  return (
    <MuiCard
      sx={{
        cursor: "pointer",
        boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
        overflow: "unset",
      }}
    >
      <CardMedia
        sx={{ height: 140 }}
        image="https://www.studytienganh.vn/upload/2021/06/105234.jpg"
        title="green iguana"
      />
      <CardContent
        sx={{
          p: 1.5,
          "&:last-child": { p: 1.5 },
        }}
      >
        <Typography>Toto`s Task</Typography>
      </CardContent>
      <CardActions sx={{ p: "0 4px 8px 4px" }}>
        <Button size="small" startIcon={<GroupIcon />}>
          20
        </Button>
        <Button size="small" startIcon={<CommentIcon />}>
          20
        </Button>
        <Button size="small" startIcon={<AttachmentIcon />}>
          20
        </Button>
      </CardActions>
    </MuiCard>
  );
}

export default Card;
