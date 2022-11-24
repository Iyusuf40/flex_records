import React from "react"
import uuid from 'react-uuid';
import SidePane from "./SidePane"
import TableView from "./TableView"
import utilities from "../utilities"
import advancedutils from "../advancedutils"

export default function Container() {

  // todo
	// load table from database
  /*let records = {
    id: 1, // get from localStorage, or user provide or gen new uuid 
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

  let flexId = localStorage.getItem("flexId");
  const postUrl = "http://localhost:3001/records";
  const putUrl = "http://localhost:3001/records";
  let getUrl = "http://localhost:3001/records/";

  if (!flexId) {
    flexId = uuid();
    const id = prompt(`Could not get your ID from localStorage, please enter
your ID if you have one or skip. We will generate a new ID for you`);
    if (id) {
      getAltUser(getUrl, id);
    } else {
      localStorage.setItem("flexId", flexId);
      alert(`here is your ID '${flexId}'. you may store it somewhere in case 
you want to access  your records from a different device`)
    }
  }

  if (flexId) {
    localStorage.setItem("flexId", flexId);
  }

  let init = null;
  let setInit;

  // setup initial load and use as condition to fetch data from store
  [init, setInit] = React.useState({loaded: false, saved: false}, setInit);

  let recordKey = `record-${flexId}`;
  let records = getRecords(recordKey, init);

  function getRecords(recordKey, init) {
    if (init.loaded){
      return;
    }
    // setInit(true); // set init the first time of load
    getFromBackend(getUrl, flexId);
    return ({
	    id: flexId, 
	    tables: {
	    },
	    altered: false,
	    currentTable: "",
	    rowsAndColsNoSet: false,
	    archiveTablesNames: [], 
    });
  }

  async function getAltUser(url, id) {
    let resp = null;
    await fetch(url + id).then(data => data.json()).then((data) => {
      resp = data
    });
    if (resp && Object.keys(resp).length) {
      setState(resp);
      localStorage.setItem("flexId", id);
      return;
    } else {
      let id = prompt(`User not found, enter correct ID or skip, we will generate one for you`);
      if (id) {
        return await getAltUser(url, id);
      }
      id = uuid();
      localStorage.setItem("flexId", id);
      alert(`here is your ID '${id}'. you may store it somewhere in case 
you want to access  your records from a different device`)
      return;
    }
  }

 async function getFromBackend(url, id) {
    let resp = null;
    await fetch(url + id).then(data => data.json()).then((data) => {
      resp = data
    });
    if (Object.keys(resp).length) {
      setState(resp);
    }
    setInit({loaded: true, saved: false}); // set init the first time of load
  }

  async function setAltUser(url, id) {
    let resp = null;
    await fetch(url + id).then(data => data.json()).then((data) => {
      resp = data
    });
    if (Object.keys(resp).length) {
      setState(resp);
      localStorage.setItem("flexId", id);;
    } else {
      alert("User not found");
    }
  }

  /*
   * function getFromStore(recordKey) {
    let load = localStorage.getItem(recordKey);
    if (load) {
      return JSON.parse(load); // when using fetch setState instead
    }
    return null;
  }
  */

  let recordState = null;
  let setState;

  [recordState, setState] = React.useState(records, setState);

  async function save(record, recordKey, init) {
    if (!init.loaded) {
      return;
    }
    const json = JSON.stringify(record);
    // localStorage.setItem(recordKey, json);
    await fetch(putUrl, {
      method: "PUT",
      body: json,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  /**
   * persists newly created records
   */
  function persist(record) {
    const json = JSON.stringify(record);
    fetch(postUrl, {
      method: "POST",
      body: json,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  /*async function shouldSave(recordState, init) {
    if (!init.saved) { 
      await setTimeout(save, 3000, recordState, recordKey, init);
      setInit({loaded: true, saved: true});
    } else {
      //
    }
  }*/

  // shouldSave(recordState, init);
  setTimeout(save, 1000, recordState, recordKey, init);

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

  // set the number of columns and number of rows
	// this block of code is irrelevant now. Useful prior to
	// createTable implementation
  if (!recordState.rowsAndColsNoSet && Object.keys(recordState.tables)) {
    // console.log("ran")
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

  function checkLimits(noOfRows, noOfCols) {
    const totalCells = noOfRows * noOfCols;
    if (totalCells > 10000) {
      const resp = prompt(`You are trying to create ${totalCells} number of cells, 
we advice you break the table into smaller tables else the app will be slow or 
worst case you might make your 
system unresponsive. Enter 'yes' to go ahead or 'no' to cancel`);
      if (resp && resp.toLowerCase() === "yes") {
        return true;
      }
      return false;
    }
    return true;
  }

  function createTable() {
    // get name from prompt and a noOfRows and noOfCols
    const name = prompt("enter the name of new table: ");
    if (!name) {
      return;
    }

    if (recordState.tables[name]) {
      const option = prompt(`Table ${name} already exist, if you type 'yes' it
will be overwritten`)
      if (option && option.toLowerCase() !== "yes"){
       return;
      }
    }
    const size = prompt("size of table: format rows x columns, eg, 5x5");
    let [noOfRows, noOfCols] = size ? size.toLowerCase().split("x") : ["", ""];
    // check for invalid responses
    noOfRows = Number(noOfRows);
    noOfCols = Number(noOfCols);
    if (checkInvalidParams(name, noOfRows, noOfCols)) {
      return null;
    }
    const isWithinLimits = checkLimits(noOfRows, noOfCols);
    if (!isWithinLimits) {
      return;
    }
    setState(prevState => {
	  let copy = (
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
    )
    persist(copy);
    return copy;
    }
    )
  }

  function addColumn(tableName) {
    if (recordState.currentTable === "") {
      alert("No table selected");
      return null;
    }

    if (!recordState.tables[tableName].noOfRows) {
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
    applyRuleOnModification(recordState);
  }

  function removeCol(data, noOfCols) {
    const copy = {...data};
    for (const key in copy) {
      const arr = [];
      for (let index = 0; index < noOfCols - 1; index++){
        arr[index] = copy[key][index];
      }
      copy[key] = arr;
    }
    return copy;
  }

  function delColumn(tableName) {
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
	          data: removeCol(prevState.tables[tableName].data,
			  prevState.tables[tableName].noOfCols),
                  noOfCols: prevState.tables[tableName].noOfCols ? 
			Number(prevState.tables[tableName]["noOfCols"]) - 1 : 
			0,
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
    applyRuleOnModification(recordState);
  }

function delRow(tableName) {
   if (recordState.currentTable === "") {
      alert("No table selected");
      return null;
   }
   setState(prevState => {
     const newObj = JSON.parse(JSON.stringify(prevState)); //{...prevState};
     const noOfRows = Number(newObj.tables[tableName].noOfRows);
     delete newObj.tables[tableName].data[noOfRows];
     newObj.tables[tableName].noOfRows = noOfRows - 1;
     if (newObj.tables[tableName].noOfRows < 0) {
       newObj.tables[tableName].noOfRows = 0;
     }
     return newObj;
   }
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
		  ruleModeAdv: false,
		}
	      }
      })
    )
  }

  function addRuleAdv(tableName) {
    setState((prevState) => (
      {
	      ...prevState,
	      altered: true,
	      tables: {
                ...prevState.tables,
		[tableName]: {
		  ...prevState.tables[tableName],
		  ruleModeAdv: true,
		  ruleMode: false,
		}
	      }
      })
    )
  }


  function increaseCellSize(tableName) {
    setState((prevState) => {
      const currentSize = prevState.tables[tableName].cellSize;
      let size = 0;
      if (currentSize) {
        size = currentSize + 1;
	size = size > 3 ? 3 : size;
      } else {
        size = 1;
      }
      
      return (
	   {
	      ...prevState,
	      altered: true,
	      tables: {
                ...prevState.tables,
		[tableName]: {
		  ...prevState.tables[tableName],
		  cellSize: size,
		}
	      }
          }
       )
      }
    )
  }

  function decreaseCellSize(tableName) {
    setState((prevState) => {
      const currentSize = prevState.tables[tableName].cellSize;
      let size = 0;
      if (currentSize) {
        size = currentSize - 1;
	size = size < 0 ? 0 : size;
      } else {
        size = 0;
      }
      
      return ({
	      ...prevState,
	      altered: true,
	      tables: {
                ...prevState.tables,
		[tableName]: {
		  ...prevState.tables[tableName],
		  cellSize: size,
		}
	      }
      })
    }
   )
  }

  /**
   * unsets rules for the current table
   */
  function clearRule(tableName) {
    setState((prevState) => (
      {
	      ...prevState,
	      altered: true,
	      tables: {
                ...prevState.tables,
		[tableName]: {
		  ...prevState.tables[tableName],
		  ruleMode: false,
	          ruleModeAdv: false,
		  prevRule: "",
		  cellPlacement: "",
		  currentRule: "",
		  prevRuleAdv: null,
		}
	      }
      })
    )
  }

  function replaceAtIndex(array, index, value) {
    array[index] = value;
    return array
  }

  /**
   * updateTableView - handles text changes in cells
   */
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
    applyRuleOnModification(recordState);
    //setInit({loaded: true, saved: false});
  }

  // cellPlacement determines where to apply rule
  function getRuleFunctionName(ruleName, cellPlacement) {
    const ruleNameMapRight = {
      "sum": "sumHorizontal",
      "subtractReverse": "subHorizontalRight",
      "subtract": "subHorizontalLeft",
      "multiply": "mulHorizontal",
      "average": "avgHorizontal"
    }

    const ruleNameMapBottom = {
      "sum": "sumVertical",
      "subtract": "subVerticalTop",
      "subtractReverse": "subVerticalBottom",
      "multiply": "mulVertical",
      "average": "avgVertical"
    }

    if (cellPlacement === "bottom") {
      return ruleNameMapBottom[ruleName];
    }
    return ruleNameMapRight[ruleName];
  }

  // cellPlacement determines where to apply rule
  function getRuleFunctionNameAdv(ruleName, cellPlacement) {
    const ruleNameMapRight = {
      "sum": "sumHorizontalAdv",
      "subtractReverse": "subHorizontalRightAdv",
      "subtract": "subHorizontalLeftAdv",
      "multiply": "mulHorizontalAdv",
      "average": "avgHorizontalAdv"
    }

    const ruleNameMapBottom = {
      "sum": "sumVerticalAdv",
      "subtract": "subVerticalTopAdv",
      "subtractReverse": "subVerticalBottomAdv",
      "multiply": "mulVerticalAdv",
      "average": "avgVerticalAdv"
    }

    if (cellPlacement === "bottom") {
      return ruleNameMapBottom[ruleName];
    }
    return ruleNameMapRight[ruleName];
  }

  function applyAdvancedRulesOnModification(currentState) {
    if (!currentState.tables[currentState.currentTable].prevRuleAdv) {
      return;
    }
    const prevRuleAdv = currentState.tables[currentState.currentTable].prevRuleAdv;
    let lastKey = prevRuleAdv.rowsRules ? 
		  Object.keys(prevRuleAdv.rowsRules).length
	          : 0
    let isLastKey = true;
    let index = 0;
    for (const key in prevRuleAdv.rowsRules) {
      const {
	      startIndex,
	      endIndex, 
	      ruleName, 
	      currentTable,
	      noOfRows, 
	      noOfCols, 
	      cellPlacement, 
	      saveIndex
      } = prevRuleAdv.rowsRules[key];
      if (Number(key) === lastKey) {
        isLastKey = false;
      }

      applyRuleAdvRow(
	      startIndex,
	      endIndex, 
	      ruleName, 
	      currentTable,
	      noOfRows, 
	      noOfCols, 
	      cellPlacement, 
	      saveIndex,
	      isLastKey=isLastKey
      )
      index++;
    }
    	  
    isLastKey = true;
    lastKey = prevRuleAdv.colsRules ?
	      Object.keys(prevRuleAdv.colsRules).length
	      : 0
    index = 0;
    for (const key in prevRuleAdv.colsRules) {
      const {
	      startIndex,
	      endIndex, 
	      ruleName, 
	      currentTable,
	      noOfRows, 
	      noOfCols, 
	      cellPlacement, 
	      saveIndex
      } = prevRuleAdv.colsRules[key];

      console.log("unmet", key, lastKey)
      if (Number(key) === lastKey) {
        isLastKey = false;
	console.log("met", key, lastKey)
      }
      applyRuleAdvCol(
	      startIndex,
	      endIndex, 
	      ruleName, 
	      currentTable,
	      noOfRows, 
	      noOfCols, 
	      cellPlacement, 
	      saveIndex,
	      isLastKey=isLastKey
      )
      index++;
    }
  }

  /**
   * applyRuleOnModification - reapplies the previously set rule on
   * new columns or rows created
   *
   * currentState -> currentState of records object
   */
  function applyRuleOnModification (currentState) {
    /* apply advanced here */
    if (currentState.tables[currentState.currentTable].prevRuleAdv) {
      applyAdvancedRulesOnModification(currentState)
    }
    if (currentState.tables[currentState.currentTable].prevRule) {
      const currentTable = currentState.currentTable;
      const ruleName = currentState.tables[currentTable].prevRule;
      const cellPlacement = currentState.tables[currentTable].cellPlacement;
      implementRule(ruleName, currentTable, cellPlacement);
    }
  }

  /**
   * implementRule - implements computations on each cell based on ruleName
   * and cellPlacement on the currentTable in view
   *
   * ruleName - the name of rule to apply e.g sum
   *
   * cellPlacement - helps to decide the order of computation
   * if set to right: comptations will be done from left to right
   * or right to left but if set to bottom computations will be done
   * vertically
   */
  function implementRule(ruleName, currentTable, cellPlacement) {
    // check if cell is empty
	  // check if cell is bottom
	  // decide if operate vertical or hor
    //get data
	  //clone it
	  //fix it
	  //set it back

   /* gets the function name to apply as rule */
   const functionName = getRuleFunctionName(ruleName, cellPlacement);
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
	   // utilities returns an object of functions to apply rules
           data: utilities()[functionName](dataClone, noOfRows, noOfCols),
	   ruleMode: false,
	   altered: true,
	   prevRule: ruleName,
	   cellPlacement: cellPlacement,
           currentRule: "",
	 }
       }
     })
   })
  }

  /**
   * afterRulePick - handles event after user chooses a rule to apply.
   * sets the currentTable to ruleMode which signals for rule
   * application
   */
  function afterRulePick(ruleName, currentTable) {
    alert(`click on the row or column you want to apply rule`);
    setState(prevState => {
      return ({
	 ...prevState,
         tables: {
            ...prevState.tables,
	    [currentTable]: {
              ...prevState.tables[currentTable],
              ruleMode: true,
              currentRule: ruleName,
	    },
         },
       });
    });
   }

  /**
   * afterRulePickAdv - handles event after user chooses an advanced rule to apply.
   * sets the currentTable to ruleModeAdv which signals for rule
   * application
   */
  function afterRulePickAdv(ruleName, currentTable) {
    alert(`click on the row or column you want to apply rule`);
    setState(prevState => {
      return ({
	 ...prevState,
         tables: {
            ...prevState.tables,
	    [currentTable]: {
              ...prevState.tables[currentTable],
              ruleModeAdv: true,
              currentRule: ruleName,
	    },
         },
       });
    });
   }

  function getCurrentTable() {
    const currentTable = recordState.currentTable;
    const table = recordState.tables[currentTable];
    return table
  }

  /**
   * checkLastCol - checks if column at at the right edge is
   * empty to permit saving of data
   */
  function checkLastCol(colIndex) {
    const table = getCurrentTable();
    const data = table.data;
    let empty = true;
    for (const key in data) {
      if (data[key][colIndex]) {
        return false
      }
    }
    return empty;
  }

  /**
   * checkLastRow - checks if column at at the bottom edge is
   * empty to permit saving of data
   */
  function checkLastRow(key) {
    const table = getCurrentTable();
    const data = table.data;
    const row = data[key];
    let empty = true;
    for (let index = 0; index < row.length; index++) {
      if (row[index]) {
        return false
      }
    }
    return empty;
  }

  /**
   * checkRowAndCols - returns where to save applied rule 
   * computation results
   */
  function checkRowAndCols(key, colIndex, noOfRows, noOfCols) {
    const rowIsEmpty = checkLastRow(key);
    const colIsEmpty = checkLastCol(colIndex);
    if (!rowIsEmpty && !colIsEmpty){
      return false;
    }
    return colIsEmpty ? "right" : "bottom";
  }

  /**
   * getCellPlacement - brings in helper functions together to
   * determine where to place computed data
   */
  function getCellPlacement(key, colIndex, noOfRows, noOfCols) {
    let cellPlacement;
    if (colIndex === noOfCols - 1 && key === noOfRows){
      cellPlacement = checkRowAndCols(key, colIndex, noOfRows, noOfCols);
    } else if (colIndex === noOfCols - 1) {
      cellPlacement = checkLastCol(colIndex) ? "right" : "col";
    } else if (key === noOfRows) {
      cellPlacement = checkLastRow(key) ? "bottom" : "row";
    } else {
      cellPlacement = false;
    }
    return cellPlacement;
  }	

  /**
   * pickCells - after rule has been chosen, pickCells listens for cell click
   * and determines if to go ahead with computations after the necassary 
   * conditions are met
   */
  function pickCells(ruleName, currentTable, key, colIndex, noOfRows, noOfCols) {
    let cellPlacement = getCellPlacement(key, colIndex, noOfRows, noOfCols);
    if (cellPlacement !== "right" && cellPlacement !== "bottom") {
      const option = prompt(`${cellPlacement} not empty. Do you want to add 
${cellPlacement}? type 'yes' or 'overwrite' to overwrite or 'no' to cancel`);
      if (!option || (option && option.toLowerCase() === "no") ||
          ((option.toLowerCase() !== "yes") && 
	  (option.toLowerCase() !== "overwrite"))) {
        return null;
      } else if ((option && option.toLowerCase() !== "overwrite") && 
	        (option.toLowerCase() !== "yes")) {
        setState(prevState => ({
          ...prevState,
	  tables: {
            ...prevState.tables,
	    [currentTable]: {
              ...prevState.tables[currentTable],
	      ruleMode: false,
	      currentRule: "",
	    }
	  }
	}));
      } else {
        if (cellPlacement === "row") {
          cellPlacement = "bottom";
	} else if (cellPlacement === "col") {
          cellPlacement = "right";
	} else {
          alert("rule will be applied on the last row");
          cellPlacement = "bottom";
	}
        implementRule(ruleName, currentTable, cellPlacement);
      }
    } else {
      implementRule(ruleName, currentTable, cellPlacement);
    }
  }

  function askForRange(cellPlacement, index) {
    let choiceName = cellPlacement === "right" ? "column": "row";
    let opp = cellPlacement === "right" ? "row": "column";
    const range = prompt(`you chose ${choiceName} number ${index},
please specify from what ${opp} to apply rule. you can specify a single value
or a range ex 3-7`)
    return range;
  }


  function isNumber(val) {
    if (Number(val) === 0 || Number(val)) {
      return true;
    }
    return false;
  }


  function checkStartIndex(startIndex, cellPlacement, noOfRows, noOfCols) {
    if (cellPlacement === "bottom") {
      if (Number(startIndex) >= Number(noOfRows) || Number(startIndex) < 1) {
        return false;
      }
    } else {
      if (Number(startIndex) >= Number(noOfCols) || Number(startIndex) < 1) {
        return false;
      }
    }
    return true;
  }

  function checkEndIndex(endIndex, cellPlacement, noOfRows, noOfCols) {
    if (cellPlacement === "bottom") {
      if (Number(endIndex) > Number(noOfRows) || Number(endIndex) < 1 ) {
        return false;
      }
    } else {
      if (Number(endIndex) > Number(noOfCols) || Number(endIndex) < 1) {
	return false;
      }
    }
    return true;
  }

  function parseRange(range, index, cellPlacement, noOfRows, noOfCols) {
    let list = range.split("-");
    let startIndex;
    let endIndex;
    if (list.length > 1) {
      startIndex = list[0];
      endIndex = list[1];
      if (!isNumber(startIndex) || !isNumber(endIndex)) {
        return false;
      }
      if (!checkStartIndex(startIndex, cellPlacement, noOfRows, noOfCols) ||
          !checkEndIndex(endIndex, cellPlacement, noOfRows, noOfCols)){
        return false;
      }
      return ([Number(startIndex), Number(endIndex)]);
    } else {
      startIndex = list[0];
      if (!isNumber(startIndex)) {
        return false;
      }
      if (!checkStartIndex(startIndex, cellPlacement, noOfRows, noOfCols)) {
        return false;
      }
      return ([Number(startIndex)]);
    }
  }

  function createAdvRuleReprCol(prev, args) {
    let newRule;
    if (!prev) {
      newRule = {
        colsRules: {
	  1: args,
	}
      }
    } else {
      newRule = {
	...prev,
        colsRules: {
          ...prev.colsRules,
	  [prev.colsRules ?
	     Object.keys(prev.colsRules).length + 1
	     : 1]: args,
	}
      }
    }
    return newRule;
  }

  function createAdvRuleReprRow(prev, args) {
    let newRule;
    if (!prev) {
      newRule = {
        rowsRules: {
	  1: args,
	}
      }
    } else {
      newRule = {
	...prev,
        rowsRules: {
          ...prev.rowsRules,
	  [prev.rowsRules ? 
	     Object.keys(prev.rowsRules).length + 1
	     : 1]: args
	},
      }
    }
    return newRule;
  }

  function applyRuleAdvRow(startIndex, endIndex, ruleName, currentTable, 
	  noOfRows, noOfCols, cellPlacement, saveIndex, isLastKey=false) {
   const functionName = getRuleFunctionNameAdv(ruleName, cellPlacement);
   const args = {
           "startIndex": startIndex,
	   "endIndex": endIndex,
	   "ruleName": ruleName,
	   "currentTable": currentTable,
	   "noOfRows": noOfRows,
	   "noOfCols": noOfCols,
	   "cellPlacement": cellPlacement,
	   "saveIndex": saveIndex
   };
   setState(prevState => {
     const data = prevState.tables[currentTable].data;
     const noOfRows = prevState.tables[currentTable].noOfRows;
     const noOfCols = prevState.tables[currentTable].noOfCols;
     const dataClone = {...data};
     const prevRuleAdv = prevState.tables[currentTable].prevRuleAdv;
     // call appropiate function on data
     // set data back
     return ({
       ...prevState,
       tables: {
         ...prevState.tables,
	 [currentTable]: {
           ...prevState.tables[currentTable],
	   // advancedutils returns an object of functions to apply rules
           data: advancedutils()[functionName](dataClone, noOfRows, 
		                noOfCols, startIndex, endIndex, saveIndex),
	   ruleModeAdv: false,
	   altered: true,
           currentRule: "",
	   prevRuleAdv: !isLastKey ? createAdvRuleReprRow(prevRuleAdv, args): null,
	 }
       }
     })
   })
  }

  function applyRuleAdvCol(startIndex, endIndex, ruleName, currentTable, 
	  noOfRows, noOfCols, cellPlacement, saveIndex, isLastKey=false) {
   const args = {
           "startIndex": startIndex,
	   "endIndex": endIndex,
	   "ruleName": ruleName,
	   "currentTable": currentTable,
	   "noOfRows": noOfRows,
	   "noOfCols": noOfCols,
	   "cellPlacement": cellPlacement,
	   "saveIndex": saveIndex
   };
   const functionName = getRuleFunctionNameAdv(ruleName, cellPlacement);
   setState(prevState => {
     const data = prevState.tables[currentTable].data;
     const noOfRows = prevState.tables[currentTable].noOfRows;
     const noOfCols = prevState.tables[currentTable].noOfCols;
     const dataClone = {...data};
     const prevRuleAdv = prevState.tables[currentTable].prevRuleAdv;
     // call appropiate function on data
     // set data back
     return ({
       ...prevState,
       tables: {
         ...prevState.tables,
	 [currentTable]: {
           ...prevState.tables[currentTable],
	   // advutils returns an object of functions to apply rules
           data: advancedutils()[functionName](dataClone, noOfRows, 
		              noOfCols, startIndex, endIndex, saveIndex),
	   ruleModeAdv: false,
	   altered: true,
	   currentRule: "",
	   prevRuleAdv: !isLastKey ? createAdvRuleReprCol(prevRuleAdv, args): null,
	 }
       }
     })
   })
  }
  console.log(recordState)

  function pickCellsAdv(ruleName, currentTable, key, colIndex, noOfRows, noOfCols) {
    const choice = prompt(`Where do you want to apply rule? please type 'row' or
'col' to apply rule accross this row or along this column respectively. will default 
to column if response is not one of the two`);
    let cellPlacement;
    if (!choice) {
      return;
    }
    if (choice && choice.toLowerCase() === "row") {
      cellPlacement = "bottom";
    } else {
      cellPlacement = "right";
    }
    let index = cellPlacement === "bottom" ? key : (colIndex + 1);
    const range = askForRange(cellPlacement, index);
    if (!range) {
      return;
    }
    const parsedRange = parseRange(range, index, cellPlacement, noOfRows, noOfCols); 
    if (!parsedRange) {
      return;
    }
    if (parsedRange.length > 1) {
      let startIndex = parsedRange[0];
      let endIndex = parsedRange[1];
      console.log(startIndex, endIndex)
      if (startIndex >= endIndex) {
        return;
      }
      if (cellPlacement === "bottom" ) {
        applyRuleAdvRow(startIndex, endIndex, ruleName, currentTable, 
		        Number(noOfRows), Number(noOfCols), cellPlacement, key);
      } else {
        applyRuleAdvCol(startIndex - 1, endIndex - 1, ruleName, currentTable, 
		        Number(noOfRows), Number(noOfCols), cellPlacement, colIndex);
      }
    } else {
      let startIndex = parsedRange[0];
      if (cellPlacement === "bottom" ) {
	 let endIndex = Number(key) - 1;
	 applyRuleAdvRow(startIndex, endIndex, ruleName, currentTable, 
		         Number(noOfRows), Number(noOfCols), cellPlacement, key);
      } else {
         let endIndex = Number(colIndex) - 1;
	 applyRuleAdvCol(startIndex - 1, endIndex, ruleName, currentTable, 
		         Number(noOfRows), Number(noOfCols), cellPlacement, colIndex);
      }
    }
  }

  function deleteTable(tableName) {
    setState(prevState => {
      const copy = {...prevState};
      delete copy.tables[tableName];
      copy.currentTable = "";
      return copy
    })
  }

  function changeTableName(tableName, option) {
     setState(prevState => {
      const copy = JSON.parse(JSON.stringify(prevState));
      const tableCopy = JSON.parse(JSON.stringify(copy.tables[tableName]));
      delete copy.tables[tableName];
      copy.tables[option] = {...tableCopy};
      copy.currentTable = option;
      return copy;
    })
   
  }

  function modifyTable(tableName) {
    const option = prompt(`Type 'delete' if you wish to delete the current table
or any other word(s) to rename it as such`);
    if (!option){
      return;
    }
    if (option.toLowerCase() === "delete") {
      deleteTable(tableName);
    } else {
      changeTableName(tableName, option);
    }
  }

  async function switchUser() {
    const id = prompt("enter user ID:")
    if (!id) {
      return;
    }

    if (typeof(id) !== "string" || id.length !== 36) {
      alert("No such ID in our records");
      return;
    }

    await setAltUser(getUrl, id);
  }

  return (
    <div className="container">
	  <SidePane
	    records={recordState}
	    handleTableClick={handleTableClick}
	    createTable={createTable}
	    modifyTable={modifyTable}
	    switchUser={switchUser}
	  />
	  <TableView
	    records={recordState}
	    addColumn={addColumn}
	    delColumn={delColumn}
	    addRow={addRow}
	    delRow={delRow}
	    addRule={addRule}
	    addRuleAdv={addRuleAdv}
	    updateTableView={updateTableView}
	    implementRule={implementRule}
	    afterRulePick={afterRulePick}
	    afterRulePickAdv={afterRulePickAdv}
	    pickCells={pickCells}
	    pickCellsAdv={pickCellsAdv}
	    clearRule={clearRule}
	    increaseCellSize={increaseCellSize}
	    decreaseCellSize={decreaseCellSize}
	  />
    </div>
  )
}
