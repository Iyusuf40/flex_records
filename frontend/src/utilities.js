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
    const isIndexZeroNumber = Number(data[key][0]) ? true : false;
    let res = isIndexZeroNumber ? Number(data[key][0]) : Number(data[key][1]);
    // implement search for first index where number starts and compute from there
    for (let index = (isIndexZeroNumber ? 1 : 2); index < (noOfCols - 1); index++) {
      let currentData = Number(data[key][index]);
      if (currentData) {
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
      if (currentData) {
        res -= currentData;
      }
    }
    data[key][noOfCols - 1] = res.toString();
  }
  return data;
}

function avgHorizontal(data, noOfRows, noOfCols) {
  for (const key in data) {
    let res = 0;
    let count = 0;
    for (let index = 0; index < (noOfCols - 1); index++) {
      let currentData = Number(data[key][index]);
      if (currentData) {
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
    for (let index = 0; index < (noOfCols - 1); index++) {
      let currentData = Number(data[key][index]);
      if (currentData) {
        res *= currentData;
      }
    }
    data[key][noOfCols - 1] = res.toString();
  }
  return data;
}

export default function () {
  const utilities = {
    "mulHorizontal": mulHorizontal,
    "avgHorizontal": avgHorizontal,
    "subHorizontalRight": subHorizontalRight,
    "subHorizontalLeft": subHorizontalLeft,
    "sumHorizontal": sumHorizontal,
  }
  return utilities;
}
