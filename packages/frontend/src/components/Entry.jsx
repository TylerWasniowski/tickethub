// @flow
import React from 'react';
import { render } from 'react-dom';
import App from './App';

render(
  <App title={process.env.TITLE} />,
  document.getElementById(process.env.REACT_ROOT)
);
