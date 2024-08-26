import uuid from "react-uuid";
import utilities from "./utilities";
import advancedutils from "./advancedutils";

export const postUrl = "http://localhost:3001/records";
export const putUrl = "http://localhost:3001/records";
export const getUrl = "http://localhost:3001/records/";

export async function getAltUser(url, id, setRecordsState) {
  let resp = null;
  resp = await fetch(url + id)
    .then((data) => data.json())
    .then((data) => {
      return data;
    });
  if (resp && Object.keys(resp).length) {
    localStorage.setItem("flexId", id);
    setRecordsState(resp);
  } else {
    let id = prompt(
      "User not found, enter correct ID or skip, we will generate one for you",
    );
    if (id) {
      return await getAltUser(url, id, setRecordsState);
    }
    id = uuid();
    localStorage.setItem("flexId", id);
    alert(`here is your ID '${id}'. you may store it somewhere in case 
    you want to access  your records from a different device`);
  }
}

export async function getAltUserInventory(url, id, setRecordsState) {
  let resp = null;
  resp = await fetch(url + id)
    .then((data) => data.json())
    .then((data) => {
      return data;
    });
  if (resp && Object.keys(resp).length) {
    flexId = id
    setRecordsState(resp);
  } else {
    alert(
      "User not found, reload the page or get a correct link",
    )
  }
}

export function attemptToGetFlexId(setRecordsState) {
  const newFlexId = uuid();
  const id = prompt(`Could not get your ID from localStorage, please enter
    your ID if you have one or skip. We will generate a new ID for you`);
  if (id) {
    localStorage.setItem("flexId", id);
    getAltUser(getUrl, id, setRecordsState);
  } else {
    localStorage.setItem("flexId", newFlexId);
    alert(`here is your ID '${newFlexId}'. you may store it somewhere in case 
    you want to access  your records from a different device`);
  }
}

export function attemptToGetFlexIdFrInventory(setRecordsState) {
  const queryString = window.location.search;
  const id = queryString.split('&').find(param => param.startsWith('flexId=')).split('=')[1];
  if (id) {
    getAltUserInventory(getUrl, id, setRecordsState);
    return id
  } else {
    alert(`flexId not in link, get a correct link and reload the page`);
  }
}

export function getRecords(init, flexId, setRecordsState, setInit) {
  if (init.loaded) {
    return;
  }

  getFromBackend(getUrl, flexId, setRecordsState, setInit);
  return {
    id: flexId,
    tables: {},
    altered: false,
    currentTable: "",
    rowsAndColsNoSet: false,
    archiveTablesNames: [],
  };
}

export async function getFromBackend(url, id, setRecordsState, setInit) {
  let resp = null;
  await fetch(url + id)
    .then((data) => data.json())
    .then((data) => {
      resp = data;
    });
  if (Object.keys(resp).length) {
    setRecordsState(resp);
  }
  setInit({ loaded: true, saved: false }); // set init the first time of load
}

export async function setAltUser(url, id, setRecordsState) {
  let resp = null;
  await fetch(url + id)
    .then((data) => data.json())
    .then((data) => {
      resp = data;
    });
  if (Object.keys(resp).length) {
    setRecordsState(resp);
    localStorage.setItem("flexId", id);
  } else {
    alert("User not found");
  }
}

export function promptForId() {
  const id = prompt("enter user ID:");
  if (!id) {
    return;
  }

  if (typeof id !== "string" || id.length !== 36) {
    alert("No such ID in our records");
    return;
  }
  return id;
}

