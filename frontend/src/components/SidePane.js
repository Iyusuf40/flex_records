import React from "react";

export default function SidePane(props) {
  // console.log(props.records.tables)
  const tables = props.records.tables;
  const tableList = [];

  // create array of JSX
  for (const key in tables) {
    tableList.push(
      <h3
	onClick={(event) => props.handleTableClick(key)}
	key={key}
        data-name={key}>
        {key}
      </h3>
    )
  }
  return (
    <div className="side--pane">
      <button onClick={props.createTable}>
	  create table +
      </button> <br />
      <div className="table--list">
	{tableList}
      </div>
    </div>
  )
};
