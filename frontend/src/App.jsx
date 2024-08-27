import React from "react";
import Container from "./components/Container";
import Inventory from "./components/Inventory";
import Index from "./components/Index";
import Tutorial from "./components/Tutorial";
import Root from "./components/Root";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sales from "./components/Sales";

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
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "inventory/sales",
        element: <Sales />,
      },
      {
        path: "tutorial",
        element: <Tutorial />,
      },
    ],
  },
]);

/**
 *
 * routes:
 *
 * /
 * /records
 * /tutorial
 *
 */

function App() {
  return (
    <div className="outer--container">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
