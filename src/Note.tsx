import { Dispatch, useEffect, useRef } from "react";
import { colors, notes } from "./constants";
import * as Tone from "tone";

export function Note({
  grid,
  dispatch,
  rowId,
  columnId,
  synth,
  focusedButton,
}: {
  grid: number[][];
  dispatch: Dispatch<{
    type: string;
    payload: {
      rowId: number;
      columnId: number;
      newValue: number;
    };
  }>;
  rowId: number;
  columnId: number;
  synth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>;
  focusedButton: { row: number; column: number };
}) {
  const color = colors[rowId];

  const ref = useRef<HTMLButtonElement>(null);

  const handleButtonClick = () => {
    const buttonIsOn = grid[rowId][columnId] === 1;

    if (!buttonIsOn) {
      synth.triggerAttackRelease(notes[rowId], "16n");
    }
    dispatch({
      type: "toggle",
      payload: { rowId, columnId, newValue: buttonIsOn ? 0 : 1 },
    });
  };

  useEffect(() => {
    if (focusedButton.row === rowId && focusedButton.column === columnId)
      ref.current?.focus();
  }, [columnId, focusedButton.column, focusedButton.row, rowId]);

  return (
    <button
      className="w-auto border-2 rounded-full overflow-hidden"
      style={{ outlineColor: color }}
      onClick={handleButtonClick}
      ref={ref}
    >
      <div
        className="h-full transition-all"
        style={{
          width: grid[rowId][columnId] === 1 ? "100%" : "5%",
          opacity: grid[rowId][columnId] === 1 ? 1 : 0.3,
          backgroundColor: color,
        }}
      ></div>
    </button>
  );
}
