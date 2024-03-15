import React from "react";

export default function SidePane(props) {
  const { tables } = props.records;
  const tableList = [];
  const { currentTable } = props.records;

  for (const tableName in tables) {
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
        className={tableName === currentTable ? "current--table" : ""}
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
      <div className="table--list">
        {/* currentTable is not undefined? */}
        {currentTable ? (
          <button onClick={(event) => modifyTable(currentTable, props.records)}>
            modify table
          </button>
        ) : (
          ""
        )}
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

function findIndex(tablesList, currentTable) {
  for (let i = 0; i < tablesList.length; i++) {
    if (tablesList[i].key === currentTable) {
      return i;
    }
  }
  return null;
}

function swapCurrTableToFront(tablesList, index) {
  let save = tablesList[0];
  tablesList[0] = tablesList[index];
  tablesList[index] = save;
}

function handleTableClick(tableName, recordState, setRecordsStateWrapper) {
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
  const flexId = localStorage.getItem("flexId")
  alert("your ID is: " + flexId)
}
