import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './App.jsx';
import AjouterFacture from './AjouterFacture.jsx';
import ModifierFacture from './ModifierFacture.jsx';
import Login from './Login.jsx';
import './index.css';

function MainRouter() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            authenticated ? (
              <Home setAuthenticated={setAuthenticated} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/ajouter"
          element={
            authenticated ? (
              <AjouterFacture />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/modifier/:id"
          element={
            authenticated ? (
              <ModifierFacture />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={<Login setAuthenticated={setAuthenticated} />}
        />
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainRouter />
  </React.StrictMode>
);
