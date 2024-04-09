import React from "react";

export default function Tutorial() {
  return (
    <div className="tutorial--container">
      <h1>Hi, Welcome to flex_records tuturial page</h1>

      <p>
        Flex_records by design aims to make carrying out tabular computations
        very easy, as such there are two ways by which computations can be
        achieved.
      </p>

      <p>
        * Granular selection: By clicking on the 𝑓 button beside any cell (the
        target cell where computation result will be stored), you will be given
        the chance to choose cells horizontally or vertically beside the target
        cell, after which these selected cells will be used as the input to the
        function you select afterwards and the result will be placed in the
        target cell.
      </p>

      <p>
        * Batch selection: By clicking on the select tool button, you can drag
        over a range of cells you want to use as input for computation, these
        cells will be colored differently to others, then you can drag over the
        range of cells where you want to store the result of the computaion,
        after which the functions pane will be visible for you to choose the
        function you want to apply.
      </p>

      <p>
        There are only a few maths functions implemented for now. The reader can
        reach out to me if there is any functions he requires to be added.
        Available functions are:
      </p>

      <div>
        <ul>
          <li>sum</li>
          <li>subtract</li>
          <li>subtract reverse</li>
          <li>multiply</li>
          <li>average</li>
        </ul>
      </div>

      <div className="features">
        <h2>Other Functionalities:</h2>

        <p>
          <b>switch user:</b> This button enables users to switch accounts by
          giving an input field to insert user's ID.
          <br />
          <b>create table:</b> On clicking this button you'd be given the option
          to name the table you want to create and then an option to enter the
          size of the table in the format row x column i.e. number of rows and
          number of columns you want the table to have.
          <br />
          <b>modify table:</b> You can change the name of the current table by
          clicking this button. To delete a table, type in 'delete' in the input
          field spawned by clicking this button.
          <br />
          <b>show ID:</b> shows your flexId that you can use to access your
          records from other devices.
          <br />
          <b>add column, del column:</b> These buttons give you the chance to
          add new columns to your table or remove them.
          <br />
          <b>add row, del row:</b> These buttons give you the chance to add new
          rows to your table or remove them.
          <br />
          <b>add rule, advanced:</b> These buttons allow you add basic and
          advanced rules to your table respectively.
          <br />
          <b>clear functions:</b> This button allows you to remove all functions
          that is registered for the current table.
          <br />
          <b>cell size +, -:</b> Allows you resize your cells.
          <br />
          <b>insert:</b> Allows you to insert a row or column at specific
          locations in the table.
          <br />
          <b>delete:</b> Allows you to delete a row or column at specific
          locations in the table.
          <br />
          <b>off rule mode:</b> clears selected cells and allows to start
          function application process afresh.
          <br />
          <b>select tool:</b> allows you to select group of cells to apply
          functions on them.
          <br />
          <b>show functions:</b> allows you to display all functions registered
          on the current table.
          <br />
          <b>export to csv:</b> allows you to export current table data as csv
          file that can be viewed in spreadsheets like microsoft excel.
          <br />
          <b>load from csv:</b> allows you to import csv data and make it a
          table.
          <br />
        </p>
      </div>
    </div>
  );
}
