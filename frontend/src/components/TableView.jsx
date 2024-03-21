import React, { useEffect } from "react";
import { changeValueInNestedObj, clearRule, removeCol } from "../utils";

const RECTANGLE = {
  canDraw: false,
  topLeft: {},
  bottomRight: {},
  initPoint: {},
  id: ""
}

export default function TableView(props) {
  let { currentTable, noOfCols, noOfRows, table } = getCurrentTableProps(props);

  const clearFormObj = {
    createTableMode: null,
    fields: {
      name: "",
      noOfRows: "",
      noOfCols: "",
    },
  };

  let [formObj, setFormObj] = React.useState(clearFormObj);

  let classForCreateTableMode = getClassForCreateTableMode(props);

  function parseCreateTableForm(formObj, e, recordState) {
    e.preventDefault();
    const { noOfRows } = formObj.fields;
    const { noOfCols } = formObj.fields;
    const { name } = formObj.fields;
    createTable(recordState, name, noOfRows, noOfCols);
    setFormObj(clearFormObj);
  }

  function cancelCreateTableForm(event) {
    event.preventDefault();
    setFormObj(clearFormObj);
    unsetCreateTableBtnClicked(props.setRecordsStateWrapper, props.records);
  }

  function handleCreateFormChange(name, value) {
    setFormObj((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: value,
      },
    }));
  }

  const tableView = [];

  // tableView is populated with table fields in createTableRepresentation
  createTableRepresentation(props, tableView, noOfRows, noOfCols);

  setRuleModeToDisplayBtns(props.records);

  enableRectangleDraw(currentTable, props.records)
  disableRectangleDraw(currentTable, props.records)

  return (
    <div className="table--view">
      <div className={`create--form--container ${classForCreateTableMode}`}>
        <form className="create--form">
          <div className="form--block">
            <label htmlFor="table--name">Table name</label>
            <input
              type="text"
              id="table--name"
              name="table--name"
              placeholder="e.g my table"
              value={formObj.fields.name}
              onChange={(e) => handleCreateFormChange("name", e.target.value)}
            />
          </div>
          <div className="form--block">
            <label htmlFor="no--of--rows">rows</label>
            <input
              type="text"
              id="no--of--rows"
              name="no--of--rows"
              placeholder="enter no of rows here"
              value={formObj.fields.noOfRows}
              onChange={(e) =>
                handleCreateFormChange("noOfRows", e.target.value)
              }
            />
          </div>
          <div className="form--block">
            <label htmlFor="no--of--cols">columns</label>
            <input
              type="text"
              id="no--of--cols"
              name="no--of--cols"
              placeholder="enter no of cols here"
              value={formObj.fields.noOfCols}
              onChange={(e) =>
                handleCreateFormChange("noOfCols", e.target.value)
              }
            />
          </div>
          <div className="create--form--btns">
            <button
              onClick={(e) => {
                parseCreateTableForm(formObj, e, props.records);
              }}
            >
              create
            </button>
            <button
              className="cancel--btn"
              onClick={(e) => cancelCreateTableForm(e)}
            >
              cancel
            </button>
          </div>
        </form>
      </div>
      <div className="rules--buttons">
        <button
          onClick={(e) =>
            addColumn(props.setRecordsStateWrapper, currentTable, props.records)
          }
        >
          add column +
        </button>
        <button
          onClick={(e) =>
            delColumn(props.setRecordsStateWrapper, currentTable, props.records)
          }
        >
          del column -
        </button>
        <button
          onClick={(e) =>
            addRow(props.setRecordsStateWrapper, currentTable, props.records)
          }
        >
          add row +
        </button>
        <button
          onClick={(e) =>
            delRow(props.setRecordsStateWrapper, currentTable, props.records)
          }
        >
          del row -
        </button>
        <button onClick={(e) => setInsertMode(currentTable, props.records)}>
          insert
        </button>
        <button onClick={(e) => setDeleteMode(currentTable, props.records)}>
          delete
        </button>
      </div>

      <div className="rules--buttons">
        <button onClick={(e) => clearRule(currentTable, props.records)}>
          clear functions
        </button>
        <button onClick={(e) => increaseCellSize(currentTable, props.records)}>
          cell size +
        </button>
        <button onClick={(e) => decreaseCellSize(currentTable, props.records)}>
          cell size -
        </button>
        <button 
          className={table.selectTool ? `red` : ``}
          onClick={(e) => {
            toggleSelectTool(currentTable, props.records)
          }}>
          select tool
        </button>
      </div>
      {table.ruleMode ? (
        <div className="rule--options">
          <input
            type="radio"
            id="sum--function"
            name="rules"
            onClick={(e) =>
              registerFunction(props.records, currentTable, "applySumFunction")
            }
          />
          <label htmlFor="sum--function">sum function</label>

          <input
            type="radio"
            id="sub--function"
            name="rules"
            onClick={(e) =>
              registerFunction(props.records, currentTable, "applySubFunction")
            }
          />
          <label htmlFor="sub--function">subtract function</label>

          <input
            type="radio"
            id="mul--function"
            name="rules"
            onClick={(e) =>
              registerFunction(props.records, currentTable, "applyMulFunction")
            }
          />
          <label htmlFor="mul--function">multiply function</label>

          <input
            type="radio"
            id="average--function"
            name="rules"
            onClick={(e) =>
              registerFunction(
                props.records,
                currentTable,
                "applyAverageFunction",
              )
            }
          />
          <label htmlFor="average--function">average function</label>
        </div>
      ) : (
        ""
      )}

      <div className="current--table">
        {tableView.length ? tableView : <h1>No table selected</h1>}
      </div>
    </div>
  );
}

