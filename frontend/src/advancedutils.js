function checkIndexZeroVertical(data, key) {
     let bool = (
	              (Number(data[key][0]) || Number(data[key][0]) === 0)
	              && data[key][0].length
                      ) 
		      ? true : false;
     return bool; 

}

function sumVerticalAdv(data, noOfRows, noOfCols, startIndex, endIndex) {
  const isIndexZeroNumber = checkIndexZeroVertical(data, startIndex);
  for (let index = (isIndexZeroNumber ? 0 : 1); index < noOfCols; index++) {
    let res = 0;
    for (let key = startIndex; key <= endIndex; key++) {
      let currentData = Number(data[key][index]);
      if (currentData && Number(key) !== endIndex) {
        res += currentData;
      }
    }
    if ((res === 0 || res) && (isTextInCell(data[endIndex + 1][index]))) {
      data[endIndex + 1][index] = res.toString();
    }
  }
  return data;
}

function mulVerticalAdv(data, noOfRows, noOfCols, startIndex, endIndex) {
  // const isIndexZeroNumber = Number(data[1][0]) ? true : false;
  const isIndexZeroNumber = checkIndexZeroVertical(data, startIndex);
  for (let index = (isIndexZeroNumber ? 0 : 1); index < noOfCols; index++) {
    let res = 1;
    let correctedIndex = startIndex;
    /*let checkCol = checkColIndexZeroVertical(data, index);
    correctedIndex = checkCol ? 1 : 2;*/
    if (!data[correctedIndex][index] || !Number(data[correctedIndex][index])) {
      res = 0;
    }
    for (let key = startIndex; key < endIndex; key++) {
      let currentData = Number(data[key][index]);
      if (currentData === 0 || currentData) {
	  res *= currentData;
      }
    }
    if ((res === 0 || res) && (isTextInCell(data[endIndex + 1][index]))) {
      data[endIndex + 1][index] = res.toString();
    }
  }
  return data;
}

function avgVerticalAdv(data, noOfRows, noOfCols, startIndex, endIndex) {
  const isIndexZeroNumber = checkIndexZeroVertical(data, startIndex);
  for (let index = (isIndexZeroNumber ? 0 : 1); index < noOfCols; index++) {
    let res = 0;
    let count = 0;
    for (let key = startIndex; key <= endIndex; key++) {
      let currentData = Number(data[key][index]);
      if (currentData === 0 || currentData) {
	  res += currentData;
	  count++;
      }
    }
    if ((res === 0 || res) && (isTextInCell(data[endIndex + 1][index]))) {
      data[endIndex + 1][index] = parseFloat((res / count).toString()).toFixed(2);
    }
  }
  return data;
}

function checkColIndexZeroVertical(data, idx) {
     let bool = (
	              (Number(data[1][idx]) ||
		      (Number(data[1][idx])) === 0)
	              && data[1][idx].length
                      ) 
		      ? true : false;
     return bool; 
}

function subVerticalTopAdv(data, noOfRows, noOfCols, startIndex, endIndex) {
  const isIndexZeroNumber = checkIndexZeroVertical(data, startIndex);
  for (let index = (isIndexZeroNumber ? 0 : 1); index < noOfCols; index++) {
    let checkCol = true; // checkColIndexZeroVertical(data, index);
    let res = checkCol ? data[startIndex + 1][index] :  data[startIndex + 2][index];
    for (let key = startIndex + 1; key <= endIndex; key++) {
      let currentData = Number(data[key][index]);
      if (currentData && Number(key) !== (endIndex + 1)) {
        res -= currentData;
      }
    }
    if ((res === 0 || res) && (isTextInCell(data[endIndex + 1][index]))) {
      data[endIndex + 1][index] = res.toString();
    }
  }
  return data;
}

function subVerticalBottomAdv(data, noOfRows, noOfCols, startIndex, endIndex) {
  const isIndexZeroNumber = checkIndexZeroVertical(data, startIndex);
  for (let index = (isIndexZeroNumber ? 0 : 1); index < noOfCols; index++) {
    let res = data[endIndex][index];
    for (let key = endIndex - 1; key >= startIndex; key--) {
      let currentData = Number(data[key][index]);
      if (currentData) {
        res -= currentData;
      }
    }
    if ((res === 0 || res) && (isTextInCell(data[endIndex + 1][index]))) {
      data[endIndex + 1][index] = res.toString();
    }
  }
  return data;
}

