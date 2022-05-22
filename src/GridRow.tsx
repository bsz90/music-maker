import { GridCell } from "./GridCell";

export function GridRow({ grid, rowId }: { grid: number[][]; rowId: number }) {
  return (
    <div>
      {grid[rowId].map((cell, id) => (
        <GridCell key={id} grid={grid} rowId={rowId} columnId={id} />
      ))}
    </div>
  );
}
