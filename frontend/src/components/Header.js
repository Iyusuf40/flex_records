import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      {/*<div className="header--div">
	  header
      </div>*/}
      <nav>
        <ul>
	  <li>
	    <Link to="/">Welcome</Link>
	  </li>
	  <li>
	    <Link to="records">Tables</Link>
	  </li>
	  <li>
	    <Link to="tutorial">Tutorial</Link>
	  </li>
	  <li>
	    <Link to="docs">docs</Link>
	  </li>
        </ul>
      </nav>
    </header>
  )
};
