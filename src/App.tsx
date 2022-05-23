import { useEffect, useReducer, useState } from "react";
import * as Tone from "tone";
import { Note } from "./Note";

const initialState = Array.from({ length: 15 }, () =>
  Array.from({ length: 8 }, () => 0)
);

function App() {
  function reducer(
    state: number[][],
    {
      type,
      payload,
    }: {
      type: string;
      payload: { rowId: number; columnId: number; newValue: number };
    }
  ) {
    switch (type) {
      case "toggle":
        let newState = [...state];
        newState[payload.rowId][payload.columnId] = payload.newValue;
        return newState;

      case "reset":
        return initialState;

      default:
        throw new Error();
    }
  }

  const [grid, dispatch] = useReducer(reducer, initialState);

  const [synth] = useState(() =>
    new Tone.PolySynth(Tone.Synth).toDestination()
  );

  return (
    <div className="h-screen w-full">
      <div className="w-full h-5/6 grid grid-row-[15] p-1 gap-1">
        {grid.map((row, rowId) => {
          return (
            <div className="w-full grid grid-cols-8 gap-1" key={rowId}>
              {row.map((cell, columnId) => {
                return (
                  <Note
                    key={columnId}
                    grid={grid}
                    dispatch={dispatch}
                    rowId={rowId}
                    columnId={columnId}
                    synth={synth}
                  ></Note>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
