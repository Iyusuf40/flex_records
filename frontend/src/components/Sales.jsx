import React from "react";
import SidePane from "./SidePane";
import TableView, { createSocket } from "./TableView";

import * as utils from "../utils";

Object.assign(window, utils); // make all utils functions global

let tableSearchWordMap = { tableSearchWordMap: {} };
Object.assign(window, tableSearchWordMap);

let flexId = "";

export default function Sales() {
  let [recordState, setRecordsState] = React.useState({});

  // setup initial load and use as condition to fetch data from backend
  let [init, setInit] = React.useState({
    loaded: false,
    saved: false,
    haveSetCurrentTable: false,
  });

  if (!flexId) {
    flexId = attemptToGetFlexIdForInventory(setRecordsState);
  }

  window.flexId = flexId;

  getRecords(init, flexId, setRecordsState, setInit);

  function setRecordsStateWrapper(prevState, pathToPropToChange, value, shouldSave = true) {
    changeValueInNestedObj(prevState, pathToPropToChange, value);
    setRecordsState({ ...prevState });
    if (shouldSave === false) return {}
    return save(recordState, init);
  }

  window.setRecordsStateWrapper = setRecordsStateWrapper;
  window.setRecordsState = setRecordsState;
  window.recordState = recordState;
  if (!init.haveSetCurrentTable && init.loaded === true) {
    if (!recordState.currentTable?.includes("inventory"))
      setRecordsStateWrapper(recordState, "currentTable", "");
    init.haveSetCurrentTable = true;
    createSocket();
  }
  return (
    <div className="container">
      <SidePane
        isInventory={true}
        isSales={true}
        records={recordState}
        setRecordsStateWrapper={setRecordsStateWrapper}
        changeValueInNestedObj={utils.changeValueInNestedObj}
      />
      <TableView
        isInventory={true}
        isSales={true}
        records={recordState}
        setRecordsStateWrapper={setRecordsStateWrapper}
        changeValueInNestedObj={utils.changeValueInNestedObj}
      />
    </div>
  );
}
