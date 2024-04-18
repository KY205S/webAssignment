import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import axios from 'axios';

const MedicalConsultationDetails = () => {
  const [patientInfo, setPatientInfo] = useState({ name: '', age: 0, appointmentNumber: '', description: '' });
  const [diagnose, setDiagnose] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [examinations, setExaminations] = useState([]);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [examinationDialogOpen, setExaminationDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [activeExamination, setActiveExamination] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);



  // useEffect(() => {
  //   axios.get('/api/patientInfo')
  //     .then((response) => setPatientInfo(response.data))
  //     .catch((error) => console.error(error));
  //
  //   axios.get('/api/prescriptions')
  //     .then((response) => setPrescriptions(response.data))
  //     .catch((error) => console.error(error));
  //
  //   axios.get('/api/examinations')
  //     .then((response) => setExaminations(response.data))
  //     .catch((error) => console.error(error));
  // }, []);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const patientInfoRes = await axios.get('http://localhost:3001/patientInfo');
        setPatientInfo(patientInfoRes.data);
        setDiagnose(patientInfoRes.data.Diagnose || '');

        const prescriptionsRes = await axios.get('http://localhost:3001/prescriptions');
        setPrescriptions(prescriptionsRes.data);

        const examinationsRes = await axios.get('http://localhost:3001/examinations');
        setExaminations(examinationsRes.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleDiagnoseChange = (event) => {
    setDiagnose(event.target.value);
  };


  const handleDeletePrescription = (id) => {
    axios.delete(`/api/prescriptions/${id}`)
      .then(() => {
        setPrescriptions(prescriptions.filter((item) => item.id !== id));
      })
      .catch((error) => console.error(error));
  };


  const handleDeleteExamination = (id) => {
    axios.delete(`/api/examinations/${id}`)
      .then(() => {
        setExaminations(examinations.filter((item) => item.id !== id));
      })
      .catch((error) => console.error(error));
  };

  const [newPrescription, setNewPrescription] = useState({
    medicineName: '',
    count: '',
    note: '',
  });


  const handlePrescriptionChange = (prop) => (event) => {
    setNewPrescription({ ...newPrescription, [prop]: event.target.value });
  };

  const handleAddPrescription = async () => {
    if (!newPrescription.medicineName || !newPrescription.count) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/prescriptions', newPrescription);
      setPrescriptions([...prescriptions, response.data]);
      setPrescriptionDialogOpen(false);
      setNewPrescription({ medicineName: '', count: '', note: '' }); // Reset the form
    } catch (error) {
      console.error('Failed to add prescription:', error);
    }
  };

  const [newExamination, setNewExamination] = useState({
    examinationName: '',
    time: '',
    note: '',
  });


  const handleExaminationChange = (prop) => (event) => {
    setNewExamination({ ...newExamination, [prop]: event.target.value });
  };

  const handleAddExamination = async () => {
    if (!newExamination.examinationName || !newExamination.time) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/examinations', newExamination);
      setExaminations([...examinations, response.data]);
      setExaminationDialogOpen(false);
      setNewExamination({ examinationName: '', time: '', note: '' }); // Reset the form
    } catch (error) {
      console.error('Failed to add examination:', error);
    }
  };

  const handleFileSelect = (event) => {
  setSelectedFile(event.target.files[0]);
};

  const UploadDialog = () => {
  return (
    <Dialog open={examinationDialogOpen} onClose={() => setExaminationDialogOpen(false)}>
      <DialogTitle>Upload Examination Results</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please select the examination result file and enter any notes.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Diagnosis"
          type="text"
          fullWidth
          variant="outlined"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadIcon />}
        >
          Upload File
          <input
            type="file"
            hidden
            onChange={handleFileSelect}
          />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setExaminationDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleUploadExamination}>Upload</Button>
      </DialogActions>
    </Dialog>
  );
};

  const handleUploadExamination = async () => {
    if (!selectedFile || !activeExamination) {
        alert('Please select a file and fill all required fields.');
        return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('diagnosis', diagnosis);

    try {
        const response = await axios.post(`/api/examinations/${activeExamination.id}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        // 更新 examinations 列表
        setExaminations(examinations.map(exam => exam.id === activeExamination.id ? {...exam, ...response.data} : exam));
        setUploadDialogOpen(false);
        setSelectedFile(null);
        setDiagnosis('');
    } catch (error) {
        console.error('Error uploading examination result:', error);
    }
};


  const handleOpenUploadDialog = (examination) => {
    setActiveExamination(examination);
    setUploadDialogOpen(true);
};

const handleSubmit = async () => {
    const updatedData = {
        patientInfo,
        prescriptions,
        examinations
    };

    try {
        const response = await axios.post('http://localhost:3001/submitAll', updatedData);
        console.log('Submission successful', response.data);
    } catch (error) {
        console.error('Failed to submit data:', error);
    }
};


return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5">Medical Consultation</Typography>
          <Box mt={2}>
            <Typography variant="h6">Basic Info</Typography>
            <Typography>Name: {patientInfo.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              Age: {patientInfo.age}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              Appointment Number: {patientInfo.appointmentNumber}
            </Typography>
            <Typography>Description: {patientInfo.description}</Typography>
          </Box>

          <Box mt={2}>
            <Typography variant="h6">Diagnostic Result</Typography>
            <TextField
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={diagnose}
              onChange={handleDiagnoseChange}
            />
          </Box>

          <Box mt={2}>
            <Typography variant="h6">Prescription</Typography>
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
                    <TableCell>{prescription.medicineName}</TableCell>
                    <TableCell>{prescription.count}</TableCell>
                    <TableCell>{prescription.note}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeletePrescription(prescription.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box mt={2}>
            <Typography variant="h6">Medical Examination</Typography>
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
                    <TableCell>{examination.examinationName}</TableCell>
                    <TableCell>{examination.time}</TableCell>
                    <TableCell>{examination.note}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteExamination(examination.id)}>
                        <DeleteIcon />
                      </IconButton>
                      {/* 添加上传按钮 */}
                      <IconButton onClick={() => handleOpenUploadDialog(examination)}>
                        <UploadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>


      <Dialog open={prescriptionDialogOpen} onClose={() => setPrescriptionDialogOpen(false)}>
        <DialogTitle>Add a Prescription</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Medicine Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newPrescription.medicineName}
            onChange={handlePrescriptionChange('medicineName')}
          />
          <TextField
            margin="dense"
            label="Count"
            type="number"
            fullWidth
            variant="outlined"
            value={newPrescription.count}
            onChange={handlePrescriptionChange('count')}
          />
          <TextField
            margin="dense"
            label="Note"
            type="text"
            fullWidth
            variant="outlined"
            value={newPrescription.note}
            onChange={handlePrescriptionChange('note')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrescriptionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddPrescription}>Add</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={examinationDialogOpen} onClose={() => setExaminationDialogOpen(false)}>
        <DialogTitle>Add an Examination</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details of the medical examination.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Examination Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newExamination.examinationName}
            onChange={handleExaminationChange('examinationName')}
          />
          <TextField
            margin="dense"
            label="Time"
            type="datetime-local"
            fullWidth
            variant="outlined"
            value={newExamination.time}
            onChange={handleExaminationChange('time')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Note"
            type="text"
            fullWidth
            variant="outlined"
            value={newExamination.note}
            onChange={handleExaminationChange('note')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExaminationDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddExamination}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
          <DialogTitle>Upload Examination Results</DialogTitle>
          <DialogContent>
              <DialogContentText>Please upload the examination result file and enter any notes.</DialogContentText>
              <TextField
                  autoFocus
                  margin="dense"
                  label="Diagnosis"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
              />
              <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadIcon />}
              >
                  Upload File
                  <input
                      type="file"
                      hidden
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
              </Button>
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
