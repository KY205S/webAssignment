import React, { useContext } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Switch from "@mui/material/Switch";
import { Link } from "react-router-dom";
import MyContext from "./Context1";
//import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AuthService from "./AuthService";

import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import StarBorder from '@mui/icons-material/StarBorder';
import ExploreIcon from '@mui/icons-material/Explore';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';


// const DoctorSidebar = () => {
//   // Your code for the doctor sidebar goes here
//   return (
//     <Box flex={1} p={1}>
//       <Box
//         sx={{
//           borderRight: 1, // Add a border right
//           borderColor: "divider", // Use the theme's divider color
//           width: 180,
//           height: "calc(100vh - 64px)", // Adjust 64px to the height of your header
//           position: "fixed",
//           top: "64px",
//         }}
//       >
//         <List>
//           <ListItem disablePadding>
//             <Link
//               to="/manageBooking"
//               style={{
//                 textDecoration: "none",
//                 color: "inherit",
//               }}
//             >
//               <ListItemButton component="a">
//                 <ListItemIcon>
//                   <AddBoxIcon />
//                 </ListItemIcon>
//                 <ListItemText primary="Management Booking" />
//               </ListItemButton>
//             </Link>
//           </ListItem>
//           <Divider />

//           <ListItem disablePadding>
//             <ListItemButton>
//               <ListItemIcon></ListItemIcon>
//               <ListItemText primary="Settings" />
//             </ListItemButton>
//           </ListItem>
//           <Divider />

//           <ListItem disablePadding>
//             <ListItemButton>
//               <ListItemIcon></ListItemIcon>
//               <ListItemText primary="Prescription" />
//             </ListItemButton>
//           </ListItem>
//           <Divider />

//           <ListItem disablePadding>
//             <ListItemButton>
//               <ListItemIcon></ListItemIcon>
//               <ListItemText primary="Test Record" />
//             </ListItemButton>
//           </ListItem>
//           <Divider />

//           <ListItem disablePadding>
//             <ListItemButton>
//               <ListItemIcon></ListItemIcon>
//               <ListItemText primary="Settings" />
//             </ListItemButton>
//           </ListItem>
//           <Divider />

//           <ListItem disablePadding>
//             <ListItemButton>
//               <ListItemIcon></ListItemIcon>
//               <ListItemText primary="About us" />
//             </ListItemButton>
//           </ListItem>
//           <Divider />

//           <ListItem disablePadding>
//             <ListItemButton>
//               <ListItemIcon>
//                 <DarkModeIcon />
//               </ListItemIcon>
//               <Switch defaultChecked />
//             </ListItemButton>
//           </ListItem>
//         </List>
//       </Box>
//     </Box>
//   );
// };

