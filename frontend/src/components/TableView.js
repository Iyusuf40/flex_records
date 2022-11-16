import React from "react";

export default function TableView(props) {

  const currentTable = props.records.currentTable;
  const tableData = currentTable ? 
		    props.records.tables[currentTable].data
	            : null;
  const noOfCols = currentTable ? 
		   props.records.tables[currentTable].noOfCols
	           : null;
  const noOfRows = currentTable ?
		   props.records.tables[currentTable].noOfRows
	           : null;
  const table = currentTable ?
		props.records.tables[currentTable]
	        : {}

  const tableView = [];
  let rowIndex = 0;
  if (tableData) {
    // console.log(props.records);
    for (let row = 1; row <= noOfRows; row++) {
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
	   value={currentRow[colIndex] ? currentRow[colIndex] : ""}
	   data-col-index={colIndex}
	   data-row-index={saveRowIndex}
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
	      {"" && <span className="numbering">{row}: </span>}
	      {rowContainer}
	    </div>
      )
      rowIndex++;
    }
  }
  // const tableView = <input type="text" value="12" />
   
  return (
    <div className="table--view">
      <div className="rules--buttons">
	  <button 
	    onClick={(e) => props.addColumn(currentTable)}
	  >
	    add column +
	  </button>
	  <button 
	    onClick={(e) => props.delColumn(currentTable)}
	  >
	    del column -
	  </button>
	  <button 
	    onClick={(e) => props.addRow(currentTable)}
	  >
	    add row +
	  </button>
	  <button 
	    onClick={(e) => props.delRow(currentTable)}
	  >
	    del row -
	  </button>
	  <button 
	    onClick={(e) => props.addRule(currentTable)}
	  >
	    add rule +
	  </button>
      </div>
      {
        table.ruleMode ?  
        <div className="rule--options">
	  <
	    input
	    type="checkbox"
	    id="sum"
	    name="rules"
	    onClick={(e) => props.implementRule("sum", currentTable)}
	  />
	  <label htmlFor="sum">sum</label>
 	  <
	    input
	    type="checkbox"
	    id="subtract-left"
	    name="rules"
	    onClick={(e) => props.implementRule("subtractLeft", currentTable)}
	  />
	  <label htmlFor="subtract-left">subtract-left</label>
      	  <
	    input
	    type="checkbox"
	    id="subtract-right"
	    name="rules"
	    onClick={(e) => props.implementRule("subtractRight", currentTable)}
	  />
	  <label htmlFor="subtract-right">subtract-right</label>
       	  <
	    input
	    type="checkbox"
	    id="multiply"
	    name="rules"
	    onClick={(e) => props.implementRule("multiply", currentTable)}
	  />
	  <label htmlFor="multiply">multiply</label>
	  <
	    input
	    type="checkbox"
	    id="average"
	    name="rules"
	    onClick={(e) => props.implementRule("average", currentTable)}
	  />
	  <label htmlFor="average">average</label>
       	  <
	    input
	    type="checkbox"
	    id="subtractTop"
	    name="rules"
	    onClick={(e) => props.implementRule("subtractTop", currentTable)}
	  />
	  <label htmlFor="subtract-top">subtract-top</label>
	  <
	    input
	    type="checkbox"
	    id="subtractBottom"
	    name="rules"
	    onClick={(e) => props.implementRule("subtractBottom", currentTable)}
	  />
	  <label htmlFor="average">subtract-bottom</label>

	</div>
        : ""
      }
      <div className="current--table">
	  {tableView}
      </div>
    </div>
  )
};
