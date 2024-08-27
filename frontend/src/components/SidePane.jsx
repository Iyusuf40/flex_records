import React from "react";

export default function SidePane(props) {
  const { tables } = props.records;
  const tableList = [];
  let isInventory = props.isInventory;
  let isSales = props.isSales;
  const { currentTable } = props.records;

  let sortedTableNamesByTimeClicked = sortTableNamesByTimeClicked(tables);

  for (const tableName of sortedTableNamesByTimeClicked) {
    let push = false;
    if (isInventory) {
      if (tableName.includes("inventory")) {
        push = true;
      }
    } else {
      if (!tableName.includes("inventory")) {
        push = true;
      }
    }
    if (push) {
      tableList.push(
        <h3
          onClick={(event) => {
            if (isInventory || isSales) {
                getFromBackend(getUrl, flexId, setRecordsState, () => {})
                .then((backendRecordState) => {
                handleTableClick(
                  tableName,
                  backendRecordState,
                  props.setRecordsStateWrapper,
                )
              })
            } else {
              handleTableClick(
                tableName,
                props.records,
                props.setRecordsStateWrapper,
              )
            }
          }}
          key={tableName}
          className={tableName === currentTable ? "current--table--name" : ""}
          data-name={tableName}
        >
          {tableName}
        </h3>,
      );
    }
  }

  setCurrentTableToFirstPos(tableList, currentTable);

  return (
    <div className="side--pane">
      {currentTable && !isSales ? (
        <>
          <button
            onClick={() => {
              if (isInventory && !isSales) createInventoryTable();
              else
                createTableBtnClicked(
                  props.setRecordsStateWrapper,
                  props.records,
                );
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
          <button onClick={(event) => modifyTable(currentTable, props.records)}>
            modify table
          </button>
          {isInventory && (
            <>
              <br />
              <br />
              <button
                onClick={(event) => {
                  copySalesLink();
                  alert("sales link copied");
                }}
              >
                share sales link
              </button>
            </>
          )}
        </>
      ) : (
        ""
      )}
      <br />
      <br />
      {currentTable ? (
        <input
          type="text"
          placeholder="search"
          onInput={(e) => {
            tableSearchWordMap[currentTable] = e.target.value;
            // force refresh
            setRecordsStateWrapper(recordState, "currentTable", currentTable);
          }}
        ></input>
      ) : (
        ""
      )}
      <div className="table--list">{tableList}</div>
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
  if (!tables) return [];
  return Object.keys(tables).sort((a, b) => {
    let aTimeClicked = tables[a].lastTimeClicked || 0;
    let bTimeClicked = tables[b].lastTimeClicked || 0;
    if (bTimeClicked > aTimeClicked) return 1;
    return -1;
  });
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
  if (recordState?.tables[tableName])
    recordState.tables[tableName].lastTimeClicked = Date.now().toString();
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

function createInventoryTable() {
  let name = prompt("enter the name of the table") + "-inventory";
  createTable(recordState, name, 50, 7);
  let currentTable = recordState.currentTable;
  recordState.tables[currentTable].data[1][0] = "product";
  recordState.tables[currentTable].data[1][1] = "start stock";
  recordState.tables[currentTable].data[1][2] = "sold";
  recordState.tables[currentTable].data[1][3] = "returned";
  recordState.tables[currentTable].data[1][4] = "current stock";
  recordState.tables[currentTable].data[1][5] = "unit price";
  recordState.tables[currentTable].data[1][6] = "price in stock";
  setRecordsStateWrapper(recordState, "currentTable", currentTable);
}

function copySalesLink() {
  let salesLink = getSalesLink();
  navigator.clipboard.writeText(salesLink);
}
