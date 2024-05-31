import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import axios from "axios";
import './OnlineConsult.css';
import AuthService from "../components/AuthService";
import { baseUrl } from '../components/Ipconfig';

const OnlineConsult = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // 获取聊天记录
  useEffect(() => {
  const fetchChatData = async () => {
    try {
      const response = await AuthService.makeAuthRequest("http://10.14.150.155:8000/my-conversation/", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching chat data:', error);
    }
  };

  fetchChatData();
}, []);


  // 发送消息
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') {
      return;
    }

    const messageData = {
      text: newMessage,
      sender_type: "Patient", // Assuming the front-end is always from the patient's perspective
      created_at: new Date().toISOString()
    };

    try {
      const response = await AuthService.makeAuthRequest("http://10.14.150.155:8000/my-conversation/send/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    });
      setMessages([...messages, messageData]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Card style={{ width: '90%', height: '80%', overflow: 'hidden' }}>
        <CardContent style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>Online Consultation Chat</Typography>

          <List style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '10px' }}>
            {messages.map((msg) => (
              <React.Fragment key={msg.id}>
                <ListItem style={{ display: 'flex', flexDirection: msg.sender_type === 'Patient' ? 'row-reverse' : 'row', padding: '10px 20px' }}>
                  <Box className={msg.sender_type === 'Patient' ? "chat-bubble right" : "chat-bubble left"}>
                    <ListItemText primary={msg.text} secondary={new Date(msg.created_at).toLocaleString()} />
                  </Box>
                </ListItem>
                <Divider variant="fullWidth" component="li" />
              </React.Fragment>
            ))}
          </List>

          <Box style={{ display: 'flex', padding: '10px' }}>
            <TextField
              label="Type a message..."
              variant="outlined"
              fullWidth
              multiline
              maxRows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{ marginRight: '10px' }}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage}>
              Send
            </Button>
          </Box>
        </CardContent>
        </Card>
      </Box>
    );
  };

export default OnlineConsult;
