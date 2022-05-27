import * as Slider from "@radix-ui/react-slider";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { useGesture } from "@use-gesture/react";
import { Metronome } from "./types";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const TempoSlider = ({
  tempo,
  setTempo,
}: {
  tempo: number;
  setTempo: Dispatch<SetStateAction<number>>;
}) => {
  const [isInputDragging, setIsInputDragging] = useState(false);

  const pendulum = (() => {
    // if (playing) {
    //   if (metronome > 1) {
    //     return Metronome.RIGHT_TICK;
    //   }
    //   return Metronome.LEFT_TICK;
    // }
    if (Math.floor(tempo / 10) % 2 === 1) {
      return Metronome.RIGHT_TICK;
    }
    return Metronome.LEFT_TICK;
  })();
  const handleSliderChange = (event: number[]) => {
    setTempo(event[0]);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTempo(+event.target.value);
  };

  const handleInputBlur = () => {
    if (tempo > 200) {
      setTempo(200);
    }
    if (tempo < 40) {
      setTempo(40);
    }
  };

  const bind = useGesture({
    onDragStart: () => setIsInputDragging(true),
    onDrag: ({ xy: [x, y], initial: [initialX, initialY], direction }) => {
      setTempo((prev) => {
        if (direction[1] < 0)
          return clamp(
            prev + Math.floor(Math.max((initialY - y) / 50, 1)),
            40,
            200
          );
        return clamp(
          prev + Math.floor(Math.min((initialY - y) / 50, -1)),
          40,
          200
        );
      });
    },
    onDragEnd: () => setIsInputDragging(false),
  });

  return (
    <div className="flex h-16 items-center justify-center grid-rows-1 gap-6">
      <div className="h-16 w-16 flex items-center justify-center">
        <svg height="60%" width="60%" viewBox="0 0 100 100">
          <path
            d="M 25,85 L 75,85 v 0,-20 l -15, -50 l -20,0 l -15,50 z"
            stroke="#f58f4b"
            fill="none"
            strokeWidth="12"
          />
          <path d={pendulum} stroke="#f58f4b" fill="none" strokeWidth="12" />
        </svg>
      </div>
      <div className="flex items-center justify-center h-full w-full">
        <Slider.Root
          min={40}
          max={200}
          step={1}
          value={[clamp(tempo, 40, 200)]}
          onValueChange={handleSliderChange}
          className="h-full w-full relative flex items-center justify-center"
        >
          <Slider.Track className="h-1 w-full bg-gray-500/50 rounded-full">
            <Slider.Range className="absolute flex justify-center h-1 bg-[#f58f4b] rounded-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-3 h-3 bg-white drop-shadow-md rounded-full outline-[#9ad3f9]" />
        </Slider.Root>
      </div>
      <div className="h-16 w-16">
        <input
          type="number"
          className="w-full h-full text-center text-[#f58f4b] font-bold bg-[#f2e6c7] outline-[#9ad3f9]"
          value={tempo}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={isInputDragging}
          {...bind()}
        ></input>
      </div>
    </div>
  );
};
