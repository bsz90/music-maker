import { Dispatch } from "react";
import { colors, notes } from "./constants";
import * as Tone from "tone";

export function Note({
  grid,
  dispatch,
  rowId,
  columnId,
  synth,
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
}) {
  const color = colors[rowId];

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

  return (
    <button
      className="w-auto border-2 rounded-full overflow-hidden"
      style={{ outlineColor: color }}
      onClick={handleButtonClick}
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
