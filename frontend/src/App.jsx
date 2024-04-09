import React from "react";
import Container from "./components/Container";
import Index from "./components/Index";
import Tutorial from "./components/Tutorial";
import Root from "./components/Root";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
