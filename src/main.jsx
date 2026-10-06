import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './liquid-glass.css';
import './portfolio.css';
import './motion.css';
import { applyAppearance } from './glassConfig.js';

applyAppearance();
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
