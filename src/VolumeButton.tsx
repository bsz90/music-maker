import {
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  MutableRefObject,
} from "react";
import * as Slider from "@radix-ui/react-slider";

export const VolumeButton = ({
  volume,
  setVolume,
}: {
  volume: number;
  setVolume: Dispatch<SetStateAction<number>>;
}) => {
  const [volumeButtonIsOpen, setVolumeButtonIsOpen] = useState(false);

  const ref = useRef() as MutableRefObject<HTMLSpanElement>;

  const volumeIcon = () => {
    if (volume > -18) {
      return (
        <>
          <path
            d="M 59, 40 a 30,20 0 0,1 0,20"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            stroke="#f58f4b"
          />
          <path
            d="M 64, 35 a 45,30 0 0,1 0,30"
            fill="none"
            stroke="#f58f4b"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 69, 30 a 60,40 0 0,1 0,40"
            fill="none"
            stroke="#f58f4b"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </>
      );
    } else if (volume > -32) {
      return (
        <>
          <path
            d="M 59, 40 a 30,20 0 0,1 0,20"
            fill="none"
            stroke="#f58f4b"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 64, 35 a 45,30 0 0,1 0,30"
            fill="none"
            stroke="#f58f4b"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </>
      );
    } else if (volume > -46) {
      return (
        <>
          <path
            d="M 59, 40 a 30,20 0 0,1 0,20"
            fill="none"
            stroke="#f58f4b"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </>
      );
    } else if (volume === -60) {
      return (
        <>
          <path
            d="M 65, 58 l 16, -16"
            fill="none"
            stroke="#f58f4b"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 65, 42 l 16, 16"
            fill="none"
            stroke="#f58f4b"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </>
      );
    }
  };

  const toggle = () => {
    volumeButtonIsOpen
      ? setVolumeButtonIsOpen(false)
      : setVolumeButtonIsOpen(true);
  };

  const handleChange = (event: number[]) => {
    setVolume(event[0]);
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div
        className="w-8 h-52 box-border py-5 transition-all origin-bottom absolute bg-gray-100 border-2 rounded-xl border-[#f58f4b]"
        style={{
          transform: `scale(${
            volumeButtonIsOpen ? 1 : 0
          }) translate(0, -150px)`,
        }}
      >
        <Slider.Root
          min={-60}
          max={-10}
          step={1}
          value={[volume]}
          onValueChange={handleChange}
          className="h-full w-full relative flex items-center justify-center"
          orientation="vertical"
        >
          <Slider.Track className="h-full w-1 bg-gray-500/50 rounded-full">
            <Slider.Range className="absolute flex justify-center w-1 bg-[#f58f4b] rounded-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-3 h-3 bg-white drop-shadow-md rounded-full outline-[#9ad3f9]"
            ref={ref}
          />
        </Slider.Root>
      </div>
      <button
        className="w-16 h-16 rounded-full border-2 border-[#f58f4b] hover:drop-shadow-md hover:scale-110 transition-all bg-white outline-[#9ad3f9]"
        onClick={toggle}
      >
        <svg width="100%" height="100%" viewBox="-20 -20 140 140">
          <path
            d="M 20,40 l 0,20 l 10,0 l 20, 15 l 0, -50 l -20, 15 z m 10, 0 l 0, 20 "
            stroke="#f58f4b"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {volumeIcon()}
        </svg>
      </button>
    </div>
  );
};
