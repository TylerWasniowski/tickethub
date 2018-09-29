// @flow
import '../styles/global.css';
import React from 'react';
import type { Node } from 'react';
import { hot } from 'react-hot-loader';

const UpdateAccount = (): Node => (
    <div>
        <h1>Update Account</h1>
        <form action="/account/submit" method="post" ><br />
            <p>Name <input type="text" name="name" /></p>
            <p>Email <input type="text" name="email" /></p>
            <p>Password <input type="password" name="password" /></p>
            <p>Re-enter <input type="password" name="password2" /></p>
            <button type="submit">Submit</button><br />
        </form>
    </div>
);

export default hot(module)(UpdateAccount);