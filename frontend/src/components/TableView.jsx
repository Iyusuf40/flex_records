import React from 'react';
import { changeValueInNestedObj, removeCol } from '../utils';

function unsetCreateTableBtnClicked(setRecordsStateWrapper, recordState) {
  setRecordsStateWrapper(recordState, "createTableBtnClicked", false)
}

function createTable(setRecordsStateWrapper, recordState, name, noOfRows, noOfCols) {
  if (!name) {
    return;
  }

  if (recordState.tables[name]) {
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


export default function TableView(props) {
  const { currentTable } = props.records;
  const tableData = currentTable
		    ? props.records.tables[currentTable].data
	            : null;
  const noOfCols = currentTable
		   ? props.records.tables[currentTable].noOfCols
	           : null;
  const noOfRows = currentTable
		   ? props.records.tables[currentTable].noOfRows
	           : null;
  const table = currentTable
    ? props.records.tables[currentTable]
	        : {};

  const className = getClassName(table);

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

  const clearFormObj = {
    createTableMode: null,
    fields: {
      name: '',
      noOfRows: '',
      noOfCols: '',
    },
  };

  let formObj;
  let setFormObj;
  [formObj, setFormObj] = React.useState(clearFormObj);

  let classCreateTableMode = '';

  if (props.records.createTableBtnClicked) {
    classCreateTableMode = '';
  } else {
    classCreateTableMode = 'hide';
  }

  function parseCreateTableForm(formObj, e, setRecordsStateWrapper, recordState) {
    e.preventDefault();
    const { noOfRows } = formObj.fields;
    const { noOfCols } = formObj.fields;
    const { name } = formObj.fields;
    createTable(setRecordsStateWrapper, recordState, name, noOfRows, noOfCols);
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
    // console.log(props.records);
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
            onChange={(e) => props.updateTableView(
              currentTable,
		                                saveRowIndex,
		                                colIndex,
	     e.target.value,
	     saveRowIndex + 1,
            )}

            onClick={(e) => {
              if (table.ruleMode && table.currentRule) { 
                props.pickCells(
                  table.currentRule,
                  currentTable,
                  row,
                  colIndex,
                  noOfRows,
                  noOfCols,
                )
              } else if ( table.ruleModeAdv && table.currentRule) {
                props.pickCellsAdv(
                  table.currentRule,
                  currentTable,
                  row,
                  colIndex,
                  noOfRows,
                  noOfCols,
                )
              }
              if (table.insertMode) props.handleInsert(
                currentTable, noOfRows, noOfCols, row, colIndex)
              if (table.deleteMode) props.handleDelete(
                currentTable, noOfRows, noOfCols, row, colIndex)
                
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
                parseCreateTableForm(formObj, e, props.setRecordsStateWrapper, props.records)
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
          onClick={(e) => props.setInsertMode(currentTable)}
        >
          insert
        </button>
        <button
          onClick={(e) => props.setDeleteMode(currentTable)}
        >
          delete
        </button>
      </div>
      <div className="rules--buttons">
        <button
          onClick={(e) => props.addRule(currentTable)}
        >
          add rule +
        </button>
        <button
          onClick={(e) => props.addRuleAdv(currentTable)}
        >
          advanced +
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
        table.ruleMode
          ? (
            <div className="rule--options">
              <input
                type="radio"
                id="sum"
                name="rules"
                onClick={(e) => props.afterRulePick('sum', currentTable)}
              />
              <label htmlFor="sum">sum</label>
              <input
                type="radio"
                id="subtract"
                name="rules"
                onClick={(e) => props.afterRulePick('subtract', currentTable)}
              />
              <label htmlFor="subtract">subtract</label>
              <input
                type="radio"
                id="subtractReverse"
                name="rules"
                onClick={(e) => props.afterRulePick('subtractReverse', currentTable)}
              />
              <label htmlFor="subtractReverse">subtract-reverse</label>
              <input
                type="radio"
                id="multiply"
                name="rules"
                onClick={(e) => props.afterRulePick('multiply', currentTable)}
              />
              <label htmlFor="multiply">multiply</label>
              <input
                type="radio"
                id="average"
                name="rules"
                onClick={(e) => props.afterRulePick('average', currentTable)}
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
                onClick={(e) => props.afterRulePickAdv('sum', currentTable)}
              />
              <label htmlFor="sum">sum adv</label>
              <input
                type="radio"
                id="subtract"
                name="rules"
                onClick={(e) => props.afterRulePickAdv('subtract', currentTable)}
              />
              <label htmlFor="subtract">subtract adv</label>
              <input
                type="radio"
                id="subtractReverse"
                name="rules"
                onClick={(e) => props.afterRulePickAdv('subtractReverse', currentTable)}
              />
              <label htmlFor="subtractReverse">subtract-reverse adv</label>
              <input
                type="radio"
                id="multiply"
                name="rules"
                onClick={(e) => props.afterRulePickAdv('multiply', currentTable)}
              />
              <label htmlFor="multiply">multiply adv</label>
              <input
                type="radio"
                id="average"
                name="rules"
                onClick={(e) => props.afterRulePickAdv('average', currentTable)}
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
