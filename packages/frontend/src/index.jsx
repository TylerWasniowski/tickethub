import React from 'react';
import { render } from 'react-dom';
import App from './components';

console.log(JSON.stringify(process.env));

const title = process.env.TITLE;
const root = process.env.REACT_ROOT;

console.log(process.env.PORT);
console.log(process.env.TITLE);
console.log(process.env.REACT_ROOT);
console.log(JSON.stringify(process.env));

render(<App title={title} />, document.getElementById(root));
