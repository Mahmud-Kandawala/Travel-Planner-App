// src/components/CollaborativeItinerary.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, IconButton, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './CollaborativeItinerary.css';

const socket = io('http://localhost:5000');

const CollaborativeItinerary = () => {
  const [itinerary, setItinerary] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [username, setUsername] = useState('');
  const [roomJoined, setRoomJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const room = 'itinerary_room';

  useEffect(() => {
    if (roomJoined) {
      socket.emit('join', { username, room });

      socket.on('connect', () => {
        console.log('Connected to the server.');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from the server.');
      });

      socket.on('update_itinerary', (updatedItinerary) => {
        setItinerary(updatedItinerary);
      });

      socket.on('update_users', (updatedUsers) => {
        setUsers(updatedUsers);
      });

      return () => {
        socket.emit('leave', { username, room });
        socket.off();
      };
    }
  }, [roomJoined, username]);

  const handleAddActivity = () => {
    const updatedItinerary = [...itinerary];
    const activity = {
      name: newActivity,
      time: newTime,
      location: newLocation,
      description: newDescription
    };

    if (editIndex === -1) {
      updatedItinerary.push(activity);
    } else {
      updatedItinerary[editIndex] = activity;
      setEditIndex(-1);
    }

    setItinerary(updatedItinerary);
    setNewActivity('');
    setNewTime('');
    setNewLocation('');
    setNewDescription('');
    socket.emit('update_itinerary', { room, itinerary: updatedItinerary });
  };

  const handleEditActivity = (index) => {
    const activity = itinerary[index];
    setNewActivity(activity.name);
    setNewTime(activity.time);
    setNewLocation(activity.location);
    setNewDescription(activity.description);
    setEditIndex(index);
  };

  const handleDeleteActivity = (index) => {
    const updatedItinerary = itinerary.filter((_, i) => i !== index);
    setItinerary(updatedItinerary);
    socket.emit('update_itinerary', { room, itinerary: updatedItinerary });
  };

  const handleJoinRoom = () => {
    setRoomJoined(true);
  };

  return (
    <Container className="collaborative-itinerary-container">
      {!roomJoined ? (
        <Box my={4} className="form-section">
          <Paper elevation={3} className="form-container">
            <Typography variant="h4" component="h1" className="form-title" gutterBottom>
              Join Collaborative Itinerary
            </Typography>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
            />
            <Button variant="contained" color="primary" onClick={handleJoinRoom} style={{ marginTop: '16px' }}>
              Join Room
            </Button>
          </Paper>
        </Box>
      ) : (
        <Box my={4} className="content-section">
          <Box className="left-section">
            <Paper elevation={3} className="form-container">
              <Typography variant="h4" component="h1" className="form-title" gutterBottom>
                Collaborative Itinerary
              </Typography>
              <List>
                {itinerary.map((activity, index) => (
                  <ListItem key={index} className="activity-item">
                    <ListItemText
                      primary={`${activity.name} at ${activity.time} (${activity.location})`}
                      secondary={activity.description}
                    />
                    <IconButton edge="end" onClick={() => handleEditActivity(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteActivity(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <Box my={2}>
                <TextField
                  label="Activity Name"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  fullWidth
                  variant="outlined"
                  style={{ marginTop: '16px' }}
                />
                <TextField
                  label="Location"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  fullWidth
                  variant="outlined"
                  style={{ marginTop: '16px' }}
                />
                <TextField
                  label="Description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  fullWidth
                  variant="outlined"
                  style={{ marginTop: '16px' }}
                />
              </Box>
              <Button variant="contained" color="primary" onClick={handleAddActivity} style={{ marginTop: '16px' }}>
                {editIndex === -1 ? 'Add Activity' : 'Update Activity'}
              </Button>
            </Paper>
          </Box>
          <Box className="right-section">
            <Paper elevation={3} className="users-container" style={{ padding: '16px' }}>
              <Typography variant="h6">Current Users:</Typography>
              <List>
                {users.map((user, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={user} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default CollaborativeItinerary;
