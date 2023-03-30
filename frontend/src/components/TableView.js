import React from 'react';

export default function TableView(props) {
  const { currentTable } = props.records;
  const tableData = currentTable
		    ? props.records.tables[currentTable].data
	            : null;
  const noOfCols = currentTable
		   ? props.records.tables[currentTable].noOfCols
	           : null;
  const noOfRows = currentTable
		   ? props.records.tables[currentTable].noOfRows
	           : null;
  const table = currentTable
    ? props.records.tables[currentTable]
	        : {};

  const className = getClassName(table);

  function getClassName(table) {
    if (!table && !table.cellSize) {
      return null;
    }
    const map = {
      1: 'input-1',
      2: 'input-2',
      3: 'input-3',
    };
    return map[table.cellSize];
  }

  const clearFormObj = {
    createTableMode: null,
    fields: {
      name: '',
      noOfRows: '',
      noOfCols: '',
    },
  };

  let formObj;
  let setFormObj;
  [formObj, setFormObj] = React.useState(clearFormObj);

  let classCreateTableMode = '';

  if (props.records.createTableBtnClicked) {
    // setFormObj({
    // 	...clearFormObj,
    // 	createTableMode: true
    // })
    classCreateTableMode = '';
  } else {
    classCreateTableMode = 'hide';
  }

  function parseCreateTableForm(formObj, e) {
    e.preventDefault();
    const { noOfRows } = formObj.fields;
    const { noOfCols } = formObj.fields;
    const { name } = formObj.fields;
    props.createTable(name, noOfRows, noOfCols);
    // props.unsetCreateTableBtnClicked()
    setFormObj(clearFormObj);
  }

  function cancelCreateTableForm(formObj, e) {
    e.preventDefault();
    setFormObj(clearFormObj);
    props.unsetCreateTableBtnClicked();
  }

  function handleCreateFormChange(name, value) {
    setFormObj((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: value,
      },
    }));
  }

  const tableView = [];
  let rowIndex = 0;
  if (tableData) {
    // console.log(props.records);
    for (let row = 1; row <= noOfRows; row++) {
      const saveRowIndex = rowIndex;
      const currentRow = tableData[row];
      const rowContainer = [];
      for (let colIndex = 0; colIndex < noOfCols; colIndex++) {
        const cell = (
          <input
            type="text"
            key={colIndex}
            className={!colIndex ? 'label--col' : (className || '')}
            placeholder={!colIndex ? 'label' : ''}
            value={currentRow[colIndex] ? currentRow[colIndex] : ''}
            data-col-index={colIndex}
            data-row-index={saveRowIndex}
            onChange={(e) => props.updateTableView(
              currentTable,
		                                saveRowIndex,
		                                colIndex,
	     e.target.value,
	     saveRowIndex + 1,
            )}

            onClick={(e) => (table.ruleMode && table.currentRule ? props.pickCells(
		              table.currentRule,
		              currentTable,
		              row,
		              colIndex,
		              noOfRows,
		              noOfCols,
	                   )
			   : (table.ruleModeAdv && table.currentRule ? props.pickCellsAdv(
	       table.currentRule,
			      currentTable,
			      row,
			      colIndex,
			      noOfRows,
			      noOfCols,
			   )
		           : '')
	   )}
          />
        );
        rowContainer.push(cell);
      }
      tableView.push(
        <div
          key={row}
          className="row--container"
        >
          {'' && (
          <span className="numbering">
            {row}
            :
            {' '}
          </span>
          )}
          {rowContainer}
        </div>,
      );
      rowIndex++;
    }
  }
  // const tableView = <input type="text" value="12" />

  return (
    <div className="table--view">
      <div className={`create--form--container ${classCreateTableMode}`}>
        <form className="create--form">
          <div className="form--block">
            <label htmlFor="table--name">Table name</label>
            <input
              type="text"
              id="table--name"
              name="table--name"
              placeholder="e.g my table"
              value={formObj.fields.name}
              onChange={(e) => handleCreateFormChange('name', e.target.value)}
            />
          </div>
          <div className="form--block">
            <label htmlFor="no--of--rows">rows</label>
            <input
              type="text"
              id="no--of--rows"
              name="no--of--rows"
              placeholder="enter no of rows here"
              value={formObj.fields.noOfRows}
              onChange={(e) => handleCreateFormChange('noOfRows', e.target.value)}
            />
          </div>
          <div className="form--block">
            <label htmlFor="no--of--cols">columns</label>
            <input
              type="text"
              id="no--of--cols"
              name="no--of--cols"
              placeholder="enter no of cols here"
              value={formObj.fields.noOfCols}
              onChange={(e) => handleCreateFormChange('noOfCols', e.target.value)}
            />
          </div>
          <div className="create--form--btns">
            <button onClick={(e) => parseCreateTableForm(formObj, e)}>
              create
            </button>
            <button className="cancel--btn" onClick={(e) => cancelCreateTableForm(formObj, e)}>
              cancel
            </button>
          </div>
        </form>
      </div>
      <div className="rules--buttons">
        <button
          onClick={(e) => props.addColumn(currentTable)}
        >
          add column +
        </button>
        <button
          onClick={(e) => props.delColumn(currentTable)}
        >
          del column -
        </button>
        <button
          onClick={(e) => props.addRow(currentTable)}
        >
          add row +
        </button>
        <button
          onClick={(e) => props.delRow(currentTable)}
        >
          del row -
        </button>
        <button
          onClick={(e) => props.addRule(currentTable)}
        >
          add rule +
        </button>
        <button
          onClick={(e) => props.addRuleAdv(currentTable)}
        >
          advanced +
        </button>
        <button
          onClick={(e) => props.clearRule(currentTable)}
        >
          clear rule -
        </button>
        <button
          onClick={(e) => props.increaseCellSize(currentTable)}
        >
          cell size +
        </button>
        <button
          onClick={(e) => props.decreaseCellSize(currentTable)}
        >
          cell size -
        </button>

      </div>
      {
        table.ruleMode
          ? (
            <div className="rule--options">
              <input
                type="radio"
                id="sum"
                name="rules"
                onClick={(e) => props.afterRulePick('sum', currentTable)}
              />
              <label htmlFor="sum">sum</label>
              <input
                type="radio"
                id="subtract"
                name="rules"
                onClick={(e) => props.afterRulePick('subtract', currentTable)}
              />
              <label htmlFor="subtract">subtract</label>
              <input
                type="radio"
                id="subtractReverse"
                name="rules"
                onClick={(e) => props.afterRulePick('subtractReverse', currentTable)}
              />
              <label htmlFor="subtractReverse">subtract-reverse</label>
              <input
                type="radio"
                id="multiply"
                name="rules"
                onClick={(e) => props.afterRulePick('multiply', currentTable)}
              />
              <label htmlFor="multiply">multiply</label>
              <input
                type="radio"
                id="average"
                name="rules"
                onClick={(e) => props.afterRulePick('average', currentTable)}
              />
              <label htmlFor="average">average</label>

            </div>
          )
          : ''
      }
      {
        table.ruleModeAdv
          ? (
            <div className="rule--options">
              <input
                type="radio"
                id="sum"
                name="rules"
                onClick={(e) => props.afterRulePickAdv('sum', currentTable)}
              />
              <label htmlFor="sum">sum adv</label>
              <input
                type="radio"
                id="subtract"
                name="rules"
                onClick={(e) => props.afterRulePickAdv('subtract', currentTable)}
              />
              <label htmlFor="subtract">subtract adv</label>
              <input
                type="radio"
                id="subtractReverse"
                name="rules"
                onClick={(e) => props.afterRulePickAdv('subtractReverse', currentTable)}
              />
              <label htmlFor="subtractReverse">subtract-reverse adv</label>
              <input
                type="radio"
                id="multiply"
                name="rules"
                onClick={(e) => props.afterRulePickAdv('multiply', currentTable)}
              />
              <label htmlFor="multiply">multiply adv</label>
              <input
                type="radio"
                id="average"
                name="rules"
                onClick={(e) => props.afterRulePickAdv('average', currentTable)}
              />
              <label htmlFor="average">average adv</label>

            </div>
          )
          : ''
      }

      <div className="current--table">
        {tableView.length ? tableView : <h1>No table selected</h1>}
      </div>
    </div>
  );
}
