function checkIndexZeroVertical(data, key) {
  let bool =
    (Number(data[key][0]) || Number(data[key][0]) === 0) && data[key][0].length
      ? true
      : false;
  return bool;
}

function sumVerticalAdv(
  data,
  noOfRows,
  noOfCols,
  startIndex,
  endIndex,
  saveIndex,
) {
  const isIndexZeroNumber = checkIndexZeroVertical(data, startIndex);
  for (let index = isIndexZeroNumber ? 0 : 1; index < noOfCols; index++) {
    let res = 0;
    for (let key = startIndex; key <= endIndex; key++) {
      let currentData = Number(data[key][index]);
      if (currentData) {
        res += currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[saveIndex][index])) {
      data[saveIndex][index] = res.toString();
    }
  }
  return data;
}

function mulVerticalAdv(
  data,
  noOfRows,
  noOfCols,
  startIndex,
  endIndex,
  saveIndex,
) {
  // const isIndexZeroNumber = Number(data[1][0]) ? true : false;
  const isIndexZeroNumber = checkIndexZeroVertical(data, startIndex);
  for (let index = isIndexZeroNumber ? 0 : 1; index < noOfCols; index++) {
    let res = 1;
    let correctedIndex;
    let checkCol = checkColIndexZeroVertical(data, index, startIndex);
    correctedIndex = checkCol ? startIndex : startIndex + 1;
    if (!data[correctedIndex][index] || !Number(data[correctedIndex][index])) {
      res = 0;
    }
    for (
      let key = checkCol ? startIndex : startIndex + 1;
      key <= endIndex;
      key++
    ) {
      let currentData = Number(data[key][index]);
      if (currentData === 0 || currentData) {
        res *= currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[saveIndex][index])) {
      data[saveIndex][index] = res.toString();
    }
  }
  return data;
}

function avgVerticalAdv(
  data,
  noOfRows,
  noOfCols,
  startIndex,
  endIndex,
  saveIndex,
) {
  const isIndexZeroNumber = checkIndexZeroVertical(data, startIndex);
  for (let index = isIndexZeroNumber ? 0 : 1; index < noOfCols; index++) {
    let res = 0;
    let count = 0;
    let checkCol = checkColIndexZeroVertical(data, index, startIndex);
    for (
      let key = checkCol ? startIndex : startIndex + 1;
      key <= endIndex;
      key++
    ) {
      let currentData = Number(data[key][index]);
      if (currentData === 0 || currentData) {
        res += currentData;
        count++;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[saveIndex][index])) {
      data[saveIndex][index] = parseFloat((res / count).toString()).toFixed(2);
    }
  }
  return data;
}

function checkColIndexZeroVertical(data, idx, stIdx) {
  let bool =
    (Number(data[stIdx][idx]) || Number(data[stIdx][idx]) === 0) &&
    data[stIdx][idx].length
      ? true
      : false;
  return bool;
}

function subVerticalTopAdv(
  data,
  noOfRows,
  noOfCols,
  startIndex,
  endIndex,
  saveIndex,
) {
  const isIndexZeroNumber = checkIndexZeroVertical(data, startIndex);
  for (let index = isIndexZeroNumber ? 0 : 1; index < noOfCols; index++) {
    let checkCol = checkColIndexZeroVertical(data, index, startIndex);
    let res = checkCol ? data[startIndex][index] : data[startIndex + 1][index];
    for (
      let key = checkCol ? startIndex + 1 : startIndex + 2;
      key <= endIndex;
      key++
    ) {
      let currentData = Number(data[key][index]);
      if (currentData && Number(key) !== endIndex + 1) {
        res -= currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[saveIndex][index])) {
      data[saveIndex][index] = res.toString();
    }
  }
  return data;
}

function subVerticalBottomAdv(
  data,
  noOfRows,
  noOfCols,
  startIndex,
  endIndex,
  saveIndex,
) {
  const isIndexZeroNumber = checkIndexZeroVertical(data, startIndex);
  for (let index = isIndexZeroNumber ? 0 : 1; index < noOfCols; index++) {
    let res = data[endIndex][index];
    for (let key = endIndex - 1; key >= startIndex; key--) {
      let currentData = Number(data[key][index]);
      if (currentData) {
        res -= currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[saveIndex][index])) {
      data[saveIndex][index] = res.toString();
    }
  }
  return data;
}

