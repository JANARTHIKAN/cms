// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Contacts from './components/Contacts';
import CreateContact from './components/CreateContact';
import EditContact from './components/EditContact';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/create-contact" element={<CreateContact />} />
      <Route path="/edit-contact/:id" element={<EditContact />} /> {/* Add this route */}
    </Routes>
  </Router>
);

export default App;
