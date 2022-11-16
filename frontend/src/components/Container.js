import React from "react"
import SidePane from "./SidePane"
import TableView from "./TableView"
import utilities from "../utilities"

export default function Container() {

  // todo
	// load table from database
  /*let records = {
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
    rowsAndColsNoSet: false,
    archiveTablesNames: [],
  }

  */

  function createArray(size) {
    const myArray = [];
    for (let index = 0; index < size; index++) {
      myArray.push("");
    }
    return myArray;
  }

  function newData(noOfRows, noOfCols) {
    let rows = noOfRows;
    let cols = noOfCols;
    const data = {};
    for (let row = 1; row <= rows; row++) {
      data[row] = createArray(cols); //new Array(cols);
    }
    return data;
  }

  function newTable(name, noOfRows, noOfCols) {
    // tableExist()
    // checkInvalidParams()
    // let rows = Number(noOfRows) ? noOfRows : 1;
    // let cols = Number(noOfCols) ? noOfCols : 1;
    const obj = {
        data: newData(noOfRows, noOfCols),
	noOfRows: noOfRows,
	noOfCols: noOfCols,
	ruleMode: false,
	currentRule: "",
	altered: true,
    }
    return obj;
  }

  let records = {
    id: 1, // get from localstorage, or user provide or gen new uuid 
    tables: {
    },
    altered: false,  // will be used to decide if to alert to save record
    currentTable: "",
    rowsAndColsNoSet: false,
    archiveTablesNames: [],
  }

  let recordState = null;
  let setState;
  [recordState, setState] = React.useState(records, setState) 

  // set the number of columns and number of rows	
  if (!recordState.rowsAndColsNoSet && Object.keys(recordState.tables)) {
    console.log("ran")
    let copy = JSON.parse(JSON.stringify(recordState))
    for (const table in copy.tables) {
      if (Object.keys(copy.tables[table]["data"]).length) {
        copy.tables[table] = {
          ...copy.tables[table],
	  noOfCols: copy.tables[table]["data"][Object
		  .keys(copy.tables[table]["data"])[0]].length,
	  noOfRows: Object.keys(copy.tables[table]["data"]).length
	}
      }
    }
    copy.rowsAndColsNoSet = true
    setState(copy)
  } 
  //to-do
  //is there a better way to get the noOfRows and noOfCols set?
  
 
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

  function checkInvalidParams(name, noOfRows, noOfCols) {
    let error = false;
    if (!noOfRows || noOfRows < 1 ) {
      alert("error creating table: invalid number of rows");
      error = true;
    } else if (!noOfCols || noOfCols < 1) {
      alert("error creating table: invalid number of columns");
      error = true;
    } else if (!name) {
      alert("error creating table: no name given for table");
      error = true;
    }
    return error;
  }

  function createTable() {
    // get name from prompt and a noOfRows and noOfCols
    const name = prompt("enter the name of new table: ");
    // const noOfRows = prompt("enter the number of rows you want to create: ");
    // const noOfCols = prompt("enter the number of columns you want to create: ");
    const size = prompt("size of table: format rows x columns, eg, 5x5");
    let [noOfRows, noOfCols] = size ? size.toLowerCase().split("x") : ["", ""];
    // check for invalid responses
    noOfRows = Number(noOfRows);
    noOfCols = Number(noOfCols);
    if (checkInvalidParams(name, noOfRows, noOfCols)) {
      return null;
    }
    setState(prevState => (
     {
	     ...prevState,
	     altered: true,
	     tables: {
		     ...(prevState.tables),
		     [name]: newTable(name, noOfRows, noOfCols)
	     },
	     currentTable: name,
             rowsAndColsNoSet: true,
     }
    ))
    // console.log(recordState);
  }

  function addColumn(tableName) {
    if (recordState.currentTable === "") {
      alert("No table selected");
      return null;
    }
    setState(prevState => (
      {
	      ...prevState,
	      altered: true,
	      tables: {
                ...prevState.tables,
		[tableName]: {
		  ...prevState.tables[tableName],
                  noOfCols: prevState.tables[tableName].noOfCols + 1
		}
	      }
      })
    )

  }

  function addRow(tableName) {
   if (recordState.currentTable === "") {
      alert("No table selected");
      return null;
   }
   setState(prevState => (
      {
	      ...prevState,
	      altered: true,
	      tables: {
                ...prevState.tables,
		[tableName]: {
		  ...prevState.tables[tableName],
                  noOfRows: prevState.tables[tableName].noOfRows + 1,
		  data: {
                    ...prevState.tables[tableName].data,
		    [prevState.tables[tableName].noOfRows + 1] :
			  createArray(prevState.tables[tableName].noOfCols),
		  }
		}
	      }
      })
    )
  }

  function addRule(tableName) {
    setState((prevState) => (
      {
	      ...prevState,
	      altered: true,
	      tables: {
                ...prevState.tables,
		[tableName]: {
		  ...prevState.tables[tableName],
		  ruleMode: true,
		}
	      }
      })
    )
  }

  function replaceAtIndex(array, index, value) {
    array[index] = value;
    return array
  }

  function updateTableView(tableName, rowIndex, colIndex, value, SN) {
    // SN is serial number, used as key in storing rows in
	  // records.tables.tableName.data
    setState(prevState => {
      return (
        {
          ...prevState,
	  tables: {
            ...prevState["tables"],
	    [tableName]: {
              ...prevState["tables"][tableName],
	      data: {
                ...prevState["tables"][tableName].data,
		[SN]: replaceAtIndex([...prevState["tables"][tableName].data[SN]],
			             colIndex, value)
	      }
	    }
	  }
	}
      )
    })
  }


  function implementRule(ruleName, currentTable){
    // console.log(ruleName) sum, subtractRight, subtractLeft, multiply, average
    // check if cell is empty
	  // check if cell is bottom
	  // decide if operate vertical or hor
    //get data
	  //clone it
	  //fix it
	  //set it back
   setState(prevState => {
     const data = prevState.tables[currentTable].data;
     const noOfRows = prevState.tables[currentTable].noOfRows;
     const noOfCols = prevState.tables[currentTable].noOfCols;
     const dataClone = {...data};
     // call appropiate function on data
     // set data back
     return ({
       ...prevState,
       tables: {
         ...prevState.tables,
	 [currentTable]: {
           ...prevState.tables[currentTable],
           data: utilities()["sumHorizontal"](dataClone, noOfRows, noOfCols),
	   ruleMode: false,
	   altered: true,
	 }
       }
     })
   })
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
	    updateTableView={updateTableView}
	    implementRule={implementRule}
	  />
    </div>
  )
}