function sumHorizontalAdv(
  data,
  noOfRows,
  noOfCols,
  startIndex,
  endIndex,
  saveIndex,
) {
  for (const key in data) {
    let res = 0;
    for (let index = startIndex; index <= endIndex; index++) {
      let currentData = Number(data[key][index]);
      if (currentData) {
        res += currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[key][saveIndex])) {
      data[key][saveIndex] = res.toString();
    }
  }
  return data;
}

/**
 * isTextInCell: checks if there is a text in the cell
 * so as to aid decision if to overwrite it or not
 */
function isTextInCell(value) {
  if (!value || Number(value) === 0 || Number(value)) {
    return true;
  }
  return false;
}

function subHorizontalLeftAdv(
  data,
  noOfRows,
  noOfCols,
  startIndex,
  endIndex,
  saveIndex,
) {
  for (const key in data) {
    const isIndexZeroNumber =
      getStartIndex(key, data, startIndex) === 0 ? true : false;
    let res = isIndexZeroNumber
      ? Number(data[key][startIndex])
      : Number(data[key][startIndex + 1]);
    // implement search for first index where number starts and compute from there
    for (
      let index = isIndexZeroNumber ? startIndex + 1 : startIndex + 2;
      index <= endIndex;
      index++
    ) {
      let currentData = Number(data[key][index]);
      if (currentData) {
        res -= currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[key][saveIndex])) {
      data[key][saveIndex] = res.toString();
    }
  }
  return data;
}

function subHorizontalRightAdv(
  data,
  noOfRows,
  noOfCols,
  startIndex,
  endIndex,
  saveIndex,
) {
  for (const key in data) {
    let res = Number(data[key][endIndex]);
    for (let index = endIndex - 1; index >= startIndex; index--) {
      let currentData = Number(data[key][index]);
      if (currentData) {
        res -= currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[key][saveIndex])) {
      data[key][saveIndex] = res.toString();
    }
  }
  return data;
}

function getStartIndex(key, data, index) {
  let startIndex =
    (Number(data[key][index]) || Number(data[key][index]) === 0) &&
    data[key][index].length
      ? 0
      : 1;
  return startIndex;
}

function avgHorizontalAdv(
  data,
  noOfRows,
  noOfCols,
  startIndex,
  endIndex,
  saveIndex,
) {
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
    if ((res === 0 || res) && isTextInCell(data[key][saveIndex])) {
      data[key][saveIndex] = parseFloat((res / count).toString()).toFixed(2);
    }
  }
  return data;
}

function mulHorizontalAdv(
  data,
  noOfRows,
  noOfCols,
  startIndex,
  endIndex,
  saveIndex,
) {
  for (const key in data) {
    let res = 1;
    if (!Number(data[key][startIndex]) && !Number(data[key][startIndex + 1])) {
      res = 0;
    }
    let startIndexNative = getStartIndex(key, data, startIndex);
    for (
      let index = startIndexNative ? startIndex + 1 : startIndex;
      index <= endIndex;
      index++
    ) {
      let currentData = Number(data[key][index]);
      if (currentData === 0 || currentData) {
        res *= currentData;
      }
    }
    if ((res === 0 || res) && isTextInCell(data[key][saveIndex])) {
      data[key][saveIndex] = res.toString();
    }
  }
  return data;
}

export default function utilsAdv() {
  const utilitiesAdv = {
    mulHorizontalAdv: mulHorizontalAdv,
    avgHorizontalAdv: avgHorizontalAdv,
    subHorizontalRightAdv: subHorizontalRightAdv,
    subHorizontalLeftAdv: subHorizontalLeftAdv,
    sumHorizontalAdv: sumHorizontalAdv,
    sumVerticalAdv: sumVerticalAdv,
    subVerticalTopAdv: subVerticalTopAdv,
    subVerticalBottomAdv: subVerticalBottomAdv,
    mulVerticalAdv: mulVerticalAdv,
    avgVerticalAdv: avgVerticalAdv,
  };
  return utilitiesAdv;
}
