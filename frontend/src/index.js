// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the change from 'react-dom' to 'react-dom/client'
import App from './App';

// Create a root element for React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));

// Use the new render method to render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);