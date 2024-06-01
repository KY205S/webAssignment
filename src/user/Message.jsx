import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button, TextField, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthService from "../components/AuthService";

const Message = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState("");

  useEffect(() => {
    fetchMessages(); // Fetch messages when component mounts
    console.log("Response Data111111111111:");
  }, []);


  const fetchMessages = async () => {
  try {
    console.log("Response Data111111111111:");
    const response = await AuthService.makeAuthRequest("http://10.14.149.222:8000/my-conversation/");
    if (!response.ok) {
      throw new Error(`Network response was not ok, status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Response Data111111111111:", data); // 打印解析后的数据

    if (data && data.messages) {
      setConversationId(data.conversation_id);
      setMessages(data.messages);
    } else {
      console.error("Error fetching chat data: No messages received", data);
    }
  } catch (error) {
    console.error("Error fetching chat data:", error);
  }
  console.log("Response Data111111111111:");
};

  const handleMessageSend = async () => {
    try {
      const response = await AuthService.makeAuthRequest(`http://10.14.149.222:8000/conversation/${conversationId}/`, {
        method: "POST",
        body: JSON.stringify({ text: newMessage }),
      });
      if (response.ok) {
        fetchMessages();  // Fetch messages again to update
        setNewMessage("");  // Clear input field
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Box flex={9} p={2} mt={1}>
      <Card sx={{ marginLeft: 5 }}>
        <CardHeader
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="Message"
        />
        <CardContent>
          {messages.length === 0 ? (
            <Typography variant="body2">No messages</Typography>
          ) : (
            messages.map((message) => (
              <div key={message.id}>
                <Typography variant="body2">
                  {message.sender_type === "Admin" ? "Admin: " : "You: "}
                  {message.text}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(message.created_at).toLocaleString()}
                </Typography>
              </div>
            ))
          )}
          <TextField
            multiline
            rows={3}
            fullWidth
            label="Type your message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </CardContent>
        <Stack direction="row" justifyContent="center" alignItems="center" p={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleMessageSend}
            disabled={!newMessage.trim()} // Disable button if new message is empty
          >
            Send
          </Button>
          <Button variant="contained" color="secondary" onClick={() => navigate("/login")}>
            Testing
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default Message;
