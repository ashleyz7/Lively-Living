import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app';
import * as c from "./Config";

firebase.initializeApp(c.config);


ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