const RegularSidebar = () => {
  const { setIsLoggedIn } = useContext(MyContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.clearToken(); // AuthService clearJWT
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <Box
   sx={{
     position: 'fixed',
     top: '64px',
     left: 0,
     bottom: 0,
     width: 240,
     bgcolor: 'primary.main',
     color: 'white',
     py: 2,
     ".MuiListItemButton-root": {
       borderRadius: "8px",
       margin: "6px 12px",
       "&:hover": {
         bgcolor: "primary.dark"
       }
     }
   }}
>
      <List>
        {[
          { icon: <AddBoxOutlinedIcon />, text: "Booking", link: "/booking" },
          { icon: <ListAltIcon />, text: "Approval", link: "/approval" },
            { icon: <ListAltIcon />, text: "Schedule", link: "/manageBooking" },
          // { icon: <AssignmentOutlinedIcon />, text: "Records", link: "/record" },
          { icon: <ListAltIcon />, text: "AppointmentD", link: "/DoctorAppointmentList" },
          { icon: <ListAltIcon />, text: "AppointmentU", link: "/PatientAppointmentList" },
          { icon: <AnalyticsOutlinedIcon />, text: "Examination", link: "/ExaminationReport" },
          { icon: <MessageOutlinedIcon />, text: "ConsultU", link: "/OnlineConsult" },
          { icon: <MessageOutlinedIcon />, text: "ConsultA", link: "/ConsultService" },
          { icon: <SettingsOutlinedIcon />, text: "ProfileD", link: "/doctor" },
            { icon: <SettingsOutlinedIcon />, text: "ProfileU", link: "/user" },
            { icon: <SettingsOutlinedIcon />, text: "Pharmacy", link: "/MyMapComponent" },
          { icon: <LogoutIcon />, text: "Logout", link: "/" },
          // { icon: <DarkModeIcon />, text: "Toggle Dark Mode", link: "#" }
        ].map((item, index) => (
          <Link key={index} to={item.link} style={{ textDecoration: "none", color: "inherit" }}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: "40px" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
        <ListItem disablePadding>
          {/*<ListItemButton onClick={handleLogout}>*/}
          {/*  <ListItemIcon><LogoutIcon /></ListItemIcon>*/}
          {/*  <ListItemText primary="Logout" />*/}
          {/*</ListItemButton>*/}
        </ListItem>
      </List>
    </Box>
  );
};


//   return (
//     <Box flex={1} p={1}>
//       <Box
//         sx={{
//           borderRight: 1, // Add a border right
//           borderColor: "divider", // Use the theme's divider color
//           width: 180,
//           height: "calc(100vh - 64px)", // Adjust 64px to the height of your header
//           position: "fixed",
//           top: "64px",
//         }}
//       >
//         <List>
//           <ListItem disablePadding>
//             <Link
//               to="/booking"
//               style={{
//                 textDecoration: "none",
//                 color: "inherit",
//               }}
//             >
//               <ListItemButton component="a">
//                 <ListItemIcon sx={{ marginLeft: "5px", minWidth: "35px" }}>
//                   <AddBoxOutlinedIcon sx={{ color: "black", fontSize: 26 }} />
//                 </ListItemIcon>
//                 <ListItemText
//                   primary="Booking"
//                   sx={{ "& .MuiListItemText-primary": { fontSize: "1.2rem" } }}
//                 />
//               </ListItemButton>
//             </Link>
//           </ListItem>
//           <Divider />
//
//           <Link
//             to="/arrangement"
//             style={{
//               textDecoration: "none",
//               color: "inherit",
//             }}
//           >
//             <ListItem disablePadding>
//               <ListItemButton>
//                 <ListItemIcon sx={{ marginLeft: "5px", minWidth: "35px" }}>
//                   <ListAltIcon sx={{ color: "black", fontSize: 26 }} />
//                 </ListItemIcon>
//                 <ListItemText
//                   primary="Arrangement"
//                   sx={{ "& .MuiListItemText-primary": { fontSize: "1.2rem" } }}
//                 />
//               </ListItemButton>
//             </ListItem>
//             <Divider />
//           </Link>
//
//           <Link
//             to="/record"
//             style={{
//               textDecoration: "none",
//               color: "inherit",
//             }}
//           >
//             <ListItem disablePadding>
//               <ListItemButton>
//                 <ListItemIcon sx={{ marginLeft: "5px", minWidth: "35px" }}>
//                   <AssignmentOutlinedIcon
//                     sx={{ color: "black", fontSize: 26 }}
//                   />
//                 </ListItemIcon>
//                 <ListItemText
//                   primary="Records"
//                   sx={{ "& .MuiListItemText-primary": { fontSize: "1.2rem" } }}
//                 />
//               </ListItemButton>
//             </ListItem>
//             <Divider />
//           </Link>
//           <Divider />
//
//           <ListItem disablePadding>
//             <ListItemButton
//                 to="/ExaminationReport" >
//               <ListItemIcon sx={{ marginLeft: "5px", minWidth: "35px" }}>
//                 <AnalyticsOutlinedIcon sx={{ color: "black", fontSize: 26 }} />
//               </ListItemIcon>
//               <ListItemText
//                 primary="Examination"
//                 sx={{ "& .MuiListItemText-primary": { fontSize: "1.2rem" } }}
//               />
//             </ListItemButton>
//           </ListItem>
//           <Divider />
//
//
//           <Link
//             to="/OnlineConsult"
//             style={{
//               textDecoration: "none",
//               color: "inherit",
//             }}
//           >
//             <ListItem disablePadding>
//               <ListItemButton>
//                 <ListItemIcon sx={{ marginLeft: "5px", minWidth: "35px" }}>
//                   <MessageOutlinedIcon sx={{ color: "black", fontSize: 26 }} />
//                 </ListItemIcon>
//                 <ListItemText
//                   primary="Message"
//                   sx={{ "& .MuiListItemText-primary": { fontSize: "1.2rem" } }}
//                 />
//               </ListItemButton>
//             </ListItem>
//             <Divider />
//           </Link>
//           <Divider />
//
//           <Link
//             to="/home"
//             style={{
//               textDecoration: "none",
//               color: "inherit",
//             }}
//           >
//             <ListItem disablePadding>
//               <ListItemButton>
//                 <ListItemIcon sx={{ marginLeft: "5px", minWidth: "35px" }}>
//                   <SettingsOutlinedIcon sx={{ color: "black", fontSize: 26 }} />
//                 </ListItemIcon>
//                 <ListItemText
//                   primary="Settings"
//                   sx={{ "& .MuiListItemText-primary": { fontSize: "1.2rem" } }}
//                 />
//               </ListItemButton>
//             </ListItem>
//             <Divider />
//           </Link>
//           <Divider />
//
//           {/*<Link*/}
//           {/*  to="/"*/}
//           {/*  style={{*/}
//           {/*    textDecoration: "none",*/}
//           {/*    color: "inherit",*/}
//           {/*  }}*/}
//           {/*>*/}
//             <ListItem disablePadding>
//               <ListItemButton onClick={handleLogout}>
//                 <ListItemIcon>
//                   <LogoutIcon />
//                 </ListItemIcon>
//                 <ListItemText primary="Logout" />
//               </ListItemButton>
//             </ListItem>
//           <Divider />
//
//           <ListItem disablePadding>
//             <ListItemButton>
//               <ListItemIcon>
//                 <DarkModeIcon />
//               </ListItemIcon>
//               <Switch defaultChecked />
//             </ListItemButton>
//           </ListItem>
//         </List>
//       </Box>
//     </Box>
//   );
// };

// const Sidebar = () => {
//   const { isDoctor, isLoggedIn } = useContext(MyContext);

//   if (!isLoggedIn) {
//     return null;
//   }

//   return isDoctor ? <DoctorSidebar /> : <RegularSidebar />;
// };

const Sidebar = () => {
  //const { isDoctor, isLoggedIn } = useContext(MyContext);
  const { isLoggedIn } = useContext(MyContext);
  if (!isLoggedIn) {
    return null;
  }
  return <RegularSidebar />;
};

export default Sidebar;
