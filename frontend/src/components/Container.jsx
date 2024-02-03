import React from 'react';
import SidePane from './SidePane';
import TableView from './TableView';
import advancedutils from '../advancedutils';
import * as utils from '../utils'

Object.assign(window, utils) // make all utils functions global

export default function Container() {
  /**
   * General record schema
   */

  /*
   *
   * records = {
    id: 1, // get from localStorage, or user provide or gen new uuid
    tables: {
      "table 1": {
	      data: {
	        1: [1, 2, 3, 4],
	        2: [10, 5, 2, 3]
	      },
	      noOfRows: 2,
	      noOfCols: 4,
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
	      ruleModeAdv,
      }
    },
    currentTable: "table 1",
    rowsAndColsNoSet: false,
    archiveTablesNames: [],
  }

  */

  let [recordState, setRecordsState] = React.useState({});

  // setup initial load and use as condition to fetch data from backend
  let [init, setInit] = React.useState({ loaded: false, saved: false });

  let flexId = localStorage.getItem('flexId');

  if (!flexId) {
    attemptToGetFlexId(setRecordsState)
  }

  getRecords(init, flexId, {setRecordsState, setInit});

  /**
   * TODO: set and unset recordState.changed so as to reduce backend calls
   */
  setTimeout(save, 1000, recordState, init);

  function setRecordsStateWrapper(prevState, pathToPropToChange, value) {
    changeValueInNestedObj(prevState, pathToPropToChange, value)
    setRecordsState({...prevState})
  }

  window.setRecordsStateWrapper = setRecordsStateWrapper

  function setDeleteMode(tableName) {
    alert('click on the cell you want to delete its row or column')
    setRecordsState((prevState) => (
      {
	      ...prevState,
	      altered: true,
	      tables: {
          ...prevState.tables,
          [tableName]: {
            ...prevState.tables[tableName],
            deleteMode: true,
          },
	      },
      }));
  }

  function setInsertMode(tableName) {
    alert('click on the cell you want to insert row or column around')
    setRecordsState((prevState) => (
      {
	      ...prevState,
	      altered: true,
	      tables: {
          ...prevState.tables,
          [tableName]: {
            ...prevState.tables[tableName],
            insertMode: true,
          },
	      },
      }));
  }

  function unSetInsertMode(tableName) {
    setRecordsState((prevState) => (
      {
	      ...prevState,
	      altered: true,
	      tables: {
          ...prevState.tables,
          [tableName]: {
            ...prevState.tables[tableName],
            insertMode: false,
          },
	      },
      }));
  }

  function unSetDeleteMode(tableName) {
    setRecordsState((prevState) => (
      {
	      ...prevState,
	      altered: true,
	      tables: {
          ...prevState.tables,
          [tableName]: {
            ...prevState.tables[tableName],
            deleteMode: false,
          },
	      },
      }));
  }

  function addRule(tableName) {
    setRecordsState((prevState) => (
      {
	      ...prevState,
	      altered: true,
	      tables: {
          ...prevState.tables,
          [tableName]: {
            ...prevState.tables[tableName],
            ruleMode: true,
            ruleModeAdv: false,
          },
	      },
      }));
  }

  function addRuleAdv(tableName) {
    setRecordsState((prevState) => (
      {
	      ...prevState,
	      altered: true,
	      tables: {
          ...prevState.tables,
          [tableName]: {
		  ...prevState.tables[tableName],
		  ruleModeAdv: true,
		  ruleMode: false,
          },
	      },
      }));
  }

  function increaseCellSize(tableName) {
    setRecordsState((prevState) => {
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
            },
	      },
        }
      );
    });
  }

  function decreaseCellSize(tableName) {
    setRecordsState((prevState) => {
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
          },
	      },
      });
    });
  }

  /**
   * unsets rules for the current table
   */
  function clearRule(tableName) {
    setRecordsState((prevState) => (
      {
	      ...prevState,
	      altered: true,
	      tables: {
          ...prevState.tables,
          [tableName]: {
		  ...prevState.tables[tableName],
		  ruleMode: false,
	          ruleModeAdv: false,
		  prevRule: '',
		  cellPlacement: '',
		  currentRule: '',
		  prevRuleAdv: null,
	          advAppMode: false,
          },
	      },
      }));
  }

  function replaceAtIndex(array, index, value) {
    array[index] = value;
    return array;
  }

  function setDataField(data, tableName) {
    setRecordsState((prevState) => (
      {
        ...prevState,
	        tables: {
          ...prevState.tables,
	        [tableName]: {
            ...prevState.tables[tableName],
	          data: data,
            noOfRows: Object.keys(data).length,
            noOfCols: data[1] ? data[1].length : 0
	        },
	      },
      }
    )); 
  }
  /**
   * updateTableView - handles text changes in cells
   */
  function updateTableView(tableName, rowIndex, colIndex, value, SN) {
    // SN is serial number, used as key in storing rows in
	  // records.tables.tableName.data
    setRecordsState((prevState) => (
      {
        ...prevState,
	        tables: {
          ...prevState.tables,
	        [tableName]: {
            ...prevState.tables[tableName],
	            data: {
              ...prevState.tables[tableName].data,
		            [SN]: replaceAtIndex(
                [...prevState.tables[tableName].data[SN]],
			             colIndex,
                value,
              ),
	      },
	    },
	  },
      }
    ));
    applyRuleOnModification(recordState);
  }

  /**
   * afterRulePick - handles event after user chooses a rule to apply.
   * sets the currentTable to ruleMode which signals for rule
   * application
   */
  function afterRulePick(ruleName, currentTable) {
    alert('click on the row or column you want to apply rule');
    setRecordsState((prevState) => ({
	 ...prevState,
      tables: {
        ...prevState.tables,
	    [currentTable]: {
          ...prevState.tables[currentTable],
          ruleMode: true,
          currentRule: ruleName,
	    },
      },
    }));
  }

  /**
   * afterRulePickAdv - handles event after user chooses an advanced rule to apply.
   * sets the currentTable to ruleModeAdv which signals for rule
   * application
   */
  function afterRulePickAdv(ruleName, currentTable) {
    alert('click on the row or column you want to apply rule');
    setRecordsState((prevState) => ({
	 ...prevState,
      tables: {
        ...prevState.tables,
	    [currentTable]: {
          ...prevState.tables[currentTable],
          ruleModeAdv: true,
          currentRule: ruleName,
	    },
      },
    }));
  }

  function getCurrentTable() {
    const { currentTable } = recordState;
    const table = recordState.tables[currentTable];
    return table;
  }

  /**
   * checkLastCol - checks if column at at the right edge is
   * empty to permit saving of data
   */
  function checkLastCol(colIndex) {
    const table = getCurrentTable();
    const { data } = table;
    const empty = true;
    for (const key in data) {
      if (data[key][colIndex]) {
        return false;
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
    const { data } = table;
    const row = data[key];
    const empty = true;
    for (let index = 0; index < row.length; index++) {
      if (row[index]) {
        return false;
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
    if (!rowIsEmpty && !colIsEmpty) {
      return false;
    }
    return colIsEmpty ? 'right' : 'bottom';
  }

  /**
   * getCellPlacement - brings in helper functions together to
   * determine where to place computed data
   */
  function getCellPlacement(key, colIndex, noOfRows, noOfCols) {
    let cellPlacement;
    if (colIndex === noOfCols - 1 && key === noOfRows) {
      cellPlacement = checkRowAndCols(key, colIndex, noOfRows, noOfCols);
    } else if (colIndex === noOfCols - 1) {
      cellPlacement = checkLastCol(colIndex) ? 'right' : 'column';
    } else if (key === noOfRows) {
      cellPlacement = checkLastRow(key) ? 'bottom' : 'row';
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
    if (cellPlacement !== 'right' && cellPlacement !== 'bottom') {
      if (!cellPlacement) {
        return alert('basic rule can only be applied on last row or column. '
      + 'and it must not be the last cell of the table as it is ambiguous where you want to'
      + 'apply rule');
      }
      const option = prompt(`${cellPlacement} not empty. Do you want to overwrite values in  
${cellPlacement}? type 'yes' or 'overwrite' to overwrite or 'no' to cancel`);
      if (!option || (option && option.toLowerCase() === 'no')
          || ((option.toLowerCase() !== 'yes')
	  && (option.toLowerCase() !== 'overwrite'))) {
        return null;
      } if ((option && option.toLowerCase() !== 'overwrite')
	        && (option.toLowerCase() !== 'yes')) {
        setRecordsState((prevState) => ({
          ...prevState,
          tables: {
            ...prevState.tables,
            [currentTable]: {
              ...prevState.tables[currentTable],
              ruleMode: false,
              currentRule: '',
            },
          },
        }));
      } else {
        if (cellPlacement === 'row') {
          cellPlacement = 'bottom';
        } else if (cellPlacement === 'column') {
          cellPlacement = 'right';
        } else {
          alert('rule will be applied on the last row');
          cellPlacement = 'bottom';
        }
        implementRule(ruleName, recordState, currentTable, cellPlacement);
      }
    } else {
      implementRule(ruleName, recordState, currentTable, cellPlacement);
    }
  }

  function askForRange(cellPlacement, index) {
    const choiceName = cellPlacement === 'right' ? 'column' : 'row';
    // let opp = cellPlacement === "right" ? "row": "column";
    const range = prompt(`you chose ${choiceName} number ${index},
please specify from what ${choiceName} to apply rule. you can specify a single value
or a range ex 3-7`);
    return range;
  }

  function isNumber(val) {
    if (Number(val) === 0 || Number(val)) {
      return true;
    }
    return false;
  }

  function checkStartIndex(startIndex, cellPlacement, noOfRows, noOfCols) {
    if (cellPlacement === 'bottom') {
      if (Number(startIndex) >= Number(noOfRows) || Number(startIndex) < 1) {
        return false;
      }
    } else if (Number(startIndex) >= Number(noOfCols) || Number(startIndex) < 1) {
      return false;
    }
    return true;
  }

  function checkEndIndex(endIndex, cellPlacement, noOfRows, noOfCols) {
    if (cellPlacement === 'bottom') {
      if (Number(endIndex) > Number(noOfRows) || Number(endIndex) < 1) {
        return false;
      }
    } else if (Number(endIndex) > Number(noOfCols) || Number(endIndex) < 1) {
      return false;
    }
    return true;
  }

  function parseRange(range, index, cellPlacement, noOfRows, noOfCols) {
    const list = range.split('-');
    let startIndex;
    let endIndex;
    if (list.length > 1) {
      startIndex = list[0];
      endIndex = list[1];
      if (!isNumber(startIndex) || !isNumber(endIndex)) {
        return false;
      }
      if (!checkStartIndex(startIndex, cellPlacement, noOfRows, noOfCols)
          || !checkEndIndex(endIndex, cellPlacement, noOfRows, noOfCols)) {
        return false;
      }
      return ([Number(startIndex), Number(endIndex)]);
    }
    startIndex = list[0];
    if (!isNumber(startIndex)) {
      return false;
    }
    if (!checkStartIndex(startIndex, cellPlacement, noOfRows, noOfCols)) {
      return false;
    }
    return ([Number(startIndex)]);
  }

  function createAdvRuleReprCol(prev, args, advAppMode) {
    let newRule;
    if (advAppMode) {
      return prev;
    }
    if (!prev) {
      newRule = {
        colsRules: {
	  1: args,
        },
      };
    } else {
      newRule = {
        ...prev,
        colsRules: {
          ...prev.colsRules,
	  [prev.colsRules
	     ? Object.keys(prev.colsRules).length + 1
	     : 1]: args,
        },
      };
    }
    return newRule;
  }

  function createAdvRuleReprRow(prev, args, advAppMode) {
    let newRule;
    if (advAppMode) {
      return prev;
    }
    if (!prev) {
      newRule = {
        rowsRules: {
	  1: args,
        },
      };
    } else {
      newRule = {
        ...prev,
        rowsRules: {
          ...prev.rowsRules,
	  [prev.rowsRules
	     ? Object.keys(prev.rowsRules).length + 1
	     : 1]: args,
        },
      };
    }
    return newRule;
  }

  function applyRuleAdvRow(
    startIndex,
    endIndex,
    ruleName,
    currentTable,
	  noOfRows,
    noOfCols,
    cellPlacement,
    saveIndex,
    advAppMode = false,
  ) {
    const functionName = getRuleFunctionNameAdv(ruleName, cellPlacement);
    const args = {
      startIndex,
	   endIndex,
	   ruleName,
	   currentTable,
	   noOfRows,
	   noOfCols,
	   cellPlacement,
	   saveIndex,
    };
    setRecordsState((prevState) => {
      const { data } = prevState.tables[currentTable];
      const { noOfRows } = prevState.tables[currentTable];
      const { noOfCols } = prevState.tables[currentTable];
      const dataClone = { ...data };
      const { prevRuleAdv } = prevState.tables[currentTable];
      // call appropiate function on data
      // set data back
      return ({
        ...prevState,
        tables: {
          ...prevState.tables,
	 [currentTable]: {
            ...prevState.tables[currentTable],
	   // advancedutils returns an object of functions to apply rules
            data: advancedutils()[functionName](
              dataClone,
              noOfRows,
		                noOfCols,
              startIndex,
              endIndex,
              saveIndex,
            ),
	   ruleModeAdv: false,
	   altered: true,
            currentRule: '',
            // isLastKey is of importance during applying adv rule after cell update
	   prevRuleAdv: createAdvRuleReprRow(prevRuleAdv, args, advAppMode),
	 },
        },
      });
    });
  }

  function applyRuleAdvCol(
    startIndex,
    endIndex,
    ruleName,
    currentTable,
	  noOfRows,
    noOfCols,
    cellPlacement,
    saveIndex,
    advAppMode = false,
  ) {
    const args = {
      startIndex,
	   endIndex,
	   ruleName,
	   currentTable,
	   noOfRows,
	   noOfCols,
	   cellPlacement,
	   saveIndex,
    };
    const functionName = getRuleFunctionNameAdv(ruleName, cellPlacement);
    setRecordsState((prevState) => {
      const { data } = prevState.tables[currentTable];
      const { noOfRows } = prevState.tables[currentTable];
      const { noOfCols } = prevState.tables[currentTable];
      const dataClone = { ...data };
      const { prevRuleAdv } = prevState.tables[currentTable];
      // call appropiate function on data
      // set data back
      return ({
        ...prevState,
        tables: {
          ...prevState.tables,
	 [currentTable]: {
            ...prevState.tables[currentTable],
	   // advutils returns an object of functions to apply rules
            data: advancedutils()[functionName](
              dataClone,
              noOfRows,
		              noOfCols,
              startIndex,
              endIndex,
              saveIndex,
            ),
	   ruleModeAdv: false,
	   altered: true,
	   currentRule: '',
	   // isLastKey is of importance during applying adv rule after cell update
	   prevRuleAdv: createAdvRuleReprCol(prevRuleAdv, args, advAppMode),
	 },
        },
      });
    });
  }

  function getChoiceForPickCellsAdv() {
    const choice = prompt(`Where do you want to apply rule? please type 'row' or
'col' to apply rule accross the clicked row or across the clicked column respectively.
`);
    if (!choice) {
      alert('aborting, no choice made');
      return null;
    }
    if (choice.toLowerCase() !== 'col' && choice.toLowerCase() !== 'row') {
      return getChoiceForPickCellsAdv();
    }
    return choice.toLowerCase();
  }

  function handleDelete(tableName, noOfRows, noOfCols, row, colIndex) {
    const validRowOrCol = ['row', 'col']
    let shouldRetainRules
    let rowOrCOl = prompt(`type 'row' or 'col' to delete an entire row or column`)
    if (!rowOrCOl) return unSetDeleteMode(tableName)
    rowOrCOl = rowOrCOl ? rowOrCOl.toLowerCase() : ""
    if (!validRowOrCol.includes(rowOrCOl)) {
      alert('ivalid option')
      return handleDelete(tableName, noOfRows, noOfCols, row, colIndex)
    }
    if (checkIfRulesSet(tableName)) {
      shouldRetainRules = prompt(`it is advised to clear existing rules to prevent
quirky behavior, to keep rules type 'yes'`)
    }
    if (!shouldRetainRules || shouldRetainRules.toLowerCase() !== 'yes') {
      clearRule(tableName)
    }
    if (rowOrCOl === 'row') {
      deleteEntireRow(tableName, row)
    } else {
      deleteEntireCol(tableName, colIndex)
    }
    unSetDeleteMode(tableName)
  }

  function deleteEntireCol(tableName, colIndex) {
    const data = getData(tableName)
    if (colIndex < 0) return
    for (let row in data) {
      const currRow = data[row]
      const len = currRow.length
      for(let i = colIndex; i < len; i++) {
        if (i < len - 1) currRow[i] = currRow[i + 1]
        if (i === len - 1) currRow.length = len - 1
      }
    }
    setDataField(data, tableName)
  }

  function deleteEntireRow(tableName, row) {
    if (row < 1) return
    const data = getData(tableName)
    const keys = Object.keys(data)
    const index = keys.indexOf(`${row}`)
    const len = keys.length
    let saveNext = null
    if (row > len || index === -1) return
    for (let i = index; i < len - 1; i++) {
      saveNext = data[keys[i + 1]]
      data[keys[i + 1]] = data[keys[i]]
      data[keys[i]] = saveNext
    }
    delete(data[keys[len - 1]])
    setDataField(data, tableName)
  }

  function handleInsert(tableName, noOfRows, noOfCols, row, colIndex) {
    const validRowOrCol = ['row', 'col']
    const validSides = ['t', 'b', 'r', 'l']
    const funcMap = {
      t: insertRowAbove,
      b: insertRowBelow,
      r: insertColRight,
      l: insertColLeft
    }
    let side
    let rowOrCOl = prompt(`type 'row' or 'col' to insert a new row or column`)
    if (!rowOrCOl) return unSetInsertMode(tableName)
    rowOrCOl = rowOrCOl ? rowOrCOl.toLowerCase() : ""
    if (!validRowOrCol.includes(rowOrCOl)) {
      alert('ivalid option')
      return handleInsert(tableName, noOfRows, noOfCols, row, colIndex)
    }
    if (rowOrCOl === 'row') {
      side = prompt(`type 't' (top) to insert above current row or 'b' (below) to insert below`)
      side = side ? side.toLowerCase()[0] : ""
    } else {
      side = prompt(`type 'r' (right) to insert to the right side of current column 
or 'l' (left) to insert to the right`)
      side = side ? side.toLowerCase()[0] : ""
    }
    if (!side) return unSetInsertMode(tableName)
    if (!validSides.includes(side)) {
      alert('invalid side entered')
      return handleInsert(tableName, noOfRows, noOfCols, row, colIndex)
    }
    const data = funcMap[side](tableName, noOfRows, noOfCols, row, colIndex)
    if (!data) return unSetInsertMode(tableName)
    let shouldRetainRules
    if (checkIfRulesSet(tableName)) {
      shouldRetainRules = prompt(`it is advised to clear existing rules to prevent
quirky behavior, to keep rules type 'yes'`)
    }
    if (!shouldRetainRules || shouldRetainRules.toLowerCase() !== 'yes') {
      clearRule(tableName)
    }
    setDataField(data, tableName)
    unSetInsertMode(tableName)
  }

  function checkIfRulesSet(tableName) {
    const table = recordState.tables[tableName]
    if (!table) return false
    if (table.prevRule) return true
    if (table.prevRuleAdv) {
      if (table.prevRuleAdv.rowsRules && Object.keys(table.prevRuleAdv.rowsRules).length) return true
      if (table.prevRuleAdv.colsRules && Object.keys(table.prevRuleAdv.colsRules).length) return true
    }
    return false
  }

  function getData(tableName) {
    const table = recordState.tables[tableName]
    const data = table.data
    return data
  }

  function insertRowAbove(tableName, noOfRows, noOfCols, row, colIndex) {
    const data = getData(tableName)
    return insertRowAboveImpl(row, data)
  }

  function insertRowBelow(tableName, noOfRows, noOfCols, row, colIndex) {
    const data = getData(tableName)
    return insertRowBelowImpl(row, data)
  }

  function insertColRight(tableName, noOfRows, noOfCols, row, colIndex) {
    const data = getData(tableName)
    return insertColRightImpl(colIndex, data)
  }

  function insertColLeft(tableName, noOfRows, noOfCols, row, colIndex) {
    const data = getData(tableName)
    return insertColLeftImpl(colIndex, data)
  }

  function insertColRightImpl(partition, data) {
    if (partition < 0) return
    for (const row in data) {
      const currRow = data[row]
      const len = currRow.length
      for(let i = len; i > partition; i--) {
        currRow[i] = currRow[i - 1]
        if (i === partition + 1) currRow[i] = ''
      }
    }
    return data
  }
  
  function insertColLeftImpl(partition, data) {
    if (partition < 0) return
    for (const row in data) {
      const currRow = data[row]
      const len = currRow.length
      for(let i = len; i > partition - 1; i--) {
        currRow[i] = currRow[i - 1]
        if (i === partition) currRow[i] = ''
      }
    }
    return data
  }
  
  function insertRowBelowImpl(partition, data) {
    if (partition < 1) return
    const keys = Object.keys(data).slice(partition - 1)
    const max = Number(keys[keys.length - 1])
    for(let i = max + 1; i > partition; i--) {
      data[i] = data[i - 1]
      if (i === partition + 1) data[i] = new Array(data[1].length)
    }
    return data
  }
  
  function insertRowAboveImpl(partition, data) {
    if (partition < 1) return
    const keys = Object.keys(data).slice(partition - 1)
    const max = Number(keys[keys.length - 1])
    const len = data[1].length
    for(let i = max + 1; i >= partition; i--) {
      data[i] = data[i - 1]
      if (i === partition) data[i] = new Array(len)
    }
    return data
  }

  function pickCellsAdv(ruleName, currentTable, key, colIndex, noOfRows, noOfCols) {
    const choice = getChoiceForPickCellsAdv();
    let cellPlacement;
    if (!choice) {
      return;
    }
    if (choice && choice.toLowerCase() === 'row') {
      cellPlacement = 'bottom';
    } else {
      cellPlacement = 'right';
    }
    const index = cellPlacement === 'bottom' ? key : (colIndex + 1);
    const range = askForRange(cellPlacement, index);
    if (!range) {
      return;
    }
    const parsedRange = parseRange(range, index, cellPlacement, noOfRows, noOfCols);
    if (!parsedRange) {
      return;
    }
    if (parsedRange.length > 1) {
      const startIndex = parsedRange[0];
      const endIndex = parsedRange[1];
      if (startIndex >= endIndex) {
        return;
      }
      if (cellPlacement === 'bottom') {
        applyRuleAdvRow(
          startIndex,
          endIndex,
          ruleName,
          currentTable,
		        Number(noOfRows),
          Number(noOfCols),
          cellPlacement,
          key,
        );
      } else {
        applyRuleAdvCol(
          startIndex - 1,
          endIndex - 1,
          ruleName,
          currentTable,
		        Number(noOfRows),
          Number(noOfCols),
          cellPlacement,
          colIndex,
        );
      }
    } else {
      const startIndex = parsedRange[0];
      if (cellPlacement === 'bottom') {
	 const endIndex = Number(key) - 1;
	 applyRuleAdvRow(
          startIndex,
          endIndex,
          ruleName,
          currentTable,
		         Number(noOfRows),
          Number(noOfCols),
          cellPlacement,
          key,
        );
      } else {
        const endIndex = Number(colIndex) - 1;
	 applyRuleAdvCol(
          startIndex - 1,
          endIndex,
          ruleName,
          currentTable,
		         Number(noOfRows),
          Number(noOfCols),
          cellPlacement,
          colIndex,
        );
      }
    }
  }

  function deleteTable(tableName) {
    setRecordsState((prevState) => {
      const copy = { ...prevState };
      delete copy.tables[tableName];
      copy.currentTable = '';
      return copy;
    });
  }

  function changeTableName(tableName, option) {
    setRecordsState((prevState) => {
      const copy = JSON.parse(JSON.stringify(prevState));
      const tableCopy = JSON.parse(JSON.stringify(copy.tables[tableName]));
      delete copy.tables[tableName];
      copy.tables[option] = { ...tableCopy };
      copy.currentTable = option;
      return copy;
    });
  }

  function modifyTable(tableName) {
    const option = prompt(`Type 'delete' if you wish to delete the current table
or any other word(s) to rename it as such`);
    if (!option) {
      return;
    }
    if (option.toLowerCase() === 'delete') {
      deleteTable(tableName);
    } else {
      changeTableName(tableName, option);
    }
  }

  async function switchUser() {
    const id = promptForId()
    if (!id) return
    await setAltUser(getUrl, id, setRecordsState);
  }

  return (
    <div className="container">
      <SidePane
        records={recordState}
        setRecordsStateWrapper={setRecordsStateWrapper}
        changeValueInNestedObj={utils.changeValueInNestedObj}
        modifyTable={modifyTable}
        switchUser={switchUser}
      />
      <TableView
        records={recordState}
        setRecordsStateWrapper={setRecordsStateWrapper}
        changeValueInNestedObj={utils.changeValueInNestedObj}
        addRule={addRule}
        addRuleAdv={addRuleAdv}
        updateTableView={updateTableView}
        afterRulePick={afterRulePick}
        afterRulePickAdv={afterRulePickAdv}
        pickCells={pickCells}
        pickCellsAdv={pickCellsAdv}
        clearRule={clearRule}
        increaseCellSize={increaseCellSize}
        decreaseCellSize={decreaseCellSize}
        setInsertMode={setInsertMode}
        unSetInsertMode={unSetInsertMode}
        handleInsert={handleInsert}
        setDeleteMode={setDeleteMode}
        unSetDeleteMode={unSetDeleteMode}
        handleDelete={handleDelete}
      />
    </div>
  );
}
