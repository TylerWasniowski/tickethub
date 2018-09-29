// @flow
import '../styles/global.css';
import React from 'react';
import type { Node } from 'react';
import { hot } from 'react-hot-loader';

const Home = (): Node => (
    <h1>HOME PAGE</h1>
);

export default hot(module)(Home);