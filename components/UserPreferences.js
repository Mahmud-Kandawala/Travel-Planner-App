import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, Paper, IconButton, Switch, FormControlLabel, ListItemIcon } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import ActivityIcon from '@mui/icons-material/DirectionsRun';
import DietaryIcon from '@mui/icons-material/Fastfood';
import BudgetIcon from '@mui/icons-material/AttachMoney';
import FamilyFriendlyIcon from '@mui/icons-material/FamilyRestroom';
import PetFriendlyIcon from '@mui/icons-material/Pets';
import TravelModeIcon from '@mui/icons-material/Commute';
import AirlineIcon from '@mui/icons-material/Flight';
import './UserPreferences.css';

const UserPreferences = () => {
  const [preferences, setPreferences] = useState([]);
  const [newPreference, setNewPreference] = useState({
    activities: '',
    dietaryRestrictions: '',
    budgetMin: 0,
    budgetMax: 0,
    familyFriendly: false,
    petFriendly: false,
    travelMode: '',
    preferredAirlines: ''
  });
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user-preferences');
      setPreferences(response.data);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleSavePreference = async () => {
    if (editIndex === -1) {
      try {
        const response = await axios.post('http://localhost:5000/api/user-preferences', newPreference);
        setPreferences([...preferences, response.data]);
      } catch (error) {
        console.error('Error saving preference:', error);
      }
    } else {
      const updatedPreferences = preferences.map((pref, index) => (index === editIndex ? newPreference : pref));
      setPreferences(updatedPreferences);
      setEditIndex(-1);
    }
    setNewPreference({
      activities: '',
      dietaryRestrictions: '',
      budgetMin: 0,
      budgetMax: 0,
      familyFriendly: false,
      petFriendly: false,
      travelMode: '',
      preferredAirlines: ''
    });
  };

  const handleEditPreference = (index) => {
    setNewPreference(preferences[index]);
    setEditIndex(index);
  };

  const handleDeletePreference = async (index) => {
    const updatedPreferences = preferences.filter((_, i) => i !== index);
    setPreferences(updatedPreferences);
    await axios.delete(`http://localhost:5000/api/user-preferences/${preferences[index].id}`);
  };

  return (
    <Container className="user-preferences-container">
      <Box my={4} className="content-section">
        <Box className="left-section">
          <Paper elevation={3} className="preferences-container">
            <Typography variant="h4" component="h1" gutterBottom>
              User Preferences
            </Typography>
            <List>
              {preferences.map((preference, index) => (
                <ListItem key={index} className="preference-item">
                  <ListItemIcon>
                    <ActivityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Activities: ${preference.activities}`}
                    secondary={
                      <>
                        <span>
                          <DietaryIcon style={{ verticalAlign: 'middle' }} /> Dietary Restrictions: {preference.dietaryRestrictions}
                        </span>
                        <br />
                        <span>
                          <BudgetIcon style={{ verticalAlign: 'middle' }} /> Budget: ${preference.budgetMin} - ${preference.budgetMax}
                        </span>
                        <br />
                        <span>
                          <FamilyFriendlyIcon style={{ verticalAlign: 'middle' }} /> Family Friendly: {preference.familyFriendly ? 'Yes' : 'No'}
                        </span>
                        <br />
                        <span>
                          <PetFriendlyIcon style={{ verticalAlign: 'middle' }} /> Pet Friendly: {preference.petFriendly ? 'Yes' : 'No'}
                        </span>
                        <br />
                        <span>
                          <TravelModeIcon style={{ verticalAlign: 'middle' }} /> Travel Mode: {preference.travelMode}
                        </span>
                        <br />
                        <span>
                          <AirlineIcon style={{ verticalAlign: 'middle' }} /> Preferred Airlines: {preference.preferredAirlines}
                        </span>
                      </>
                    }
                  />
                  <IconButton edge="end" onClick={() => handleEditPreference(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeletePreference(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
        <Box className="right-section">
          <Paper elevation={3} className="form-container" style={{ padding: '16px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {editIndex === -1 ? 'Add New Preference' : 'Edit Preference'}
            </Typography>
            <TextField
              label="Activities"
              value={newPreference.activities}
              onChange={(e) => setNewPreference({ ...newPreference, activities: e.target.value })}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '16px' }}
            />
            <TextField
              label="Dietary Restrictions"
              value={newPreference.dietaryRestrictions}
              onChange={(e) => setNewPreference({ ...newPreference, dietaryRestrictions: e.target.value })}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '16px' }}
            />
            <TextField
              label="Budget Min"
              type="number"
              value={newPreference.budgetMin}
              onChange={(e) => setNewPreference({ ...newPreference, budgetMin: e.target.value })}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '16px' }}
            />
            <TextField
              label="Budget Max"
              type="number"
              value={newPreference.budgetMax}
              onChange={(e) => setNewPreference({ ...newPreference, budgetMax: e.target.value })}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '16px' }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newPreference.familyFriendly}
                  onChange={(e) => setNewPreference({ ...newPreference, familyFriendly: e.target.checked })}
                />
              }
              label="Family Friendly"
              style={{ marginBottom: '16px' }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newPreference.petFriendly}
                  onChange={(e) => setNewPreference({ ...newPreference, petFriendly: e.target.checked })}
                />
              }
              label="Pet Friendly"
              style={{ marginBottom: '16px' }}
            />
            <TextField
              label="Travel Mode"
              value={newPreference.travelMode}
              onChange={(e) => setNewPreference({ ...newPreference, travelMode: e.target.value })}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '16px' }}
            />
            <TextField
              label="Preferred Airlines"
              value={newPreference.preferredAirlines}
              onChange={(e) => setNewPreference({ ...newPreference, preferredAirlines: e.target.value })}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '16px' }}
            />
            <Button variant="contained" color="primary" onClick={handleSavePreference}>
              {editIndex === -1 ? 'Save Preference' : 'Update Preference'}
            </Button>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default UserPreferences;
