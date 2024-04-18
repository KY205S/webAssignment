import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button } from "@mui/material";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MessageR = () => {
  const navigate = useNavigate();

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
          title="Message"
        />
        <CardMedia
          component="img"
          height="20%"
          image="https://cdn1.vectorstock.com/i/1000x1000/34/70/two-color-processing-icon-from-artificial-vector-25693470.jpg"
          alt="Paella dish"
        />
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            This page show the all Message
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "center", padding: 2 }}>
          <Stack spacing={2} justifyContent={"space-between"}>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/login")}
            >
              Testing
            </Button>
          </Stack>
        </CardActions>
      </Card>
    </Box>
  );
};

export default MessageR;