function sumHorizontalAdv(data, noOfRows, noOfCols, startIndex, endIndex) {
  for (const key in data) {
    let res = 0;
    for (let index = startIndex; index <= endIndex; index++) {
      let currentData = Number(data[key][index]);
      if (currentData) {
        res += currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[key][endIndex + 1])) {
      data[key][endIndex + 1] = res.toString();
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

function subHorizontalLeftAdv(data, noOfRows, noOfCols, startIndex, endIndex) {
  for (const key in data) {
    // const isIndexZeroNumber = Number(data[key][0]) ? true : false;
    const isIndexZeroNumber = getStartIndex(key, data, startIndex) === 0 ? 
		                                                 true : false
    let res = isIndexZeroNumber ? 
		  Number(data[key][startIndex]) 
		  : Number(data[key][startIndex + 1]);
    // implement search for first index where number starts and compute from there
    for (let index = (isIndexZeroNumber ? 
	              startIndex + 1 
	              : startIndex + 2); index <= endIndex; index++) {
      let currentData = Number(data[key][index]);
      if (currentData) {
        res -= currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[key][endIndex + 1])) {
      data[key][endIndex + 1] = res.toString();
    }
  }
  return data;
}

function subHorizontalRightAdv(data, noOfRows, noOfCols, startIndex, endIndex) {
  for (const key in data) {
    // const isIndexZeroNumber = Number(data[key][0]) ? true : false;
    // let res = isIndexZeroNumber ? Number(data[key][0]) : Number(data[key][1]);
    let res = Number(data[key][endIndex]);
    // implement search for first index where number starts and compute from there
    for (let index = endIndex - 1; index >= startIndex; index--) {
      let currentData = Number(data[key][index]);
      if (currentData) {
        res -= currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[key][endIndex + 1])) {
      data[key][endIndex + 1] = res.toString();
    }
  }
  return data;
}

function getStartIndex(key, data, index) {
     let startIndex = (
	              (Number(data[key][index]) ||
                       Number(data[key][index]) === 0)
	              && data[key][index].length
                      ) 
		      ? 0 : 1;
     return startIndex; 
}

function avgHorizontalAdv(data, noOfRows, noOfCols, startIndex, endIndex) {
  for (const key in data) {
    let res = 0;
    // let startIndexNative = getStartIndex(key, data, startIndex);
    let count = 0;
    for (let index = startIndex; index <= endIndex; index++) {
      let currentData = Number(data[key][index]);
      if (currentData === 0 || currentData) {
        res += currentData;
        count++;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[key][endIndex + 1])) {
      data[key][endIndex + 1] = parseFloat((res / count).toString()).toFixed(2);
    }
  }
  return data;
}

function mulHorizontalAdv(data, noOfRows, noOfCols, startIndex, endIndex) {
  for (const key in data) {
    let res = 1;
    if (!Number(data[key][startIndex])) {
      res = 0;
    }
    // let startIndexNative = getStartIndex(key, data);
    for (let index = startIndex; index <= endIndex; index++) {
      let currentData = Number(data[key][index]);
      if (currentData === 0 || currentData) {
        res *= currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[key][endIndex + 1])) {
      data[key][endIndex + 1] = res.toString();
    }
  }
  return data;
}

export default function utilsAdv () {
  const utilitiesAdv = {
    "mulHorizontalAdv": mulHorizontalAdv,
    "avgHorizontalAdv": avgHorizontalAdv,
    "subHorizontalRightAdv": subHorizontalRightAdv,
    "subHorizontalLeftAdv": subHorizontalLeftAdv,
    "sumHorizontalAdv": sumHorizontalAdv,
    "sumVerticalAdv": sumVerticalAdv,
    "subVerticalTopAdv": subVerticalTopAdv,
    "subVerticalBottomAdv": subVerticalBottomAdv,
    "mulVerticalAdv": mulVerticalAdv,
    "avgVerticalAdv": avgVerticalAdv,
  }
  return utilitiesAdv;
}
