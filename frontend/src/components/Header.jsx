import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="records">Records</Link>
          </li>
          <li>
            <Link to="tutorial">Tutorial</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
