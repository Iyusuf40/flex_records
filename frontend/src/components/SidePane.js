import React from 'react';

function setCurrentTableToFirstPos(tablesList, currentTable) {
  if (!tablesList.length) return
  let indexOfCurrTable = null
  for (let i = 0; i < tablesList.length; i++) {
    if (tablesList[i].key === currentTable) {
      indexOfCurrTable = i
      break
    }
  }
  if (!indexOfCurrTable) return
  let save = tablesList[0]
  tablesList[0] = tablesList[indexOfCurrTable]
  tablesList[indexOfCurrTable] = save
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
