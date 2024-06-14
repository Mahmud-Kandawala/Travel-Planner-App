// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import FlightBooking from './components/FlightBooking';
import WeatherForecast from './components/WeatherForecast';
import UserPreferences from './components/UserPreferences';
import BookedFlights from './components/BookedFlights';
import Itinerary from './components/Itinerary';
import ItineraryAndMap from './components/ItineraryAndMap';
import CollaborativeItinerary from './components/CollaborativeItinerary'; // Import the new component
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Travel Planner Application
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/user-preferences">User Preferences</Button>
            <Button color="inherit" component={Link} to="/flight-booking">Flight Booking</Button>
            <Button color="inherit" component={Link} to="/weather-forecast">Weather Forecast</Button>
            <Button color="inherit" component={Link} to="/itinerary">Custom</Button>
            <Button color="inherit" component={Link} to="/itinerary-and-map">Map</Button>
            <Button color="inherit" component={Link} to="/collaborative-itinerary">Collaborative Itinerary</Button> {/* Add new button */}
          </Toolbar>
        </AppBar>
        <Container>
          <Routes>
            <Route path="/" element={<BookedFlights />} />
            <Route path="/user-preferences" element={<UserPreferences />} />
            <Route path="/flight-booking" element={<FlightBooking />} />
            <Route path="/weather-forecast" element={<WeatherForecast />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/itinerary-and-map" element={<ItineraryAndMap />} />
            <Route path="/collaborative-itinerary" element={<CollaborativeItinerary />} /> {/* Add new route */}
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
