import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import './index.css';

import App from './App';
import TicTacToe from './tic-tac-toe/ttt';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/tic-tac-toe",
    element: <TicTacToe/>
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/> 
  </React.StrictMode>
);

