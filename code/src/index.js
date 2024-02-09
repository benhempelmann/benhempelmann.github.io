import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, Outlet, RouterProvider,} from "react-router-dom";
import './index.css';

import NavBar from './navbar';
import App from './App';
import TicTacToe from './games/tic-tac-toe/ttt';
import GOL from './games/game-of-life/gol';
import Wordle from './games/wordle/wordle';

const AppLayout = () => {
  return(
    <>
      <NavBar/>
      <Outlet/>
    </>
  )
}

const router = createBrowserRouter([
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
      {
        path: "/wordle",
        element: <Wordle/>
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

