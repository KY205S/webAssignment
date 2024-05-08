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

const Admin = () => {
  const navigate = useNavigate();

  return (
    <Box flex={9} p={1}>
      <Card sx={{ maxWidth: 350, marginLeft: 30 }}>
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
          title="hello admin!"
        />
        <CardMedia
          component="img"
          image="data:image/png;base64,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"
          alt="Paella dish"
          sx={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            width: "50%", // Set width as desired
            height: "auto", // Set height to 'auto' to maintain aspect ratio
          }}
          style={{
            width: "30%",
            height: "30%",
          }}
        />
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            Welcome adminstrator
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "center", padding: 2 }}>
          <Stack spacing={2} justifyContent={"space-between"}>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/RegisterDoctor")}
            >
              Register doctor
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1, ml: 2 }} // Increase padding and font size, add margin left for spacing
              onClick={() => navigate("/userApproval")}
            >
              User Approval
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "1.1rem", px: 3, py: 1 }} // Increase padding and font size
              onClick={() => navigate("/MessageRespond")}
            >
              Message
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
          </Stack>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Admin;
