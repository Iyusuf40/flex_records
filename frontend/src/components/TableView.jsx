import React, { useEffect } from "react";
import {
  buildTableDataFromCsv,
  changeValueInNestedObj,
  clearRule,
  createEl,
  extractCSVFromData,
  removeCol,
} from "../utils";

const RECTANGLE = {
  canDraw: false,
  topLeft: {},
  bottomRight: {},
  initPoint: {},
  id: "",
};

const COLOR_CLASS_FOR_APPLICABLE_CELLS =
  "cell--is--function--applicable--color";
const CLASS_CELL_IS_SELECTED = "cell--is--selected";

const SELECTED_CELLS_ACCUMULATOR = [];

export default function TableView(props) {
  return <div>hi</div>
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

  enableRectangleDraw(currentTable, props.records);
  disableRectangleDraw(currentTable, props.records);

  displayRegisteredFunctions();

  useEffect(() => {
    let html = document.querySelector("html");
    // alsways scroll to the top on page reload
    html.scrollTop = 0;
  }, []);

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
        <button onClick={(e) => unSetRuleModeToDisplayBtns()}>
          off rule mode
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
            toggleSelectTool(currentTable, props.records);
          }}
        >
          select tool
        </button>
        <button onClick={(e) => toggleShowOrHideRegisteredFunctions()}>
          {table?.showOrHideRegisteredFunctions
            ? "hide functions"
            : "show functions"}
        </button>
      </div>

      <div className="rules--buttons">
        <button onClick={(e) => handleDownloadCSV()}>export to csv</button>
        <button>
          <label className="pointer">
            load from csv
            <input
              type="file"
              className="hide"
              onChange={(e) => handleUploadCsv(e)}
            />
          </label>
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
            id="rev--sub--function"
            name="rules"
            onClick={(e) =>
              registerFunction(
                props.records,
                currentTable,
                "applyReverseSubFunction",
              )
            }
          />
          <label htmlFor="rev--sub--function">reverse subtract function</label>

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
    for (let row = 1; row <= noOfRows; row++) {
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
              key={`${row}:${colIndex}`}
              className={(cellClassName || "") + extendInputClass}
              value={currentRow[colIndex] ? currentRow[colIndex] : ""}
              col={colIndex}
              row={row}
              iscell={"true"}
              id={`${row}:${colIndex}`}
              onChange={(e) =>
                updateTableView(
                  currentTable,
                  props.records,
                  colIndex,
                  e.target.value,
                  row,
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
    return ` ${COLOR_CLASS_FOR_APPLICABLE_CELLS}`;
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
      return ` ${CLASS_CELL_IS_SELECTED}`;
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

function unSetRuleModeToDisplayBtns() {
  if (!recordState) return;
  const currentTable = recordState.currentTable;
  if (!currentTable) return;
  recordState.tables[currentTable].selectedCells = [];
  recordState.tables[currentTable].colorRowsAndCols = [];

  resetSelecetedCellsAccumulator();
  setRecordsStateWrapper(recordState, `tables.${currentTable}.ruleMode`, false);
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
  appendCol(recordState.tables[tableName].data, newNoOfCols);
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
function updateTableView(tableName, recordState, colIndex, value, row) {
  // SN is serial number, used as key in storing rows in
  // records.tables.tableName.data
  setRecordsStateWrapper(
    recordState,
    `tables.${tableName}.data.${row}`,
    replaceAtIndex(recordState.tables[tableName].data[row], colIndex, value),
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

function displayRegisteredFunctions() {
  if (!recordState) return;
  const tableName = recordState.currentTable;

  deleteDivContainerForRegisteredFunctions();

  if (!tableName) return;

  const registeredFunctions =
    recordState?.tables[tableName].registeredFunctions;

  // get names of buttons
  const registeredFunctionsDisplayDescs =
    extractDisplayReqFromRegisteredFuncs(registeredFunctions);
  // build div with id functions--display if it doesnt exist
  createDivContainerForRegisteredFunctionsIfNotExist();
  createRegisteredFunctionsDisplayElements(registeredFunctionsDisplayDescs);
  recordState?.tables[tableName].showOrHideRegisteredFunctions
    ? showDivContainerForRegisteredFunctions()
    : hideDivContainerForRegisteredFunctions();
}

function extractDisplayReqFromRegisteredFuncs(registeredFunctions) {
  if (!registeredFunctions) return;
  const displayResources = {};
  let index = 0;

  for (const rFunc of registeredFunctions) {
    const name = rFunc.functionName
      .replace("apply", "")
      .replace("Function", "");
    const cellsToOperateOnAsAGroup = rFunc.cellsToOperateOnAsAGroup;
    const topLeftCellAndBottomRightCell = getTopLeftCellAndBottomRightCell(
      cellsToOperateOnAsAGroup.flat(),
    );
    const key = `${name}_${index}`;
    displayResources[key] = topLeftCellAndBottomRightCell;
    index++;
  }

  function getTopLeftCellAndBottomRightCell(flattenedCellsToOperateOnAsAGroup) {
    if (!flattenedCellsToOperateOnAsAGroup.length) return;
    const cellRep = flattenedCellsToOperateOnAsAGroup[0];

    // add target cell in box to draw
    flattenedCellsToOperateOnAsAGroup.push({
      row: cellRep.targetRow,
      column: cellRep.targetCol,
    });
    let leastRow = cellRep.row;
    let leastCol = cellRep.column;
    let maxRow = cellRep.row;
    let maxCol = cellRep.column;

    for (const cellRep of flattenedCellsToOperateOnAsAGroup) {
      if (cellRep.row < leastRow) leastRow = cellRep.row;
      if (cellRep.row > maxRow) maxRow = cellRep.row;
      if (cellRep.column < leastCol) leastCol = cellRep.column;
      if (cellRep.column > leastCol) maxCol = cellRep.column;
    }

    return { leastRow, leastCol, maxRow, maxCol };
  }

  return displayResources;
}

function createDivContainerForRegisteredFunctionsIfNotExist() {
  const id = "registered--funcs--display--elements--container";
  let registeredFuncsBtnsContainer = document.getElementById(id);
  if (registeredFuncsBtnsContainer) return;
  registeredFuncsBtnsContainer = createEl("div", { id });
  const currentTableEl = document.getElementsByClassName("current--table")[0];
  currentTableEl.appendChild(registeredFuncsBtnsContainer);
}

function createRegisteredFunctionsDisplayElements(rFunctionsDisplayDescs) {
  if (!rFunctionsDisplayDescs) return;
  const id = "registered--funcs--display--elements--container";
  let registeredFuncsBtnsContainer = document.getElementById(id);

  removeAllRegFunctionDisplayEl();

  for (const key in rFunctionsDisplayDescs) {
    const rFunctionDisplayEl = createEl("div", {
      class: "registered--func--display--el",
    });
    addContentToRegFunctionDisplayEl(rFunctionDisplayEl, key);
    const displayDesc = rFunctionsDisplayDescs[key];
    addEventListenersForRFuncsDisplayElements(rFunctionDisplayEl, displayDesc);
    registeredFuncsBtnsContainer.appendChild(rFunctionDisplayEl);
  }
}

function removeAllRegFunctionDisplayEl() {
  const elements = document.getElementsByClassName(
    "registered--func--display--el",
  );
  Array.from(elements).forEach((el) => el.remove());
}

function addContentToRegFunctionDisplayEl(rFunctionDisplayEl, key) {
  const container = createEl("div");
  const textSpan = createEl("span");
  textSpan.innerText = key;
  textSpan.style.color = "black";
  const deleteSpan = createEl("span", { class: "hover--bold" });
  deleteSpan.addEventListener("click", () => {
    const index = Number(key.split("_")[1]);
    deleteRegisteredFunctionAtIndex(index);
    deleteBoxOverRegisteredFunctions();
  });
  deleteSpan.innerText = "x";
  deleteSpan.style.color = "red";
  container.appendChild(textSpan);
  container.appendChild(deleteSpan);
  container.style.display = "flex";
  container.style.justifyContent = "space-between";
  container.style.gap = "5px";
  rFunctionDisplayEl.appendChild(container);
}

function addEventListenersForRFuncsDisplayElements(
  rFunctionDisplayEl,
  displayDesc,
) {
  rFunctionDisplayEl.addEventListener("mouseenter", () => {
    drawBoxOverRegisteredFunctions(displayDesc);
  });

  rFunctionDisplayEl.addEventListener("mouseleave", () => {
    deleteBoxOverRegisteredFunctions();
  });

  rFunctionDisplayEl.addEventListener("touchstart", () => {
    drawBoxOverRegisteredFunctions(displayDesc);
  });

  rFunctionDisplayEl.addEventListener("touchenter", () => {
    drawBoxOverRegisteredFunctions(displayDesc);
  });

  rFunctionDisplayEl.addEventListener("touchleave", () => {
    deleteBoxOverRegisteredFunctions();
  });

  rFunctionDisplayEl.addEventListener("touchend", () => {
    deleteBoxOverRegisteredFunctions();
  });

  rFunctionDisplayEl.addEventListener("touchcancel", () => {
    deleteBoxOverRegisteredFunctions();
  });
}

function drawBoxOverRegisteredFunctions(displayDesc) {
  const topLeftCellId = `${displayDesc.leastRow}:${displayDesc.leastCol}`;
  const bottomRightCellId = `${displayDesc.maxRow}:${displayDesc.maxCol}`;
  const topLeftCell = document.getElementById(topLeftCellId);
  const bottomRightCell = document.getElementById(bottomRightCellId);
  const left = topLeftCell.getBoundingClientRect().left;
  const top = topLeftCell.getBoundingClientRect().top;
  const width = bottomRightCell.getBoundingClientRect().right - left;
  const height = bottomRightCell.getBoundingClientRect().bottom - top;

  const box = createEl("div", { class: "registered--funcs--box" });

  box.style.left = `${left}px`;
  box.style.top = `${top}px`;
  box.style.width = `${width}px`;
  box.style.height = `${height}px`;

  const body = document.querySelector("body");
  body.appendChild(box);
}

function deleteBoxOverRegisteredFunctions() {
  const boxes = document.getElementsByClassName("registered--funcs--box");
  Array.from(boxes).forEach((box) => box.remove());
}

function showDivContainerForRegisteredFunctions() {
  const id = "registered--funcs--display--elements--container";
  let registeredFuncsBtnsContainer = document.getElementById(id);
  registeredFuncsBtnsContainer.classList.remove("hide");
}

function hideDivContainerForRegisteredFunctions() {
  const id = "registered--funcs--display--elements--container";
  let registeredFuncsBtnsContainer = document.getElementById(id);
  registeredFuncsBtnsContainer?.classList.add("hide");
}

function deleteDivContainerForRegisteredFunctions() {
  const id = "registered--funcs--display--elements--container";
  let registeredFuncsBtnsContainer = document.getElementById(id);
  registeredFuncsBtnsContainer?.remove();
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

function deleteRegisteredFunctionAtIndex(index) {
  if (!recordState) return;
  const tableName = recordState.currentTable;
  recordState.tables[tableName].registeredFunctions.splice(index, 1);
  setRecordsStateWrapper(recordState, "currentTable", tableName);
  // force function application
  runRegisteredFunctions(recordState, tableName);
}

function runRegisteredFunctions(recordState, tableName) {
  const functionNameToFunctionApplierMap = {
    applySumFunction: applySumFunction,
    applySubFunction: applySubFunction,
    applyReverseSubFunction: applyReverseSubFunction,
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

function applyReverseSubFunction(
  recordState,
  tableName,
  cellsToOperateOnAsAGroup,
) {
  const data = recordState.tables[tableName].data;
  const updatedData = reverseSubFunctionImpl(data, cellsToOperateOnAsAGroup);
  setRecordsStateWrapper(recordState, `tables.${tableName}.data`, updatedData);
  clearSelectedCells(tableName, recordState);
}

function reverseSubFunctionImpl(data, cellsToOperateOnAsAGroup) {
  const relevantData = extractRelevantData(data, cellsToOperateOnAsAGroup);
  const { targetRow, targetCol } = cellsToOperateOnAsAGroup[0];
  let res = 0;
  let start = false;
  relevantData.reverse().forEach((v) => {
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
      // move columns back
      currRow[i] = currRow[i + 1];
    }
    currRow.splice(len - 1); // delete last col
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
  RECTANGLE.canDraw = false;
  RECTANGLE.topLeft = {};
  RECTANGLE.bottomRight = {};
  RECTANGLE.initPoint = {};
  resetTableViewScroll();
}

function toggleSelectTool(tableName, recordState) {
  const value = recordState.tables[tableName].selectTool ? false : true;
  recordState.altered = true;
  setRecordsStateWrapper(recordState, `tables.${tableName}.selectTool`, value);
}

function toggleShowOrHideRegisteredFunctions() {
  if (!recordState?.tables) return;
  const tableName = recordState.currentTable;
  const value = recordState.tables[tableName].showOrHideRegisteredFunctions
    ? false
    : true;
  setRecordsStateWrapper(
    recordState,
    `tables.${tableName}.showOrHideRegisteredFunctions`,
    value,
  );
}

function enableRectangleDraw(tableName, recordState) {
  if (!recordState?.tables || !recordState?.tables[tableName]?.selectTool)
    return;
  const table = document.getElementsByClassName("current--table")[0];
  table?.addEventListener("mousedown", setCanDraw);
  table?.addEventListener("mousemove", redrawRectangle);
  table?.addEventListener("mouseup", stopDraw);

  table?.addEventListener("touchstart", setCanDraw);
  table?.addEventListener("touchmove", redrawRectangle);
  table?.addEventListener("touchend", stopDraw);
}

function disableRectangleDraw(tableName, recordState) {
  if (recordState?.tables && recordState?.tables[tableName]?.selectTool) return;
  const table = document.getElementsByClassName("current--table")[0];
  table?.removeEventListener("mousemove", redrawRectangle);
  table?.removeEventListener("mousedown", setCanDraw);
  table?.removeEventListener("mouseup", stopDraw);

  table?.removeEventListener("touchmove", redrawRectangle);
  table?.removeEventListener("touchstart", setCanDraw);
  table?.removeEventListener("touchend", stopDraw);
}

function setCanDraw(event) {
  event.preventDefault();
  resetRectangle();
  RECTANGLE.canDraw = true;
}

function stopDraw(event) {
  deleteRectangle();
  const selectedCells = selectCellsInRectangle();
  handleSelectedCells(selectedCells);
  resetRectangle();
}

function redrawRectangle(event) {
  if (!RECTANGLE.canDraw) return;
  if (!RECTANGLE.id) {
    drawRectangle(event);
  }

  event.preventDefault();

  const id = RECTANGLE.id;

  const rect = document.getElementById(id);

  const cursorPosition = {
    x: event.pageX ?? event.changedTouches[0].pageX,
    y: event.pageY ?? event.changedTouches[0].pageY,
  };

  const flipped = shouldFlip(cursorPosition);

  resetRectangleTopLeftIfShouldFlip(cursorPosition, flipped);

  scrollTableIfCursorCloseToEdge(cursorPosition, flipped);

  const width = Math.abs(
    RECTANGLE.bottomRight.relativeX - RECTANGLE.topLeft.relativeX,
  );
  const height = Math.abs(
    RECTANGLE.bottomRight.relativeY - RECTANGLE.topLeft.relativeY,
  );

  rect.style.width = `${width}px`;
  rect.style.height = `${height}px`;
}

function drawRectangle(event) {
  if (!RECTANGLE.canDraw) return;
  if (RECTANGLE.id) return; // draw only 1 rect

  setCurrentTableBoundingRect();
  setCurrentTableCSSProps();

  event.preventDefault();

  const id = Date.now().toString();
  RECTANGLE.id = id;

  const table = document.getElementsByClassName("current--table")[0];

  const rect = document.createElement("div");
  rect.id = id;

  let x = event.pageX ?? event.changedTouches[0].pageX;
  let y = event.pageY ?? event.changedTouches[0].pageY;

  let relativeY = getAdjustedY(y);
  let relativeX = getAdjustedX(x);
  rect.style.top = `${relativeY}px`;
  rect.style.left = `${relativeX}px`;

  RECTANGLE.topLeft = { relativeX, relativeY };
  RECTANGLE.bottomRight = { relativeX, relativeY };
  RECTANGLE.initPoint = { relativeX, relativeY };

  rect.classList.add("select--box");
  table?.appendChild(rect);
}

function shouldFlip(cursorPosition) {
  let adjustedY = getAdjustedY(cursorPosition.y);
  let adjustedX = getAdjustedX(cursorPosition.x);

  if (
    adjustedX < RECTANGLE.initPoint.relativeX ||
    adjustedY < RECTANGLE.initPoint.relativeY
  ) {
    return true;
  }
  return false;
}

function resetRectangleTopLeftIfShouldFlip(cursorPosition, shouldFlip) {
  if (shouldFlip) {
    const rect = document.getElementById(RECTANGLE.id);

    let adjustedY = getAdjustedY(cursorPosition.y);
    let adjustedX = getAdjustedX(cursorPosition.x);

    if (adjustedX < RECTANGLE.initPoint.relativeX) {
      rect.style.left = `${adjustedX}px`;
    }

    if (adjustedY < RECTANGLE.initPoint.relativeY) {
      rect.style.top = `${adjustedY}px`;
    }
  }
}

let tableViewScrollData = {
  updatedTop: 0,
  updatedLeft: 0,
  currentTableBoundingRect: null,
  currentTableCSSProps: null,
  scrollingX: false,
  scrollingY: false,
  actualTableBoundingRect: null,
};

function setCurrentTableBoundingRect() {
  let tableContainer = document.getElementsByClassName("current--table")[0];
  tableViewScrollData.currentTableBoundingRect =
    tableContainer.getBoundingClientRect();
}

function setCurrentTableCSSProps() {
  let tableContainer = document.getElementsByClassName("current--table")[0];
  tableViewScrollData.currentTableCSSProps = getComputedStyle(tableContainer);
}

function resetTableViewScroll() {
  resetUpdatedTopLeft();
  resetActualTableElBoundingRect();
  resetScrolling();
}

function resetUpdatedTopLeft() {
  let tableView = document.getElementsByClassName("table--view")[0];
  tableViewScrollData.updatedTop = tableView.scrollTop;
  tableViewScrollData.updatedLeft = tableView.scrollLeft;
}

function resetScrolling() {
  tableViewScrollData.scrollingX = false;
  tableViewScrollData.scrollingY = false;
}

function resetActualTableElBoundingRect() {
  let currentTableEl = document.querySelector(".current--table");

  let currentTableElBoundingRect = currentTableEl.getBoundingClientRect();

  tableViewScrollData.actualTableBoundingRect = {
    right: currentTableElBoundingRect.right + tableViewScrollData.updatedLeft,
    left: currentTableElBoundingRect.left + tableViewScrollData.updatedLeft,
    top: currentTableElBoundingRect.top + tableViewScrollData.updatedTop,
    bottom: currentTableElBoundingRect.bottom + tableViewScrollData.updatedTop,
  };
}

function scrollTableIfCursorCloseToEdge(cursorPosition, flipped) {
  let tableContainer = document.getElementsByClassName("current--table")[0];
  let tableView = document.getElementsByClassName("table--view")[0];
  let rect = document.getElementById(RECTANGLE.id);
  if (!tableContainer || !tableView || !rect) {
    throw new Error(
      "scrollTableIfCursorCloseToEdge: tableContainer, tableView and rect cannot be undefined",
    );
  }

  const scrollTreshold = 75;
  const scrollPixel = 200;

  let tableBoundingRect = tableContainer.getBoundingClientRect();

  let tableViewLeft =
    tableViewScrollData.actualTableBoundingRect.left -
    tableViewScrollData.updatedLeft;

  let tableEdgeTop = Math.max(
    tableViewScrollData.actualTableBoundingRect.top -
      tableViewScrollData.updatedTop,
    0,
  );

  let tableEdgeBottom = Math.min(
    tableViewScrollData.actualTableBoundingRect.bottom -
      tableViewScrollData.updatedTop -
      parseFloat(
        tableViewScrollData.currentTableCSSProps.getPropertyValue(
          "padding-bottom",
        ),
      ),
    window.innerHeight,
  );

  let tableEdgeLeft = Math.max(tableBoundingRect.left - tableViewLeft, 0);

  let tableEdgeRight = Math.min(
    tableViewScrollData.actualTableBoundingRect.right -
      tableViewScrollData.updatedLeft -
      parseFloat(
        tableViewScrollData.currentTableCSSProps.getPropertyValue(
          "padding-left",
        ),
      ),
    window.innerWidth,
  );

  let dataRequiredForScroll = {
    cursorPosition,
    tableBoundingRect,
    tableView,
    scrollTreshold,
    scrollPixel,
    tableEdgeRight,
    tableEdgeLeft,
    tableEdgeTop,
    tableEdgeBottom,
  };
  // scroll down
  scrollTableViewDown(dataRequiredForScroll);

  // scroll up
  scrollTableViewUp(dataRequiredForScroll);

  // scroll right
  scrollTableViewRight(dataRequiredForScroll);

  // scroll left
  scrollTableViewLeft(dataRequiredForScroll);

  setRectangleEdges(cursorPosition, flipped);
}

function scrollTableViewDown({
  cursorPosition,
  tableView,
  tableEdgeBottom,
  scrollTreshold,
  scrollPixel,
}) {
  if (
    tableEdgeBottom - cursorPosition.y < scrollTreshold &&
    tableEdgeBottom >= window.innerHeight
  ) {
    let scrollableLength = Math.max(
      0,
      Math.min(scrollPixel, tableEdgeBottom - cursorPosition.y),
    );

    tableView.scrollTop += scrollableLength;
    tableViewScrollData.updatedTop += scrollableLength;
    cursorPosition.y += scrollableLength;
  }
}

function scrollTableViewUp({
  cursorPosition,
  tableBoundingRect,
  tableView,
  scrollTreshold,
  scrollPixel,
  tableEdgeTop,
}) {
  if (
    cursorPosition.y - tableEdgeTop < scrollTreshold &&
    tableEdgeTop > tableBoundingRect.top
  ) {
    let scrollableLength = Math.max(
      0,
      Math.min(scrollPixel, cursorPosition.y - tableEdgeTop),
    );

    tableView.scrollTop -= scrollableLength;
    tableViewScrollData.updatedTop -= scrollableLength;
    cursorPosition.y -= scrollableLength;
  }
}

function scrollTableViewRight({
  cursorPosition,
  tableView,
  scrollTreshold,
  scrollPixel,
  tableEdgeRight,
}) {
  if (
    tableEdgeRight - cursorPosition.x < scrollTreshold &&
    tableEdgeRight >= window.innerWidth
  ) {
    let scrollableLength = Math.max(
      0,
      Math.min(scrollPixel, tableEdgeRight - cursorPosition.x),
    );

    if (scrollableLength > 0) {
      tableView.scrollLeft += scrollableLength;
      tableViewScrollData.updatedLeft += scrollableLength;
      cursorPosition.x += scrollableLength;
    }
  }
}

function scrollTableViewLeft({
  cursorPosition,
  tableBoundingRect,
  tableView,
  scrollTreshold,
  scrollPixel,
  tableEdgeLeft,
}) {
  let tableViewBoundingRect = tableView.getBoundingClientRect();
  let tableViewLeft = tableViewBoundingRect.left;

  if (
    cursorPosition.x - tableEdgeLeft - tableView.getBoundingClientRect().left <
      scrollTreshold &&
    tableEdgeLeft > tableBoundingRect.left - tableViewLeft
  ) {
    let scrollableLength = Math.max(
      0,
      Math.min(
        scrollPixel,
        cursorPosition.x -
          tableEdgeLeft -
          tableView.getBoundingClientRect().left,
      ),
    );

    tableView.scrollLeft -= scrollableLength;
    tableViewScrollData.updatedLeft -= scrollableLength;
    cursorPosition.x -= scrollableLength;
  }
}

function setRectangleEdges(cursorPosition, shouldFlip) {
  let adjustedY = getAdjustedY(
    cursorPosition.y,
    tableViewScrollData.scrollingY,
  );
  let adjustedX = getAdjustedX(
    cursorPosition.x,
    tableViewScrollData.scrollingX,
  );

  if (shouldFlip) {
    if (adjustedX < RECTANGLE.initPoint.relativeX) {
      RECTANGLE.topLeft.relativeX = adjustedX; // shift topleft to the left
      RECTANGLE.bottomRight.relativeX = RECTANGLE.initPoint.relativeX;
      RECTANGLE.bottomRight.relativeY = adjustedY; // adjusts horizontal width of rect
    }

    if (adjustedY < RECTANGLE.initPoint.relativeY) {
      RECTANGLE.topLeft.relativeY = adjustedY; // shift topleft up
      RECTANGLE.bottomRight.relativeY = RECTANGLE.initPoint.relativeY; // anchor rectangle to init point
      if (adjustedX < RECTANGLE.initPoint.relativeX)
        // anchor rectangle to init point
        RECTANGLE.bottomRight.relativeX = RECTANGLE.initPoint.relativeX;
      // set horizontal width of rect
      else RECTANGLE.bottomRight.relativeX = adjustedX;
    }
  } else {
    RECTANGLE.bottomRight.relativeX = adjustedX;
    RECTANGLE.bottomRight.relativeY = adjustedY;
  }
}

function getAdjustedX(x) {
  let adjustedX =
    x -
    tableViewScrollData.actualTableBoundingRect.left +
    tableViewScrollData.updatedLeft -
    parseFloat(
      tableViewScrollData.currentTableCSSProps.getPropertyValue("padding-left"),
    );

  return adjustedX;
}

function getAdjustedY(y) {
  let tableBottom = tableViewScrollData.actualTableBoundingRect.bottom;
  let updatedTop = tableViewScrollData.updatedTop;
  let paddingTop = parseFloat(
    tableViewScrollData.currentTableCSSProps.getPropertyValue("padding-top"),
  );

  return y - tableBottom + updatedTop + paddingTop;
}

function reverseAdjustedX(adjustedX) {
  let x =
    adjustedX +
    tableViewScrollData.actualTableBoundingRect.left -
    tableViewScrollData.updatedLeft +
    parseFloat(
      tableViewScrollData.currentTableCSSProps.getPropertyValue("padding-left"),
    );
  return x;
}

function reverseAdjustedY(adjustedY) {
  let tableBottom = tableViewScrollData.actualTableBoundingRect.bottom;
  let updatedTop = tableViewScrollData.updatedTop;
  let paddingTop = parseFloat(
    tableViewScrollData.currentTableCSSProps.getPropertyValue("padding-top"),
  );

  let y = adjustedY + tableBottom - updatedTop - paddingTop;

  return y;
}

function getPadding(el, side) {
  return parseFloat(window.getComputedStyle(el, null).getPropertyValue(side));
}

function deleteRectangle() {
  if (!RECTANGLE.id) return;
  const id = RECTANGLE.id;
  const el = document.getElementById(id);
  RECTANGLE.id = "";
  el.remove();
}

function selectCellsInRectangle() {
  let cells = Array.from(document.getElementsByClassName("cell--input"));

  const selectedCells = [];

  if (cells.length === 0) return selectedCells;

  let cellBoundingRect = cells[0].getBoundingClientRect();

  // use half cell height and width to pad select box so as to
  // select cells half highlighted
  let halfCellHeight = cellBoundingRect.height / 2;
  let halfCellWidth = cellBoundingRect.width / 2;

  let topLeftX = reverseAdjustedX(RECTANGLE.topLeft.relativeX) - halfCellWidth;
  let topLeftY = reverseAdjustedY(RECTANGLE.topLeft.relativeY) - halfCellHeight;
  let bottomRightX =
    reverseAdjustedX(RECTANGLE.bottomRight.relativeX) + halfCellWidth;
  let bottomRightY =
    reverseAdjustedY(RECTANGLE.bottomRight.relativeY) + halfCellHeight;

  cells.forEach((cell) => {
    cellBoundingRect = cell.getBoundingClientRect();
    if (
      Math.floor(cellBoundingRect.left) >= topLeftX &&
      Math.floor(cellBoundingRect.top) >= topLeftY &&
      Math.floor(cellBoundingRect.right) <= bottomRightX &&
      Math.floor(cellBoundingRect.bottom) <= bottomRightY
    ) {
      selectedCells.push(cell);
    }
  });

  return selectedCells;
}

function handleSelectedCells(selectedCells) {
  if (!selectedCells || selectedCells.length === 0) return;

  if (SELECTED_CELLS_ACCUMULATOR.length === 0) {
    SELECTED_CELLS_ACCUMULATOR.push(selectedCells);
    colorSelectedCells(selectedCells);
    return;
  }

  const initialSelection = SELECTED_CELLS_ACCUMULATOR[0];

  if (thereIsIntersection(selectedCells, initialSelection)) {
    alert("cannot place computation in cells used as input for computation");
    return;
  }

  // check wether to place result in row or col
  const placementDesc = getDestinationDesc(selectedCells, initialSelection);
  if (placementDesc === null) {
    alert(
      "destination row or column for computation must align with input for computation",
    );
    return;
  }

  // set cells in selected cells
  batchSetCellsInSelectedCells(initialSelection, placementDesc);

  deColorizeSelectedCells(initialSelection);
  SELECTED_CELLS_ACCUMULATOR.splice(0);
}

function resetSelecetedCellsAccumulator() {
  const initialSelection = SELECTED_CELLS_ACCUMULATOR[0];
  deColorizeSelectedCells(initialSelection || []);
  SELECTED_CELLS_ACCUMULATOR.splice(0);
}

function colorSelectedCells(selectedCells) {
  selectedCells.forEach((cell) => {
    cell.classList.add(CLASS_CELL_IS_SELECTED);
  });
}

function deColorizeSelectedCells(selectedCells) {
  selectedCells.forEach((cell) => {
    cell.classList.remove(CLASS_CELL_IS_SELECTED);
  });
}

function thereIsIntersection(selectedCells, initialSelection) {
  const hMap = new Map();
  for (const cell of initialSelection) {
    hMap.set(`${cell.getAttribute("row")}:${cell.getAttribute("col")}`, true);
  }

  for (const cell of selectedCells) {
    if (hMap.get(`${cell.getAttribute("row")}:${cell.getAttribute("col")}`)) {
      return true;
    }
  }

  return false;
}

function getDestinationDesc(selectedCells, initialSelection) {
  const targetCell = selectedCells[0];
  const inputCell_0 = initialSelection[0];
  const targetRow = Number(targetCell.getAttribute("row"));
  const targetCol = Number(targetCell.getAttribute("col"));
  const inputRow = Number(inputCell_0.getAttribute("row"));
  const inputCol = Number(inputCell_0.getAttribute("col"));

  if (targetCol === inputCol) {
    return {
      direction: "y",
      targetRow: targetRow,
      targetCol: targetCol,
    };
  }

  if (targetRow === inputRow) {
    return {
      direction: "x",
      targetRow: targetRow,
      targetCol: targetCol,
    };
  }

  return null;
}

function batchSetCellsInSelectedCells(initialSelection, placementDesc) {
  // colorRowsAndCols, row, colIndex, recordState

  const currentTable = recordState.currentTable;
  if (!currentTable) return;
  if (!recordState.tables[currentTable].selectedCells)
    recordState.tables[currentTable].selectedCells = {};

  let { targetRow, targetCol } = placementDesc;

  for (const el of initialSelection) {
    const row = Number(el.getAttribute("row"));
    const col = Number(el.getAttribute("col"));

    if (placementDesc.direction === "x") {
      targetRow = row;
    } else {
      targetCol = col;
    }

    const cell = { row, column: col, colIndex: col, targetRow, targetCol };
    const key = `${targetRow}.${targetCol}`;
    pushCellInSelectedCells(
      recordState.tables[currentTable].selectedCells,
      key,
      cell,
    );
  }

  setRecordsStateWrapper(recordState, "currentTable", currentTable);
}

function handleDownloadCSV() {
  if (!recordState) throw new Error("recordState undefined");
  if (!recordState.currentTable) throw new Error("currentTable undefined");
  const tableName = recordState.currentTable;

  const tableData = recordState.tables[tableName].data;
  const csv = extractCSVFromData(tableData);

  downloadFile(tableName, csv);
}

// function adapted from https://stackoverflow.com/a/33542499
function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/csv" });
  const elem = window.document.createElement("a");
  elem.style.display = "none";
  const url = window.URL.createObjectURL(blob);
  elem.href = url;
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
  URL.revokeObjectURL(url);
}

function handleUploadCsv(event) {
  const file = event.target.files?.item(0);
  if (!file) return;

  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = (e) => {
    const csv = e.target.result;
    const tableData = buildTableDataFromCsv(csv);
    if (!isValidTableData(tableData)) throw new Error("Invalid table data");
    const tableName = file.name.replace(".csv", "");
    loadTableDataAsCurrentTable(tableData, tableName);
  };

  reader.addEventListener("error", (e) => console.error(e));
  reader.addEventListener("abort", (e) => console.error(e));
}

function isValidTableData(tableData) {
  const firstRow = tableData[1];
  if (!firstRow || !Array.isArray(firstRow)) return false;

  for (const row in tableData) {
    if (typeof Number(row) !== "number") return false;
    const currentRow = tableData[row];
    if (!Array.isArray(currentRow)) return false;
    for (let i = 0; i < currentRow.length; i++) {
      const type = typeof currentRow[i];
      if (type !== "string") return false;
    }
  }

  return true;
}

function loadTableDataAsCurrentTable(tableData, tableName) {
  // check if table with name exist
  if (recordState.tables[tableName]) {
    const resp = prompt(
      `table with name ${tableName} exists, do you want to overwrite it?`,
    );
    if (
      resp.toLocaleLowerCase() !== "y" &&
      resp.toLocaleLowerCase() !== "yes"
    ) {
      let name = prompt("type in the name you want to call this table");
      if (!name) return;
      return loadTableDataAsCurrentTable(tableData, name);
    }
  }

  recordState.currentTable = tableName;
  setRecordsStateWrapper(recordState, `tables.${tableName}`, {
    data: tableData,
    noOfRows: Object.values(tableData).length,
    noOfCols: Math.max(...Object.values(tableData).map((row) => row.length)), // tableData[1].length,
    ruleMode: false,
    currentRule: "",
    altered: true,
  });
}
