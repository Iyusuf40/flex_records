import React from "react";
import SidePane from "./SidePane";
import TableView from "./TableView";

import * as utils from "../utils";

Object.assign(window, utils); // make all utils functions global

let tableSearchWordMap = { tableSearchWordMap: {} };
Object.assign(window, tableSearchWordMap);

export default function DaySales() {
  let [recordState, setRecordsState] = React.useState({});

  function setRecordsStateWrapper(prevState, pathToPropToChange, value) {
    changeValueInNestedObj(prevState, pathToPropToChange, value);
    setRecordsState({ ...prevState });
  }


  window.setRecordsStateWrapper = setRecordsStateWrapper;
  window.setRecordsState = setRecordsState;
  window.recordState = recordState;

  React.useEffect(() => {
    let tableData = JSON.parse(localStorage.getItem("daySales"))
    if (!tableData || !tableData[1]) return
    let dayName = localStorage.getItem("dayName")
    recordState.currentTable = dayName || "daySales"
    recordState.tables = {}
    recordState.tables[dayName] = {
        data: tableData,
        noOfRows: Object.keys(tableData).length,
        noOfCols: tableData[1]?.length
    }
    setRecordsStateWrapper(recordState, "currentTable", dayName)
  },[])

  return (
    <div className="container">
      <SidePane
        isDaySales={true}
        records={recordState}
        setRecordsStateWrapper={setRecordsStateWrapper}
        changeValueInNestedObj={utils.changeValueInNestedObj}
      />
      <TableView
        isDaySales={true}
        records={recordState}
        setRecordsStateWrapper={setRecordsStateWrapper}
        changeValueInNestedObj={utils.changeValueInNestedObj}
      />
    </div>
  );
}