function createTableRepresentation(props, tableView, noOfRows, noOfCols) {
  const currentTable = props.records.currentTable;
  if (!currentTable) return;
  const table = props.records.tables[currentTable];
  const cellClassName = getClassName(table);
  const tableData = table.data;

  const colorRowsAndCols = table.colorRowsAndCols;

  if (tableData) {
    let rowIndex = 0;
    for (let row = 1; row <= noOfRows; row++) {
      const saveRowIndex = rowIndex;
      const currentRow = tableData[row];
      const rowContainer = [];
      for (let colIndex = 0; colIndex < noOfCols; colIndex++) {
        let extendInputClass = getColorClassForApplicableRowsAndCols(
          colorRowsAndCols,
          row,
          colIndex,
        );
        extendInputClass += getColorClassForSelectedRowsOrCols(
          colorRowsAndCols,
          row,
          colIndex,
          props.records,
        );

        const cell = (
          <div className="cell--container" key={colIndex}>
            <input
              type="text"
              key={colIndex}
              className={(cellClassName || "") + extendInputClass}
              value={currentRow[colIndex] ? currentRow[colIndex] : ""}
              data-col-index={colIndex}
              data-row-index={saveRowIndex}
              onChange={(e) =>
                updateTableView(
                  currentTable,
                  props.records,
                  colIndex,
                  e.target.value,
                  saveRowIndex + 1,
                )
              }
              onClick={(e) => {
                setCellInSelectedCells(
                  colorRowsAndCols,
                  row,
                  colIndex,
                  props.records,
                );
                if (table.ruleMode && table.currentRule) {
                  pickCells(
                    table.currentRule,
                    currentTable,
                    row,
                    colIndex,
                    noOfRows,
                    noOfCols,
                    props.records,
                  );
                } else if (table.ruleModeAdv && table.currentRule) {
                  pickCellsAdv(
                    table.currentRule,
                    currentTable,
                    row,
                    colIndex,
                    noOfRows,
                    noOfCols,
                    props.records,
                  );
                }
                if (table.insertMode)
                  handleInsert(
                    currentTable,
                    noOfRows,
                    noOfCols,
                    row,
                    colIndex,
                    props.records,
                  );
                if (table.deleteMode)
                  handleDelete(
                    currentTable,
                    noOfRows,
                    noOfCols,
                    row,
                    colIndex,
                    props.records,
                  );
              }}
            />
            <span
              className="function--sign"
              onClick={() => {
                addToRowsAndColsToColor(row, colIndex, props.records);
              }}
            >
              𝑓 
            </span>
          </div>
        );
        rowContainer.push(cell);
      }
      tableView.push(
        <div key={row} className="row--container">
          {"" && <span className="numbering">{row}: </span>}
          {rowContainer}
        </div>,
      );
      rowIndex++;
    }
  }
}

function unsetCreateTableBtnClicked(setRecordsStateWrapper, recordState) {
  setRecordsStateWrapper(recordState, "createTableBtnClicked", false);
}

function createTable(recordState, name, noOfRows, noOfCols) {
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
  );
  persist(recordState);
  return recordState;
}

function addToRowsAndColsToColor(row, colIndex, recordState) {
  const currentTable = recordState.currentTable;
  const cellToColor = {
    currentTable,
    row,
    column: colIndex,
    targetRow: row,
    targetCol: colIndex,
  };
  const colorRowsAndCols =
    recordState.tables[currentTable].colorRowsAndCols || [];
  colorRowsAndCols.push(cellToColor);
  setRecordsStateWrapper(
    recordState,
    `tables.${currentTable}.colorRowsAndCols`,
    colorRowsAndCols,
  );
  alert(
    "select the cells across the row or along the column you wish to apply a function to",
  );
}

function unSetApplicableRowsAndColsToColor(recordState) {
  const currentTable = recordState.currentTable;
  setRecordsStateWrapper(
    recordState,
    `tables.${currentTable}.colorRowsAndCols`,
    null,
  );
}

