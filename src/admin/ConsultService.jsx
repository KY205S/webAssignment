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
  Divider,
  CardActionArea
} from '@mui/material';
import './AdminChat.css'; // 自定义样式
import AuthService from "../components/AuthService";

const AdminChat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // 获取所有会话列表
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await AuthService.makeAuthRequest("http://10.14.149.222:8000/admin/conversations/", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data && data.conversations) {
          setConversations(data.conversations);
        } else {
          console.error('Unexpected response structure:', response);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  // 获取选定会话的聊天记录
  useEffect(() => {
    if (!selectedConversationId) return;

    const fetchMessages = async () => {
      try {
        const response = await AuthService.makeAuthRequest(`http://10.14.149.222:8000/conversation/${selectedConversationId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data && data.messages) {
          setMessages(data.messages);
        } else {
          console.error('Unexpected response structure:', response);
          setMessages([]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [selectedConversationId]);

  // 发送消息
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') {
      return;
    }

    const messageData = {
      text: newMessage,
      sender_type: "Admin",
      created_at: new Date().toISOString()
    };

    try {
      const response = await AuthService.makeAuthRequest(`http://10.14.149.222:8000/conversation/${selectedConversationId}/send/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      setMessages(prevMessages => [...prevMessages, messageData]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Card style={{ width: '20%', overflow: 'auto', marginRight: '10px' }}>
        <CardContent>
          <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
            Conversations
          </Typography>
          <List>
            {conversations.map((conversation) => (
              <ListItem key={conversation.id} button onClick={() => setSelectedConversationId(conversation.id)}>
                <ListItemText primary={conversation.patient_name} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <Card style={{ width: '70%', height: '80%', overflow: 'hidden' }}>
        <CardContent style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
            Chat
          </Typography>
          <List style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '10px' }}>
            {messages.map((msg) => (
              <React.Fragment key={msg.id}>
                <ListItem style={{ display: 'flex', flexDirection: msg.sender_type === 'Admin' ? 'row-reverse' : 'row', padding: '10px 20px' }}>
                  <Box className={msg.sender_type === 'Admin' ? "chat-bubble right" : "chat-bubble left"}>
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

export default AdminChat;
