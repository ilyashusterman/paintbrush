import "./ColorPicker.css";

interface ColorPickerProps {
  setSelectedColor: (color: string) => void;
  selectedColor: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  setSelectedColor,
  selectedColor,
}) => {
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setSelectedColor(color);
  };

  return (
    <div className="color-picker-light">
      <input
        type="color"
        value={selectedColor}
        onChange={handleColorChange}
        className="color-picker-input"
      />
      <h3>Color picker</h3>
    </div>
  );
};

export default ColorPicker;
