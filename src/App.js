import "./App.css";
import * as React from "react";
import Sidebar from "./components/Sidebar";
import Rightbar from "./components/Rightbar";
import Navbar from "./components/Navbar";
import { Box, Stack } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import History from "./user/History";
import Welcome from "./components/Welcome";
import { useState } from "react";
import MyContext from "./components/Context1";
import HomeU from "./user/HomeU";
import HomeD from "./doctor/HomeD";
import Booking from "./user/booking";
import Arrangement from "./user/Arrangement";
import Record from "./user/Record";
import Message from "./user/Message";
import ManageBooking from "./doctor/ManageBooking";
import Admin from "./admin/admin";
import RegisterDoctor from "./admin/DoctorRegister";
import MessageRespond from "./admin/MessageRespond";
import Approval from "./admin/Approval";
import PasswordChangeForm from "./user/Password";
import UpdateContact from "./user/Contact";
import UpcomingBooking from "./doctor/UpcomingBooking";
import DoctorAppointmentList from "./doctor/DoctorAppointmentList";
import PatientAppointmentList from "./user/PatientAppointmentList";
import EditMedicalResult from "./doctor/EditMedicalResult";
import ViewMedicalResult from './user/ViewMedicalResult'
import OnlineConsult from './components/OnlineConsult'
import MedicalRecords from './doctor/EditMedicalResult'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <Router>
        <MyContext.Provider
          value={{
            isLoggedIn,
            setIsLoggedIn,
          }}
        >
          <Box>
            <Navbar />

            <Stack
              direction={"row"}
              spacing={2}
              justifyContent={"space-between"}
            >
              <Sidebar />
              <Box flex={9} p={2}>
                <Routes>
                  <Route path="/" element={<Welcome />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/user" element={<HomeU />} />
                  <Route path="/doctor" element={<HomeD />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/arrangement" element={<Arrangement />} />
                  <Route path="/record" element={<Record />} />
                  <Route path="/message" element={<Message />} />
                  <Route path="/home" element={<HomeU />} />
                  <Route path="/manageBooking" element={<ManageBooking />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/registerDoctor" element={<RegisterDoctor />} />
                  <Route path="/messageRespond" element={<MessageRespond />} />
                  <Route path="/userApproval" element={<Approval />} />
                  <Route path="/updateContact" element={<UpdateContact />} />
                  <Route
                    path="/upcomingBooking"
                    element={<UpcomingBooking />}
                  />
                  <Route path="/DoctorAppointmentList" element={<DoctorAppointmentList />} />
                  <Route path="/PatientAppointmentList" element={<PatientAppointmentList />} />
                  {/*<Route path="/EditMedicalResult" element={<EditMedicalResult />} />*/}
                  <Route path="/ViewMedicalResult" element={<ViewMedicalResult />} />
                  <Route path="/OnlineConsult" element={<OnlineConsult />} />
                  <Route path="/medical-records/:appointmentId" element={<MedicalRecords />} />

                  <Route
                    path="/changePassword"
                    element={<PasswordChangeForm />}
                  />
                </Routes>
              </Box>
              {/*<Rightbar />*/}
            </Stack>
          </Box>
        </MyContext.Provider>
      </Router>
    </div>
  );
}

export default App;
