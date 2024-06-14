// src/components/WeatherForecast.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';
import Lottie from 'react-lottie';
import clearSkyAnimation from './animations/clear-sky.json';
import cloudyAnimation from './animations/cloudy.json';
import rainAnimation from './animations/rain.json';
import snowAnimation from './animations/snow.json';
import './WeatherForecast.css';

const WeatherForecast = () => {
  const location = useLocation();
  const [weather, setWeather] = useState(null);
  const destination = location.state?.location || 'New York'; // Default to 'New York' if no location is passed

  useEffect(() => {
    if (destination) {
      const fetchWeather = async () => {
        try {
          const response = await axios.get('', {
            params: {
              q: destination,
              appid: '',
              units: 'metric'
            }
          });
          setWeather(response.data);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      };

      fetchWeather();
    }
  }, [destination]);

  const getWeatherAdvice = (description) => {
    switch (description) {
      case 'clear sky':
        return "It's a beautiful day! Enjoy the sunshine and consider outdoor activities.";
      case 'few clouds':
        return "A few clouds won't ruin your day. Perfect for a walk in the park.";
      case 'scattered clouds':
      case 'broken clouds':
        return "It's a bit cloudy. A light jacket might be needed.";
      case 'shower rain':
      case 'rain':
        return "Don't forget your umbrella. It's going to be wet!";
      case 'thunderstorm':
        return "Stay indoors if possible. Thunderstorms can be dangerous.";
      case 'snow':
        return "It's snowing! Stay warm and drive safely.";
      case 'mist':
        return "Visibility is low. Be careful if you're driving.";
      default:
        return "Be prepared for any weather.";
    }
  };

  const getWeatherAnimation = (description) => {
    switch (description) {
      case 'clear sky':
        return clearSkyAnimation;
      case 'few clouds':
      case 'scattered clouds':
      case 'broken clouds':
        return cloudyAnimation;
      case 'shower rain':
      case 'rain':
        return rainAnimation;
      case 'snow':
        return snowAnimation;
      default:
        return clearSkyAnimation;
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: weather ? getWeatherAnimation(weather.weather[0].description) : clearSkyAnimation,
    rendererSettings: {
      preserveAspectRatio: ''
    }
  };

  return (
    <Container className="weather-forecast-container">
      <Box my={4} className="form-section">
        <Paper elevation={3} className="form-container">
          <Typography variant="h4" component="h1" className="form-title" gutterBottom>
            Weather Forecast for {destination}
          </Typography>
          {weather ? (
            <Box className="weather-section">
              <Lottie options={defaultOptions} height={200} width={200} />
              <Typography variant="h6">{weather.weather[0].description}</Typography>
              <Typography>{weather.main.temp}°C</Typography>
              <Typography>{weather.main.humidity}% Humidity</Typography>
              <Typography variant="body1" mt={2}>{getWeatherAdvice(weather.weather[0].description)}</Typography>
            </Box>
          ) : (
            <Typography>No weather data available.</Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default WeatherForecast;
