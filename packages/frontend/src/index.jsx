import React from 'react';
import { render } from 'react-dom';
import App from './components';

const title = process.env.TITLE;
const root = process.env.REACT_ROOT;

render(<App title={title} />, document.getElementById(root));
