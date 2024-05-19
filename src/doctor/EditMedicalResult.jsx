import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Table, TableBody, TableCell, TableHead, TableRow, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import AuthService from "../components/AuthService";
import { useParams } from 'react-router-dom';

const MedicalConsultationDetails = () => {
  const { appointmentId } = useParams();
  const [patientInfo, setPatientInfo] = useState({ patient_name: '', age: 0, appointmentNumber: '', description: '' });
  const [diagnose, setDiagnose] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [examinations, setExaminations] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await AuthService.makeAuthRequest(`http://10.14.150.66:8000/medical-records/${appointmentId}/`, {
        method: 'GET'
      });
      console.log("111111111111111111111111111111")
      console.log('Response:', response);
       const data = await response.json(); // 解析 JSON
      console.log('hhhhhhh');
      console.log('Response JSON:', data);

      // 需要确保响应是有效的，然后解析 JSON
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }


      if (data) {
        const { info, diagnose, prescriptions, examinations } = data;
        setPatientInfo({
          patient_name: info?.patient_name || '',
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
    }
  };

  fetchData();
}, [appointmentId]);


  const handleDiagnoseChange = (event) => {
    setDiagnose(event.target.value);
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadExamination = async () => {
    if (!selectedFile) {
      alert('Please select a file and fill all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('diagnosis', diagnose);

    try {
      await AuthService.makeAuthRequest('http://10.14.150.66:8000/upload-examination', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File upload successful');
      setUploadDialogOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      info: patientInfo,
      diagnose,
      prescriptions,
      examinations: examinations.map(exam => ({...exam, file: undefined}))
    };

    try {
      await AuthService.makeAuthRequest('http://10.14.150.66:8000/update-medical-record/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      console.log('Submission successful');
    } catch (error) {
      console.error('Failed to submit data:', error);
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h4" style={{fontWeight: 'bold'}}>Medical Consultation</Typography>
          <Box mt={2} bgcolor="lightblue" p={2}>
            <Typography variant="h6">Basic Info</Typography>
          </Box>
          <Typography>Name: {patientInfo.patient_name} Age: {patientInfo.age} Doctor: {patientInfo.doctor_name}</Typography>
          <Typography>Appointment Number: {patientInfo.appointmentNumber}</Typography>
          <Typography>Description: {patientInfo.description}</Typography>
          <Box mt={2} bgcolor="lightblue" p={2}>
            <Typography variant="h6">Diagnostic Result</Typography>
          </Box>
          <TextField
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={diagnose}
            onChange={handleDiagnoseChange}
          />
          <Box mt={2} bgcolor="lightblue" p={2}>
            <Typography variant="h6">Prescription</Typography>
          </Box>
          <Button onClick={() => setUploadDialogOpen(true)}>Add Prescription</Button>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Medicine Name</TableCell>
                <TableCell>Count</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell>{prescription.medicine_name}</TableCell>
                  <TableCell>{prescription.quantity}</TableCell>
                  <TableCell>{prescription.usage_description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => {}}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box mt={2} bgcolor="lightblue" p={2}>
            <Typography variant="h6">Medical Examination</Typography>
          </Box>
          <Button onClick={() => setUploadDialogOpen(true)}>Add Examination</Button>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Examination Name</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examinations.map((examination) => (
                <TableRow key={examination.id}>
                  <TableCell>{examination.exam_name}</TableCell>
                  <TableCell>{examination.exam_date}</TableCell>
                  <TableCell>{examination.exam_description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => {}}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => {}}>
                      <UploadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
        <DialogTitle>Upload a Medical Report</DialogTitle>
        <DialogContent>
          <DialogContentText>For the examination: {examinations[0]?.examinationName}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Diagnosis"
            type="text"
            fullWidth
            value={diagnose}
            onChange={(e) => setDiagnose(e.target.value)}
          />
          <input
            accept="application/pdf"
            type="file"
            onChange={handleFileSelect}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUploadExamination}>Upload</Button>
        </DialogActions>
      </Dialog>
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default MedicalConsultationDetails;
