import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {initializeApp} from 'firebase/app'
import { getAuth, setPersistence,browserLocalPersistence,browserSessionPersistence,inMemoryPersistence } from 'firebase/auth';
import {getDatabase} from 'firebase/database';
import firebaseConfig from './firebaseConfig';


const app = initializeApp(firebaseConfig);

const auth = getAuth(app); // Get the auth instance

await setPersistence(auth,browserLocalPersistence) // Set persistence

const database = getDatabase(app); // Get the database instance


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



