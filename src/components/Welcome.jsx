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

const Welcome = () => {
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
          title="NHS Help"
        />
        <CardMedia
          component="img"
          height="20%"
          image="https://dailysceptic.org/wp-content/uploads/2022/12/Rainbow-NHS-badge_Video-01-01-01-01-1024x576-1.png"
          alt="Paella dish"
        />
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            Welcome to NHS Help! Please login to access your account and manage
            your services. If you don't have an account, feel free to register
            and start using our services today.
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
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1, ml: 2 }} // Increase padding and font size, add margin left for spacing
              onClick={() => navigate("/register")}
            >
              Register
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/History")}
            >
              History
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/user")}
            >
              WelcomeU
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/doctor")}
            >
              WelcomeD
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/admin")}
            >
              admin
            </Button>




          </Stack>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Welcome;
