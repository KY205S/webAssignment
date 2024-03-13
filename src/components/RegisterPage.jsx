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
import { Margin } from "@mui/icons-material";

const RegisterPage = () => {
  return (
    <Box flex={9} p={2}>
      <Card sx={{ marginLeft: 5 }}>
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
          image="https://media.istockphoto.com/id/1373745245/vector/login-page-background-enter-username-and-password-ui-user-interface.jpg?s=612x612&w=0&k=20&c=lTFio2kjoTHxwlEPxLGf59_vibtvjzp4ypy-RVcQTp0="
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

export default RegisterPage;
