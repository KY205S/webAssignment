import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Table, TableBody, TableCell, TableHead, TableRow, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import AuthService from "../components/AuthService";
import { Snackbar } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';


const MedicalConsultationDetails = () => {
  const { appointmentId } = useParams();
  const [patientInfo, setPatientInfo] = useState({ patient_name: '', age: 0, appointmentNumber: '', description: '' });
  const [diagnose, setDiagnose] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [examinations, setExaminations] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [examinationDialogOpen, setExaminationDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();



  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await AuthService.makeAuthRequest(`http://10.14.149.222:8000/medical-records/${appointmentId}/`, {
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
    }
  };

  fetchData();
}, [appointmentId]);


  const handleDiagnoseChange = (event) => {
    setDiagnose(event.target.value);
  };

  const handlePrescriptionChange = (prop) => (event) => {
    setNewPrescription({ ...newPrescription, [prop]: event.target.value });
  };

  const handleExaminationChange = (prop) => (event) => {
    setNewExamination({ ...newExamination, [prop]: event.target.value });
  };

  // 删除处方或检查时更新缓存状态
  const handleDeletePrescription = (id) => {
    setPrescriptions(prescriptions.filter((item) => item.id !== id));
  };

  const handleDeleteExamination = (id) => {
    setExaminations(examinations.filter((item) => item.id !== id));
  };

  // 新增处方
  const [newPrescription, setNewPrescription] = useState({
    medicine_name: '',
    quantity: '',
    usage_description: '',
  });

  const handleAddPrescription = () => {
    if (!newPrescription.medicine_name || !newPrescription.quantity) {
      alert('Please fill out all required fields.');
      return;
    }

    const newEntry = { ...newPrescription, id: prescriptions.length + 1 };
    setPrescriptions([...prescriptions, newEntry]);
    setPrescriptionDialogOpen(false);
    setNewPrescription({ medicine_name: '', quantity: '', usage_description: '' }); // 清空表单
  };

  // 新增检查
  const [newExamination, setNewExamination] = useState({
    exam_name: '',
    exam_date: '',
    exam_description: '',
  });

  const handleAddExamination = () => {
    if (!newExamination.exam_name || !newExamination.exam_date) {
      alert('Please fill out all required fields。');
      return;
    }

    const newEntry = { ...newExamination, id: examinations.length + 1 };
    setExaminations([...examinations, newEntry]);
    setExaminationDialogOpen(false);
    setNewExamination({ exam_name: '', exam_date: '', exam_description: '' }); // 清空表单
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
      await AuthService.makeAuthRequest('http://10.14.149.222:8000/upload-examination', {
        method: 'POST',
        body: formData,

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
    await AuthService.makeAuthRequest('http://10.14.149.222:8000/update-medical-record/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    console.log('Submission successful');
    setSnackbarMessage('Data saved successfully'); //
    setSnackbarOpen(true); // 打开Snackbar
  } catch (error) {
    console.error('Failed to submit data:', error);
    setSnackbarMessage('Failed to save data'); //
    setSnackbarOpen(true); // 打开Snackbar
  }
};


  const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const day = String(tomorrow.getDate()).padStart(2, '0');
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const year = tomorrow.getFullYear();
  return `${day}/${month}/${year}`;
};


  return (
    <Box textAlign="left">
      <Card>
        <CardContent>
          <Typography variant="h4" style={{fontWeight: 'bold'}}>Medical Consultation</Typography>
          <Box mt={2} bgcolor="lightblue" p={2}>
            <Typography variant="h6">Basic Info</Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
    <Typography style={{ fontWeight: 'bold', marginRight: '8px' }}>Name:</Typography>
    <Typography>{patientInfo.patient_name}</Typography>
  </Box>

  <Box display="flex" alignItems="center" mb={1}>
    <Typography style={{ fontWeight: 'bold', marginRight: '8px' }}>Age:</Typography>
    <Typography>{patientInfo.age}</Typography>
  </Box>

  <Box display="flex" alignItems="center" mb={1}>
    <Typography style={{ fontWeight: 'bold', marginRight: '8px' }}>Doctor:</Typography>
    <Typography>{patientInfo.doctor_name}</Typography>
  </Box>

  <Box display="flex" alignItems="center" mb={1}>
    <Typography style={{ fontWeight: 'bold', marginRight: '8px' }}>Appointment Number:</Typography>
    <Typography>{patientInfo.appointmentNumber}</Typography>
  </Box>

  <Box display="flex" alignItems="center" mb={1}>
    <Typography style={{ fontWeight: 'bold', marginRight: '8px' }}>Description:</Typography>
    <Typography>{patientInfo.description}</Typography>
  </Box>

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
          <Button onClick={() => setPrescriptionDialogOpen(true)}>Add Prescription</Button>
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
                    <IconButton onClick={() => handleDeletePrescription(prescription.id)}>
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
          <Button onClick={() => setExaminationDialogOpen(true)}>Add Examination</Button>
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
                    <IconButton onClick={() => handleDeleteExamination(examination.id)}>
                      <DeleteIcon />
                    </IconButton>
                    {/*<IconButton onClick={handleFileSelect}>*/}
                    {/*  <UploadIcon />*/}
                    {/*</IconButton>*/}
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
          <DialogContentText>For the examination: {examinations[0]?.exam_name}</DialogContentText>
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
      <Dialog open={prescriptionDialogOpen} onClose={() => setPrescriptionDialogOpen(false)}>
    <DialogTitle>Add a Prescription</DialogTitle>
    <DialogContent>
        <TextField autoFocus margin="dense" label="Medicine Name" type="text" fullWidth value={newPrescription.medicine_name} onChange={handlePrescriptionChange('medicine_name')} />
        <TextField margin="dense" label="Count" type="number" fullWidth value={newPrescription.quantity} onChange={handlePrescriptionChange('quantity')} />
        <TextField margin="dense" label="Note" type="text" fullWidth value={newPrescription.usage_description} onChange={handlePrescriptionChange('usage_description')} />
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setPrescriptionDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleAddPrescription}>Add</Button>
    </DialogActions>
</Dialog>

<Dialog open={examinationDialogOpen} onClose={() => setExaminationDialogOpen(false)}>
    <DialogTitle>Add an Examination</DialogTitle>
    <DialogContent>
        <TextField autoFocus margin="dense" label="Examination Name" type="text" fullWidth value={newExamination.exam_name} onChange={handleExaminationChange('exam_name')} />
        <TextField margin="dense" label="Time" type="date" fullWidth InputLabelProps={{ shrink: true }} InputProps={{ inputProps: { min: getTomorrowDate() } }} value={newExamination.exam_date} onChange={handleExaminationChange('exam_date')} />
        <TextField margin="dense" label="Note" type="text" fullWidth value={newExamination.exam_description} onChange={handleExaminationChange('exam_description')} />
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setExaminationDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleAddExamination}>Add</Button>
    </DialogActions>
</Dialog>

      <Snackbar
      open={snackbarOpen}
         autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // 设置Snackbar位置
        ontentProps={{
        style: { marginTop: '150vh' } // 将Snackbar向下移动，'50vh' 表示视窗高度的50%
        }}
      />


      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/DoctorAppointmentList')}
          style={{width: "90px",  marginRight: '20px', borderColor: 'blue' }}
          >
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};



export default MedicalConsultationDetails;
