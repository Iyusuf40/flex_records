import uuid from 'react-uuid';

export const postUrl = 'http://localhost:3001/records';
export const putUrl = 'http://localhost:3001/records';
export const getUrl = 'http://localhost:3001/records/';

export async function getAltUser(url, id, setRecordsState) {
    let resp = null;
    resp = await fetch(url + id).then((data) => data.json()).then((data) => {
        return data;
    });
    if (resp && Object.keys(resp).length) {
        localStorage.setItem('flexId', id);
        setRecordsState(resp)
    } else {
        let id = prompt('User not found, enter correct ID or skip, we will generate one for you');
        if (id) {
        return await getAltUser(url, id, setRecordsState);
        }
        id = uuid();
        localStorage.setItem('flexId', id);
        alert(`here is your ID '${id}'. you may store it somewhere in case 
    you want to access  your records from a different device`);
    }
}
  
export function attemptToGetFlexId(setRecordsState) {
    const newFlexId = uuid();
    const id = prompt(`Could not get your ID from localStorage, please enter
    your ID if you have one or skip. We will generate a new ID for you`);
    if (id) {
        localStorage.setItem('flexId', id);
        getAltUser(getUrl, id, setRecordsState);
    } else {
        localStorage.setItem('flexId', newFlexId);
        alert(`here is your ID '${newFlexId}'. you may store it somewhere in case 
    you want to access  your records from a different device`);
    }
}
  
export function getRecords(init, flexId, {setRecordsState, setInit}) {
    if (init.loaded) {
      return;
    }
  
    getFromBackend(getUrl, flexId, setRecordsState, setInit);
    return ({
      id: flexId,
      tables: {
      },
      altered: false,
      currentTable: '',
      rowsAndColsNoSet: false,
      archiveTablesNames: [],
    });
}
  
export async function getFromBackend(url, id, setRecordsState, setInit) {
    let resp = null;
    await fetch(url + id).then((data) => data.json()).then((data) => {
      resp = data;
    });
    if (Object.keys(resp).length) {
      setRecordsState(resp);
    }
    setInit({ loaded: true, saved: false }); // set init the first time of load
}
  
export async function setAltUser(url, id, setRecordsState) {
    let resp = null;
    await fetch(url + id).then((data) => data.json()).then((data) => {
      resp = data;
    });
    if (Object.keys(resp).length) {
      setRecordsState(resp);
      localStorage.setItem('flexId', id);
    } else {
      alert('User not found');
    }
}
  
export function promptForId() {
    const id = prompt('enter user ID:');
    if (!id) {
      return;
    }
  
    if (typeof (id) !== 'string' || id.length !== 36) {
      alert('No such ID in our records');
      return;
    }
    return id
}
  
export async function save(record, init) {
    if (!init.loaded) {
      return;
    }
    const json = JSON.stringify(record);
    await fetch(putUrl, {
      method: 'PUT',
      body: json,
      headers: {
        'Content-Type': 'application/json',
      },
    });
}
  
  
export function persist(record) {
    const json = JSON.stringify(record);
    fetch(postUrl, {
      method: 'POST',
      body: json,
      headers: {
        'Content-Type': 'application/json',
      },
    });
}
  
export function newData(noOfRows, noOfCols) {
    const rows = noOfRows;
    const cols = noOfCols;
    const data = {};
    for (let row = 1; row <= rows; row++) {
      data[row] = createArray(cols); // new Array(cols);
    }
    return data;
}
  
export function createArray(size) {
    const myArray = [];
    for (let index = 0; index < size; index++) {
      myArray.push('');
    }
    return myArray;
}
  
export function newTable(noOfRows, noOfCols) {
    const table = {
      data: newData(noOfRows, noOfCols),
      noOfRows,
      noOfCols,
      ruleMode: false,
      currentRule: '',
      altered: true,
    };
    return table;
}

/**
 * 
 * @param {*} obj 
 * @param {"dot separated path to property of obj to change eg 
 *          obj={a: {b: 1}}, path can be `a.b`"} path 
 * @param {*} value 
 * @returns 
 */
export function changeValueInNestedObj(obj, path, value) {
    let propsList = path.split(".")
    let propsLen = propsList.length
    
    if (propsLen === 1) {
        obj[path] = value
        return
    }
  
    let tmp = null 
    for (const prop of propsList.slice(0, propsLen - 1)) {
        if (tmp === null) tmp = obj[prop]
        else tmp = tmp[prop]
    }
    tmp ? tmp[propsList[propsLen - 1]] = value : tmp
}
  
export function validateParamsWhenCreatingTable(name, noOfRows, noOfCols) {
    let error = false;
    if (!noOfRows || noOfRows < 1) {
      alert('error creating table: invalid number of rows');
      error = true;
    } else if (!noOfCols || noOfCols < 1) {
      alert('error creating table: invalid number of columns');
      error = true;
    } else if (!name) {
      alert('error creating table: no name given for table');
      error = true;
    }
    return error;
}
  
export function checkTableLimits(noOfRows, noOfCols) {
    const totalCells = noOfRows * noOfCols;
    if (totalCells > 10000) {
      const resp = prompt(`You are trying to create ${totalCells} number of cells, 
  we advice you break the table into smaller tables else the app will be slow or 
  worst case you might make your 
  system unresponsive. Enter 'yes' to go ahead or 'no' to cancel`);
      if (resp && resp.toLowerCase() === 'yes') {
        return true;
      }
      return false;
    }
    return true;
}

