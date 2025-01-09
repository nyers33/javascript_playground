import React, { useState } from "react";
import './App.css';

let App = function CrushGame() {
  // number of variations in items to match
  const nItemIdeal = 4;

  // size of grid
	const nCellXIdeal = 5;
	const nCellYIdeal = 6;

  const [bIsInitialized, setIsInitialized] = useState(0);
	const [nItem, setNumberOfItem] = useState(nItemIdeal);
	const [nCellX, setNumberOfCellX] = useState(nCellXIdeal);
	const [nCellY, setNumberOfCellY] = useState(nCellYIdeal);
	const [cellValues, setCellValues] = useState(Array(nCellX * nCellY).fill(0));

  function destroyGame() {
    setIsInitialized(0);
    setCellValues(Array(nCellX * nCellY).fill(0));
  }
  
  function initGame() {
    setIsInitialized(1);
    setCellValues(
      Array.from(
        { length: nCellX * nCellY }, () => Math.floor(Math.random() * nItem + 1)
      )
    );
  }
  
  function tweakCounter(setCount, currentCount, tweakValue = 0, counterLimitMin = 0, counterLimitMax = 99) {
    setCount(Math.min(Math.max(currentCount + tweakValue, counterLimitMin), counterLimitMax));
  }
  
  function TweakValueButton({ onClick, text }) {
    return (
      <button className="cpTweakerButton" role="button" onClick={onClick}>{text}</button>
    );
  }
  
  function CrushGameGrid({ xDim, yDim, cellValues }) {
    const rows = Array.from({ length: yDim }, (_, rowIndex) => (
      <tr key={rowIndex}>
        {Array.from({ length: xDim }, (_, cellIndex) => {
          const cellIndexGlobal = rowIndex * xDim + cellIndex;
          const colorClass = `item${cellValues[cellIndexGlobal]}`;
          return <td key={cellIndex} className={colorClass}></td>;
        })}
      </tr>
    ));
  
    return <table><tbody>{rows}</tbody></table>;
  }
  
  function CrushGameTweaker({ title, count, setCount, min, max }) {
    return (
      <div className="cpTweakerContainer">
        <div className="cpTweakerTitle">{title}</div>
        <div className="cpTweakerInput">
          <TweakValueButton
            onClick={() => tweakCounter(setCount, count, -1, min, max)}
            text={"−"}
          />
        <div className="cpTweakerCounter">{count}</div>
          <TweakValueButton
            onClick={() => tweakCounter(setCount, count, 1, min, max)}
            text={"+"}
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
          })}

          {CrushGameTweaker({
            title: "nGridX",
            count: nCellX,
            setCount: setNumberOfCellX,
            min: 3,
            max: 12,
          })}

          {CrushGameTweaker({
            title: "nGridY",
            count: nCellY,
            setCount: setNumberOfCellY,
            min: 5,
            max: 9,
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
