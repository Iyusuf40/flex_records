function checkIndexZeroVertical(data) {
     let bool = (
	              typeof(Number(data[1][0])) === "number"
	              && data[1][0]
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
    data[noOfRows][index] = res.toString();
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
      if (typeof(currentData) === 'number' && Number(key) !== noOfRows) {
        res *= currentData;
      }
    }
    data[noOfRows][index] = res.toString();
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
      if (typeof(currentData) === 'number' && Number(key) !== noOfRows) {
        res += currentData;
	count++;
      }
    }
    data[noOfRows][index] = parseFloat((res / count).toString()).toFixed(2);
  }
  return data;
}

function subVerticalTop(data, noOfRows, noOfCols) {
  const isIndexZeroNumber = checkIndexZeroVertical(data);
  for (let index = (isIndexZeroNumber ? 0 : 1); index < noOfCols; index++) {
    let res = data[1][index];
    for (let key = 2; key <= noOfRows; key++) {
      let currentData = Number(data[key][index]);
      if (typeof(currentData) === 'number' && Number(key) !== noOfRows) {
        res -= currentData;
      }
    }
    data[noOfRows][index] = res.toString();
  }
  return data;
}

function subVerticalBottom(data, noOfRows, noOfCols) {
  const isIndexZeroNumber = checkIndexZeroVertical(data);
  for (let index = (isIndexZeroNumber ? 0 : 1); index < noOfCols; index++) {
    let res = data[Number(noOfRows) - 1][index];
    for (let key = Number(noOfRows) - 2; key > 0; key--) {
      let currentData = Number(data[key][index]);
      if (typeof(currentData) === 'number') {
        res -= currentData;
      }
    }
    data[noOfRows][index] = res.toString();
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
    data[key][noOfCols - 1] = res.toString();
  }
  return data;
}

function subHorizontalLeft(data, noOfRows, noOfCols) {
  for (const key in data) {
    // const isIndexZeroNumber = Number(data[key][0]) ? true : false;
    const isIndexZeroNumber = getStartIndex(key, data) === 0 ? true : false
    let res = isIndexZeroNumber ? Number(data[key][0]) : Number(data[key][1]);
    // implement search for first index where number starts and compute from there
    for (let index = (isIndexZeroNumber ? 1 : 2); index < (noOfCols - 1); index++) {
      let currentData = Number(data[key][index]);
      if (typeof(currentData) === 'number') {
        res -= currentData;
      }
    }
    data[key][noOfCols - 1] = res.toString();
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
      if (typeof(currentData) === 'number') {
        res -= currentData;
      }
    }
    data[key][noOfCols - 1] = res.toString();
  }
  return data;
}

function getStartIndex(key, data) {
     let startIndex = (
	              typeof(Number(data[key][0])) === "number"
	              && data[key][0]
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
      if (typeof(currentData) === 'number') {
        res += currentData;
        count++;
      }
    }
    data[key][noOfCols - 1] = parseFloat((res / count).toString()).toFixed(2);
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
      if (typeof(currentData) === 'number') {
        res *= currentData;
      }
    }
    data[key][noOfCols - 1] = res.toString();
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
