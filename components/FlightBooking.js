// src/components/FlightBooking.js
import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, Paper, IconButton, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PlaceIcon from '@mui/icons-material/Place';
import axios from 'axios';
import './FlightBooking.css';

const FlightBooking = () => {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [newSearch, setNewSearch] = useState({ departure: '', destination: '', departureDate: '', returnDate: '' });
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log('Searching flights');

    // Validate dates
    if (returnDate && new Date(returnDate) <= new Date(departureDate)) {
      setError({
        title: 'Invalid Dates',
        detail: 'Return date must be after the departure date.'
      });
      return;
    }

    try {
      // Step 1: Authenticate to get the access token
      const authResponse = await axios.post('', new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: '',
        client_secret: ''
      }), {
        headers: {
          'Content-Type': ''
        }
      });
      console.log('Auth response:', authResponse.data);

      const accessToken = authResponse.data.access_token;

      // Step 2: Use the access token to search for flights
      const flightResponse = await axios.get('', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          originLocationCode: departure,
          destinationLocationCode: destination,
          departureDate: departureDate,
          returnDate: returnDate || undefined,
          adults: 1
        }
      });
      console.log('Flight response:', flightResponse.data);
      setFlights(flightResponse.data.data);
      setError(null);  // Clear any previous errors

      // Save search
      const newSavedSearch = { departure, destination, departureDate, returnDate };
      setSavedSearches([...savedSearches, newSavedSearch]);
    } catch (error) {
      console.error('Error fetching flight data:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : error.message);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleDeleteSearch = (index) => {
    const updatedSearches = savedSearches.filter((_, i) => i !== index);
    setSavedSearches(updatedSearches);
  };

  const filteredFlights = flights.filter(flight => 
    filter === '' || flight.itineraries[0].segments[0].carrierCode.includes(filter)
  );

  return (
    <Container className="flight-booking-container">
      <Box my={4} className="content-section">
        <Box className="left-section">
          <Paper elevation={3} className="search-container">
            <Typography variant="h4" component="h1" gutterBottom>
              Flight Booking
            </Typography>
            <form onSubmit={handleSearch}>
              <Box mb={2}>
                <TextField
                  label="Departure (IATA code)"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  fullWidth
                  required
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Destination (IATA code)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  fullWidth
                  required
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Departure Date"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Return Date"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Button variant="contained" color="primary" type="submit">
                Search Flights
              </Button>
            </form>
            {error && (
              <Box mt={4}>
                <Typography color="error">Error: {error.title}</Typography>
                <Typography color="error">{error.detail}</Typography>
              </Box>
            )}
            <Box mt={4}>
              <Typography variant="h5" component="h2" className="saved-searches-header">Saved Searches</Typography>
              <List>
                {savedSearches.map((search, index) => (
                  <ListItem key={index} className="search-item">
                    <ListItemText
                      primary={`Departure: ${search.departure} | Destination: ${search.destination}`}
                      secondary={`Departure Date: ${search.departureDate} | Return Date: ${search.returnDate}`}
                    />
                    <IconButton edge="end" onClick={() => handleDeleteSearch(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Box>
        <Box className="right-section">
          <Paper elevation={3} className="results-container" style={{ padding: '16px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Flight Results
            </Typography>
            <Box mb={2}>
              <Select
                value={filter}
                onChange={handleFilterChange}
                fullWidth
                displayEmpty
              >
                <MenuItem value="">All Airlines</MenuItem>
                {flights.map((flight, index) => (
                  <MenuItem key={index} value={flight.itineraries[0].segments[0].carrierCode}>
                    {flight.itineraries[0].segments[0].carrierCode}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <List>
              {filteredFlights.map((flight, index) => (
                <ListItem key={index} className="flight-item">
                  <ListItemText
                    primary={
                      <>
                        <Typography variant="body1">
                          <PlaceIcon /> Carrier: {flight.itineraries[0].segments[0].carrierCode}
                        </Typography>
                        <Typography variant="body1">
                          <AttachMoneyIcon /> Price: ${flight.price.total}
                        </Typography>
                        <Typography variant="body1">
                          <ScheduleIcon /> Departure: {new Date(flight.itineraries[0].segments[0].departure.at).toLocaleString()}
                        </Typography>
                        <Typography variant="body1">
                          <ScheduleIcon /> Arrival: {new Date(flight.itineraries[0].segments[0].arrival.at).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default FlightBooking;
