import React from "react"
import SidePane from "./SidePane"
import TableView from "./TableView"

export default function Container() {

  // todo
	// load table from database
  let records = {
    id: 1, // get from localstorage, or user provide or gen new uuid 
    tables: { 
      "table 1": {
	      data: {
	        1: [1, 2, 3, 4],
	        2: [10, 5, 2, 3]
	      },
	      noOfRows: 0,
	      noOfCols: 0,
	      ruleMode: false,
	      currentRule: "", // rule for table eg sum-horizontal for left to right
	                       // or sum-vertical for top to bottom  
      },
      "table 2": {
	      data: {
	        1: [4, 9],
	        2: [3, 32]
	      },
	      noOfRows: 0,
	      noOfCols: 0,
	      ruleMode: false,
	      currentRule: "",
      }
    },
    currentTable: "table 1",
    rowsAndColsNoSet: false
  }

  // set the number of columns and number of rows	
  if (!records.rowsAndColsNoSet && Object.keys(records.tables).length) {
    console.log("ran")
    for (const table in records.tables) {
      if (Object.keys(records.tables[table]["data"]).length) {
        records.tables[table] = {
          ...records.tables[table],
	  noOfRows: records.tables[table]["data"][Object
		  .keys(records.tables[table]["data"])[0]].length,
	  noOfCols: Object.keys(records.tables[table]["data"]).length
	}
      }
    }
    records = setNoOfRowsAndColsSet(records)
  } 
  //to-do
  //is there a better way to get the noOfRows and noOfCols set?
  
  function setNoOfRowsAndColsSet(obj) {
    return {...obj, rowsAndColsNoSet: true}
  }
  
  let recordState;
  let setState;
  [recordState, setState] = React.useState(records, setState) 
 
  console.log(recordState)

  function handleTableClick (tableName) {
    setState((prevState) => {
      return (
        {
          ...prevState,
	  currentTable: tableName
	}
      )
    })
  }

  function createTable() {

  }

  function addColumn(tableName) {
    console.log(tableName)
  }

  function addRow(tableName) {

  }

  function addRule(tableName) {

  }

  return (
    <div className="container">
	  <SidePane
	    records={recordState}
	    handleTableClick={handleTableClick}
	    createTable={createTable}
	  />
	  <TableView
	    records={recordState}
	    addColumn={addColumn}
	    addRow={addRow}
	    addRule={addRule}
	  />
    </div>
  )
}