export async function save(record, init) {
  if (!init.loaded) {
    return;
  }

  const tableName = record.currentTable;

  if (!tableName) {
    // may have been deleted
    return;
  }

  const tableData = record.tables[tableName];

  const payload = {
    tableName,
    tableData,
    id: record.id,
  };

  const json = JSON.stringify(payload);

  await fetch(putUrl, {
    method: "PUT",
    body: json,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function persist(record) {
  const json = JSON.stringify(record);
  fetch(postUrl, {
    method: "POST",
    body: json,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function deleteTableAtBackend() {
  const tableName = recordState.currentTable;

  if (!tableName) {
    return;
  }

  const payload = {
    tableName,
    id: recordState.id,
  };

  const json = JSON.stringify(payload);

  await fetch(putUrl, {
    method: "DELETE",
    body: json,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function newData(noOfRows, noOfCols) {
  const rows = noOfRows;
  const cols = noOfCols;
  const data = {};
  for (let row = 1; row <= rows; row++) {
    data[row] = createArray(cols); // new Array(cols);
  }
  return data;
}

export function createArray(size) {
  const myArray = [];
  for (let index = 0; index < size; index++) {
    myArray.push("");
  }
  return myArray;
}

export function newTable(noOfRows, noOfCols) {
  const table = {
    data: newData(noOfRows, noOfCols),
    noOfRows,
    noOfCols,
    ruleMode: false,
    currentRule: "",
    altered: true,
  };
  return table;
}

/**
 *
 * @param {*} obj
 * @param {"dot separated path to property of obj to change eg
 *          obj={a: {b: 1}}, path can be `a.b`"} path
 * @param {*} value
 * @returns
 */
export function changeValueInNestedObj(obj, path, value) {
  let propsList = path.split(".");
  let propsLen = propsList.length;

  if (propsLen === 1) {
    obj[path] = value;
    return;
  }

  let tmp = null;
  for (const prop of propsList.slice(0, propsLen - 1)) {
    if (tmp === null) tmp = obj[prop];
    else tmp = tmp[prop];
  }
  tmp ? (tmp[propsList[propsLen - 1]] = value) : tmp;
}

export function validateParamsWhenCreatingTable(name, noOfRows, noOfCols) {
  let error = false;
  if (!noOfRows || noOfRows < 1) {
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

export function checkTableLimits(noOfRows, noOfCols) {
  const totalCells = noOfRows * noOfCols;
  if (totalCells > 10000) {
    const resp =
      prompt(`You are trying to create ${totalCells} number of cells, 
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

export function removeCol(data, noOfCols) {
  const copy = { ...data };
  for (const key in copy) {
    const arr = [];
    for (let index = 0; index < noOfCols - 1; index++) {
      arr[index] = copy[key][index];
    }
    copy[key] = arr;
  }
  return copy;
}

export function appendCol(data, noOfCols) {
  for (const key in data) {
    const row = data[key];
    row.push("");
  }
}

/**
 *
 * @param type e.g div, span, p etc
 * @param opts obj with props {id: string, class: string}
 * @returns
 */
export function createEl(type, opts = {}) {
  const el = document.createElement(type);
  if (opts.id) el.id = opts.id;
  if (opts.class) el.classList.add(...opts.class.split(" "));
  return el;
}

/**
 * applyRuleOnModification - reapplies the previously set rule on
 * new columns or rows created
 *
 * currentState -> currentState of records object
 */
export function applyRuleOnModification(recordState) {
  try {
    /* apply advanced here */
    if (recordState.tables[recordState.currentTable].prevRuleAdv) {
      applyAdvancedRulesOnModification(recordState);
    }
    if (recordState.tables[recordState.currentTable].prevRule) {
      const { currentTable } = recordState;
      const ruleName = recordState.tables[currentTable].prevRule;
      const { cellPlacement } = recordState.tables[currentTable];
      implementRule(ruleName, recordState, currentTable, cellPlacement);
    }
  } catch (e) {
    alert(`could not apply rule. please clear rule and reapply it`);
  }
}

/**
 * applyAdvancedRulesOnModification - runs everytime a cell is changed
 * to reapply advanced rule
 */
export function applyAdvancedRulesOnModification(recordState) {
  if (!recordState.tables[recordState.currentTable].prevRuleAdv) {
    return;
  }
  const { prevRuleAdv } = recordState.tables[recordState.currentTable];
  const advAppMode = true; /**
   * flag to check if in advanced rule application phase
   * during table change.. So as not to create new
   * prevRuleAdv objects else will result in so many objects
   * created, which will slow and crash program since
   * new nonesense advRule objects will be attached to table
   * and program will try to apply them
   */

  for (const key in prevRuleAdv.rowsRules) {
    // apply rows rules
    const {
      startIndex,
      endIndex,
      ruleName,
      currentTable,
      noOfRows,
      noOfCols,
      cellPlacement,
      saveIndex,
    } = prevRuleAdv.rowsRules[key];

    applyRuleAdvRow(
      startIndex,
      endIndex,
      ruleName,
      currentTable,
      noOfRows,
      noOfCols,
      cellPlacement,
      saveIndex,
      recordState,
      advAppMode,
    );
  }

  for (const key in prevRuleAdv.colsRules) {
    // apply cols rules
    const {
      startIndex,
      endIndex,
      ruleName,
      currentTable,
      noOfRows,
      noOfCols,
      cellPlacement,
      saveIndex,
    } = prevRuleAdv.colsRules[key];

    applyRuleAdvCol(
      startIndex,
      endIndex,
      ruleName,
      currentTable,
      noOfRows,
      noOfCols,
      cellPlacement,
      saveIndex,
      recordState,
      advAppMode,
    );
  }
}

// cellPlacement determines where to apply rule
export function getRuleFunctionNameAdv(ruleName, cellPlacement) {
  const ruleNameMapRight = {
    sum: "sumHorizontalAdv",
    subtractReverse: "subHorizontalRightAdv",
    subtract: "subHorizontalLeftAdv",
    multiply: "mulHorizontalAdv",
    average: "avgHorizontalAdv",
  };

  const ruleNameMapBottom = {
    sum: "sumVerticalAdv",
    subtract: "subVerticalTopAdv",
    subtractReverse: "subVerticalBottomAdv",
    multiply: "mulVerticalAdv",
    average: "avgVerticalAdv",
  };

  if (cellPlacement === "bottom") {
    return ruleNameMapBottom[ruleName];
  }
  return ruleNameMapRight[ruleName];
}

// cellPlacement determines where to apply rule
export function getRuleFunctionName(ruleName, cellPlacement) {
  const ruleNameMapRight = {
    sum: "sumHorizontal",
    subtractReverse: "subHorizontalRight",
    subtract: "subHorizontalLeft",
    multiply: "mulHorizontal",
    average: "avgHorizontal",
  };

  const ruleNameMapBottom = {
    sum: "sumVertical",
    subtract: "subVerticalTop",
    subtractReverse: "subVerticalBottom",
    multiply: "mulVertical",
    average: "avgVertical",
  };

  if (cellPlacement === "bottom") {
    return ruleNameMapBottom[ruleName];
  }
  return ruleNameMapRight[ruleName];
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
export function implementRule(
  ruleName,
  recordState,
  currentTable,
  cellPlacement,
) {
  const { data } = recordState.tables[currentTable];
  const { noOfRows } = recordState.tables[currentTable];
  const { noOfCols } = recordState.tables[currentTable];

  recordState.tables[currentTable].ruleMode = false;
  recordState.tables[currentTable].altered = true;
  recordState.tables[currentTable].prevRule = ruleName;
  recordState.tables[currentTable].cellPlacement = cellPlacement;
  recordState.tables[currentTable].currentRule = "";

  /* gets the function name to apply as rule */
  const functionName = getRuleFunctionName(ruleName, cellPlacement);

  setRecordsStateWrapper(
    recordState,
    `tables.${currentTable}.data`,
    utilities()[functionName](data, noOfRows, noOfCols),
  );
}

export function setDataField(recordState, data, tableName) {
  const noOfRows = Object.keys(data).length;
  const noOfCols = data[1] ? data[1].length : 0;
  recordState.tables[tableName].noOfCols = noOfCols;
  recordState.tables[tableName].noOfRows = noOfRows;
  setRecordsStateWrapper(recordState, `tables.${tableName}.data`, data);
}

/**
 * unsets rules for the current table
 */
export function clearRule(tableName, recordState) {
  recordState.altered = true;
  recordState.tables[tableName].ruleMode = false;
  recordState.tables[tableName].ruleModeAdv = null;
  recordState.tables[tableName].prevRule = "";
  recordState.tables[tableName].prevRuleAdv = null;
  recordState.tables[tableName].cellPlacement = "";
  recordState.tables[tableName].currentRule = "";
  recordState.tables[tableName].advAppMode = false;
  recordState.tables[tableName].colorRowsAndCols = null;
  recordState.tables[tableName].selectedCells = null;
  recordState.tables[tableName].registeredFunctions = [];
  setRecordsStateWrapper(recordState, `tables.${tableName}.ruleMode`, false);
}

/**
 * unsets rules for the current table
 */
export function clearSelectedCells(tableName, recordState) {
  recordState.altered = true;
  recordState.tables[tableName].colorRowsAndCols = null;
  recordState.tables[tableName].selectedCells = null;
  setRecordsStateWrapper(recordState, `tables.${tableName}.ruleMode`, false);
}

export function replaceAtIndex(array, index, value) {
  array[index] = value;
  return array;
}

/**
 * getCellPlacement - brings in helper functions together to
 * determine where to place computed data
 */
export function getCellPlacement(
  key,
  colIndex,
  noOfRows,
  noOfCols,
  recordState,
) {
  let cellPlacement;
  if (colIndex === noOfCols - 1 && key === noOfRows) {
    cellPlacement = checkRowAndCols(key, colIndex, recordState);
  } else if (colIndex === noOfCols - 1) {
    cellPlacement = checkLastCol(colIndex, recordState) ? "right" : "column";
  } else if (key === noOfRows) {
    cellPlacement = checkLastRow(key, recordState) ? "bottom" : "row";
  } else {
    cellPlacement = false;
  }
  return cellPlacement;
}

/**
 * checkRowAndCols - returns where to save applied rule
 * computation results
 */
export function checkRowAndCols(key, colIndex, recordState) {
  const rowIsEmpty = checkLastRow(key, recordState);
  const colIsEmpty = checkLastCol(colIndex, recordState);
  if (!rowIsEmpty && !colIsEmpty) {
    return false;
  }
  return colIsEmpty ? "right" : "bottom";
}

/**
 * checkLastCol - checks if column at at the right edge is
 * empty to permit saving of data
 */
export function checkLastCol(colIndex, recordState) {
  const table = getCurrentTable(recordState);
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
export function checkLastRow(key, recordState) {
  const table = getCurrentTable(recordState);
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

export function getCurrentTable(recordState) {
  const { currentTable } = recordState;
  const table = recordState.tables[currentTable];
  return table;
}

export function askForRange(cellPlacement, index) {
  const choiceName = cellPlacement === "right" ? "column" : "row";
  // let opp = cellPlacement === "right" ? "row": "column";
  const range = prompt(`you chose ${choiceName} number ${index},
please specify from what ${choiceName} to apply rule. you can specify a single value
or a range ex 3-7`);
  return range;
}

export function isNumber(val) {
  if (Number(val) === 0 || Number(val)) {
    return true;
  }
  return false;
}

/**
 * pickCells - after rule has been chosen, pickCells listens for cell click
 * and determines if to go ahead with computations after the necassary
 * conditions are met
 */
export function pickCells(
  ruleName,
  currentTable,
  key,
  colIndex,
  noOfRows,
  noOfCols,
  recordState,
) {
  let cellPlacement = getCellPlacement(
    key,
    colIndex,
    noOfRows,
    noOfCols,
    recordState,
  );
  if (cellPlacement !== "right" && cellPlacement !== "bottom") {
    if (!cellPlacement) {
      return alert(
        "basic rule can only be applied on last row or column. " +
          "and it must not be the last cell of the table as it is ambiguous where you want to" +
          "apply rule",
      );
    }
    const option =
      prompt(`${cellPlacement} not empty. Do you want to overwrite values in  
    ${cellPlacement}? type 'yes' or 'overwrite' to overwrite or 'no' to cancel`);
    if (
      !option ||
      (option && option.toLowerCase() === "no") ||
      (option.toLowerCase() !== "yes" && option.toLowerCase() !== "overwrite")
    ) {
      return null;
    }
    if (
      option &&
      option.toLowerCase() !== "overwrite" &&
      option.toLowerCase() !== "yes"
    ) {
      recordState.tables[currentTable].ruleMode = false;
      recordState.tables[currentTable].currentRule = "";
      setRecordsStateWrapper(
        recordState,
        `tables.${currentTable}.ruleMode`,
        false,
      );
    } else {
      if (cellPlacement === "row") {
        cellPlacement = "bottom";
      } else if (cellPlacement === "column") {
        cellPlacement = "right";
      } else {
        alert("rule will be applied on the last row");
        cellPlacement = "bottom";
      }
      implementRule(ruleName, recordState, currentTable, cellPlacement);
    }
  } else {
    implementRule(ruleName, recordState, currentTable, cellPlacement);
  }
}

export function pickCellsAdv(
  ruleName,
  currentTable,
  key,
  colIndex,
  noOfRows,
  noOfCols,
  recordState,
) {
  const choice = getChoiceForPickCellsAdv();
  let cellPlacement;
  if (!choice) {
    return;
  }
  if (choice && choice.toLowerCase() === "row") {
    cellPlacement = "bottom";
  } else {
    cellPlacement = "right";
  }
  const index = cellPlacement === "bottom" ? key : colIndex + 1;
  const range = askForRange(cellPlacement, index);
  if (!range) {
    return;
  }
  const parsedRange = parseRange(
    range,
    index,
    cellPlacement,
    noOfRows,
    noOfCols,
  );
  if (!parsedRange) {
    return;
  }
  if (parsedRange.length > 1) {
    const startIndex = parsedRange[0];
    const endIndex = parsedRange[1];
    if (startIndex >= endIndex) {
      return;
    }
    if (cellPlacement === "bottom") {
      applyRuleAdvRow(
        startIndex,
        endIndex,
        ruleName,
        currentTable,
        Number(noOfRows),
        Number(noOfCols),
        cellPlacement,
        key,
        recordState,
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
        recordState,
      );
    }
  } else {
    const startIndex = parsedRange[0];
    if (cellPlacement === "bottom") {
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
        recordState,
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
        recordState,
      );
    }
  }
}

export function applyRuleAdvRow(
  startIndex,
  endIndex,
  ruleName,
  currentTable,
  noOfRows,
  noOfCols,
  cellPlacement,
  saveIndex,
  recordState,
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

  const { data } = recordState.tables[currentTable];
  const { prevRuleAdv } = recordState.tables[currentTable];

  const updatedData = advancedutils()[functionName](
    data,
    noOfRows,
    noOfCols,
    startIndex,
    endIndex,
    saveIndex,
  );

  recordState.altered = true;
  recordState.tables[currentTable].ruleModeAdv = false;
  recordState.tables[currentTable].currentRule = "";
  recordState.tables[currentTable].prevRuleAdv = createAdvRuleReprRow(
    prevRuleAdv,
    args,
    advAppMode,
  );

  setRecordsStateWrapper(
    recordState,
    `tables.${currentTable}.data`,
    updatedData,
  );
}

export function applyRuleAdvCol(
  startIndex,
  endIndex,
  ruleName,
  currentTable,
  noOfRows,
  noOfCols,
  cellPlacement,
  saveIndex,
  recordState,
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

  const { data } = recordState.tables[currentTable];
  const { prevRuleAdv } = recordState.tables[currentTable];

  const updatedData = advancedutils()[functionName](
    data,
    noOfRows,
    noOfCols,
    startIndex,
    endIndex,
    saveIndex,
  );

  recordState.altered = true;
  recordState.tables[currentTable].ruleModeAdv = false;
  recordState.tables[currentTable].currentRule = "";
  recordState.tables[currentTable].prevRuleAdv = createAdvRuleReprCol(
    prevRuleAdv,
    args,
    advAppMode,
  );

  setRecordsStateWrapper(
    recordState,
    `tables.${currentTable}.data`,
    updatedData,
  );
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
        [prev.rowsRules ? Object.keys(prev.rowsRules).length + 1 : 1]: args,
      },
    };
  }
  return newRule;
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
        [prev.colsRules ? Object.keys(prev.colsRules).length + 1 : 1]: args,
      },
    };
  }
  return newRule;
}

function getChoiceForPickCellsAdv() {
  const choice = prompt(`Where do you want to apply rule? please type 'row' or
'col' to apply rule accross the clicked row or across the clicked column respectively.
`);
  if (!choice) {
    alert("aborting, no choice made");
    return null;
  }
  if (choice.toLowerCase() !== "col" && choice.toLowerCase() !== "row") {
    return getChoiceForPickCellsAdv();
  }
  return choice.toLowerCase();
}

function parseRange(range, index, cellPlacement, noOfRows, noOfCols) {
  const list = range.split("-");
  let startIndex;
  let endIndex;
  if (list.length > 1) {
    startIndex = list[0];
    endIndex = list[1];
    if (!isNumber(startIndex) || !isNumber(endIndex)) {
      return false;
    }
    if (
      !checkStartIndex(startIndex, cellPlacement, noOfRows, noOfCols) ||
      !checkEndIndex(endIndex, cellPlacement, noOfRows, noOfCols)
    ) {
      return false;
    }
    return [Number(startIndex), Number(endIndex)];
  }
  startIndex = list[0];
  if (!isNumber(startIndex)) {
    return false;
  }
  if (!checkStartIndex(startIndex, cellPlacement, noOfRows, noOfCols)) {
    return false;
  }
  return [Number(startIndex)];
}

function checkStartIndex(startIndex, cellPlacement, noOfRows, noOfCols) {
  if (cellPlacement === "bottom") {
    if (Number(startIndex) >= Number(noOfRows) || Number(startIndex) < 1) {
      return false;
    }
  } else if (Number(startIndex) >= Number(noOfCols) || Number(startIndex) < 1) {
    return false;
  }
  return true;
}

function checkEndIndex(endIndex, cellPlacement, noOfRows, noOfCols) {
  if (cellPlacement === "bottom") {
    if (Number(endIndex) > Number(noOfRows) || Number(endIndex) < 1) {
      return false;
    }
  } else if (Number(endIndex) > Number(noOfCols) || Number(endIndex) < 1) {
    return false;
  }
  return true;
}

export function checkIfRulesSet(tableName, recordState) {
  const table = recordState.tables[tableName];
  if (!table) return false;
  if (table.prevRule) return true;
  if (table.prevRuleAdv) {
    if (
      table.prevRuleAdv.rowsRules &&
      Object.keys(table.prevRuleAdv.rowsRules).length
    )
      return true;
    if (
      table.prevRuleAdv.colsRules &&
      Object.keys(table.prevRuleAdv.colsRules).length
    )
      return true;
  }
  return false;
}

export function getData(tableName, recordState) {
  const table = recordState.tables[tableName];
  const data = table.data;
  return data;
}

export function deleteTable(tableName, recordState) {
  deleteTableAtBackend();
  delete recordState.tables[tableName];
  recordState.currentTable = "";
  setRecordsStateWrapper(recordState, "currentTable", "");
}

export function changeTableName(tableName, option, recordState) {
  if (recordState.tables[option]) {
    const resp = prompt(
      `table with name ${option} exists, do you want to overwrite it?`,
    );
    if (
      resp.toLocaleLowerCase() !== "y" &&
      resp.toLocaleLowerCase() !== "yes"
    ) {
      option = prompt("type in the name you want to call this table");
      if (!option) return;
      return changeTableName(tableName, option, recordState);
    }
  }

  const saveTableDetails = recordState.tables[tableName];
  deleteTableAtBackend();
  delete recordState.tables[tableName];
  recordState.tables[option] = saveTableDetails;
  setRecordsStateWrapper(recordState, "currentTable", option);
}

export function pasteSpan(x, y, bg = "red", size = 3) {
  const sp = document.createElement("span");

  sp.style.top = `${y}px`;
  sp.style.left = `${x}px`;
  sp.style.position = "absolute";
  sp.style.width = `${size}px`;
  sp.style.height = `${size}px`;
  sp.style.backgroundColor = bg;

  sp.classList.add("select--box");
  const table = document.getElementsByClassName("current--table")[0];
  table?.appendChild(sp);
}

export function createTable(recordState, name, noOfRows, noOfCols) {
  if (!name) {
    return;
  }

  if (recordState.tables && recordState.tables[name]) {
    const option = prompt(`Table ${name} already exist, if you type 'yes' it
will be overwritten`);
    if (option && option.toLowerCase() !== "yes") {
      return;
    }
  }

  noOfRows = Number(noOfRows);
  noOfCols = Number(noOfCols);
  if (validateParamsWhenCreatingTable(name, noOfRows, noOfCols)) {
    return null;
  }
  const isWithinLimits = checkTableLimits(noOfRows, noOfCols);
  if (!isWithinLimits) {
    return;
  }

  recordState.altered = true;
  recordState.createTableBtnClicked = false;
  recordState.rowsAndColsNoSet = true;
  recordState.currentTable = name;
  recordState.id
    ? recordState.id
    : (recordState.id = localStorage.getItem("flexId"));
  recordState.tables ? recordState.tables : (recordState.tables = {});
  setRecordsStateWrapper(
    recordState,
    `tables.${name}`,
    newTable(noOfRows, noOfCols),
  )

  recordState.tables[name].lastTimeClicked = Date.now().toString();
  persist(recordState);
  return recordState;
}

/**
 *
 * @param data map of keys to rows, 1: [a, b, c]
 *
 * returns: string CSV rep
 */
export function extractCSVFromData(data) {
  let csv = "";

  for (const key in data) {
    const row = [...data[key]];
    quoteCSVFieldContainingComma(row);
    csv += row.join(",");
    csv += "\n";
  }

  return csv;
}

function quoteCSVFieldContainingComma(row) {
  row.forEach((field, index) => {
    let stringVal = `${field}`;
    if (stringVal.includes(",")) {
      row[index] = `"${stringVal}"`;
    }
  });
}

export function buildTableDataFromCsv(csv) {
  let trimmedCsv = csv.trimEnd();
  let rows = trimmedCsv.split("\n");
  let data = {};

  for (let rowIndex = 1; rowIndex <= rows.length; rowIndex++) {
    let currentRow = rows[rowIndex - 1];
    if (!currentRow) break;
    let constructedRow = splitCSVRows(currentRow);
    data[rowIndex] = constructedRow;
  }

  return data;
}

/**
 *
 * @param row - comma separated string e.g a,b,c,d
 * @returns constructedRow - list of columns computed from row e.g [a, b, c]
 */
function splitCSVRows(row) {
  let constructedRow = [];
  let processingRow = row;
  while (true) {
    let [column, remainingRow] = getNextCSVColumn(processingRow);
    processingRow = remainingRow;
    constructedRow.push(column);
    if (remainingRow === "") break;
  }
  return constructedRow;
}

/**
 *
 * @param row - comma separated string e.g a,b,c,d
 * @returns next column in row and yetToBeProcessedSectionOfRow
 * e.g [a, b,c,d] if called again returns [b, c,d]
 */
function getNextCSVColumn(row) {
  let col = "";
  let i = 0;

  for (i = 0; i < row.length; i++) {
    let currentChar = row[i];

    if (currentChar === '"' && row[i + 1] === '"') {
      col += currentChar;
      i += 1;
      continue;
    } else if (currentChar === '"') {
      let quoteClosureIndex = getQuoteClosureIndexAhead(row, i);
      if (quoteClosureIndex !== -1) {
        col += row.slice(i + 1, quoteClosureIndex);
        i = quoteClosureIndex;
        continue;
      }
    } else if (currentChar === ",") {
      break;
    }

    col += currentChar;
  }

  row = row.slice(i + 1);
  return [col, row];
}

function getQuoteClosureIndexAhead(row, index) {
  for (let i = index + 1; i < row.length; i++) {
    if (row[i] === '"') return i;
  }
  return -1;
}
