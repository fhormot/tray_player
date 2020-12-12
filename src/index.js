import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app.js';
import 'babel-polyfill';

import { MyContext } from './context';

window.onload = () => {
    ReactDOM.render(
        <MyContext>
            <App />
        </MyContext>
    , document.getElementById('app'));
};
