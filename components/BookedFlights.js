import React, { useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Paper, Button, TextField, IconButton, ListItemIcon } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import './BookedFlights.css';

const BookedFlights = () => {
  const [flights, setFlights] = useState([
    { id: 1, airline: 'B6', price: 702.31, departure: '08:00', arrival: '10:00', date: '2024-07-01' },
    { id: 2, airline: 'B6', price: 771.11, departure: '09:00', arrival: '11:00', date: '2024-07-02' },
  ]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [newFlight, setNewFlight] = useState({ airline: '', price: '', departure: '', arrival: '', date: '' });
  const [editIndex, setEditIndex] = useState(-1);
  
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ description: '', time: '' });
  const [editReminderIndex, setEditReminderIndex] = useState(-1);

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
  };

  const handleAddFlight = () => {
    const newId = flights.length ? flights[flights.length - 1].id + 1 : 1;
    const updatedFlights = [...flights];
    
    if (editIndex === -1) {
      updatedFlights.push({ ...newFlight, id: newId });
    } else {
      updatedFlights[editIndex] = { ...newFlight, id: flights[editIndex].id };
      setEditIndex(-1);
    }
    
    setFlights(updatedFlights);
    setNewFlight({ airline: '', price: '', departure: '', arrival: '', date: '' });
  };

  const handleEditFlight = (index) => {
    setNewFlight(flights[index]);
    setEditIndex(index);
  };

  const handleDeleteFlight = (index) => {
    const updatedFlights = flights.filter((_, i) => i !== index);
    setFlights(updatedFlights);
  };

  const handleAddReminder = () => {
    const updatedReminders = [...reminders];
    
    if (editReminderIndex === -1) {
      updatedReminders.push({ ...newReminder });
    } else {
      updatedReminders[editReminderIndex] = { ...newReminder };
      setEditReminderIndex(-1);
    }
    
    setReminders(updatedReminders);
    setNewReminder({ description: '', time: '' });
  };

  const handleEditReminder = (index) => {
    setNewReminder(reminders[index]);
    setEditReminderIndex(index);
  };

  const handleDeleteReminder = (index) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    setReminders(updatedReminders);
  };

  return (
    <Container className="booked-flights-container">
      <Box my={4} className="content-section">
        <Box className="left-section">
          <Paper elevation={3} className="flights-container">
            <Typography variant="h4" component="h1" gutterBottom>
              Booked Flights
            </Typography>
            <List>
              {flights.map((flight, index) => (
                <ListItem
                  key={flight.id}
                  button
                  onClick={() => handleSelectFlight(flight)}
                  selected={selectedFlight && selectedFlight.id === flight.id}
                >
                  <ListItemIcon>
                    <AirplanemodeActiveIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Airline: ${flight.airline}`}
                    secondary={
                      <>
                        <span>
                          <AttachMoneyIcon style={{ verticalAlign: 'middle' }} /> ${flight.price}
                        </span>
                        <br />
                        <span>
                          <FlightTakeoffIcon style={{ verticalAlign: 'middle' }} /> {flight.departure}
                        </span>
                        <br />
                        <span>
                          <FlightLandIcon style={{ verticalAlign: 'middle' }} /> {flight.arrival}
                        </span>
                        <br />
                        <span>
                          <CalendarTodayIcon style={{ verticalAlign: 'middle' }} /> {flight.date}
                        </span>
                      </>
                    }
                  />
                  <IconButton edge="end" onClick={() => handleEditFlight(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeleteFlight(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
          <Paper elevation={3} className="reminders-container" style={{ marginTop: '16px', padding: '16px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Flight Reminders
            </Typography>
            <List>
              {reminders.map((reminder, index) => (
                <ListItem key={index} className="reminder-item">
                  <ListItemText
                    primary={reminder.description}
                    secondary={`Time: ${reminder.time}`}
                  />
                  <IconButton edge="end" onClick={() => handleEditReminder(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeleteReminder(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Box my={2}>
              <TextField
                label="Description"
                value={newReminder.description}
                onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                fullWidth
                variant="outlined"
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label="Time"
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                fullWidth
                variant="outlined"
                style={{ marginBottom: '16px' }}
              />
              <Button variant="contained" color="primary" onClick={handleAddReminder}>
                {editReminderIndex === -1 ? 'Add Reminder' : 'Update Reminder'}
              </Button>
            </Box>
          </Paper>
        </Box>
        <Box className="right-section">
          <Paper elevation={3} className="details-container" style={{ padding: '16px' }}>
            {selectedFlight ? (
              <>
                <Typography variant="h6">Flight Details</Typography>
                <Typography>Airline: {selectedFlight.airline}</Typography>
                <Typography>Price: ${selectedFlight.price}</Typography>
                <Typography>Departure: {selectedFlight.departure}</Typography>
                <Typography>Arrival: {selectedFlight.arrival}</Typography>
                <Typography>Date: {selectedFlight.date}</Typography>
              </>
            ) : (
              <>
                <Typography variant="h6">{editIndex === -1 ? 'Add New Flight' : 'Edit Flight'}</Typography>
                <TextField
                  label="Airline"
                  value={newFlight.airline}
                  onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value })}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: '16px' }}
                />
                <TextField
                  label="Price"
                  type="number"
                  value={newFlight.price}
                  onChange={(e) => setNewFlight({ ...newFlight, price: e.target.value })}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: '16px' }}
                />
                <TextField
                  label="Departure Time"
                  type="time"
                  value={newFlight.departure}
                  onChange={(e) => setNewFlight({ ...newFlight, departure: e.target.value })}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: '16px' }}
                />
                <TextField
                  label="Arrival Time"
                  type="time"
                  value={newFlight.arrival}
                  onChange={(e) => setNewFlight({ ...newFlight, arrival: e.target.value })}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: '16px' }}
                />
                <TextField
                  label="Date"
                  type="date"
                  value={newFlight.date}
                  onChange={(e) => setNewFlight({ ...newFlight, date: e.target.value })}
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: '16px' }}
                  InputLabelProps={{ shrink: true }}
                />
                <Button variant="contained" color="primary" onClick={handleAddFlight}>
                  {editIndex === -1 ? 'Add Flight' : 'Update Flight'}
                </Button>
              </>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default BookedFlights;
