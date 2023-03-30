import React from 'react';

export default function Tutorial() {
  return (
    <div className="tutorial--container">
      <h1>Hi, Welcome to flex_records tutuorial page</h1>
      <p>
        The tutorial has 2 broad sections,
        Basic rules and Advanced, with each section having sub-sections.
        We'd look at how to apply rules on columns and rows so that
        flex_records handle computations we define.
      </p>
      <p>
        Do not be frightened :) there are only 5 rules to learn. And they
        apply to both basic and advanced with the only difference being that
        advanced rules gives you more freedom on where and how to apply
        rules. There are also demo videos for each section.
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
      <p>
        Generally, how it works is, you enter your data into a table; then you
        click on the
        {' '}
        <em>add rule</em>
        {' '}
        or
        <em>advanced</em>
        {' '}
        button
        depending on which mode you want to use; then the options
        are displayed for you to choose from; after picking one
        a prompt will ask you to
        click on the row or column you want to save the results. On clicking the cell
        the results of the computation will be stored there.
        <br />
        <br />
        <strong>NOTE:</strong>
        {' '}
        for basic rules, you can only store
        results at the edge cells
        i.e. either the last column or the bottom row. Advanced rules give you
        the freedom to store your results anywhere: One reason I personally prefer
        advanced over basic.
        <br />
        <br />
        If the data in your table changes, the results will be recalculated
        accordingly and if the structure of your table changes, the rules applied
        will run as well for the new columns or rows. Sometimes you don't want
        that to happen, you can prevent continuous application of rule by
        clicking on
        {' '}
        <em>clear rule</em>
        {' '}
        button. Then you can apply the rules back
        when you need them again.
      </p>
      <div className="basic--rules">
        <h2>Basic Rules</h2>
        <h3>
          Rules Description
        </h3>
        <div>
          <h3>sum:</h3>
          <p>
            For Calculation accross columns: sums all numeric data
            accross all columns and stores the result on the last column.
            <br />
            For Calculation accross rows: sums all numeric data
            accross all rows and stores the result on the last row
          </p>

          <h3>subtract:</h3>
          <p>
            <b>For Calculation accross columns:</b>
            {' '}
            Gets the data in the first
            column if it is a numeric value else it gets the second column
            data, then it subtracts all other numeric data accross the column
            and saves the result in the last column.
            <br />
            <b>NOTE:</b>
            {' '}
            Basic rules only checks the first and second column
            for numeric data. If your table is structured in such a way
            that the numeric fields are deep in the table we suggest you
            use advanced instead as it gives you the chance to choose
            from which column to start computations.
            <br />
            <b>For Calculation accross rows:</b>
            {' '}
            Gets the data in the first
            row if it is a numeric value else it gets the second row
            data, then it subtracts all other numeric data accross the row
            and saves the result in the last row.
            <br />
            <b>NOTE:</b>
            {' '}
            Basic rules only checks the first and second row
            for numeric data. If your table is structured in such a way
            that the numeric fields are deep in the table we suggest you
            use advanced instead as it gives you the chance to choose
            from which row to start computations.
          </p>

          <h3>subtract reverse:</h3>
          <p>
            <b>For Calculation accross columns:</b>
            {' '}
            Gets the data in the column
            before the last column
            then it subtracts all other numeric data accross the column
            moving left
            and saves the result in the last column.
            <br />
            <b>For Calculation accross rows:</b>
            {' '}
            Gets the data in the row above
            the bottom row,
            then it subtracts all other numeric data accross the row
            moving upward and saves the result in the last row.
          </p>

          <h3>multiply:</h3>
          <p>
            <b>For Calculation accross columns:</b>
            {' '}
            multiplies all
            numeric data
            accross all columns and stores the result on the last column.
            <br />
            <b>For Calculation accross rows:</b>
            {' '}
            multiplies all numeric data
            accross all rows and stores the result on the last row
            <br />
            <b>NOTE:</b>
            {' '}
            Basic rules only checks the first and second row
            for numeric data. If your table is structured in such a way
            that the numeric fields are deep in the table we suggest you
            use advanced instead as it gives you the chance to choose
            from which row to start computations.
          </p>

          <h3>average:</h3>
          <p>
            <b>For Calculation accross columns:</b>
            {' '}
            sums all numeric data
            accross all columns;
            divides the sum by the number of cells where numeric data was
            found
            and stores the result on the last column.
            <br />
            <b>For Calculation accross rows:</b>
            {' '}
            sums all numeric data
            accross all rows;
            divides the sum by the number of cells where numeric data was
            found
            and stores the result on the last row
            <br />
            <b>NOTE:</b>
            {' '}
            Basic rules only checks the first and second row
            for numeric data. If your table is structured in such a way
            that the numeric fields are deep in the table we suggest you
            use advanced instead as it gives you the chance to choose
            from which row to start computations.
          </p>
        </div>
        <h3>Demo</h3>
        <div className="youtube">
          <iframe
            width="1000"
            height="600"
            title="basic-rules demo"
            src="https://www.youtube.com/embed/77iz8caEq_A"
          />
        </div>
      </div>
      <div className="advanced--rules">
        <h2>Advanced Rules</h2>
        <p>
          Common flow is on clicking the
          {' '}
          <em>advanced</em>
          {' '}
          button and then an
          option, You'd be asked to click on the row or column you'd like
          to save
          your results. Then You'd be presented a prompt to type in
          either "col" or
          "row": This is so to notify the application if it should apply the
          rule accross columns or accross rows. On entering a valid option
          you'd be asked to enter a range or a number from where to apply
          rule and where to stop, for instance, you chose column 5, the range
          could be 1-3 which means perform all calculations on
          columns 1 through 3 and save the result in column 5.
          <br />
          This way you can have several advanced rules on one table
          each acting on a given range.
        </p>
        <h3>
          Rules Description
        </h3>
        <div>
          <h3>sum:</h3>
          <p>
            <b>For Calculation accross columns:</b>
            {' '}
            sums all numeric data
            accross all columns in the range specified and stores the result on
            the column clicked.
            <br />
            <b>For Calculation accross rows:</b>
            {' '}
            sums all numeric data
            accross all rows in the range specified and stores
            the result on the
            the row clicked.
          </p>
          <h3>subtract:</h3>
          <p>
            <b>For Calculation accross columns:</b>
            {' '}
            Gets the data of the
            first column
            of the range specified
            then it subtracts all other numeric data accross the column within
            the range specified ie up to the last item of the range
            and saves the result in the column clicked.
            <br />
            <b>For Calculation accross rows:</b>
            {' '}
            Gets the data of the first
            row in the range specified, then it subtracts all other
            numeric data
            accross the row within the range
            and saves the result in the row clicked.
            <br />
          </p>
          <h3>subtract reverse:</h3>
          <p>
            <b>For Calculation accross columns:</b>
            {' '}
            Gets the data in the column
            of the last column of the range specified
            then it subtracts all other numeric data accross the column
            moving left until the first column in the range
            and saves the result in the clicked column.
            <br />
            <b>For Calculation accross rows:</b>
            {' '}
            Gets the data in the row of
            the  last number in the range specified,
            then it subtracts all other numeric data accross the row
            moving up until the first row of the range specified
            and saves the result in the row clicked.
          </p>
          <h3>multiply:</h3>
          <p>
            <b>For Calculation accross columns:</b>
            {' '}
            multiplies all
            numeric data
            accross all columns of the range specified
            and stores the result on the column clicked.
            <br />
            <b>For Calculation accross rows:</b>
            {' '}
            multiplies all numeric data
            accross all rows in the range specified
            and stores the result on the clicked row
            <br />
          </p>
          <h3>average:</h3>
          <p>
            <b>For Calculation accross columns:</b>
            {' '}
            sums all numeric data
            accross all columns in the range specified;
            divides the sum by the number of cells where numeric data was
            found
            and stores the result on the clicked column.
            <br />
            <b>For Calculation accross rows:</b>
            {' '}
            sums all numeric data
            accross all rows of the range specified;
            divides the sum by the number of cells where numeric data was
            found
            and stores the result on the clicked row
            <br />
          </p>
        </div>
        <h3>Demo</h3>
        <div className="youtube">
          <iframe
            width="1000"
            height="600"
            title="advanced demo"
            src="https://www.youtube.com/embed/hOOzbQ7ocL4"
          />
        </div>
        <div className="features">
          <h2>Other Functionalities:</h2>
          <p>
            <b>switch user:</b>
            {' '}
            This button enables users to switch accounts
            by giving an input field to insert user's ID.
            <br />
            <b>create table:</b>
            {' '}
            On clicking this button you'd be given
            the option to name the table you want to create and then an
            option to enter the size of the table in the format row x column
            i.e. number of rows and number of columns you want the table to
            have.
            <br />
            <b>modify table:</b>
            {' '}
            You can change the name of the current table
            by clicking this button. To delete a table, type in 'delete'
            in the input field spawned by clicking this button.
            <br />
            <b>add column, del column:</b>
            {' '}
            These buttons give you the chance
            to add new columns to your table or remove them.
            <br />
            <b>add row, del row:</b>
            {' '}
            These buttons give you the chance
            to add new rows to your table or remove them.
            <br />
            <b>add rule, advanced:</b>
            {' '}
            These buttons allow you add
            basic and advanced rules to your table respectively.
            <br />
            <b>clear rule:</b>
            {' '}
            This button allows you to remove rule
            that is bound to your table.
            <br />
            <b>cell size +, -:</b>
            {' '}
            Allows you resize your cells.
          </p>
        </div>
      </div>

    </div>
  );
}
