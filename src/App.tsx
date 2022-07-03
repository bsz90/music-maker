import { useEffect, useReducer, useState } from "react";
import * as Tone from "tone";
import { PlayButton } from "./PlayButton";
import { Note } from "./Note";
import { TempoSlider } from "./TempoSlider";
import { VolumeButton } from "./VolumeButton";
import { beats, notes } from "./constants";
import { ActionType } from "./types";

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
    case ActionType.TOGGLE:
      let newState = [...state];
      newState[payload.rowId][payload.columnId] = payload.newValue;
      return newState;
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
    case ActionType.ARROW_DOWN:
      return { ...state, row: (state.row + 1) % 15 };
    case ActionType.ARROW_UP:
      return { ...state, row: mod(state.row - 1, 15) };
    case ActionType.ARROW_RIGHT:
      return { ...state, column: (state.column + 1) % 8 };
    case ActionType.ARROW_LEFT:
      return { ...state, column: mod(state.column - 1, 8) };
    default:
      return state;
  }
}

function beatReducer(state: { beat: number }, { type }: { type: string }) {
  switch (type) {
    case ActionType.INCREMENT: {
      const newState = { ...state };
      const prevCount = state.beat;
      newState.beat = (prevCount + 1) % 8;
      return newState;
    }
    case ActionType.RESET:
      return { beat: -1 };
    default:
      throw new Error();
  }
}

function App() {
  const [grid, dispatch] = useReducer(reducer, initialState);

  const [focusedButton, focusDispatch] = useReducer(focusReducer, {
    row: 0,
    column: 0,
  });

  const [currentBeat, beatDispatch] = useReducer(beatReducer, { beat: -1 });

  const [isDragging, setIsDragging] = useState({
    dragging: false,
    startingButtonWasActive: false,
  });

  const [playedNotes, setPlayedNotes] = useState<number[][]>([]);

  const [synth] = useState(() =>
    new Tone.PolySynth(Tone.Synth).toDestination()
  );

  const [playing, setPlaying] = useState(false);

  const [tempo, setTempo] = useState(120);

  const [volume, setVolume] = useState(-20);

  useEffect(() => {
    synth.volume.value = volume;
    synth.maxPolyphony = grid[0].length * grid.length;
  }, [synth, grid, volume]);

  useEffect(() => {
    Tone.Transport.bpm.rampTo(tempo);
  }, [tempo]);

  useEffect(() => {
    const arrayToPassToPart = () => {
      const arrayOfEveryBeat = beats.map((beat, id) => [beat]);
      const arrayOfNotesToBePlayed = grid
        .flatMap((row, rowIndex) =>
          row.map((cell, columnIndex) =>
            cell === 1 ? [beats[columnIndex], notes[rowIndex]] : undefined
          )
        )
        .filter(Boolean) as [string, number][];
      if (arrayOfNotesToBePlayed.length === 0) return arrayOfEveryBeat;

      for (let i = 0; i < arrayOfEveryBeat.length; i++) {
        for (let j = 0; j < arrayOfNotesToBePlayed.length; j++) {
          if (arrayOfEveryBeat[i][0] === arrayOfNotesToBePlayed[j][0])
            arrayOfEveryBeat[i].push(arrayOfNotesToBePlayed[j][1]);
        }
      }

      return arrayOfEveryBeat;
    };

    const part = new Tone.Part((time, note) => {
      synth.triggerAttackRelease(note, 0.2, time);
      beatDispatch({ type: ActionType.INCREMENT });
    }, arrayToPassToPart()).start(0);
    part.mute = volume < -59;
    part.loop = true;

    if (playing) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
      beatDispatch({ type: ActionType.RESET });
    }

    return () => {
      part.dispose();
    };
  }, [grid, volume, playing, synth]);

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
                    currentBeat={currentBeat}
                    playing={playing}
                  ></Note>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="border-t border-[#f58f4b] grid grid-cols-[20%_60%_20%] items-center justify-center w-full h-1/6 bg-[#f2e6c7]">
        <PlayButton playing={playing} setPlaying={setPlaying} />
        <TempoSlider tempo={tempo} setTempo={setTempo} />
        <VolumeButton volume={volume} setVolume={setVolume} />
      </div>
    </div>
  );
}

export default App;
