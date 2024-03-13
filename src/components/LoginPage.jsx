import React from "react";

import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import AddBoxIcon from "@mui/icons-material/AddBox";

const LoginPage = () => {
  return (
    <Box
      marginLeft={35}
      sx={{
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", m: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={
              "data:image/png;base64,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"
            }
            alt="NHS Logo"
            style={{ maxWidth: "100px", marginTop: "20px" }}
          />
          <Typography variant="h5" component="h1" sx={{ mt: 2 }}>
            NHS Help
          </Typography>
        </Box>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            id="input-username"
            label="Username"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <AccountCircle sx={{ color: "action.active", mr: 1 }} />
              ),
            }}
          />
          <TextField
            fullWidth
            id="input-password"
            label="Password"
            type="password"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <LockIcon sx={{ color: "action.active", mr: 1 }} />
              ),
            }}
          />
          <FormControlLabel
            control={<Checkbox name="remember" color="primary" />}
            label="Remember me"
            sx={{ alignSelf: "flex-start" }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1, width: "100%" }}
          >
            LOGIN
          </Button>

          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 0, width: "100%" }}
          >
            REGISTER
          </Button>

          <Button color="primary" sx={{ mt: 1 }}>
            Forgot password?
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
