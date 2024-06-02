import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography,
  Table, TableBody, TableCell, TableHead, TableRow,
  Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText,
  Snackbar, Button
} from '@mui/material';
import AuthService from "../components/AuthService";
import { useParams, useNavigate } from 'react-router-dom';

const ViewMedicalResult = () => {
  const { appointmentId } = useParams();
  const [patientInfo, setPatientInfo] = useState({ patient_name: '', age: 0, appointmentNumber: '', description: '' });
  const [diagnose, setDiagnose] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [examinations, setExaminations] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AuthService.makeAuthRequest(`http://10.14.149.222:8000/patient/medical-records/${appointmentId}/`, {
          method: 'GET'
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        if (data) {
          const { info, diagnose, prescriptions, examinations } = data;
          setPatientInfo({
            patient_name: info?.patient_name || '',
            doctor_name: info?.doctor_name || '',
            age: info?.age || '',
            appointmentNumber: info?.appointmentNumber || '',
            description: info?.description || ''
          });
          setDiagnose(diagnose?.Diagnose || '');
          setPrescriptions(prescriptions || []);
          setExaminations(examinations || []);
        } else {
          throw new Error("No data received from backend");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbarMessage('Failed to fetch data');
        setSnackbarOpen(true);
      }
    };

    fetchData();
  }, [appointmentId]);

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'left' }}>Medical Consultation</Typography>

          <Box mt={2} p={2} sx={{ textAlign: 'left' }}>
            <Box bgcolor="lightblue" p={1}>
              <Typography variant="h6">Basic Info</Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
    <Typography style={{ fontWeight: 'bold', marginRight: '8px', marginLeft: '18px' }}>Name:</Typography>
    <Typography>{patientInfo.patient_name}</Typography>
  </Box>

  <Box display="flex" alignItems="center" mb={1}>
    <Typography style={{ fontWeight: 'bold', marginRight: '8px', marginLeft: '18px' }}>Age:</Typography>
    <Typography>{patientInfo.age}</Typography>
  </Box>

  <Box display="flex" alignItems="center" mb={1}>
    <Typography style={{ fontWeight: 'bold', marginRight: '8px', marginLeft: '18px' }}>Doctor:</Typography>
    <Typography>{patientInfo.doctor_name}</Typography>
  </Box>

  <Box display="flex" alignItems="center" mb={1}>
    <Typography style={{ fontWeight: 'bold', marginRight: '8px', marginLeft: '18px' }}>Appointment Number:</Typography>
    <Typography>{patientInfo.appointmentNumber}</Typography>
  </Box>

  <Box display="flex" alignItems="center" mb={1}>
    <Typography style={{ fontWeight: 'bold', marginRight: '8px', marginLeft: '18px' }}>Description:</Typography>
    <Typography>{patientInfo.description}</Typography>
  </Box>

          <Box mt={2} p={2} sx={{ textAlign: 'left' }}>
            <Box bgcolor="lightblue" p={1}>
              <Typography variant="h6">Diagnostic Result</Typography>
            </Box>
            <Typography>{diagnose}</Typography>
          </Box>

          <Box mt={2} p={2} sx={{ textAlign: 'left' }}>
            <Box bgcolor="lightblue" p={1}>
              <Typography variant="h6">Prescription</Typography>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Medicine Name</TableCell>
                  <TableCell>Count</TableCell>
                  <TableCell>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>{prescription.medicine_name}</TableCell>
                    <TableCell>{prescription.quantity}</TableCell>
                    <TableCell>{prescription.usage_description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <Box mt={2} p={2} sx={{ textAlign: 'left' }}>
            <Box bgcolor="lightblue" p={1}>
              <Typography variant="h6">Medical Examination</Typography>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Examination Name</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {examinations.map((examination) => (
                  <TableRow key={examination.id}>
                    <TableCell>{examination.exam_name}</TableCell>
                    <TableCell>{examination.exam_date}</TableCell>
                    <TableCell>{examination.exam_description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

        </CardContent>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/PatientAppointmentList')}
          style={{width: "90px",  marginRight: '20px', borderColor: 'blue' }}
          >
          Back
        </Button>
      </Box>

    </Box>
  );

};

export default ViewMedicalResult;