export function removeCol(data, noOfCols) {
    const copy = { ...data };
    for (const key in copy) {
      const arr = [];
      for (let index = 0; index < noOfCols - 1; index++) {
        arr[index] = copy[key][index];
      }
      copy[key] = arr;
    }
    return copy;
}

/**
* applyRuleOnModification - reapplies the previously set rule on
* new columns or rows created
*
* currentState -> currentState of records object
*/
export function applyRuleOnModification(currentState) {
 try {
   /* apply advanced here */
   if (currentState.tables[currentState.currentTable].prevRuleAdv) {
      applyAdvancedRulesOnModification(currentState);
   }
   if (currentState.tables[currentState.currentTable].prevRule) {
      const { currentTable } = currentState;
      const ruleName = currentState.tables[currentTable].prevRule;
      const { cellPlacement } = currentState.tables[currentTable];
      implementRule(ruleName, currentTable, cellPlacement);
   }
 } catch (e) {
   alert(`could not apply rule. please clear rule and reapply it`)
 }
}

/**
 * applyAdvancedRulesOnModification - runs everytime a cell is changed
 * to reapply advanced rule
 */
export function applyAdvancedRulesOnModification(currentState) {
    if (!currentState.tables[currentState.currentTable].prevRuleAdv) {
        return;
    }
    const { prevRuleAdv } = currentState.tables[currentState.currentTable];
    const advAppMode = true; /**
                    * flag to check if in advanced rule application phase
                * during table change.. So as not to create new
                * prevRuleAdv objects else will result in so many objects
                * created, which will slow and crash program since
                * new nonesense advRule objects will be attached to table
                * and program will try to apply them
                */

    for (const key in prevRuleAdv.rowsRules) { // apply rows rules
        const {
            startIndex,
            endIndex,
            ruleName,
            currentTable,
            noOfRows,
            noOfCols,
            cellPlacement,
            saveIndex,
        } = prevRuleAdv.rowsRules[key];

        applyRuleAdvRow(
            startIndex,
            endIndex,
            ruleName,
            currentTable,
            noOfRows,
            noOfCols,
            cellPlacement,
            saveIndex,
            advAppMode,
        );
    }

    for (const key in prevRuleAdv.colsRules) { // apply cols rules
        const {
            startIndex,
            endIndex,
            ruleName,
            currentTable,
            noOfRows,
            noOfCols,
            cellPlacement,
            saveIndex,
        } = prevRuleAdv.colsRules[key];

        applyRuleAdvCol(
            startIndex,
            endIndex,
            ruleName,
            currentTable,
            noOfRows,
            noOfCols,
            cellPlacement,
            saveIndex,
            advAppMode,
        );
    }
}

// cellPlacement determines where to apply rule
export function getRuleFunctionNameAdv(ruleName, cellPlacement) {
    const ruleNameMapRight = {
        sum: 'sumHorizontalAdv',
        subtractReverse: 'subHorizontalRightAdv',
        subtract: 'subHorizontalLeftAdv',
        multiply: 'mulHorizontalAdv',
        average: 'avgHorizontalAdv',
    };

    const ruleNameMapBottom = {
        sum: 'sumVerticalAdv',
        subtract: 'subVerticalTopAdv',
        subtractReverse: 'subVerticalBottomAdv',
        multiply: 'mulVerticalAdv',
        average: 'avgVerticalAdv',
    };

    if (cellPlacement === 'bottom') {
        return ruleNameMapBottom[ruleName];
    }
    return ruleNameMapRight[ruleName];
}

// cellPlacement determines where to apply rule
export function getRuleFunctionName(ruleName, cellPlacement) {
    const ruleNameMapRight = {
        sum: 'sumHorizontal',
        subtractReverse: 'subHorizontalRight',
        subtract: 'subHorizontalLeft',
        multiply: 'mulHorizontal',
        average: 'avgHorizontal',
    };

    const ruleNameMapBottom = {
        sum: 'sumVertical',
        subtract: 'subVerticalTop',
        subtractReverse: 'subVerticalBottom',
        multiply: 'mulVertical',
        average: 'avgVertical',
    };

    if (cellPlacement === 'bottom') {
        return ruleNameMapBottom[ruleName];
    }
    return ruleNameMapRight[ruleName];
}

/**
 * implementRule - implements computations on each cell based on ruleName
 * and cellPlacement on the currentTable in view
 *
 * ruleName - the name of rule to apply e.g sum
 *
 * cellPlacement - helps to decide the order of computation
 * if set to right: comptations will be done from left to right
 * or right to left but if set to bottom computations will be done
 * vertically
 */
export function implementRule(ruleName, currentTable, cellPlacement) {
    // check if cell is empty
        // check if cell is bottom
        // decide if operate vertical or hor
    // get data
        // clone it
        // fix it
        // set it back

    /* gets the function name to apply as rule */
    const functionName = getRuleFunctionName(ruleName, cellPlacement);
    setRecordsState((prevState) => {
        const { data } = prevState.tables[currentTable];
        const { noOfRows } = prevState.tables[currentTable];
        const { noOfCols } = prevState.tables[currentTable];
        const dataClone = { ...data };
        // call appropiate function on data
        // set data back
        return ({
        ...prevState,
        tables: {
            ...prevState.tables,
        [currentTable]: {
            ...prevState.tables[currentTable],
        // utilities returns an object of functions to apply rules
            data: utilities()[functionName](dataClone, noOfRows, noOfCols),
        ruleMode: false,
        altered: true,
        prevRule: ruleName,
        cellPlacement,
            currentRule: '',
        },
        },
        });
    });
}
