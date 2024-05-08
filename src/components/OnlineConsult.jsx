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
import AuthService from "../components/AuthService";
import './OnlineConsult.css';

const OnlineConsult = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // 获取聊天记录
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/messages');
        setMessages(response.data);
        //const response = await AuthService.makeAuthRequest('http://localhost:3001/messages');
        // const data = await response.json();
        // setMessages(data);
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
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await AuthService.makeAuthRequest('http://localhost:3001/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });
      const data = await response.json();
      console.log('Message sent successfully', data);

      setMessages([...messages, {...messageData, username: 'You'}]); // Assuming "You" as a placeholder for the username
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
            {messages.map((msg, index) => (
              <React.Fragment key={index}>
                <ListItem style={{ display: 'flex', flexDirection: 'row-reverse', padding: '10px 20px' }}>
                  <Box className="chat-bubble right">
                    <ListItemText primary={msg.message} secondary={new Date(msg.timestamp).toLocaleString()} />
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
