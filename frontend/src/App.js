/* import logo from './logo.svg';
import './App.css';*/

import React from "react";
import Container from "./components/Container"
import Index from "./components/Index"
import Docs from "./components/Docs"
import Tutorial from "./components/Tutorial"
import Root from "./components/Root"
import {
  createBrowserRouter,
  RouterProvider,
  /*Route,*/
} from "react-router-dom";


const router = createBrowserRouter([
      {
	path: "/",
	element: <Root />,
	children: [
	  {
	    index: true,
	    element: <Index />,
	  },
	  {
	    path: "records",
	    element: <Container />,
	  },
	  {
	    path: "docs",
	    element: <Docs />,
	  },
	  {
	    path: "tutorial",
	    element: <Tutorial />,
	  },
	],
   }
]);

/**
 * routes:
 * /
 * records
 * docs
 * tutorial
 */

function App() {
  return (
    <div className="outer--container">
	  <RouterProvider router={router} />
    </div>
  )
}

export default App;
