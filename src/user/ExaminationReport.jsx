import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import AuthService from "../components/AuthService";

// Function to fetch reports from a simulated API
const fetchReports = () => {
  return AuthService.makeAuthRequest('http://10.14.149.222:8000/patient/test-records/', {
    method: 'GET',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network error occurred. Please try again later.'); // 抛出网络错误
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error);
      throw error; // 抛出错误
    });
};

const Report = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null); // 新增状态用于保存错误信息

  useEffect(() => {
    fetchReports()
      .then(data => {
        setReports(data);
        setError(null); // 清除错误信息
      })
      .catch(error => {
        setError(error.message); // 捕获错误信息
      });
  }, []);

  return (
    <Box flex={4} p={2}>
      <Card>
        <Typography variant="h5" sx={{ m: 2 }}>
          Medical Examination Reports
        </Typography>
        {error ? ( // 如果有错误，则显示错误信息
          <Typography variant="body1" sx={{ m: 2, color: 'error.main' }}>
            {error}
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 800 }} aria-label="medical report table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ fontWeight: 'bold', width: '33.333%' }}>Examination Name</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold', width: '33.333%' }}>Date</TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold', width: '33.333%' }}>Download</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No reports available.</TableCell>
                  </TableRow>
                ) : (
                  reports.map(report => (
                    <TableRow key={report.appointment_number}>
                      <TableCell align="center">{report.report_name}</TableCell>
                      <TableCell align="center">{new Date(report.report_date).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <Button variant="contained" href={'http://10.14.149.222:8000' + report.file_url} target="_blank">Download</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
};

export default Report;
