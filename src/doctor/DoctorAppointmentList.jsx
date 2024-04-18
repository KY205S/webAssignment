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
} from "@mui/material";
import axios from "axios";

const AppointmentListPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:3001/doctorappointmentslist")
      .then((response) => {
        setAppointments(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const getStatusStyles = (status) => {
    const statusColors = {
      "pending confirmation": "#FFD700", // gold
      "accepted": "#008000",             // green
      "refused": "#FF0000",              // red
      "cancelled": "#FF0000",            // red
      "currently consulting": "#0000FF", // blue
      "completed": "#A9A9A9",            // dark grey
    };
    return { color: statusColors[status.toLowerCase()] || "inherit" };
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    axios
      .patch(`http://localhost:3001/doctorappointmentslist/${appointmentId}`, {
        status: newStatus,
      })
      .then(response => {
        setAppointments(currentAppointments =>
          currentAppointments.map(appointment =>
            appointment.id === appointmentId
              ? { ...appointment, status: newStatus }
              : appointment
          )
        );
      })
      .catch(error => {
        console.error("Error updating appointment status:", error);
      });
  };

  const renderStatusButtons = (status, id) => {
    switch (status.toLowerCase()) {
      case "pending confirmation":
        return (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleStatusChange(id, "Accepted")}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleStatusChange(id, "Refused")}
              sx={{ ml: 1 }}
            >
              Refuse
            </Button>
          </>
        );
      case "accepted":
        return (
          <>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleStatusChange(id, "Currently consulting")}
            >
              Start
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleStatusChange(id, "Cancelled")}
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
            onClick={() => handleStatusChange(id, "Completed")}
          >
            Complete
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Box flex={4} p={2}>
      <Card>
        <Typography variant="h5" sx={{ m: 2 }}>
          Appointment List
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="appointment table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Appointment Number</TableCell>
                <TableCell align="center">Patient Name</TableCell>
                <TableCell align="center">Consultation Time</TableCell>
                <TableCell align="center">Appointed Doctor</TableCell>
                <TableCell align="center">Location</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow
                  key={appointment.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{appointment.number}</TableCell>
                  <TableCell align="center">{appointment.patientName}</TableCell>
                  <TableCell align="center">{appointment.time}</TableCell>
                  <TableCell align="center">{appointment.doctor}</TableCell>
                  <TableCell align="center">{appointment.location}</TableCell>
                  <TableCell
                    align="center"
                    style={getStatusStyles(appointment.status)}
                  >
                    {appointment.status}
                  </TableCell>
                  <TableCell align="center">
                    {renderStatusButtons(appointment.status, appointment.id)}
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
    </Box>
  );
};

export default AppointmentListPage;
