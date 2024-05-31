import React, { useEffect, useState } from "react";
import { Box, Card, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Tooltip, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import AuthService from "../components/AuthService";
import { useNavigate } from 'react-router-dom';

const AppointmentListPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAppointmentNumber, setCurrentAppointmentNumber] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [doctor_advice, setReason] = useState("");

  const navigate = useNavigate(); // 使用 useNavigate 进行导航

  useEffect(() => {
    setIsLoading(true);
    AuthService.makeAuthRequest("http://10.14.150.155:8000/doctorappointmentlist", {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAppointments(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const goToAppointmentDetail = (appointmentId) => {
    navigate(`/medical-records/${appointmentId}`);
  };

  const getStatusStyles = (status) => {
    const statusColors = {
      "pending confirmation": "#FFD700", // gold
      accepted: "#008000", // green
      refused: "#FF0000", // red
      cancelled: "#FF0000", // red
      "currently consulting": "#0000FF", // blue
      completed: "#A9A9A9", // dark grey
    };
    return { color: statusColors[status.toLowerCase()] || "inherit" };
  };

  const handleOpenDialog = (appointmentNumber, status) => {
    setCurrentAppointmentNumber(appointmentNumber);
    setCurrentStatus(status);
    setReason("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleDialogSubmit = () => {
    handleStatusChange(currentAppointmentNumber, currentStatus, doctor_advice);
    handleCloseDialog();
  };

  const handleStatusChange = (appointmentNumber, newStatus, doctor_advice) => {
    AuthService.makeAuthRequest(`http://10.14.150.155:8000/update-appointment/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appointment_number: appointmentNumber,
        status: newStatus,
        doctor_advice: doctor_advice || "No reason provided",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((updatedAppointment) => {
        setAppointments((currentAppointments) =>
          currentAppointments.map((appointment) =>
            appointment.appointment_number === appointmentNumber
              ? { ...appointment, status: newStatus, advice: doctor_advice }
              : appointment
          )
        );
      })
      .catch((error) => {
        console.error("Error updating appointment status:", error);
      });
  };

  const renderStatusButtons = (status, appointmentNumber) => {
    switch (status.toLowerCase()) {
      case "pending confirmation":
        return (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleStatusChange(appointmentNumber, "Accepted")}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleOpenDialog(appointmentNumber, "Refused")}
              sx={{ ml: 1 }}
            >
              Refuse
            </Button>
          </>
        );

        case "completed":
        return (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setCurrentAppointmentNumber(appointmentNumber);
                setOpenUploadDialog(true);
              }}
            >
              Upload Report
            </Button>
          </>
        );

      case "accepted":
        return (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleStatusChange(appointmentNumber, "Currently consulting")}
            >
              Start
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleOpenDialog(appointmentNumber, "Cancelled")}
              sx={{ ml: 1 }}
            >
              Cancel
            </Button>
          </>
        );
      case "currently consulting":
        return (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleStatusChange(appointmentNumber, "Completed")}
          >
            Complete
          </Button>
        );
      default:
        return null;
    }
  };

  const renderReasonIcon = (status, doctor_advice) => {
    if (status.toLowerCase() === "refused" || status.toLowerCase() === "cancelled") {
      return (
        <Tooltip title={`Reason: ${doctor_advice}`} arrow>
          <IconButton size="small" color="error">
            <ErrorOutline />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  };

  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [uploadData, setUploadData] = useState({
    ExaminationReportName: '',
    reportDate: '',
    file: null
  });

  const handleUploadSubmit = () => {
  const formData = new FormData();
  formData.append('appointmentNumber', currentAppointmentNumber);
  formData.append('patientName', appointments.find(app => app.appointment_number === currentAppointmentNumber)?.patient_name);
  formData.append('ExaminationReportName', uploadData.ExaminationReportName);
  formData.append('reportDate', uploadData.reportDate);
  formData.append('file', uploadData.file);

  AuthService.makeAuthRequest('http://10.14.150.155:8000/upload-test-record/', {
    method: 'POST',
    body: formData,
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    setOpenUploadDialog(false);
    setUploadError(null);  // 清除之前的错误状态
  })
  .catch((error) => {
    console.error('Error:', error);
    setUploadError("Upload failed: " + error.message);  // 设置错误信息
  });
};



  const handleUploadDataChange = (event) => {
    const { name, value } = event.target;
    setUploadData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (event) => {
    if (event.target.files[0]) { // 确保有文件被选中
      setUploadData(prevData => ({ ...prevData, file: event.target.files[0] }));
    }
  };


  const [uploadError, setUploadError] = useState(null);


  return (
    <Box flex={4} p={2}>
      <Card>
        <Typography variant="h5" sx={{ m: 2 }}>
          Appointment List
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }} aria-label="appointment table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Appointment Number</TableCell>
                <TableCell align="center">Patient Name</TableCell>
                <TableCell align="center">Consultation Time</TableCell>
                <TableCell align="center">Location</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow
                  key={appointment.appointment_number}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer" }}
                >
                    <TableCell align="center" onClick={() => goToAppointmentDetail(appointment.appointment_number)}>{appointment.appointment_number}</TableCell>
                    <TableCell align="center" onClick={() => goToAppointmentDetail(appointment.appointment_number)}>{appointment.patient_name}</TableCell>
                    <TableCell align="center" onClick={() => goToAppointmentDetail(appointment.appointment_number)}>{appointment.time}</TableCell>
                    <TableCell align="center" onClick={() => goToAppointmentDetail(appointment.appointment_number)}>{appointment.location}</TableCell>
                    <TableCell align="center" onClick={() => goToAppointmentDetail(appointment.appointment_number)}>
                      <Tooltip title={appointment.description} arrow>
                      <Typography
                        sx={{
                          maxWidth: "200px",
                          display: "-webkit-box",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {appointment.description}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" style={getStatusStyles(appointment.status)}>
                    {appointment.status}
                    {renderReasonIcon(appointment.status, appointment.advice)}
                  </TableCell>
                  <TableCell align="center">
                    {renderStatusButtons(appointment.status, appointment.appointment_number)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {isLoading && <Typography sx={{ m: 2 }}>Loading...</Typography>}
          {error && (
            <Typography sx={{ m: 2 }} color="error">
              {error}
            </Typography>
          )}
        </TableContainer>
      </Card>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Provide a Reason</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for this action:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            fullWidth
            value={doctor_advice}
            onChange={handleReasonChange}
            sx={{ width: 500 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDialogSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openUploadDialog} onClose={() => {
  setOpenUploadDialog(false);
  setUploadError(null); // 关闭对话框时清除错误信息
}}>
  <DialogTitle>Upload a Examination Report</DialogTitle>
  <DialogContent>
    <DialogContentText>Please provide the details of the Examination report:</DialogContentText>
    <TextField
      autoFocus
      margin="dense"
      name="ExaminationReportName"
      label="Examination Report Name"
      type="text"
      fullWidth
      value={uploadData.ExaminationReportName}
      onChange={handleUploadDataChange}
    />
    <TextField
      margin="dense"
      name="reportDate"
      label="Report Date"
      type="date"
      fullWidth
      value={uploadData.reportDate}
      onChange={handleUploadDataChange}
      InputLabelProps={{ shrink: true }}
    />
    <input
      accept="application/pdf"
      type="file"
      onChange={handleFileChange}
      style={{ marginTop: 20 }}
    />
    {uploadError && (
      <Typography color="error" sx={{ mt: 2 }}>
        {uploadError}
      </Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
    <Button onClick={handleUploadSubmit}>Upload</Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default AppointmentListPage;
