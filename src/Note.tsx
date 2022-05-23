import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { colors, notes } from "./constants";
import * as Tone from "tone";
import { useGesture } from "@use-gesture/react";

export function Note({
  grid,
  dispatch,
  rowId,
  columnId,
  synth,
  focusedButton,
  isDragging,
  setIsDragging,
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
  isDragging: { dragging: boolean; toggleOff: boolean };
  setIsDragging: Dispatch<
    SetStateAction<{ dragging: boolean; toggleOff: boolean }>
  >;
}) {
  const color = colors[rowId];

  const ref = useRef<HTMLButtonElement>(null);

  const buttonIsOn = grid[rowId][columnId] === 1;

  const bind = useGesture(
    {
      onDragStart: ({ args }) => {
        if (!buttonIsOn) {
          synth.triggerAttackRelease(notes[args[0]], "16n");
        }

        dispatch({
          type: "toggle",
          payload: {
            rowId: args[0],
            columnId: args[1],
            newValue: buttonIsOn ? 0 : 1,
          },
        });
        setIsDragging((prev) => {
          return { dragging: true, toggleOff: buttonIsOn ? true : false };
        });
      },
      onDrag: ({ xy: [x, y], args }) => {},
      onDragEnd: () =>
        setIsDragging((prev) => {
          return { ...prev, dragging: false };
        }),
      onHover: ({ xy: [x, y], dragging, args }) => {
        if (
          isDragging.dragging &&
          document.elementFromPoint(x, y) === ref.current
        ) {
          dispatch({
            type: "toggle",
            payload: {
              rowId: args[0],
              columnId: args[1],
              newValue: isDragging.toggleOff ? 0 : 1,
            },
          });
        }
      },
    },
    { drag: { pointer: { capture: false } } }
  );

  const handleButtonClick = () => {
    if (isDragging) {
      setIsDragging((prev) => {
        return { ...prev, dragging: false };
      });
      return;
    }

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
      {...bind(rowId, columnId)}
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
