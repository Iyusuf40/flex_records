import React from "react";

export default function TableView(props) {

  const currentTable = props.records.currentTable;
  const tableData = props.records.tables[currentTable].data;
  const noOfRows = props.records.tables[currentTable].noOfRows;
  const noOfCols = props.records.tables[currentTable].noOfCols;
  console.log(tableData, noOfRows, noOfCols);

  const tableView = [];
  let rowIndex = 0;
  for (const row in tableData) {
    const saveRowIndex = rowIndex
    let currentRow = tableData[row];
    let rowContainer = []
    for (let colIndex = 0; colIndex < noOfCols; colIndex++) {
      let cell = (
        <
	 input type="text"
	 key={colIndex}
	 className={!colIndex ? "label--col" : ""}
	 placeholder={!colIndex ? "label" : ""}
	 value={currentRow[colIndex]}
	 onChange={(e) => props.updateTableView(currentTable,
		                                saveRowIndex, 
		                                colIndex,
	                                        e.target.value,
	                                        saveRowIndex + 1)}
	/>
      )
      rowContainer.push(cell)
    }
    tableView.push(
	  <div
	    key={row}
	    className="row--container"
	  >
	    {rowContainer}
	  </div>
    )
    rowIndex++;
  }
  // const tableView = <input type="text" value="12" />
  
  return (
    <div className="table--view">
      <div className="rules--buttons">
	  <button>add column +</button>
	  <button>add row +</button>
	  <button>add rule +</button>
      </div>
      <div className="current--table">
	  {tableView}
      </div>
    </div>
  )
};
