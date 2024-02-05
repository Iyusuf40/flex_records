import React from "react";
import architecture from "../images/infrastructure.drawio.png";

export default function Docs() {
  return (
    <div className="docs--container">
      <h1>This Page is Specifically for Developers</h1>
      <div className="docs--architecture">
        <h2>Architecture</h2>
        <img src={architecture} alt="architecture" />
      </div>

      <div className="docs--stack">
        <h2>Stack</h2>
        <h3>Servers:</h3>
        <p>All 3 machines are Linux based on Ubuntu 20.04.5</p>
        <h3> Front-end:</h3>
        <p>
          The front-end was built with react. react-router and react-uuid were
          also incorporated. The choice to use react was down to the need to
          maintain, update and listen for state changes. The bulk of the app
          logic is embedded in the frontend since it is wasteful and slow to
          perform computations in the back-end before re-rendering the results
          in the front-end.
        </p>
        <h3> Back-end:</h3>
        <p>
          The back-end of the app was built with python using Flask, Mongodb as
          database and Pymongo as the database driver. The choice for using
          python was because of I beign more proficient in python. And Mongodb
          was used due to the constant changing nature of the data structure
          sent to the backend.
        </p>

        <b>API Endpoints:</b>
        <br />
        <div>
          GET /records_api/:id
          <br />
          <ul>
            <li>Fetches the records associated with the id</li>
            <li>
              Returns a JSON having all the records and data associated with
              that ID with 200 status code if successful
            </li>
          </ul>
        </div>

        <div>
          POST /records_api/
          <br />
          <ul>
            <li>
              Accepts a payload and validates it before persisting in the
              database
            </li>
            <li>
              Returns a JSON of the payload and a 201 status code if successfull
            </li>
          </ul>
        </div>

        <div>
          PUT /records_api/
          <br />
          <ul>
            <li>
              Accepts a payload and validates it before persisting in the
              database, ID is retrived from the payload and checked if record
              exists
            </li>
            <li>
              Returns a JSON of the payload and a 200 status code if successfull
            </li>
          </ul>
        </div>

        <h2>Setting Up Locally:</h2>
        <p>
          This section will give details on how to run the app locally on a
          Linux machine
        </p>
        <h3>Front-end</h3>
        <p>
          Install Node.js from this{" "}
          <a href="https://nodejs.org/en/download/" target="blank">
            link
          </a>
          <span> </span>
          if you don't have it installed.
        </p>
        <h3>Back-end</h3>
        <p>
          Install python from this &nbsp;
          <a
            href="https://docs.python.org/3/using/unix.html#on-linux"
            target="blank"
          >
            link
          </a>{" "}
          &nbsp; if you don't have it installed.
          <br />
          Install pip3 by running 'sudo apt-get install python3-pip'
          <br />
          Install Mongodb by following this &nbsp;
          <a
            href="https://www.mongodb.com/docs/manual/administration/install-on-linux/"
            target="blank"
          >
            link
          </a>
          . Ensure it is running. Install Flask, Flask-CORS and pymongo by
          runing 'pip3 install Flask; pip3 install -U flask-cors; pip3 install
          pymongo'
        </p>
        <h3>Starting the app</h3>
        <p>
          run 'git clone https://github.com/Iyusuf40/flex_records'
          <br />
          'cd flex_records/backend'
          <br />
          You can choose to run the following commands in the background or open
          other terminals to continue with other operations.
          <br />
          'python3 -m api.v1.app'
          <br />
          'cd flex_records/frontend'
          <br />
          'npm install'
          <br />
          'npm start'
        </p>
      </div>
    </div>
  );
}
