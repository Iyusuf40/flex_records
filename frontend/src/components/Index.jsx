import React from "react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="welcome--container">

      <div className="hero--container">
        <h1>
            Save Alphanumeric Data in Tables and Carryout Computations on Them
            Easily
        </h1>
      </div>

      <div className="descriptions--container">
        <div className="intro--container">
          <div className="text">
            <h2>Working with tabulated data made easy</h2>
            <p>
              With flex_records, it is very easy working with <span> </span>
              <Link to="records">tables</Link>. You define the size of the table
              you want and the application creates it for you. Down the line, if
              you figure the size you initially designed is inadequate, Just by a
              click of a button you can increase or decrease the number of rows
              and columns as you deem fit. With internet connection, you don't
              have to worry about loosing your work. Changes made to the table are
              instantly saved and sent to our servers for storage.
            </p>
          </div>
        </div>

        <div className="compute--container">
          <div className="text">
            <h2>
              Define Easy Computation Functions To Apply On a Row or Column Once
              and The App Updates Results on Table Changes
            </h2>
            <p>
              The power of flex_records lies in its ability to perform
              computations on your numeric data. Carrying out computations such as
              sum, average etc on data in your table is very easy to achieve. You
              can specify on which cell to store your computation and speficy its
              input cells, or you can select a group of cells to serve as input to
              a function. On update of your table values, the computations are
              redone to reflect the updated data.
            </p>
            <p>
              When you want to stop applying a particular rule, you click on
              <strong> show functions </strong> button and delete the function.
              Alternatively, to clear all functions you click on
              <strong> clear functions </strong> button.
            </p>
            <p>
              Head on to the <Link to="tutorial">tutorial</Link> page to learn how
              easy it is to apply functions on your table.
            </p>
          </div>
        </div>

        <div className="access--anywhere--container">
          <div className="text">
            <h2>Access From Anywhere and With Any Device</h2>
            <p>
              When you visit <Link to="records">records</Link> for the first time,
              a unique ID will be generated for you and stored in your browser.
              Anytime you visit your records on a future date, that ID will be
              used to retrieve all your records from our servers. You may want to
              save that ID somewhere in case a need arise for you to access your
              records from a different device.
            </p>
          </div>
          <div className="access--anywhere--image" />
        </div>
        
      </div>

      <div className="about--container">
        <div className="about--text text">
          <h2>Contact:</h2>
          <address>
            Mail:{" "}
            <a href="mailto: isyakuyusuf@outlook.com" target="blank">
              isyakuyusuf@outlook.com
            </a>{" "}
            <br />
            Linkedin:{" "}
            <a
              href="https://linkedin.com/in/yusuf-isyaku-361138245"
              target="blank"
            >
              linkedin.com/in/yusuf-isyaku
            </a>{" "}
            <br />
            Repo:{" "}
            <a href="https://github.com/Iyusuf40/flex_records" target="blank">
              https://github.com/Iyusuf40/flex_records
            </a>
          </address>
        </div>
        <div className="about--image" />
      </div>
    </div>
  );
}
