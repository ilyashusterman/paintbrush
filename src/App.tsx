import React, { useState } from "react";
import "./App.css";
import ColorPicker from "./ColorPicker";

interface Pixel {
  row: number;
  col: number;
  color: string;
}

const PaletteSize = 10;

const PaintbrushApp: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [pixels, setPixels] = useState<Pixel[][]>(initializePixels());
  const [mode, setMode] = useState<string>("brush");

  // Initialize the pixels array with white color
  function initializePixels(): Pixel[][] {
    const pixelsArray: Pixel[][] = [];
    for (let row = 0; row < PaletteSize; row++) {
      const rowArray: Pixel[] = [];
      for (let col = 0; col < PaletteSize; col++) {
        rowArray.push({ row, col, color: "white" });
      }
      pixelsArray.push(rowArray);
    }
    return pixelsArray;
  }

  // Handle pixel click event
  function handlePixelClick(row: number, col: number) {
    if (mode === "brush") {
      const updatedPixels = [...pixels];
      updatedPixels[row][col].color = selectedColor;
      setPixels(updatedPixels);
    } else if (mode === "fill") {
      const updatedPixels = floodFill(
        [...pixels],
        row,
        col,
        pixels[row][col].color,
        selectedColor
      );
      setPixels(updatedPixels);
    }
  }

  // Handle fill click event based on mouse position
  function clear() {
    setPixels(initializePixels());
  }

  // Perform flood-fill on the pixels array
  function floodFill(
    matrix: Pixel[][],
    rowIndex: number,
    colIndex: number,
    targetColor: string,
    fillColor: string
  ): Pixel[][] {
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    if (
      rowIndex < 0 ||
      rowIndex >= numRows ||
      colIndex < 0 ||
      colIndex >= numCols ||
      matrix[rowIndex][colIndex].color !== targetColor
    ) {
      return matrix;
    }

    const stack: [number, number][] = [[rowIndex, colIndex]];
    let minRow = rowIndex;
    let maxRow = rowIndex;
    let minCol = colIndex;
    let maxCol = colIndex;

    while (stack.length > 0) {
      const [row, col] = stack.pop()!;

      if (
        row < 0 ||
        row >= numRows ||
        col < 0 ||
        col >= numCols ||
        matrix[row][col].color !== targetColor
      ) {
        continue;
      }

      matrix[row][col].color = fillColor;

      if (row < minRow) minRow = row;
      if (row > maxRow) maxRow = row;
      if (col < minCol) minCol = col;
      if (col > maxCol) maxCol = col;

      stack.push([row - 1, col]); // Up
      stack.push([row + 1, col]); // Down
      stack.push([row, col - 1]); // Left
      stack.push([row, col + 1]); // Right
    }

    // Optimize: Iterate only within the boundary of the filled region
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        matrix[r][c].color = fillColor;
      }
    }

    return matrix;
  }

  return (
    <div>
      <h1>Paintbrush App</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${PaletteSize}, 30px)`,
        }}
      >
        {pixels.map((row, rowIndex) =>
          row.map((pixel, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: pixel.color,
                border: "1px solid black",
              }}
              onClick={() => handlePixelClick(pixel.row, pixel.col)}
            />
          ))
        )}
      </div>
      <button onClick={() => setMode("brush")}>
        {mode === "brush" ? "Disable Brush" : "Enable Brush"}
      </button>
      <button onClick={() => setMode("fill")}>
        {mode === "fill" ? "Disable Fill" : "Enable Fill"}
      </button>
      <button onClick={() => clear()}>clear</button>
      <ColorPicker
        setSelectedColor={setSelectedColor}
        selectedColor={selectedColor}
      />
      <a href="https://github.com/ilyashusterman/paintbrush">Github</a>
    </div>
  );
};

export default PaintbrushApp;
