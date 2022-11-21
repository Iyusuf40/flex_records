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

  const className = getClassName(table);

  function getClassName(table) {
    if (!table && !table.cellSize) {
      return null;
    }
    const map = {
      1: "input-1",
      2: "input-2",
      3: "input-3"
    }
    return map[table.cellSize];
  }

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
	   className={!colIndex ? "label--col" : (className ? className: "")}
	   placeholder={!colIndex ? "label" : ""}
	   value={currentRow[colIndex] ? currentRow[colIndex] : ""}
	   data-col-index={colIndex}
	   data-row-index={saveRowIndex}
	   onChange={(e) => props.updateTableView(currentTable,
		                                saveRowIndex, 
		                                colIndex,
	                                        e.target.value,
	                                        saveRowIndex + 1)}
           
	   onClick={(e) => ( table.ruleMode && table.currentRule ? props.pickCells(
		              table.currentRule,
		              currentTable,
		              row,
		              colIndex,
		              noOfRows,
		              noOfCols
	                   )
			   : "")}
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
	  <button 
	    onClick={(e) => props.clearRule(currentTable)}
	  >
	    clear rule -
	  </button>
	  <button 
	    onClick={(e) => props.increaseCellSize(currentTable)}
	  >
	    cell size +
	  </button>
	  <button 
	    onClick={(e) => props.decreaseCellSize(currentTable)}
	  >
	    cell size -
	  </button>

      </div>
      {
        table.ruleMode ?  
        <div className="rule--options">
	  <
	    input
	    type="radio"
	    id="sum"
	    name="rules"
	    onClick={(e) => props.afterRulePick("sum", currentTable)}
	  />
	  <label htmlFor="sum">sum</label>
 	  <
	    input
	    type="radio"
	    id="subtract"
	    name="rules"
	    onClick={(e) => props.afterRulePick("subtract", currentTable)}
	  />
	  <label htmlFor="subtract">subtract</label>
      	  <
	    input
	    type="radio"
	    id="subtractReverse"
	    name="rules"
	    onClick={(e) => props.afterRulePick("subtractReverse", currentTable)}
	  />
	  <label htmlFor="subtractReverse">subtract-reverse</label>
       	  <
	    input
	    type="radio"
	    id="multiply"
	    name="rules"
	    onClick={(e) => props.afterRulePick("multiply", currentTable)}
	  />
	  <label htmlFor="multiply">multiply</label>
	  <
	    input
	    type="radio"
	    id="average"
	    name="rules"
	    onClick={(e) => props.afterRulePick("average", currentTable)}
	  />
	  <label htmlFor="average">average</label>

	</div>
        : ""
      }
      <div className="current--table">
	  {tableView.length ? tableView : <h1>No tables in record</h1>}
      </div>
    </div>
  )
};
