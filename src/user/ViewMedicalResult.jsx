import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';

const ViewMedicalResult = () => {
  const [patientInfo, setPatientInfo] = useState({ name: '', age: 0, appointmentNumber: '', description: '' });
  const [diagnose, setDiagnose] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [examinations, setExaminations] = useState([]);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [activeExamination, setActiveExamination] = useState(null);

  // 获取数据
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
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  // 打开报告对话框
  const handleOpenReportDialog = (examination) => {
    setActiveExamination(examination);
    setReportDialogOpen(true);
  };

  // 下载报告
  const handleDownloadReport = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/examinations/${id}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'medical_report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h4" style={{ fontWeight: 'bold' }}>Medical Consultation Details (Patient View)</Typography>

          <Box mt={2} bgcolor="lightblue" p={2}>
            <Typography variant="h6">Basic Info</Typography>
          </Box>
          <Typography>Name: {patientInfo.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Age: {patientInfo.age}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Appointment Number: {patientInfo.appointmentNumber}</Typography>
          <Typography>Description: {patientInfo.description}</Typography>

          <Box mt={2} bgcolor="lightblue" p={2}>
            <Typography variant="h6">Diagnostic Result</Typography>
          </Box>
          <Typography>{diagnose}</Typography>

          <Box mt={2} bgcolor="lightblue" p={2}>
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
                  <TableCell>{prescription.medicineName}</TableCell>
                  <TableCell>{prescription.count}</TableCell>
                  <TableCell>{prescription.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box mt={2} bgcolor="lightblue" p={2}>
            <Typography variant="h6">Medical Examination</Typography>
          </Box>
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
                    <IconButton onClick={() => handleOpenReportDialog(examination)}>
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </CardContent>
      </Card>

      {/* 对话框显示报告详情并下载 */}
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
        <DialogTitle>Examination Report</DialogTitle>
        <DialogContent>
          <DialogContentText>Examination: {activeExamination?.examinationName}</DialogContentText>
          <DialogContentText>Diagnosis: {activeExamination?.diagnosis || 'No diagnosis available'}</DialogContentText>
        </DialogContent>
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button variant="contained" onClick={() => handleDownloadReport(activeExamination.id)}>
            Download Report
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ViewMedicalResult;
