import { Dispatch, SetStateAction } from "react";

export const PlayButton = ({
  playing,
  setPlaying,
}: {
  playing: boolean;
  setPlaying: Dispatch<SetStateAction<boolean>>;
}) => {
  const togglePlaying = () => {
    playing ? setPlaying(false) : setPlaying(true);
  };

  const playIcon = (
    <>
      <polygon
        points="25,15 25,85 75,50"
        fill="#f58f4b"
        stroke="#f58f4b"
        strokeLinejoin="round"
        strokeWidth="10"
      ></polygon>
    </>
  );

  const pauseIcon = (
    <>
      <rect
        x="27.5"
        y="17.5"
        width="12.5"
        height="65"
        fill="#f58f4b"
        stroke="#f58f4b"
        strokeLinejoin="round"
        strokeWidth="10"
      ></rect>
      <rect
        x="60"
        y="17.5"
        width="12.5"
        height="65"
        fill="#f58f4b"
        stroke="#f58f4b"
        strokeLinejoin="round"
        strokeWidth="10"
      ></rect>
    </>
  );

  const SVG = () => {
    return playing ? pauseIcon : playIcon;
  };

  return (
    <div className="w-full h-full flex justify-center items-center outline-[#9ad3f9]">
      <button
        className="w-16 h-16 rounded-full border-2 border-[#f58f4b] hover:drop-shadow-md hover:scale-110 transition-all bg-white"
        onClick={togglePlaying}
      >
        <svg className="w-full h-full" viewBox="-50 -50 200 200">
          {SVG()}
        </svg>
      </button>
    </div>
  );
};
