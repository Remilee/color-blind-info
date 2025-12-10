import React, {useState} from "react";
import "./ColorBlind.css";
import colorBlind from "color-blind";

function App() {
    const [color, setColor] = useState("#fa2323");
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

    const handleCopy = (e) => {
      e.preventDefault();
      const text = e.currentTarget.querySelector(".info-code__label").innerText;
      navigator.clipboard.writeText(text);
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
                                    <strong className="swatch-info__label">{label} </strong>
                                    <button className="button info-code__copy" onClick={handleCopy} type="button">
                                        <code className="info-code__label">{simulated.toUpperCase()}</code>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5"
                                                stroke="black" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round"/>
                                            <path
                                                d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z"
                                                stroke="black" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round"/>
                                        </svg>
                                    </button>
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