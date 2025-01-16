import React, { useState } from "react";
import './App.css';

let App = function CrushGame() {
  // number of variations in items to match
  const nItemIdeal = 4;

  // size of grid
	const nCellXIdeal = 5;
	const nCellYIdeal = 6;

  const [bIsInitialized, setIsInitialized] = useState(0);
  const [bCellsWereSwapped, setCellsWereSwapped] = useState(0);
	const [nItem, setNumberOfItem] = useState(nItemIdeal);
	const [nCellX, setNumberOfCellX] = useState(nCellXIdeal);
	const [nCellY, setNumberOfCellY] = useState(nCellYIdeal);
	const [cellValues, setCellValues] = useState(Array(nCellX * nCellY).fill(null));
  const [cellToSwap1st, setCellToSwap1st] = useState(null);
  const [cellToSwap2nd, setCellToSwap2nd] = useState(null);

  function onCellMouseDown(cellDown) {
    setCellsWereSwapped(0);
    setCellToSwap1st(cellDown);
    setCellToSwap2nd(null);
  }

  function onCellMouseUp(cellUp) {
    if (cellToSwap1st !== null && cellToSwap1st != cellUp) {

      const bIsFirstRow = cellToSwap1st < nCellX;
      const bIsLastRow = cellToSwap1st >= nCellX * nCellY - nCellX;
      const bIsFirstCol = cellToSwap1st % nCellX === 0;
      const bIsLastCol = (cellToSwap1st + 1) % nCellX === 0;

      const offsetCells = [
        bIsFirstRow ? cellToSwap1st : cellToSwap1st - nCellX,
        bIsLastRow ? cellToSwap1st : cellToSwap1st + nCellX,
        bIsFirstCol ? cellToSwap1st : cellToSwap1st - 1,
        bIsLastCol ? cellToSwap1st : cellToSwap1st + 1
      ];

      if (offsetCells.includes(cellUp)) {
        // do the swap
        if (cellToSwap1st !== null && cellUp !== null) {
          [cellValues[cellToSwap1st], cellValues[cellUp]] = [cellValues[cellUp], cellValues[cellToSwap1st]];
          setCellsWereSwapped(1);
          setCellToSwap2nd(cellUp);
        }
      } else {
        setCellToSwap1st(null);
        setCellToSwap2nd(null);
      }
    }
  }

  function destroyGame() {
    setIsInitialized(0);
    setCellsWereSwapped(0);
    setCellValues(Array(nCellX * nCellY).fill(null));
    setCellToSwap1st(null);
    setCellToSwap2nd(null);
  }
  
  function initGame() {
    setIsInitialized(1);
    setCellsWereSwapped(0);
    setCellValues(
      Array.from(
        { length: nCellX * nCellY }, () => Math.floor(Math.random() * nItem + 1)
      )
    );
    setCellToSwap1st(null);
    setCellToSwap2nd(null);
  }
  
  function tweakCounter(setCount, currentCount, tweakValue = 0, counterLimitMin = 0, counterLimitMax = 99) {
    setCount(Math.min(Math.max(currentCount + tweakValue, counterLimitMin), counterLimitMax));
 }
  
  function TweakValueButton({ onClick, text, disabled }) {
    return (
      <button className="cpTweakerButton" role="button" disabled={disabled} onClick={onClick}>{text}</button>
    );
  }
  
  function CrushGameGrid({ xDim, yDim, cellValues }) {
    const rows = Array.from({ length: yDim }, (_, rowIndex) => (
      <tr key={rowIndex}>
        {Array.from({ length: xDim }, (_, cellIndex) => {
          const cellIndexGlobal = rowIndex * xDim + cellIndex;
          const colorClass = `item${cellValues[cellIndexGlobal]}`;
          const isSelected1st = cellToSwap1st === cellIndexGlobal; 
          const isSelected2nd = cellToSwap2nd === cellIndexGlobal; 

          return <td
            key={cellIndex}
            className={colorClass}
            onMouseDown={() => onCellMouseDown(cellIndexGlobal)}
            onMouseUp={() => onCellMouseUp(cellIndexGlobal)}
            style={{
              border: isSelected1st || isSelected2nd ? "2px solid white" : "2px solid black",
          }}>
          </td>;
        })}
      </tr>
    ));
  
    return <table><tbody>{rows}</tbody></table>;
  }
  
  function CrushGameTweaker({ title, count, setCount, min, max, disabled }) {
    return (
      <div className="cpTweakerContainer">
        <div className="cpTweakerTitle">{title}</div>
        <div className="cpTweakerInput">
          <TweakValueButton
            onClick={() => tweakCounter(setCount, count, -1, min, max)}
            text={"−"}
            disabled = {disabled}
          />
        <div className="cpTweakerCounter">{count}</div>
          <TweakValueButton
            onClick={() => tweakCounter(setCount, count, 1, min, max)}
            text={"+"}
            disabled = {disabled}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mainContainer">
      <div className="gameContainer">
      
        <div className="gameTitle">React Crush Game</div>

        <div className="cpContainer">

          {CrushGameTweaker({
            title: "number of items",
            count: nItem,
            setCount: setNumberOfItem,
            min: 3,
            max: 7,
            disabled: bIsInitialized
          })}

          {CrushGameTweaker({
            title: "nGridX",
            count: nCellX,
            setCount: setNumberOfCellX,
            min: 3,
            max: 12,
            disabled: bIsInitialized
          })}

          {CrushGameTweaker({
            title: "nGridY",
            count: nCellY,
            setCount: setNumberOfCellY,
            min: 5,
            max: 9,
            disabled: bIsInitialized
          })}

        </div>
        
        <CrushGameGrid xDim={nCellX} yDim={nCellY} cellValues={cellValues} />
        
        <button className="gameButton" onClick={initGame}>generate arena</button>
        <button className="gameButton" onClick={destroyGame}>destroy game</button>
      </div>
    </div>
  );
}

export default App;
