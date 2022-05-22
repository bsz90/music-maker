import { useEffect, useState } from "react";
import * as Tone from "tone";
import { GridRow } from "./GridRow";

function FullGrid() {
  const [grid, setGrid] = useState(
    Array.from({ length: 15 }, () => Array.from({ length: 8 }, () => 0))
  );

  return (
    <div>
      {grid.map((row, id) => {
        return <GridRow key={id} grid={grid} rowId={id} />;
      })}
    </div>
  );
}

export default function App() {
  return (
    <div className="">
      <FullGrid />
    </div>
  );
}