function getColorClassForApplicableRowsAndCols(
  colorRowsAndCols,
  row,
  colIndex,
) {
  if (
    colorRowsAndCols &&
    cellInAxisOfColorRowsOrCols(row, colIndex, colorRowsAndCols)
  ) {
    return " cell--is--function--applicable--color";
  }
  return "";
}

function getColorClassForSelectedRowsOrCols(
  colorRowsAndCols,
  row,
  colIndex,
  recordState,
) {
  if (
    colorRowsAndCols &&
    cellInAxisOfColorRowsOrCols(row, colIndex, colorRowsAndCols)
  ) {
    const currentTable = recordState.currentTable;
    const selectedCells = recordState.tables[currentTable].selectedCells || {};
    const { targetRow, targetCol } = getTargetRowAndCol(
      colorRowsAndCols,
      row,
      colIndex,
    );
    const key = `${targetRow}.${targetCol}`;
    if (cellInCellsGroup(row, colIndex, selectedCells[key]))
      return " cell--is--selected";
  }
  return "";
}

function cellInCellsGroup(row, colIndex, cellsGroup) {
  if (!cellsGroup) return false;
  for (const cell of cellsGroup) {
    if (cell.row === row && cell.column === colIndex) return true;
  }
  return false;
}

function cellInAxisOfColorRowsOrCols(row, colIndex, colorRowsOrCols) {
  for (const cell of colorRowsOrCols) {
    if (cell.row === row || cell.column === colIndex) return true;
  }
  return false;
}

function getIndexOfCellInSelected(row, colIndex, cellsGroup) {
  let index = 0;
  for (const cell of cellsGroup) {
    if (cell.row === row && cell.column === colIndex) return index;
    index++;
  }
  return -1;
}

function setCellInSelectedCells(colorRowsAndCols, row, colIndex, recordState) {
  if (
    colorRowsAndCols &&
    cellInAxisOfColorRowsOrCols(row, colIndex, colorRowsAndCols)
  ) {
    const currentTable = recordState.currentTable;
    if (!currentTable) return;
    if (!recordState.tables[currentTable].selectedCells)
      recordState.tables[currentTable].selectedCells = {};

    const { targetRow, targetCol } = getTargetRowAndCol(
      colorRowsAndCols,
      row,
      colIndex,
    );
    const cell = { row, column: colIndex, colIndex, targetRow, targetCol };
    const key = `${targetRow}.${targetCol}`;
    if (
      !cellInCellsGroup(
        cell.row,
        cell.column,
        recordState.tables[currentTable].selectedCells[key],
      )
    ) {
      pushCellInSelectedCells(
        recordState.tables[currentTable].selectedCells,
        key,
        cell,
      );
    } else {
      const indexOfCell = getIndexOfCellInSelected(
        cell.row,
        cell.column,
        recordState.tables[currentTable].selectedCells[key],
      );
      if (indexOfCell !== -1)
        recordState.tables[currentTable].selectedCells[key].splice(
          indexOfCell,
          1,
        );
    }

    removeColorForNeglectedRowOrCol(
      recordState.tables[currentTable].colorRowsAndCols,
      row,
      colIndex,
      targetRow,
      targetCol,
    );

    setRecordsStateWrapper(recordState, "currentTable", currentTable);
  }
}

function removeColorForNeglectedRowOrCol(
  colorRowsAndCols,
  row,
  colIndex,
  targetRow,
  targetCol,
) {
  for (const cell of colorRowsAndCols) {
    if (cell.targetRow == row) {
      // row is fixed, allow colored rows
      cell.column = null;
    } else if (cell.targetCol == colIndex) {
      // column is fixed, allow colored columns
      cell.row = null;
    }
  }
}

function pushCellInSelectedCells(selectedCells, key, cell) {
  if (!selectedCells[key]) {
    selectedCells[key] = [];
  }
  selectedCells[key].push(cell);
}

function getTargetRowAndCol(colorRowsAndCols, row, colIndex) {
  for (const cell of colorRowsAndCols.toReversed()) {
    if (cell.targetRow == row) {
      return { targetRow: cell.targetRow, targetCol: cell.targetCol };
    } else if (cell.targetCol == colIndex) {
      return { targetRow: cell.targetRow, targetCol: cell.targetCol };
    }
  }
  throw new Error("target not found");
}

function setRuleModeToDisplayBtns(recordState) {
  const currentTable = recordState.currentTable;
  if (!currentTable) return;
  // allow rule selection
  if (Object.keys(recordState.tables[currentTable]?.selectedCells || []).length)
    recordState.tables[currentTable].ruleMode = true;
  else recordState.tables[currentTable].ruleMode = false;
}

function addColumn(setRecordsStateWrapper, tableName, recordState) {
  if (recordState.currentTable === "") {
    alert("No table selected");
    return null;
  }

  if (!recordState.tables[tableName].noOfRows) {
    return null;
  }
  recordState.altered = true;
  let newNoOfCols = recordState.tables[tableName].noOfCols + 1;
  setRecordsStateWrapper(
    recordState,
    `tables.${tableName}.noOfCols`,
    newNoOfCols,
  );
  applyRuleOnModification(recordState);
  runRegisteredFunctions(recordState, tableName);
}

