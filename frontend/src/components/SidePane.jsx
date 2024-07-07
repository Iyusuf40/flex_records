import React from "react";

export default function SidePane(props) {
  const { tables } = props.records;
  const tableList = [];
  const { currentTable } = props.records;

  let sortedTableNamesByTimeClicked = sortTableNamesByTimeClicked(tables)

  for (const tableName of sortedTableNamesByTimeClicked) {
    tableList.push(
      <h3
        onClick={(event) =>
          handleTableClick(
            tableName,
            props.records,
            props.setRecordsStateWrapper,
          )
        }
        key={tableName}
        className={tableName === currentTable ? "current--table--name" : ""}
        data-name={tableName}
      >
        {tableName}
      </h3>,
    );
  }

  setCurrentTableToFirstPos(tableList, currentTable);

  return (
    <div className="side--pane">
      <button
        onClick={() => {
          createTableBtnClicked(props.setRecordsStateWrapper, props.records);
        }}
      >
        create table +
      </button>{" "}
      <br />
      <br />
      <button onClick={switchUser}>switch user</button>
      <br />
      <br />
      <button onClick={showId}>show ID</button>
      <br />
      <br />
      {currentTable ? (
          <button onClick={(event) => modifyTable(currentTable, props.records)}>
            modify table
          </button>
        ) : (
          ""
        )
      }

      <div className="table--list">
        {tableList}
      </div>
    </div>
  );
}

function setCurrentTableToFirstPos(tablesList, currentTable) {
  if (!tablesList.length) return;
  let indexOfCurrTable = findIndex(tablesList, currentTable);
  if (!indexOfCurrTable) return;
  swapCurrTableToFront(tablesList, indexOfCurrTable);
}

function sortTableNamesByTimeClicked(tables) {
  if (!tables) return []
  return Object.keys(tables).sort((a, b) => {
    let aTimeClicked = tables[a].lastTimeClicked || 0
    let bTimeClicked = tables[b].lastTimeClicked || 0
    if (bTimeClicked > aTimeClicked) return 1
    return -1
  })
}

function findIndex(tablesList, currentTable) {
  for (let i = 0; i < tablesList.length; i++) {
    if (tablesList[i].key === currentTable) {
      return i;
    }
  }
  return null;
}

function swapCurrTableToFront(tablesList, index) {
  let moveToFront = tablesList[index];
  tablesList.splice(index, 1);
  tablesList.unshift(moveToFront);
}

function handleTableClick(tableName, recordState, setRecordsStateWrapper) {
  if (recordState?.tables[tableName]) recordState.tables[tableName].lastTimeClicked = Date.now().toString()
  setRecordsStateWrapper(recordState, "currentTable", tableName);
}

function createTableBtnClicked(setRecordsStateWrapper, recordState) {
  setRecordsStateWrapper(recordState, "createTableBtnClicked", true);
}

function modifyTable(tableName, recordState) {
  const option = prompt(`Type 'delete' if you wish to delete the current table
or any other word(s) to rename it as such`);
  if (!option) {
    return;
  }
  if (option.toLowerCase() === "delete") {
    deleteTable(tableName, recordState);
  } else {
    changeTableName(tableName, option, recordState);
  }
}

async function switchUser() {
  const id = promptForId();
  if (!id) return;
  await setAltUser(getUrl, id, setRecordsState);
}

function showId() {
  const flexId = localStorage.getItem("flexId");
  alert("your ID is: " + flexId);
}
