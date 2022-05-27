import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { colors, notes } from "./constants";
import * as Tone from "tone";
import { useGesture } from "@use-gesture/react";
import { ActionType } from "./types";

const equals = (playedNotes: number[], newElementCoordinates: number[]) =>
  playedNotes.length === newElementCoordinates.length &&
  playedNotes.every((coord, i) => {
    return coord === newElementCoordinates[i];
  });

const noteIsPlayed = (
  playedNotes: number[][],
  newElementCoordinates: number[]
) => {
  for (let i = 0; i < playedNotes.length; i++) {
    if (equals(playedNotes[i], newElementCoordinates)) return true;
  }
  return false;
};

export function Note({
  grid,
  dispatch,
  rowId,
  columnId,
  synth,
  focusedButton,
  isDragging,
  setIsDragging,
  playedNotes,
  setPlayedNotes,
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
  isDragging: { dragging: boolean; startingButtonWasActive: boolean };
  setIsDragging: Dispatch<
    SetStateAction<{ dragging: boolean; startingButtonWasActive: boolean }>
  >;
  playedNotes: number[][];
  setPlayedNotes: Dispatch<SetStateAction<number[][]>>;
}) {
  const color = colors[rowId];

  const ref = useRef<HTMLButtonElement>(null);

  const buttonIsOn = grid[rowId][columnId] === 1;

  const bind = useGesture(
    {
      onDragStart: ({ args }) => {
        if (!buttonIsOn) {
          setPlayedNotes([args]);
          synth.triggerAttackRelease(notes[args[0]], "16n");
        }
        dispatch({
          type: ActionType.TOGGLE,
          payload: {
            rowId: args[0],
            columnId: args[1],
            newValue: buttonIsOn ? 0 : 1,
          },
        });
        setIsDragging((prev) => {
          return {
            dragging: true,
            startingButtonWasActive: buttonIsOn ? true : false,
          };
        });
      },
      onDrag: ({ xy: [x, y], args }) => {
        const elem = document.elementFromPoint(x, y);
        if (elem && elem.id) {
          const newElementCoordinates = elem.id
            .split(", ")
            .map((string) => +string);

          if (
            !isDragging.startingButtonWasActive &&
            !noteIsPlayed(playedNotes, newElementCoordinates)
          ) {
            setPlayedNotes((prev) => {
              const newState = [...prev];
              newState.push(newElementCoordinates);
              return newState;
            });
            synth.triggerAttackRelease(notes[newElementCoordinates[0]], "16n");
          }

          dispatch({
            type: ActionType.TOGGLE,
            payload: {
              rowId: newElementCoordinates[0],
              columnId: newElementCoordinates[1],
              newValue: isDragging.startingButtonWasActive ? 0 : 1,
            },
          });
        }
      },
      onDragEnd: () => {
        setIsDragging((prev) => {
          return { ...prev, dragging: false };
        });
        setPlayedNotes([]);
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
      type: ActionType.TOGGLE,
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
      id={`${rowId}, ${columnId}`}
      {...bind(rowId, columnId)}
    >
      <div
        className="h-full transition-all touch-none pointer-events-none"
        style={{
          width: grid[rowId][columnId] === 1 ? "100%" : "5%",
          opacity: grid[rowId][columnId] === 1 ? 1 : 0.3,
          backgroundColor: color,
        }}
      ></div>
    </button>
  );
}
