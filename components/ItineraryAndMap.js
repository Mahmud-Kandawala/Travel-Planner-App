// src/components/ItineraryAndMap.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button, Paper, Tab, Tabs, List, ListItem, ListItemText } from '@mui/material';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import './ItineraryAndMap.css'; 

const containerStyle = {
  width: '100%',
  height: '500px'
};

const ItineraryAndMap = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interests, setInterests] = useState('');
  const [center, setCenter] = useState({ lat: -3.745, lng: -38.523 });
  const [locationSet, setLocationSet] = useState(false);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Destination:', destination);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Interests:', interests);

    try {
      const response = await axios.get(``, {
        params: {
          address: destination,
          key: ''
        }
      });
      const location = response.data.results[0].geometry.location;
      setCenter(location);
      setLocationSet(true);
      fetchPointsOfInterest(location);
      fetchRestaurants(location);
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  const fetchPointsOfInterest = async (location) => {
    try {
      const response = await axios.get('', {
        params: {
          location: `${location.lat},${location.lng}`,
          radius: 1500,
          type: 'tourist_attraction',
          key: ''
        }
      });
      setPointsOfInterest(response.data.results);
    } catch (error) {
      console.error('Error fetching points of interest:', error);
    }
  };

  const fetchRestaurants = async (location) => {
    try {
      const response = await axios.get('', {
        params: {
          location: `${location.lat},${location.lng}`,
          radius: 1500,
          type: 'restaurant',
          key: ''
        }
      });
      setRestaurants(response.data.results);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleWeatherNavigate = () => {
    navigate('/weather-forecast', { state: { location: destination } });
  };

  const addToFavorites = (place) => {
    setFavorites([...favorites, place]);
  };

  const removeFromFavorites = (place) => {
    setFavorites(favorites.filter(fav => fav.place_id !== place.place_id));
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container className="itinerary-map-container">
      <Box my={4}>
        <Paper elevation={3}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Itinerary Planner" />
            <Tab label="Map" />
            <Tab label="Points of Interest" />
            <Tab label="Nearby Restaurants" />
            <Tab label="Favorites" />
          </Tabs>
        </Paper>
        <Box mt={4}>
          {tabIndex === 0 && (
            <Paper elevation={3} className="form-container">
              <Typography variant="h4" component="h1" className="form-title" gutterBottom>
                Itinerary Planner
              </Typography>
              <form onSubmit={handleSubmit}>
                <Box mb={2}>
                  <TextField
                    label="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Box>
                <Box mb={2}>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Box>
                <Box mb={2}>
                  <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Box>
                <Box mb={2}>
                  <TextField
                    label="Interests"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Box>
                <Button variant="contained" color="primary" type="submit">
                  Plan Itinerary
                </Button>
              </form>
              {locationSet && (
                <Button variant="contained" color="secondary" onClick={handleWeatherNavigate} style={{ marginTop: '16px' }}>
                  Check Weather
                </Button>
              )}
            </Paper>
          )}
          {tabIndex === 1 && (
            <Box className="map-container" style={{ marginBottom: '20px' }}>
              <LoadScript googleMapsApiKey="">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={12}
                >
                  {pointsOfInterest.map((place, index) => (
                    <Marker
                      key={index}
                      position={{ lat: place.geometry.location.lat, lng: place.geometry.location.lng }}
                      onClick={() => setSelectedPlace(place)}
                    />
                  ))}
                  {restaurants.map((place, index) => (
                    <Marker
                      key={index}
                      position={{ lat: place.geometry.location.lat, lng: place.geometry.location.lng }}
                      onClick={() => setSelectedPlace(place)}
                    />
                  ))}
                  {selectedPlace && (
                    <InfoWindow
                      position={{ lat: selectedPlace.geometry.location.lat, lng: selectedPlace.geometry.location.lng }}
                      onCloseClick={() => setSelectedPlace(null)}
                    >
                      <div>
                        <Typography variant="h6">{selectedPlace.name}</Typography>
                        <Typography variant="body2">{selectedPlace.vicinity}</Typography>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            </Box>
          )}
          {tabIndex === 2 && (
            <Box mt={4}>
              <Paper elevation={3} className="poi-container">
                <Typography variant="h5" component="h2" className="poi-title" gutterBottom>
                  Points of Interest
                </Typography>
                <List>
                  {pointsOfInterest.map((place, index) => (
                    <ListItem key={index} button onClick={() => setSelectedPlace(place)}>
                      <ListItemText primary={place.name} secondary={place.vicinity} />
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => addToFavorites(place)}
                        style={{ marginLeft: '10px' }}
                      >
                        Add to Favorites
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}
          {tabIndex === 3 && (
            <Box mt={4}>
              <Paper elevation={3} className="poi-container">
                <Typography variant="h5" component="h2" className="poi-title" gutterBottom>
                  Nearby Restaurants
                </Typography>
                <List>
                  {restaurants.map((place, index) => (
                    <ListItem key={index} button onClick={() => setSelectedPlace(place)}>
                      <ListItemText primary={place.name} secondary={place.vicinity} />
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => addToFavorites(place)}
                        style={{ marginLeft: '10px' }}
                      >
                        Add to Favorites
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}
          {tabIndex === 4 && (
            <Box mt={4}>
              <Paper elevation={3} className="favorites-container">
                <Typography variant="h5" component="h2" className="favorites-title" gutterBottom>
                  Favorite Places
                </Typography>
                <List>
                  {favorites.map((place, index) => (
                    <ListItem key={index} button onClick={() => setSelectedPlace(place)}>
                      <ListItemText primary={place.name} secondary={place.vicinity} />
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => removeFromFavorites(place)}
                        style={{ marginLeft: '10px' }}
                      >
                        Remove
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ItineraryAndMap;
