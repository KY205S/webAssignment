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
  const [appointmentNumber, setAppointmentNumber] = useState('');
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [examinationDialogOpen, setExaminationDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [activeExamination, setActiveExamination] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // 初始数据获取
  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientInfoRes = await axios.get('http://localhost:3001/patientInfo');
        setPatientInfo(patientInfoRes.data);

        const diagnoseRes = await axios.get('http://localhost:3001/diagnose');
        setDiagnose(diagnoseRes.data.Diagnose || '');

        const prescriptionsRes = await axios.get('http://localhost:3001/prescriptions');
        setPrescriptions(prescriptionsRes.data);

        const examinationsRes = await axios.get('http://localhost:3001/examinations');
        setExaminations(examinationsRes.data);

        // 获取并保存 Appointment Number
        setAppointmentNumber(patientInfoRes.data.appointmentNumber);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // 缓存的编辑状态更新
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
    medicineName: '',
    count: '',
    note: '',
  });

  const handleAddPrescription = () => {
    if (!newPrescription.medicineName || !newPrescription.count) {
      alert('Please fill out all required fields.');
      return;
    }

    const newEntry = { ...newPrescription, id: prescriptions.length + 1 };
    setPrescriptions([...prescriptions, newEntry]);
    setPrescriptionDialogOpen(false);
    setNewPrescription({ medicineName: '', count: '', note: '' }); // 清空表单
  };

  // 新增检查
  const [newExamination, setNewExamination] = useState({
    examinationName: '',
    time: '',
    note: '',
  });

  const handleAddExamination = () => {
    if (!newExamination.examinationName || !newExamination.time) {
      alert('Please fill out all required fields。');
      return;
    }

    const newEntry = { ...newExamination, id: examinations.length + 1 };
    setExaminations([...examinations, newEntry]);
    setExaminationDialogOpen(false);
    setNewExamination({ examinationName: '', time: '', note: '' }); // 清空表单
  };


  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // const handleUploadExamination = () => {
  //   if (!selectedFile || !activeExamination) {
  //     alert('Please select a file and fill all required fields.');
  //     return;
  //   }
  //
  //   const updatedExaminations = examinations.map((exam) => {
  //     if (exam.id === activeExamination.id) {
  //       return { ...exam, diagnosis };
  //     }
  //     return exam;
  //   });
  //
  //   setExaminations(updatedExaminations);
  //   setUploadDialogOpen(false);
  //   setSelectedFile(null);
  //   setDiagnosis('');
  // };
  const handleUploadExamination = async () => {
    if (!selectedFile || !activeExamination) {
        alert('Please select a file and fill all required fields.');
        return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('diagnosis', diagnosis);

    try {
        const response = await axios.post(`http://localhost:3001/examinations/${activeExamination.id}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('File upload successful', response.data);
        setUploadDialogOpen(false);
        setSelectedFile(null);
        setDiagnosis('');
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};


  const handleOpenUploadDialog = (examination) => {
    setActiveExamination(examination);
    setUploadDialogOpen(true);
  };

  // 提交时所有修改在一个接口里发送 In commit, all changes are sent in one request
  // const handleSubmit = async () => {
  //   const updatedData = {
  //     appointmentNumber,
  //     patientInfo,
  //     diagnose,
  //     prescriptions,
  //     examinations
  //   };
  //
  //   try {
  //     const response = await axios.post('http://localhost:3001/submitAll', updatedData);
  //     console.log('Submission successful', response.data);
  //   } catch (error) {
  //     console.error('Failed to submit data:', error);
  //   }
  // };

  const handleSubmit = async () => {
  const diagnoseData = {
    appointmentNumber,
    diagnose
  };

  const prescriptionsData = {
    appointmentNumber,
    prescriptions
  };

  const examinationsData = {
    appointmentNumber,
    examinations
  };

  try {
    const diagnoseResponse = await axios.post('http://localhost:3001/diagnose', diagnoseData);
    console.log('Diagnose submission successful', diagnoseResponse.data);

    const prescriptionsResponse = await axios.post('http://localhost:3001/prescriptions', prescriptionsData);
    console.log('Prescriptions submission successful', prescriptionsResponse.data);

    const examinationsResponse = await axios.post('http://localhost:3001/examinations', examinationsData);
    console.log('Examinations submission successful', examinationsResponse.data);
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
            <Typography>Name: {patientInfo.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              Age: {patientInfo.age}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              Appointment Number: {patientInfo.appointmentNumber}</Typography>
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
                    <TableCell>{examination.examinationName}</TableCell>
                    <TableCell>{examination.time}</TableCell>
                    <TableCell>{examination.note}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteExamination(examination.id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenUploadDialog(examination)}>
                        <UploadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
            value={newPrescription.medicineName}
            onChange={handlePrescriptionChange('medicineName')}
          />
          <TextField
            margin="dense"
            label="Count"
            type="number"
            fullWidth
            value={newPrescription.count}
            onChange={handlePrescriptionChange('count')}
          />
          <TextField
            margin="dense"
            label="Note"
            type="text"
            fullWidth
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
          <TextField
            autoFocus
            margin="dense"
            label="Examination Name"
            type="text"
            fullWidth
            value={newExamination.examinationName}
            onChange={handleExaminationChange('examinationName')}
          />
          <TextField
            margin="dense"
            label="Time"
            type="datetime-local"
            fullWidth
            value={newExamination.time}
            onChange={handleExaminationChange('time')}
          />
          <TextField
            margin="dense"
            label="Note"
            type="text"
            fullWidth
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
        <DialogTitle>Upload a Medical Report</DialogTitle>
        <DialogContent>
          <DialogContentText>For the examination: {activeExamination?.examinationName}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Diagnosis"
            type="text"
            fullWidth
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
          <input
            accept="application/pdf"
            type="file"
            onChange={handleFileSelect}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() =>setUploadDialogOpen(false)}>Cancel</Button>
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