function delColumn(setRecordsStateWrapper, tableName, recordState) {
  if (recordState.currentTable === "") {
    alert("No table selected");
    return null;
  }

  let prevNoOfCols = recordState.tables[tableName].noOfCols;
  let newNoOfCols = prevNoOfCols ? Number(prevNoOfCols) - 1 : 0;

  let prevTableData = recordState.tables[tableName].data;
  let newTableData = removeCol(prevTableData, Number(prevNoOfCols));

  recordState.altered = true;
  changeValueInNestedObj(
    recordState,
    `tables.${tableName}.noOfCols`,
    newNoOfCols,
  );
  setRecordsStateWrapper(recordState, `tables.${tableName}.data`, newTableData);
}

function addRow(setRecordsStateWrapper, tableName, recordState) {
  if (recordState.currentTable === "") {
    alert("No table selected");
    return null;
  }

  const prevNoOfRows = recordState.tables[tableName].noOfRows;
  const newNoOfRows = prevNoOfRows + 1;
  let noOfCols = recordState.tables[tableName].noOfCols;
  let tableData = recordState.tables[tableName].data;

  recordState.tables[tableName].noOfRows = newNoOfRows;
  changeValueInNestedObj(tableData, `${newNoOfRows}`, createArray(noOfCols));

  recordState.altered = true;
  setRecordsStateWrapper(recordState, `tables.${tableName}.data`, tableData);
  applyRuleOnModification(recordState);
  runRegisteredFunctions(recordState, tableName);
}

function delRow(setRecordsStateWrapper, tableName, recordState) {
  if (recordState.currentTable === "") {
    alert("No table selected");
    return null;
  }

  const noOfRows = Number(recordState.tables[tableName].noOfRows);
  delete recordState.tables[tableName].data[noOfRows];
  let newNoOfRows = noOfRows - 1;
  if (newNoOfRows < 0) newNoOfRows = 0;

  setRecordsStateWrapper(
    recordState,
    `tables.${tableName}.noOfRows`,
    newNoOfRows,
  );
}

function setDeleteMode(tableName, recordState) {
  alert("click on the cell you want to delete its row or column");
  setRecordsStateWrapper(recordState, `tables.${tableName}.deleteMode`, true);
}

function setInsertMode(tableName, recordState) {
  alert("click on the cell you want to insert row or column around");
  setRecordsStateWrapper(recordState, `tables.${tableName}.insertMode`, true);
}

function addRule(tableName, recordState) {
  recordState.altered = true;
  recordState.tables[tableName].ruleModeAdv = false;
  setRecordsStateWrapper(recordState, `tables.${tableName}.ruleMode`, true);
}

function addRuleAdv(tableName, recordState) {
  recordState.altered = true;
  recordState.tables[tableName].ruleMode = false;
  setRecordsStateWrapper(recordState, `tables.${tableName}.ruleModeAdv`, true);
}

function increaseCellSize(tableName, recordState) {
  let maxCellSize = 3;
  let currentSize = Number(recordState.tables[tableName].cellSize) || 0;
  let size = 0;
  if (currentSize < maxCellSize) {
    size = currentSize + 1;
    size = size > maxCellSize ? maxCellSize : size;
  } else {
    size = currentSize;
  }

  recordState.altered = true;
  setRecordsStateWrapper(recordState, `tables.${tableName}.cellSize`, size);
}

function decreaseCellSize(tableName, recordState) {
  let minCellSize = 0;
  const currentSize = Number(recordState.tables[tableName].cellSize) || 0;
  let size = 0;
  if (currentSize > minCellSize) {
    size = currentSize - 1;
    size = size < minCellSize ? minCellSize : size;
  } else {
    size = currentSize;
  }

  recordState.altered = true;
  setRecordsStateWrapper(recordState, `tables.${tableName}.cellSize`, size);
}

/**
 * updateTableView - handles text changes in cells
 */
function updateTableView(tableName, recordState, colIndex, value, SN) {
  // SN is serial number, used as key in storing rows in
  // records.tables.tableName.data
  setRecordsStateWrapper(
    recordState,
    `tables.${tableName}.data.${SN}`,
    replaceAtIndex(recordState.tables[tableName].data[SN], colIndex, value),
  );
  applyRuleOnModification(recordState);
  runRegisteredFunctions(recordState, tableName);
}

/**
 * afterRulePick - handles event after user chooses a rule to apply.
 * sets the currentTable to ruleMode which signals for rule
 * application
 */
function afterRulePick(ruleName, tableName, recordState) {
  alert("click on the row or column you want to apply rule");

  recordState.tables[tableName].ruleMode = true;
  setRecordsStateWrapper(
    recordState,
    `tables.${tableName}.currentRule`,
    ruleName,
  );
}

