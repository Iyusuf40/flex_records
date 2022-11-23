function checkIndexZeroVertical(data) {
     let bool = (
	              Number(data[1][0])
	              && data[1][0].length
                      ) 
		      ? true : false;
     return bool; 

}

function sumVertical(data, noOfRows, noOfCols) {
  const isIndexZeroNumber = checkIndexZeroVertical(data);
  for (let index = (isIndexZeroNumber ? 0 : 1); index < noOfCols; index++) {
    let res = 0;
    for (const key in data) {
      let currentData = Number(data[key][index]);
      if (currentData && Number(key) !== noOfRows) {
        res += currentData;
      }
    }
    if ((res === 0 || res) && (isTextInCell(data[noOfRows][index]))) {
      data[noOfRows][index] = res.toString();
    }
  }
  return data;
}

function mulVertical(data, noOfRows, noOfCols) {
  // const isIndexZeroNumber = Number(data[1][0]) ? true : false;
  const isIndexZeroNumber = checkIndexZeroVertical(data);
  for (let index = (isIndexZeroNumber ? 0 : 1); index < noOfCols; index++) {
    let res = 1;
    if (!data[1][index] || !Number(data[1][index])) {
      res = 0;
    }
    for (const key in data) {
      let currentData = Number(data[key][index]);
      if (currentData === 0 || currentData) {
        if (Number(key) !== noOfRows) {
	  res *= currentData;
	}
      }
    }
    if ((res === 0 || res) && (isTextInCell(data[noOfRows][index]))) {
      data[noOfRows][index] = res.toString();
    }
  }
  return data;
}

function avgVertical(data, noOfRows, noOfCols) {
  const isIndexZeroNumber = checkIndexZeroVertical(data);
  for (let index = (isIndexZeroNumber ? 0 : 1); index < noOfCols; index++) {
    let res = 0;
    let count = 0;
    for (const key in data) {
      let currentData = Number(data[key][index]);
      if (currentData === 0 || currentData) {
        if (Number(key) !== noOfRows) {
	  res += currentData;
	  count++;
        }
      }
    }
    if ((res === 0 || res) && (isTextInCell(data[noOfRows][index]))) {
      data[noOfRows][index] = parseFloat((res / count).toString()).toFixed(2);
    }
  }
  return data;
}

function checkColIndexZeroVertical(data, idx) {
     let bool = (
	              Number(data[1][idx])
	              && data[1][idx].length
                      ) 
		      ? true : false;
     return bool; 
}

function subVerticalTop(data, noOfRows, noOfCols) {
  const isIndexZeroNumber = checkIndexZeroVertical(data);
  for (let index = (isIndexZeroNumber ? 0 : 1); index < noOfCols; index++) {
    let checkCol = checkColIndexZeroVertical(data, index);
    let res = checkCol ? data[1][index] :  data[2][index];
    for (let key = checkCol? 2: 3; key <= noOfRows; key++) {
      let currentData = Number(data[key][index]);
      if (currentData && Number(key) !== noOfRows) {
        res -= currentData;
      }
    }
    if ((res === 0 || res) && (isTextInCell(data[noOfRows][index]))) {
      data[noOfRows][index] = res.toString();
    }
  }
  return data;
}

function subVerticalBottom(data, noOfRows, noOfCols) {
  const isIndexZeroNumber = checkIndexZeroVertical(data);
  for (let index = (isIndexZeroNumber ? 0 : 1); index < noOfCols; index++) {
    let res = data[Number(noOfRows) - 1][index];
    for (let key = Number(noOfRows) - 2; key > 0; key--) {
      let currentData = Number(data[key][index]);
      if (currentData) {
        res -= currentData;
      }
    }
    if ((res === 0 || res) && (isTextInCell(data[noOfRows][index]))) {
      data[noOfRows][index] = res.toString();
    }
  }
  return data;
}

function sumHorizontal(data, noOfRows, noOfCols) {
  for (const key in data) {
    let res = 0;
    for (let index = 0; index < (noOfCols - 1); index++) {
      let currentData = Number(data[key][index]);
      if (currentData) {
        res += currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[key][noOfCols - 1])) {
      data[key][noOfCols - 1] = res.toString();
    }
  }
  return data;
}

/**
 * isTextInCell: checks if there is a text in the cell
 * so as to aid decision if to overwrite it or not
 */
function isTextInCell(value) {
  if ((!value) || (Number(value) === 0) || (Number(value))) {
    return true;
  }
  return false;
}

function subHorizontalLeft(data, noOfRows, noOfCols) {
  for (const key in data) {
    // const isIndexZeroNumber = Number(data[key][0]) ? true : false;
    const isIndexZeroNumber = getStartIndex(key, data) === 0 ? true : false
    let res = isIndexZeroNumber ? Number(data[key][0]) : Number(data[key][1]);
    // implement search for first index where number starts and compute from there
    for (let index = (isIndexZeroNumber ? 1 : 2); index < (noOfCols - 1); index++) {
      let currentData = Number(data[key][index]);
      if (currentData) {
        res -= currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[key][noOfCols - 1])) {
      data[key][noOfCols - 1] = res.toString();
    }
  }
  return data;
}

function subHorizontalRight(data, noOfRows, noOfCols) {
  for (const key in data) {
    // const isIndexZeroNumber = Number(data[key][0]) ? true : false;
    // let res = isIndexZeroNumber ? Number(data[key][0]) : Number(data[key][1]);
    let res = Number(data[key][noOfCols - 2]);
    // implement search for first index where number starts and compute from there
    for (let index = noOfCols - 3; index >= 0; index--) {
      let currentData = Number(data[key][index]);
      if (currentData) {
        res -= currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[key][noOfCols - 1])) {
      data[key][noOfCols - 1] = res.toString();
    }
  }
  return data;
}

function getStartIndex(key, data) {
     let startIndex = (
	              Number(data[key][0])
	              && data[key][0].length
                      ) 
		      ? 0 : 1;
     return startIndex; 
}

function avgHorizontal(data, noOfRows, noOfCols) {
  for (const key in data) {
    let res = 0;
    let startIndex = getStartIndex(key, data);
   let count = 0;
    for (let index = startIndex; index < (noOfCols - 1); index++) {
      let currentData = Number(data[key][index]);
      if (currentData === 0 || currentData) {
        res += currentData;
        count++;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[key][noOfCols - 1])) {
      data[key][noOfCols - 1] = parseFloat((res / count).toString()).toFixed(2);
    }
  }
  return data;
}

function mulHorizontal(data, noOfRows, noOfCols) {
  for (const key in data) {
    let res = 1;
    if (!Number(data[key][0]) && !Number(data[key][1])) {
      res = 0;
    }
    let startIndex = getStartIndex(key, data);
    for (let index = startIndex; index < (noOfCols - 1); index++) {
      let currentData = Number(data[key][index]);
      if (currentData === 0 || currentData) {
        res *= currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[key][noOfCols - 1])) {
      data[key][noOfCols - 1] = res.toString();
    }
  }
  return data;
}

export default function utils () {
  const utilities = {
    "mulHorizontal": mulHorizontal,
    "avgHorizontal": avgHorizontal,
    "subHorizontalRight": subHorizontalRight,
    "subHorizontalLeft": subHorizontalLeft,
    "sumHorizontal": sumHorizontal,
    "sumVertical": sumVertical,
    "subVerticalTop": subVerticalTop,
    "subVerticalBottom": subVerticalBottom,
    "mulVertical": mulVertical,
    "avgVertical": avgVertical,
  }
  return utilities;
}
