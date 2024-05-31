import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

// Function to fetch reports from a simulated API
const fetchReports = () => {
  return fetch('http://localhost:3001/reports')
    .then(response => response.json())
    .catch(error => console.error('Error:', error));
};

const Report = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports().then(data => {
      setReports(data);
    });
  }, []);

  return (
    <Box flex={4} p={2}>
      <Card>
        <Typography variant="h5" sx={{ m: 2 }}>
          Medical Examination Reports
        </Typography>
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
                  <TableRow key={report.id}>
                    <TableCell align="center">{report.name}</TableCell>
                    <TableCell align="center">{new Date(report.date).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <Button variant="contained" onClick={() => window.location.href = report.downloadUrl}>Download</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default Report;
