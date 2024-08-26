import React from "react";
import SidePane from "./SidePane";
import TableView from "./TableView";

import * as utils from "../utils";

Object.assign(window, utils); // make all utils functions global

let tableSearchWordMap = { tableSearchWordMap: {} };
Object.assign(window, tableSearchWordMap);

// url = "localhost/view/inventory?table=<tableName>&flexId=<flexId>"
// ensure there are columns [product, stock, sold, returned, stock balance]

// get table

// dislpay all products
// allow search filter
// display sell button and returned button
// disable other fields except starting stock

export default function inventory() {
  let [recordState, setRecordsState] = React.useState({});

  // setup initial load and use as condition to fetch data from backend
  let [init, setInit] = React.useState({ 
    loaded: false, 
    saved: false, 
    haveSetCurrentTable: false 
  });

  let flexId = localStorage.getItem("flexId");

  if (!flexId) {
    attemptToGetFlexId(setRecordsState);
  }

  getRecords(init, flexId, setRecordsState, setInit);

  setTimeout(save, 1000, recordState, init);

  function setRecordsStateWrapper(prevState, pathToPropToChange, value) {
    changeValueInNestedObj(prevState, pathToPropToChange, value);
    setRecordsState({ ...prevState });
  }

  window.setRecordsStateWrapper = setRecordsStateWrapper;
  window.setRecordsState = setRecordsState;
  window.recordState = recordState;
  if (!init.haveSetCurrentTable && init.loaded === true) {
    if (!recordState.currentTable?.includes("inventory")) setRecordsStateWrapper(recordState, "currentTable", "")
    init.haveSetCurrentTable = true
  } 
  return (
    <div className="container">
      <SidePane
        isInventory={true}
        records={recordState}
        setRecordsStateWrapper={setRecordsStateWrapper}
        changeValueInNestedObj={utils.changeValueInNestedObj}
      />
      <TableView
        isInventory={true}
        records={recordState}
        setRecordsStateWrapper={setRecordsStateWrapper}
        changeValueInNestedObj={utils.changeValueInNestedObj}
      />
    </div>
  );
}
