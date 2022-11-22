import React from "react";

export default function SidePane(props) {
  // console.log(props.records.tables)
  const tables = props.records.tables;
  const tableList = [];
  const currentTable = props.records.currentTable;
  // const table = props.records.tables[currentTable];

  // create array of JSX
  for (const key in tables) {
    tableList.push(
      <h3
	onClick={(event) => props.handleTableClick(key)}
	key={key}
	className={key === currentTable ? "current--table": ""}
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
      <br />
      <button onClick={props.switchUser}>
	  switch user
      </button> <br />

      <div className="table--list">
	{currentTable ? 
		<button
		 onClick={(event) => props.modifyTable(currentTable)}
		>
		 modify table
		</button>: 
		""}
	{tableList}
      </div>
    </div>
  )
};
