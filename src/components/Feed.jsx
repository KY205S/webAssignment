import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Feed = () => {
  return (
    <Box flex={10} p={2}>
      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "skyblue" }} aria-label="recipe">
              R
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="NHS Help"
        />
        <CardMedia
          component="img"
          height="20%"
          image="https://dailysceptic.org/wp-content/uploads/2022/12/Rainbow-NHS-badge_Video-01-01-01-01-1024x576-1.png"
          alt="Paella dish"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            This is NHS help webpage, please to login in first to use our
            service
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "skyblue" }} aria-label="recipe">
              R
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="NHS Help"
        />
        <CardMedia
          component="img"
          height="20%"
          image="https://dailysceptic.org/wp-content/uploads/2022/12/Rainbow-NHS-badge_Video-01-01-01-01-1024x576-1.png"
          alt="Paella dish"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            This is NHS help webpage, please to login in first to use our
            service
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Feed;
