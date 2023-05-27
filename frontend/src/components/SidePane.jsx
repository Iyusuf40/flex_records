import React from 'react';

function setCurrentTableToFirstPos(tablesList, currentTable) {
  if (!tablesList.length) return
  let indexOfCurrTable = findIndex(tablesList, currentTable)
  if (!indexOfCurrTable) return
  // putCurrTableFirsrAndShiftTablesList(tablesList, indexOfCurrTable)
  // putCurrTableFirsrAndShiftTablesList not working as expected because
  // key is always sorted after rendering
  // possible solution is to store order
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

// function putCurrTableFirsrAndShiftTablesList(tablesList, index) {
//   if (index >= tablesList.length || index < 0) return
//   let save = tablesList[index]
//   let curr = null
//   for (let i = 0; i <= index; i++) {
//     curr = tablesList[i]
//     tablesList[i] = save
//     save = curr
//   }
// }

function swapCurrTableToFront(tablesList, index) {
  let save = tablesList[0]
  tablesList[0] = tablesList[index]
  tablesList[index] = save
}

export default function SidePane(props) {
  // console.log(props.records.tables)
  const { tables } = props.records;
  const tableList = [];
  const { currentTable } = props.records;
  // const table = props.records.tables[currentTable];

  // create array of JSX
  for (const key in tables) {
    tableList.push(
      <h3
        onClick={(event) => props.handleTableClick(key)}
        key={key}
        className={key === currentTable ? 'current--table' : ''}
        data-name={key}
      >
        {key}
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
