import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Switch from "@mui/material/Switch";
import { Link } from "react-router-dom";
import MyContext from "./Context1";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const DoctorSidebar = () => {
  // Your code for the doctor sidebar goes here
  return (
    <Box flex={1} p={1}>
      <Box
        sx={{
          borderRight: 1, // Add a border right
          borderColor: "divider", // Use the theme's divider color
          width: 180,
          height: "calc(100vh - 64px)", // Adjust 64px to the height of your header
          position: "fixed",
          top: "64px",
        }}
      >
        <List>
          <ListItem disablePadding>
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItemButton component="a">
                <ListItemIcon>
                  <AddBoxIcon />
                </ListItemIcon>
                <ListItemText primary="Management Booking" />
              </ListItemButton>
            </Link>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Prescription" />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Test Record" />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="About us" />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DarkModeIcon />
              </ListItemIcon>
              <Switch defaultChecked />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

const RegularSidebar = () => {
  // Your code for the regular sidebar goes here
  return (
    <Box flex={1} p={1}>
      <Box
        sx={{
          borderRight: 1, // Add a border right
          borderColor: "divider", // Use the theme's divider color
          width: 180,
          height: "calc(100vh - 64px)", // Adjust 64px to the height of your header
          position: "fixed",
          top: "64px",
        }}
      >
        <List>
          <ListItem disablePadding>
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <ListItemButton component="a">
                <ListItemIcon>
                  <AddBoxIcon />
                </ListItemIcon>
                <ListItemText primary="Booking" />
              </ListItemButton>
            </Link>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText primary="History" />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Prescription" />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Test Record" />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="About us" />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DarkModeIcon />
              </ListItemIcon>
              <Switch defaultChecked />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

const Sidebar = () => {
  const { isDoctor, isLoggedIn } = useContext(MyContext);

  if (!isLoggedIn) {
    return null;
  }

  return isDoctor ? <DoctorSidebar /> : <RegularSidebar />;
};

export default Sidebar;
