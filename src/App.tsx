import { useEffect, useReducer, useState } from "react";
import * as Tone from "tone";
import { Note } from "./Note";

const initialState = Array.from({ length: 15 }, () =>
  Array.from({ length: 8 }, () => 0)
);

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

function focusReducer(
  state: { row: number; column: number },
  {
    type,
  }: {
    type: string;
  }
) {
  const mod = (num: number, mod: number) => ((num % mod) + mod) % mod;

  switch (type) {
    case "ArrowDown":
      return { ...state, row: (state.row + 1) % 15 };
    case "ArrowUp":
      return { ...state, row: mod(state.row - 1, 15) };
    case "ArrowRight":
      return { ...state, column: (state.column + 1) % 8 };
    case "ArrowLeft":
      return { ...state, column: mod(state.column - 1, 8) };
    default:
      return { ...state };
  }
}

function App() {
  const [grid, dispatch] = useReducer(reducer, initialState);

  const [focusedButton, focusDispatch] = useReducer(focusReducer, {
    row: 0,
    column: 0,
  });

  const [isDragging, setIsDragging] = useState({
    dragging: false,
    startingButtonWasActive: false,
  });

  const [playedNotes, setPlayedNotes] = useState<number[][]>([]);

  const [synth] = useState(() =>
    new Tone.PolySynth(Tone.Synth).toDestination()
  );

  return (
    <div
      className="h-screen w-full touch-none"
      onKeyDown={({ key }) => focusDispatch({ type: key })}
    >
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
                    focusedButton={focusedButton}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                    playedNotes={playedNotes}
                    setPlayedNotes={setPlayedNotes}
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
