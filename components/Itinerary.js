// src/components/Itinerary.js
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Button, List, ListItem, ListItemText, Paper } from '@mui/material';
import './Itinerary.css';

const Itinerary = () => {
  const [itinerary, setItinerary] = useState(null);
  const [preferences, setPreferences] = useState(null);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user-preferences');
      const data = await response.json();
      if (data.length > 0) {
        setPreferences(data[0]);
      } else {
        console.error('No user preferences found');
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const generateItinerary = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });
      const data = await response.json();
      setItinerary(data);
    } catch (error) {
      console.error('Error generating itinerary:', error);
    }
  }, [preferences]);

  useEffect(() => {
    fetchPreferences();
  }, []);

  useEffect(() => {
    if (preferences) {
      generateItinerary();
    }
  }, [preferences, generateItinerary]);

  return (
    <Container className="itinerary-container">
      <Box my={4} className="form-section">
        <Paper elevation={3} className="form-container">
          <Typography variant="h4" component="h1" className="form-title" gutterBottom>
            Your Custom Itinerary
          </Typography>
          {itinerary ? (
            Object.keys(itinerary).map(day => (
              <Box key={day} my={2} className="day-box">
                <Typography variant="h6" className="day-header">{day}</Typography>
                <List>
                  {itinerary[day].map((activity, index) => (
                    <ListItem key={index} className="activity-item">
                      <ListItemText
                        primary={activity.activity}
                        secondary={
                          <>
                            <span className="cost">Cost: ${activity.cost}</span>
                            <br />
                            <span className="suitable-for">Suitable for: {activity.suitableFor}</span>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))
          ) : (
            <Typography>Loading...</Typography>
          )}
          <Button variant="contained" color="primary" onClick={generateItinerary} style={{ marginTop: '16px' }}>
            Regenerate Itinerary
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Itinerary;
