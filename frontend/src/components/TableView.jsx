import React from 'react';
import { changeValueInNestedObj, removeCol } from '../utils';

export default function TableView(props) {

  let {
    currentTable, tableData, noOfCols, noOfRows, table
  } = getCurrentTableProps(props)

  const className = getClassName(table);

  const clearFormObj = {
    createTableMode: null,
    fields: {
      name: '',
      noOfRows: '',
      noOfCols: '',
    },
  };

  let [formObj, setFormObj] = React.useState(clearFormObj);

  let classCreateTableMode = '';

  if (props.records.createTableBtnClicked) {
    classCreateTableMode = '';
  } else {
    classCreateTableMode = 'hide';
  }

  function parseCreateTableForm(formObj, e, recordState) {
    e.preventDefault();
    const { noOfRows } = formObj.fields;
    const { noOfCols } = formObj.fields;
    const { name } = formObj.fields;
    createTable(recordState, name, noOfRows, noOfCols);
    setFormObj(clearFormObj);
  }

  function cancelCreateTableForm(formObj, e) {
    e.preventDefault();
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
  let rowIndex = 0;
  if (tableData) {
    for (let row = 1; row <= noOfRows; row++) {
      const saveRowIndex = rowIndex;
      const currentRow = tableData[row];
      const rowContainer = [];
      for (let colIndex = 0; colIndex < noOfCols; colIndex++) {
        const cell = (
          <input
            type="text"
            key={colIndex}
            className={!colIndex ? 'label--col' : (className || '')}
            placeholder={!colIndex ? 'label' : ''}
            value={currentRow[colIndex] ? currentRow[colIndex] : ''}
            data-col-index={colIndex}
            data-row-index={saveRowIndex}
            onChange={(e) => updateTableView(
              currentTable,
		          props.records,
		          colIndex,
	            e.target.value,
	            saveRowIndex + 1,
            )}

            onClick={(e) => {
              if (table.ruleMode && table.currentRule) { 
                pickCells(
                  table.currentRule,
                  currentTable,
                  row,
                  colIndex,
                  noOfRows,
                  noOfCols,
                  props.records
                )
              } else if ( table.ruleModeAdv && table.currentRule) {
                pickCellsAdv(
                  table.currentRule,
                  currentTable,
                  row,
                  colIndex,
                  noOfRows,
                  noOfCols,
                  props.records
                )
              }
              if (table.insertMode) handleInsert(
                currentTable, noOfRows, noOfCols, row, colIndex, props.records
              )
              if (table.deleteMode) handleDelete(currentTable, noOfRows, noOfCols, row, colIndex, props.records)
                
            } 
    }
          />
        );
        rowContainer.push(cell);
      }
      tableView.push(
        <div
          key={row}
          className="row--container"
        >
          {'' && (
          <span className="numbering">
            {row}
            :
            {' '}
          </span>
          )}
          {rowContainer}
        </div>,
      );
      rowIndex++;
    }
  }
  // const tableView = <input type="text" value="12" />

  return (
    <div className="table--view">
      <div className={`create--form--container ${classCreateTableMode}`}>
        <form className="create--form">
          <div className="form--block">
            <label htmlFor="table--name">Table name</label>
            <input
              type="text"
              id="table--name"
              name="table--name"
              placeholder="e.g my table"
              value={formObj.fields.name}
              onChange={(e) => handleCreateFormChange('name', e.target.value)}
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
              onChange={(e) => handleCreateFormChange('noOfRows', e.target.value)}
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
              onChange={(e) => handleCreateFormChange('noOfCols', e.target.value)}
            />
          </div>
          <div className="create--form--btns">
            <button onClick={(e) => {
                parseCreateTableForm(formObj, e, props.records)
              }}>
              create
            </button>
            <button className="cancel--btn" onClick={(e) => cancelCreateTableForm(formObj, e)}>
              cancel
            </button>
          </div>
        </form>
      </div>
      <div className="rules--buttons">
        <button
          onClick={(e) => addColumn(props.setRecordsStateWrapper, currentTable, props.records)}
        >
          add column +
        </button>
        <button
          onClick={(e) => delColumn(props.setRecordsStateWrapper, currentTable, props.records)}
        >
          del column -
        </button>
        <button
          onClick={(e) => addRow(props.setRecordsStateWrapper, currentTable, props.records)}
        >
          add row +
        </button>
        <button
          onClick={(e) => delRow(props.setRecordsStateWrapper, currentTable, props.records)}
        >
          del row -
        </button>
        <button
          onClick={(e) => setInsertMode(currentTable, props.records)}
        >
          insert
        </button>
        <button
          onClick={(e) => setDeleteMode(currentTable, props.records)}
        >
          delete
        </button>
      </div>
      <div className="rules--buttons">
        <button
          onClick={(e) => addRule(currentTable, props.records)}
        >
          add rule +
        </button>
        <button
          onClick={(e) => addRuleAdv(currentTable, props.records)}
        >
          advanced +
        </button>
        <button
          onClick={(e) => clearRule(currentTable, props.records)}
        >
          clear rule -
        </button>
        <button
          onClick={(e) => increaseCellSize(currentTable, props.records)}
        >
          cell size +
        </button>
        <button
          onClick={(e) => decreaseCellSize(currentTable, props.records)}
        >
          cell size -
        </button>

      </div>
      {
        table.ruleMode
          ? (
            <div className="rule--options">
              <input
                type="radio"
                id="sum"
                name="rules"
                onClick={(e) => afterRulePick('sum', currentTable, props.records)}
              />
              <label htmlFor="sum">sum</label>
              <input
                type="radio"
                id="subtract"
                name="rules"
                onClick={(e) => afterRulePick('subtract', currentTable, props.records)}
              />
              <label htmlFor="subtract">subtract</label>
              <input
                type="radio"
                id="subtractReverse"
                name="rules"
                onClick={(e) => afterRulePick('subtractReverse', currentTable, props.records)}
              />
              <label htmlFor="subtractReverse">subtract-reverse</label>
              <input
                type="radio"
                id="multiply"
                name="rules"
                onClick={(e) => afterRulePick('multiply', currentTable, props.records)}
              />
              <label htmlFor="multiply">multiply</label>
              <input
                type="radio"
                id="average"
                name="rules"
                onClick={(e) => afterRulePick('average', currentTable, props.records)}
              />
              <label htmlFor="average">average</label>

            </div>
          )
          : ''
      }
      {
        table.ruleModeAdv
          ? (
            <div className="rule--options">
              <input
                type="radio"
                id="sum"
                name="rules"
                onClick={(e) => afterRulePickAdv('sum', currentTable, props.records)}
              />
              <label htmlFor="sum">sum adv</label>
              <input
                type="radio"
                id="subtract"
                name="rules"
                onClick={(e) => afterRulePickAdv('subtract', currentTable, props.records)}
              />
              <label htmlFor="subtract">subtract adv</label>
              <input
                type="radio"
                id="subtractReverse"
                name="rules"
                onClick={(e) => afterRulePickAdv('subtractReverse', currentTable, props.records)}
              />
              <label htmlFor="subtractReverse">subtract-reverse adv</label>
              <input
                type="radio"
                id="multiply"
                name="rules"
                onClick={(e) => afterRulePickAdv('multiply', currentTable, props.records)}
              />
              <label htmlFor="multiply">multiply adv</label>
              <input
                type="radio"
                id="average"
                name="rules"
                onClick={(e) => afterRulePickAdv('average', currentTable, props.records)}
              />
              <label htmlFor="average">average adv</label>

            </div>
          )
          : ''
      }

      <div className="current--table">
        {tableView.length ? tableView : <h1>No table selected</h1>}
      </div>
    </div>
  );
}

function unsetCreateTableBtnClicked(setRecordsStateWrapper, recordState) {
  setRecordsStateWrapper(recordState, "createTableBtnClicked", false)
}

function createTable(recordState, name, noOfRows, noOfCols) {
  if (!name) {
    return;
  }

  if (recordState.tables && recordState.tables[name]) {
    const option = prompt(`Table ${name} already exist, if you type 'yes' it
will be overwritten`);
    if (option && option.toLowerCase() !== 'yes') {
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
  
  recordState.altered = true
  recordState.createTableBtnClicked = false
  recordState.rowsAndColsNoSet = true
  recordState.currentTable = name
  recordState.id ? recordState.id : recordState.id = localStorage.getItem("flexId")
  recordState.tables ? recordState.tables : recordState.tables = {}
  setRecordsStateWrapper(recordState, `tables.${name}`, newTable(noOfRows, noOfCols))
  persist(recordState)
  return recordState
}

function addColumn(setRecordsStateWrapper, tableName, recordState) {
  if (recordState.currentTable === '') {
    alert('No table selected');
    return null;
  }

  if (!recordState.tables[tableName].noOfRows) {
    return null;
  }
  recordState.altered = true
  let newNoOfCols = recordState.tables[tableName].noOfCols + 1
  setRecordsStateWrapper(recordState, `tables.${tableName}.noOfCols`, newNoOfCols)
  applyRuleOnModification(recordState);
}

function delColumn(setRecordsStateWrapper, tableName, recordState) {
  if (recordState.currentTable === '') {
    alert('No table selected');
    return null;
  }

  let prevNoOfCols = recordState.tables[tableName].noOfCols
  let newNoOfCols = prevNoOfCols ? Number(prevNoOfCols) - 1 : 0

  let prevTableData = recordState.tables[tableName].data
  let newTableData = removeCol(prevTableData, Number(prevNoOfCols))

  recordState.altered = true
  changeValueInNestedObj(recordState, `tables.${tableName}.noOfCols`, newNoOfCols)
  setRecordsStateWrapper(recordState, `tables.${tableName}.data`, newTableData)
}

function addRow(setRecordsStateWrapper, tableName, recordState) {
  if (recordState.currentTable === '') {
    alert('No table selected');
    return null;
  }

  const prevNoOfRows = recordState.tables[tableName].noOfRows
  const newNoOfRows = prevNoOfRows + 1
  let noOfCols = recordState.tables[tableName].noOfCols
  let tableData = recordState.tables[tableName].data

  recordState.tables[tableName].noOfRows = newNoOfRows
  changeValueInNestedObj(tableData, `${newNoOfRows}`, createArray(noOfCols))

  recordState.altered = true
  setRecordsStateWrapper(recordState, `tables.${tableName}.data`, tableData)
  applyRuleOnModification(recordState);
}

function delRow(setRecordsStateWrapper, tableName, recordState) {
  if (recordState.currentTable === '') {
    alert('No table selected');
    return null;
  }

  const noOfRows = Number(recordState.tables[tableName].noOfRows);
  delete recordState.tables[tableName].data[noOfRows];
  let newNoOfRows = noOfRows - 1
  if (newNoOfRows < 0) newNoOfRows = 0

  setRecordsStateWrapper(recordState, `tables.${tableName}.noOfRows`, newNoOfRows)
}

function setDeleteMode(tableName, recordState) {
  alert('click on the cell you want to delete its row or column')
  setRecordsStateWrapper(recordState, `tables.${tableName}.deleteMode`, true)
}

function setInsertMode(tableName, recordState) {
  alert('click on the cell you want to insert row or column around')
  setRecordsStateWrapper(recordState, `tables.${tableName}.insertMode`, true)
}

function addRule(tableName, recordState) {
  recordState.altered = true
  recordState.tables[tableName].ruleModeAdv = false
  setRecordsStateWrapper(recordState, `tables.${tableName}.ruleMode`, true)
}

function addRuleAdv(tableName, recordState) {
  recordState.altered = true
  recordState.tables[tableName].ruleMode = false
  setRecordsStateWrapper(recordState, `tables.${tableName}.ruleModeAdv`, true)
}

function increaseCellSize(tableName, recordState) {
  let maxCellSize = 3
  let currentSize = Number(recordState.tables[tableName].cellSize) || 0;
  let size = 0;
  if (currentSize < maxCellSize) {
    size = currentSize + 1;
    size = size > maxCellSize ? maxCellSize : size;
  } else {
    size = currentSize
  }

  recordState.altered = true
  setRecordsStateWrapper(recordState, `tables.${tableName}.cellSize`, size)
}

function decreaseCellSize(tableName, recordState) {
  let minCellSize = 0
  const currentSize = Number(recordState.tables[tableName].cellSize) || 0;
  let size = 0;
  if (currentSize > minCellSize) {
    size = currentSize - 1;
    size = size < minCellSize ? minCellSize : size;
  } else {
    size = currentSize
  }

  recordState.altered = true
  setRecordsStateWrapper(recordState, `tables.${tableName}.cellSize`, size)
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
    replaceAtIndex(recordState.tables[tableName].data[SN], colIndex, value)
  )
  applyRuleOnModification(recordState);
}

/**
 * afterRulePick - handles event after user chooses a rule to apply.
 * sets the currentTable to ruleMode which signals for rule
 * application
 */
function afterRulePick(ruleName, tableName, recordState) {
  alert('click on the row or column you want to apply rule');

  recordState.tables[tableName].ruleMode = true
  setRecordsStateWrapper(recordState, `tables.${tableName}.currentRule`, ruleName)
}

/**
 * afterRulePickAdv - handles event after user chooses an advanced rule to apply.
 * sets the currentTable to ruleModeAdv which signals for rule
 * application
 */
function afterRulePickAdv(ruleName, tableName, recordState) {
  alert('click on the row or column you want to apply rule');

  recordState.tables[tableName].ruleModeAdv = true
  setRecordsStateWrapper(recordState, `tables.${tableName}.currentRule`, ruleName)
}

function handleDelete(tableName, noOfRows, noOfCols, row, colIndex, recordState) {
  const validRowOrCol = ['row', 'col']
  let shouldRetainRules
  let rowOrCOl = prompt(`type 'row' or 'col' to delete an entire row or column`)
  if (!rowOrCOl) return unSetDeleteMode(tableName, recordState)
  rowOrCOl = rowOrCOl ? rowOrCOl.toLowerCase() : ""
  if (!validRowOrCol.includes(rowOrCOl)) {
    alert('ivalid option')
    return handleDelete(tableName, noOfRows, noOfCols, row, colIndex, recordState)
  }
  if (checkIfRulesSet(tableName, recordState)) {
    shouldRetainRules = prompt(`it is advised to clear existing rules to prevent
quirky behavior, to keep rules type 'yes'`)
  }
  if (!shouldRetainRules || shouldRetainRules.toLowerCase() !== 'yes') {
    clearRule(tableName, recordState)
  }
  if (rowOrCOl === 'row') {
    deleteEntireRow(tableName, row, recordState)
  } else {
    deleteEntireCol(tableName, colIndex, recordState)
  }
  unSetDeleteMode(tableName, recordState)
}

function deleteEntireRow(tableName, row, recordState) {
  if (row < 1) return
  const data = getData(tableName, recordState)
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
  setDataField(recordState, data, tableName)
}

function deleteEntireCol(tableName, colIndex, recordState) {
  const data = getData(tableName, recordState)
  if (colIndex < 0) return
  for (let row in data) {
    const currRow = data[row]
    const len = currRow.length
    for(let i = colIndex; i < len; i++) {
      if (i < len - 1) currRow[i] = currRow[i + 1]
      if (i === len - 1) currRow.length = len - 1
    }
  }
  setDataField(recordState, data, tableName)
}

function handleInsert(tableName, noOfRows, noOfCols, row, colIndex, recordState) {
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
  if (!rowOrCOl) return unSetInsertMode(tableName, recordState)
  rowOrCOl = rowOrCOl ? rowOrCOl.toLowerCase() : ""
  if (!validRowOrCol.includes(rowOrCOl)) {
    alert('ivalid option')
    return handleInsert(tableName, noOfRows, noOfCols, row, colIndex, recordState)
  }
  if (rowOrCOl === 'row') {
    side = prompt(`type 't' (top) to insert above current row or 'b' (below) to insert below`)
    side = side ? side.toLowerCase()[0] : ""
  } else {
    side = prompt(`type 'r' (right) to insert to the right side of current column 
or 'l' (left) to insert to the right`)
    side = side ? side.toLowerCase()[0] : ""
  }
  if (!side) return unSetInsertMode(tableName, recordState)
  if (!validSides.includes(side)) {
    alert('invalid side entered')
    return handleInsert(tableName, noOfRows, noOfCols, row, colIndex, recordState)
  }
  const data = funcMap[side](tableName, noOfRows, noOfCols, row, colIndex, recordState)
  if (!data) return unSetInsertMode(tableName, recordState)
  let shouldRetainRules
  if (checkIfRulesSet(tableName, recordState)) {
    shouldRetainRules = prompt(`it is advised to clear existing rules to prevent
quirky behavior, to keep rules type 'yes'`)
  }
  if (!shouldRetainRules || shouldRetainRules.toLowerCase() !== 'yes') {
    clearRule(tableName, recordState)
  }
  setDataField(recordState, data, tableName)
  unSetInsertMode(tableName, recordState)
}

function insertRowAbove(tableName, noOfRows, noOfCols, row, colIndex, recordState) {
  const data = getData(tableName, recordState)
  return insertRowAboveImpl(row, data)
}

function insertRowBelow(tableName, noOfRows, noOfCols, row, colIndex, recordState) {
  const data = getData(tableName, recordState)
  return insertRowBelowImpl(row, data)
}

function insertColRight(tableName, noOfRows, noOfCols, row, colIndex, recordState) {
  const data = getData(tableName, recordState)
  return insertColRightImpl(colIndex, data)
}

function insertColLeft(tableName, noOfRows, noOfCols, row, colIndex, recordState) {
  const data = getData(tableName, recordState)
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

export function unSetInsertMode(tableName, recordState) {
  setRecordsStateWrapper(recordState, `tables.${tableName}.insertMode`, false)
}

export function unSetDeleteMode(tableName, recordState) {
  setRecordsStateWrapper(recordState, `tables.${tableName}.deleteMode`, false)
}

function getClassName(table) {
  if (!table && !table.cellSize) {
    return null;
  }
  const map = {
    1: 'input-1',
    2: 'input-2',
    3: 'input-3',
  };
  return map[table.cellSize];
}

function getCurrentTableProps(props) {
  const { currentTable } = props.records;
  const tableData = currentTable && props.records.tables
		    ? props.records.tables[currentTable].data
	            : null;
  const noOfCols = currentTable && props.records.tables
		   ? props.records.tables[currentTable].noOfCols
	           : null;
  const noOfRows = currentTable && props.records.tables
		   ? props.records.tables[currentTable].noOfRows
	           : null;
  const table = currentTable && props.records.tables
    ? props.records.tables[currentTable]
	  : {};
  
  return {currentTable, tableData, noOfCols, noOfRows, table}
}