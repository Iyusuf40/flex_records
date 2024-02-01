import React from 'react';

function setCurrentTableToFirstPos(tablesList, currentTable) {
  if (!tablesList.length) return
  let indexOfCurrTable = findIndex(tablesList, currentTable)
  if (!indexOfCurrTable) return
  swapCurrTableToFront(tablesList, indexOfCurrTable)
}

function findIndex(tablesList, currentTable) {
  for (let i = 0; i < tablesList.length; i++) {
    if (tablesList[i].key === currentTable) {
      return i
    }
  }
  return null
}

function swapCurrTableToFront(tablesList, index) {
  let save = tablesList[0]
  tablesList[0] = tablesList[index]
  tablesList[index] = save
}

export default function SidePane(props) {

  const { tables } = props.records;
  const tableList = [];
  const { currentTable } = props.records;

  for (const tableName in tables) {
    tableList.push(
      <h3
        onClick={(event) => props.handleTableClick(tableName)}
        key={tableName}
        className={tableName === currentTable ? 'current--table' : ''}
        data-name={tableName}
      >
        {tableName}
      </h3>,
    );
  }

  setCurrentTableToFirstPos(tableList, currentTable)

  return (
    <div className="side--pane">
      <button onClick={props.createTableBtnClicked}>
        create table +
      </button>
      {' '}
      <br />
      <br />
      <button onClick={props.switchUser}>
        switch user
      </button>
      {' '}
      <br />

      <div className="table--list">
        {/* currentTable is not undefined? */}
        {currentTable
          ? (
              <button
                onClick={(event) => props.modifyTable(currentTable)}
              >
                modify table
              </button>
            )
	        : ''}
        {tableList}
      </div>
    </div>
  );
}
