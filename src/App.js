import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import Sidebar from './components/Sidebar';
import Sidebar2 from './components/Sidebar2';
import Sidebar3 from './components/Sidebar3';
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import History from "./user/History";
import Welcome from "./components/Welcome";
import MyContext from "./components/Context1";
import HomeU from "./user/HomeU";
import HomeD from "./doctor/doctor";
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
import ExaminationReport from "./user/ExaminationReport"
import ConsultService from "./admin/ConsultService"
import PrivacyModal from './components/PrivacyModal';
import MapLocation from "./components/MyMapComponent"
import MyMapComponent from "./components/MyMapComponent"
import PatientMedicalRecords from './user/ViewMedicalResult'
import Navbar from "./components/Navbar";


function SidebarRenderer() {
  const location = useLocation();  // 使用useLocation来获取当前路径

  const renderSidebar = () => {
    const path = location.pathname;

    // 使用正则表达式来匹配包含动态参数的路径
    const userPaths = new RegExp('^/(user|booking|PatientAppointmentList|OnlineConsult|patient/medical-records/[^/]+|ExaminationReport|MyMapComponent|medical-records/[^/]+)$');
    const doctorPaths = new RegExp('^/(doctor|manageBooking|DoctorAppointmentList|medical-records/[^/]+)$');
    const adminPaths = new RegExp('^/(admin|registerDoctor|approval|ConsultService)$');

    if (['/', '/login', '/register', '/history'].includes(path)) {
      return null; // 这些路由不显示sidebar
    } else if (userPaths.test(path)) {
      return <Sidebar />;
    } else if (doctorPaths.test(path)) {
      return <Sidebar2 />;
    } else if (adminPaths.test(path)) {
      return <Sidebar3 />;
    }
  };

  return renderSidebar();
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [showPrivacyModal, setShowPrivacyModal] = useState(() => !localStorage.getItem("gdprConsent"));

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  function handlePrivacyConsent(consentType) {
    localStorage.setItem('gdprConsent', consentType);
    setShowPrivacyModal(false);
  };

  // localStorage.removeItem("isLoggedIn");

  return (
    <div className="App">
      {showPrivacyModal && <PrivacyModal onClose={handlePrivacyConsent} />}
      <Router>
        <MyContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
          {isLoggedIn && <Navbar />}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            {isLoggedIn && <SidebarRenderer />}
            <Box
   className="main-content"
   component="main"
   sx={{
     flexGrow: 1,
     p: 3,
     // marginLeft: isLoggedIn ? '240px' : 0
       marginLeft: '240px'
   }}
>            <Routes>
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
                  <Route path="/approval" element={<Approval />} />
                  <Route path="/updateContact" element={<UpdateContact />} />
                  <Route
                    path="/upcomingBooking"
                    element={<UpcomingBooking />}
                  />
                  <Route path="/DoctorAppointmentList" element={<DoctorAppointmentList />} />
                  <Route path="/PatientAppointmentList" element={<PatientAppointmentList />} />
                  {/*<Route path="/EditMedicalResult" element={<EditMedicalResult />} />*/}
                  {/*<Route path="/ViewMedicalResult" element={<ViewMedicalResult />} />*/}
                  <Route path="/OnlineConsult" element={<OnlineConsult />} />
                  <Route path="/medical-records/:appointmentId" element={<MedicalRecords />} />
                  <Route path="/ExaminationReport" element={<ExaminationReport />} />
                  <Route path="/ConsultService" element={<ConsultService />} />
                  <Route path="/MyMapComponent" element={<MyMapComponent />} />
                <Route path="/patient/medical-records/:appointmentId" element={<PatientMedicalRecords />} />

                  <Route
                    path="/changePassword"
                    element={<PasswordChangeForm />}
                  />
                </Routes>
          </Box>
          </Stack>
        </MyContext.Provider>
      </Router>
    </div>
  );
}

export default App;
