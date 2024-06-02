import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import AuthService from "../components/AuthService";
import { useNavigate } from 'react-router-dom';

const AppointmentListPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [reason, setReason] = useState("");

  // 使用 useEffect 来获取并解析预约数据
  useEffect(() => {
    setIsLoading(true);
    AuthService.makeAuthRequest("http://10.14.149.222:8000/patientappointmentlist", {
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

  // 为不同状态设置对应颜色
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

  // 打开对话框输入状态和原因
  const handleDialogOpen = (appointmentNumber, newStatus) => {
    setCurrentAppointmentId(appointmentNumber);
    setCurrentStatus(newStatus);
    setReason("");
    setOpenDialog(true);
  };

  // 关闭对话框
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // 确认并更新预约状态
  const handleDialogConfirm = () => {
  const requestBody = {
    appointment_number: currentAppointmentId,
    status: currentStatus,
    doctor_advice: reason
  };

  AuthService.makeAuthRequest(
    "http://10.14.151.254:8000/update-appointment/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  )
    .then(() => {
      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.appointment_number === currentAppointmentId
            ? { ...appointment, status: currentStatus, advice: reason }
            : appointment
        )
      );
      setOpenDialog(false);
    })
    .catch((error) => {
      console.error("Error updating appointment status:", error);
    });
};

  const goToAppointmentDetail = (appointmentId) => {
    navigate(`/patient/medical-records/${appointmentId}`);
  };

  const navigate = useNavigate();

  // 渲染取消按钮
  const renderStatusButtons = (status, appointmentNumber) => {
    switch (status.toLowerCase()) {
      case "pending confirmation":
      case "accepted":
        return (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDialogOpen(appointmentNumber, "Cancelled")}
          >
            Cancel
          </Button>
        );
      default:
        return null;
    }
  };

  // 渲染显示原因的图标
  const renderReasonIcon = (status, advice) => {
    if (status.toLowerCase() === "refused" || status.toLowerCase() === "cancelled") {
      return (
        <Tooltip title={`Reason: ${advice || "No reason provided"}`} arrow>
          <IconButton size="small" color="error">
            <ErrorOutline />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  };

  // 页面结构和布局
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
    <TableCell align="center">Time</TableCell>
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
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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

      {/* Dialog for inputting the reason */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Provide a Reason</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the appointment status to `{currentStatus}`? Please provide a reason.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ width: 500 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDialogConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentListPage;