function registerFunction(recordState, tableName, functionName) {
  const selectedCells = recordState.tables[tableName].selectedCells;
  if (!recordState.tables[tableName].registeredFunctions) {
    recordState.tables[tableName].registeredFunctions = [];
  }

  const cellsToOperateOnAsAGroup = Object.values(selectedCells);
  recordState.tables[tableName].registeredFunctions.push({
    functionName,
    cellsToOperateOnAsAGroup: cellsToOperateOnAsAGroup,
  });

  setRecordsStateWrapper(recordState, "currentTable", tableName);
  // force function application
  runRegisteredFunctions(recordState, tableName);
}

function runRegisteredFunctions(recordState, tableName) {
  const functionNameToFunctionApplierMap = {
    applySumFunction: applySumFunction,
    applySubFunction: applySubFunction,
    applyMulFunction: applyMulFunction,
    applyAverageFunction: applyAverageFunction,
  };

  if (!tableName) return;

  const registeredFunctions =
    recordState?.tables[tableName].registeredFunctions;
  if (!registeredFunctions) return;

  for (const rFunction of registeredFunctions) {
    const functioN = functionNameToFunctionApplierMap[rFunction.functionName];
    if (!functioN) throw new Error("function doesnt exist");
    rFunction.cellsToOperateOnAsAGroup.forEach((cellsGroup) => {
      functioN(recordState, tableName, cellsGroup);
    });
  }
}

function applySumFunction(recordState, tableName, cellsToOperateOnAsAGroup) {
  const data = recordState.tables[tableName].data;
  const updatedData = sumFunctionImpl(data, cellsToOperateOnAsAGroup);
  setRecordsStateWrapper(recordState, `tables.${tableName}.data`, updatedData);
  clearSelectedCells(tableName, recordState);
}

function sumFunctionImpl(data, cellsToOperateOnAsAGroup) {
  const relevantData = extractRelevantData(data, cellsToOperateOnAsAGroup);
  const { targetRow, targetCol } = cellsToOperateOnAsAGroup[0];
  let res = 0;
  relevantData.forEach((v) => (res += Number(v)));
  data[targetRow][targetCol] = `${res}`;
  return data;
}

function applySubFunction(recordState, tableName, cellsToOperateOnAsAGroup) {
  const data = recordState.tables[tableName].data;
  const updatedData = subFunctionImpl(data, cellsToOperateOnAsAGroup);
  setRecordsStateWrapper(recordState, `tables.${tableName}.data`, updatedData);
  clearSelectedCells(tableName, recordState);
}

function subFunctionImpl(data, cellsToOperateOnAsAGroup) {
  const relevantData = extractRelevantData(data, cellsToOperateOnAsAGroup);
  const { targetRow, targetCol } = cellsToOperateOnAsAGroup[0];
  let res = 0;
  let start = false;
  relevantData.forEach((v) => {
    if (start === false) {
      start = true;
      res = Number(v);
    } else {
      res -= Number(v);
    }
  });
  data[targetRow][targetCol] = `${res}`;
  return data;
}

function applyMulFunction(recordState, tableName, cellsToOperateOnAsAGroup) {
  const data = recordState.tables[tableName].data;
  const updatedData = mulFunctionImpl(data, cellsToOperateOnAsAGroup);
  setRecordsStateWrapper(recordState, `tables.${tableName}.data`, updatedData);
  clearSelectedCells(tableName, recordState);
}

function mulFunctionImpl(data, cellsToOperateOnAsAGroup) {
  const relevantData = extractRelevantData(data, cellsToOperateOnAsAGroup);
  const { targetRow, targetCol } = cellsToOperateOnAsAGroup[0];
  let res = 1;
  relevantData.forEach((v) => (res *= Number(v)));
  data[targetRow][targetCol] = `${res}`;
  return data;
}

function applyAverageFunction(
  recordState,
  tableName,
  cellsToOperateOnAsAGroup,
) {
  const data = recordState.tables[tableName].data;
  const updatedData = averageFunctionImpl(data, cellsToOperateOnAsAGroup);
  setRecordsStateWrapper(recordState, `tables.${tableName}.data`, updatedData);
  clearSelectedCells(tableName, recordState);
}

function averageFunctionImpl(data, cellsToOperateOnAsAGroup) {
  const relevantData = extractRelevantData(data, cellsToOperateOnAsAGroup);
  const { targetRow, targetCol } = cellsToOperateOnAsAGroup[0];
  let sum = 0;
  relevantData.forEach((v) => (sum += Number(v)));
  let res = sum / relevantData.length;
  data[targetRow][targetCol] = res.toFixed(2);
  return data;
}

