import React, {useState} from "react";
import "./ColorBlind.css";
import colorBlind from "color-blind";

function App() {
  const [color, setColor] = useState("#");
  const isValidHex = (value: string) => /^#[0-9A-Fa-f]{0,6}$/.test(value);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isValidHex(value)) {
      setColor(value);
    }
    setColor(e.target.value);
  }
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("Text").trim();
    const raw = pasted.startsWith("#") ? pasted.slice(1) : pasted;
    if (/^[0-9A-Fa-f]{6}$/.test(raw)) {
      e.preventDefault();
      setColor("#" + raw);
    } else {
      e.preventDefault()
    }
  }
  const anomalyModes = [
    {label: "Обычное зрение", value: "none"},
    {label: "Дейтераномалия (мало зеленого)", value: "deuteranomaly"},
    {label: "Протаномалия(мало красного)", value: "protanomaly"},
    {label: "Протанопия (нет красного)", value: "protanopia"},
    {label: "Дейтеранопия (нет зеленого)", value: "deuteranopia"},
    {label: "Тританомалия(мало синего)", value: "tritanomaly"},
  ]

  const getSimulatedColor = (mode) => {
    if (mode === "none") return color;
    try {
      return colorBlind[mode](color);
    } catch {
      return color;
    }
  }



  return (
      <div>
        <h1 className="app-title">Определение цветовых различий</h1>
        <form className="color-form">
          <label className="color-label" htmlFor="colorPicker">HEX код</label>
          <div className="inputs-wrapper">
            <input type="color" value={color} onChange={handleChange}
                   id="colorPicker"
                   className="color-input"/>
            <input type="text" value={color}
                   onChange={handleChange}
                   onPaste={handlePaste}
                   maxLength={7}
                   placeholder="#ffffff"
                   className="text-input"
            />
          </div>
          <div className="color-preview-list">
            {anomalyModes.map(({label, value}) => {
              const simulated = getSimulatedColor(value);
              return (
                  <div key={value} className="color-swatch">
                    <div className="swatch-box"
                         style={{backgroundColor: simulated}}
                    ></div>
                    <div className="swatch-info">
                      <strong>{label}: </strong>
                      <span>{simulated.toUpperCase()}</span>
                    </div>
                  </div>
              )
            })}
          </div>


        </form>
      </div>

  );
}

export default App;