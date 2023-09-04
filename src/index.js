import React from 'react';
import ReactDOM from 'react-dom/client';
import {createHashRouter, Outlet, RouterProvider,} from "react-router-dom";
import './index.css';

import NavBar from './navbar';
import App from './App';
import TicTacToe from './tic-tac-toe/ttt';
import GOL from './game-of-life/gol';

const AppLayout = () => {
  return(
    <>
      <NavBar/>
      <Outlet/>
    </>
  )
}

const router = createHashRouter([
  {
    element: <AppLayout/>,
    children: [
      {
        path: "/",
        element: <App/>
      },
      {
        path: "/tic-tac-toe",
        element: <TicTacToe/>
      },
      {
        path: "/game-of-life",
        element: <GOL/>
      },
    ]

  },
  
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/> 
  </React.StrictMode>
);