function extractRelevantData(data, selectedCells) {
  const relevantData = [];
  for (const cell of selectedCells) {
    try {
      relevantData.push(data[cell.row][cell.column]);
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  return relevantData;
}

/**
 * afterRulePickAdv - handles event after user chooses an advanced rule to apply.
 * sets the currentTable to ruleModeAdv which signals for rule
 * application
 */
function afterRulePickAdv(ruleName, tableName, recordState) {
  alert("click on the row or column you want to apply rule");

  recordState.tables[tableName].ruleModeAdv = true;
  setRecordsStateWrapper(
    recordState,
    `tables.${tableName}.currentRule`,
    ruleName,
  );
}

function handleDelete(
  tableName,
  noOfRows,
  noOfCols,
  row,
  colIndex,
  recordState,
) {
  const validRowOrCol = ["row", "col"];
  let shouldRetainRules;
  let rowOrCOl = prompt(
    `type 'row' or 'col' to delete an entire row or column`,
  );
  if (!rowOrCOl) return unSetDeleteMode(tableName, recordState);
  rowOrCOl = rowOrCOl ? rowOrCOl.toLowerCase() : "";
  if (!validRowOrCol.includes(rowOrCOl)) {
    alert("ivalid option");
    return handleDelete(
      tableName,
      noOfRows,
      noOfCols,
      row,
      colIndex,
      recordState,
    );
  }
  if (checkIfRulesSet(tableName, recordState)) {
    shouldRetainRules = prompt(`it is advised to clear existing rules to prevent
quirky behavior, to keep rules type 'yes'`);
  }
  if (!shouldRetainRules || shouldRetainRules.toLowerCase() !== "yes") {
    clearRule(tableName, recordState);
  }
  if (rowOrCOl === "row") {
    deleteEntireRow(tableName, row, recordState);
  } else {
    deleteEntireCol(tableName, colIndex, recordState);
  }
  unSetDeleteMode(tableName, recordState);
}

function deleteEntireRow(tableName, row, recordState) {
  if (row < 1) return;
  const data = getData(tableName, recordState);
  const keys = Object.keys(data);
  const index = keys.indexOf(`${row}`);
  const len = keys.length;
  let saveNext = null;
  if (row > len || index === -1) return;
  for (let i = index; i < len - 1; i++) {
    saveNext = data[keys[i + 1]];
    data[keys[i + 1]] = data[keys[i]];
    data[keys[i]] = saveNext;
  }
  delete data[keys[len - 1]];
  setDataField(recordState, data, tableName);
}

function deleteEntireCol(tableName, colIndex, recordState) {
  const data = getData(tableName, recordState);
  if (colIndex < 0) return;
  for (let row in data) {
    const currRow = data[row];
    const len = currRow.length;
    for (let i = colIndex; i < len; i++) {
      if (i < len - 1) currRow[i] = currRow[i + 1];
      if (i === len - 1) currRow.length = len - 1;
    }
  }
  setDataField(recordState, data, tableName);
}

function handleInsert(
  tableName,
  noOfRows,
  noOfCols,
  row,
  colIndex,
  recordState,
) {
  const validRowOrCol = ["row", "col"];
  const validSides = ["t", "b", "r", "l"];
  const funcMap = {
    t: insertRowAbove,
    b: insertRowBelow,
    r: insertColRight,
    l: insertColLeft,
  };
  let side;
  let rowOrCOl = prompt(`type 'row' or 'col' to insert a new row or column`);
  if (!rowOrCOl) return unSetInsertMode(tableName, recordState);
  rowOrCOl = rowOrCOl ? rowOrCOl.toLowerCase() : "";
  if (!validRowOrCol.includes(rowOrCOl)) {
    alert("ivalid option");
    return handleInsert(
      tableName,
      noOfRows,
      noOfCols,
      row,
      colIndex,
      recordState,
    );
  }
  if (rowOrCOl === "row") {
    side = prompt(
      `type 't' (top) to insert above current row or 'b' (below) to insert below`,
    );
    side = side ? side.toLowerCase()[0] : "";
  } else {
    side =
      prompt(`type 'r' (right) to insert to the right side of current column 
or 'l' (left) to insert to the right`);
    side = side ? side.toLowerCase()[0] : "";
  }
  if (!side) return unSetInsertMode(tableName, recordState);
  if (!validSides.includes(side)) {
    alert("invalid side entered");
    return handleInsert(
      tableName,
      noOfRows,
      noOfCols,
      row,
      colIndex,
      recordState,
    );
  }
  const data = funcMap[side](
    tableName,
    noOfRows,
    noOfCols,
    row,
    colIndex,
    recordState,
  );
  if (!data) return unSetInsertMode(tableName, recordState);
  let shouldRetainRules;
  if (checkIfRulesSet(tableName, recordState)) {
    shouldRetainRules = prompt(`it is advised to clear existing rules to prevent
quirky behavior, to keep rules type 'yes'`);
  }
  if (!shouldRetainRules || shouldRetainRules.toLowerCase() !== "yes") {
    clearRule(tableName, recordState);
  }
  setDataField(recordState, data, tableName);
  unSetInsertMode(tableName, recordState);
}

function insertRowAbove(
  tableName,
  noOfRows,
  noOfCols,
  row,
  colIndex,
  recordState,
) {
  const data = getData(tableName, recordState);
  return insertRowAboveImpl(row, data);
}

function insertRowBelow(
  tableName,
  noOfRows,
  noOfCols,
  row,
  colIndex,
  recordState,
) {
  const data = getData(tableName, recordState);
  return insertRowBelowImpl(row, data);
}

function insertColRight(
  tableName,
  noOfRows,
  noOfCols,
  row,
  colIndex,
  recordState,
) {
  const data = getData(tableName, recordState);
  return insertColRightImpl(colIndex, data);
}

function insertColLeft(
  tableName,
  noOfRows,
  noOfCols,
  row,
  colIndex,
  recordState,
) {
  const data = getData(tableName, recordState);
  return insertColLeftImpl(colIndex, data);
}

function insertColRightImpl(partition, data) {
  if (partition < 0) return;
  for (const row in data) {
    const currRow = data[row];
    const len = currRow.length;
    for (let i = len; i > partition; i--) {
      currRow[i] = currRow[i - 1];
      if (i === partition + 1) currRow[i] = "";
    }
  }
  return data;
}

function insertColLeftImpl(partition, data) {
  if (partition < 0) return;
  for (const row in data) {
    const currRow = data[row];
    const len = currRow.length;
    for (let i = len; i > partition - 1; i--) {
      currRow[i] = currRow[i - 1];
      if (i === partition) currRow[i] = "";
    }
  }
  return data;
}

function insertRowBelowImpl(partition, data) {
  if (partition < 1) return;
  const keys = Object.keys(data).slice(partition - 1);
  const max = Number(keys[keys.length - 1]);
  for (let i = max + 1; i > partition; i--) {
    data[i] = data[i - 1];
    if (i === partition + 1) data[i] = new Array(data[1].length);
  }
  return data;
}

function insertRowAboveImpl(partition, data) {
  if (partition < 1) return;
  const keys = Object.keys(data).slice(partition - 1);
  const max = Number(keys[keys.length - 1]);
  const len = data[1].length;
  for (let i = max + 1; i >= partition; i--) {
    data[i] = data[i - 1];
    if (i === partition) data[i] = new Array(len);
  }
  return data;
}

export function unSetInsertMode(tableName, recordState) {
  setRecordsStateWrapper(recordState, `tables.${tableName}.insertMode`, false);
}

export function unSetDeleteMode(tableName, recordState) {
  setRecordsStateWrapper(recordState, `tables.${tableName}.deleteMode`, false);
}

function getClassName(table) {
  if (!table || !table.cellSize) {
    return "cell--input";
  }
  const map = {
    1: "cell--input input-1",
    2: "cell--input input-2",
    3: "cell--input input-3",
  };
  return map[table.cellSize];
}

function getCurrentTableProps(props) {
  const { currentTable } = props.records;
  const tableData =
    currentTable && props.records.tables
      ? props.records.tables[currentTable].data
      : null;
  const noOfCols =
    currentTable && props.records.tables
      ? props.records.tables[currentTable].noOfCols
      : null;
  const noOfRows =
    currentTable && props.records.tables
      ? props.records.tables[currentTable].noOfRows
      : null;
  const table =
    currentTable && props.records.tables
      ? props.records.tables[currentTable]
      : {};

  return { currentTable, tableData, noOfCols, noOfRows, table };
}

function getClassForCreateTableMode(props) {
  if (props.records.createTableBtnClicked) {
    return "";
  } else {
    return "hide";
  }
}

function resetRectangle() {
  RECTANGLE.canDraw = false,
  RECTANGLE.topLeft = {}
  RECTANGLE.bottomRight = {}
  RECTANGLE.initPoint = {}
}

function toggleSelectTool(tableName, recordState) {
  const value = recordState.tables[tableName].selectTool ? false : true
  recordState.altered = true;
  setRecordsStateWrapper(recordState, `tables.${tableName}.selectTool`, value);
}

function enableRectangleDraw(tableName, recordState) {
  if (!recordState?.tables || !recordState?.tables[tableName].selectTool) return
  const table = document.getElementsByClassName("current--table")[0]
  table?.addEventListener('mousedown', setCanDraw)
  table?.addEventListener('mousemove', redrawRectangle)
  table?.addEventListener('mouseup', unSetCanDraw)
}

function disableRectangleDraw(tableName, recordState) {
  if (recordState?.tables && recordState?.tables[tableName]?.selectTool) return
  const table = document.getElementsByClassName("current--table")[0]
  table?.removeEventListener('mousemove', redrawRectangle)
  table?.removeEventListener('mousedown', setCanDraw)
  table?.removeEventListener('mouseup', unSetCanDraw)
}

function setCanDraw(event) {
  event.preventDefault()
  resetRectangle()
  RECTANGLE.canDraw = true
  drawRectangle(event)
}

function unSetCanDraw(event) {
  deleteRectangle()
  selectCellsInRectangle()
  resetRectangle()
}

function selectCellsInRectangle() {
  const cellRep = document.querySelector(".cell--container")
  let {width: cellWidth, height: cellHeight} = cellRep.getBoundingClientRect()
  cellWidth = Math.round(cellWidth)
  cellHeight = Math.round(cellHeight)
  
  const selectedCells = []

  for (let row = RECTANGLE.topLeft.y; row <= RECTANGLE.bottomRight.y; row += cellHeight) {
    for (let col = RECTANGLE.topLeft.x; col <= RECTANGLE.bottomRight.x; col += cellWidth) {
      const elements = document.elementsFromPoint(col, row)
      console.log(elements)
      elements.forEach(el => {
        if (el?.classList.contains('cell--container')) {
          selectedCells.push(el)
        }
      })

      // const element = document.elementFromPoint(col, row)
      // console.log(element, "<--")
      // if (element?.classList.contains('cell--container')) {
      //   selectedCells.push(element)
      // }
    }
  }

  console.log(selectedCells.length, selectedCells)
}

function drawRectangle(event) {
  if (!RECTANGLE.canDraw) return
  if (RECTANGLE.id) return          // draw only 1 rect
  event.preventDefault()
  const id = Date.now().toString()
  RECTANGLE.id = id

  const rect = document.createElement("div")
  rect.id = id

  rect.style.top = `${event.pageY}px`
  rect.style.left = `${event.pageX}px`

  RECTANGLE.topLeft = {x: event.pageX, y: event.pageY} 
  RECTANGLE.bottomRight = {x: event.pageX, y: event.pageY}
  RECTANGLE.initPoint = {x: event.pageX, y: event.pageY} 

  rect.classList.add("select--box")
  const table = document.getElementsByClassName("current--table")[0]
  table?.appendChild(rect)
}

function redrawRectangle(event) {
  if (!RECTANGLE.canDraw) return
  if (!RECTANGLE.id) return
  const id = RECTANGLE.id

  const rect = document.getElementById(id)

  const cursorPosition = {x: event.pageX, y: event.pageY}

  const flipped = shouldFlip(cursorPosition)

  setRectangleEdges(cursorPosition, flipped)
  resetRectangleTopLeft(cursorPosition, flipped)

  const width = Math.abs(RECTANGLE.bottomRight.x - RECTANGLE.topLeft.x)
  const height = Math.abs(RECTANGLE.bottomRight.y - RECTANGLE.topLeft.y)
  
  rect.style.width = `${width}px`
  rect.style.height = `${height}px`
}

function shouldFlip(cursorPosition) {
  if (
    cursorPosition.x < RECTANGLE.initPoint.x 
    || cursorPosition.y < RECTANGLE.initPoint.y
  ) {
    return true
  }
  return false
}

function setRectangleEdges(cursorPosition, shouldFlip) {
  if (shouldFlip) {

    if (cursorPosition.x < RECTANGLE.initPoint.x) {
      RECTANGLE.topLeft.x = cursorPosition.x              // shift topleft to the left
      RECTANGLE.bottomRight.x = RECTANGLE.initPoint.x
      RECTANGLE.bottomRight.y = cursorPosition.y          // adjusts horizontal width of rect
    }

    if (cursorPosition.y < RECTANGLE.initPoint.y) {
      RECTANGLE.topLeft.y = cursorPosition.y              // shift topleft up
      RECTANGLE.bottomRight.y = RECTANGLE.initPoint.y     // anchor rectangle to init point
      if (cursorPosition.x < RECTANGLE.initPoint.x)       // anchor rectangle to init point
        RECTANGLE.bottomRight.x = RECTANGLE.initPoint.x
      else                                                // set horizontal width of rect
        RECTANGLE.bottomRight.x = cursorPosition.x
    }

  } else {
    RECTANGLE.bottomRight.x = cursorPosition.x
    RECTANGLE.bottomRight.y = cursorPosition.y
  }
}

function resetRectangleTopLeft(cursorPosition, shouldFlip) {
  if (shouldFlip) {

    const rect = document.getElementById(RECTANGLE.id)
    if (cursorPosition.x < RECTANGLE.initPoint.x) {
      rect.style.left = `${cursorPosition.x}px`
    }

    if (cursorPosition.y < RECTANGLE.initPoint.y) {
      rect.style.top = `${cursorPosition.y}px`
    }

  }
}

function deleteRectangle() {
  if (!RECTANGLE.id) return
  const id = RECTANGLE.id
  const el = document.getElementById(id)
  RECTANGLE.id = ""
  el.remove()
}