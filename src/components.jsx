
import {mp3_files} from "./sound_files.js";
import {PowerContext} from "./context.jsx";

import {useContext} from "react";


function Screen({pad, sound_bank, volume}) {
    return <section className="display" aria-label="drum_machine_info">
        <p>Pad: {pad}</p>
        <p>Sound Bank: {sound_bank}</p>
        <p>Volume: {volume}</p>
    </section>
}

function Pad({id, src, style}) {
    return <button className="pad" style={style}>
        <audio id={id} src={src}></audio>
    </button>
}

function Pads({sound_bank}) {
    const power_on = useContext(PowerContext);
    const mp3s = sound_bank === "A" ? mp3_files[0]: mp3_files[1];
    const pads = mp3s.map((mp3_file) => {
        return <Pad key={crypto.randomUUID()} id={mp3_file.id} src={mp3_file.src} style={
            {
                background: power_on ? mp3_file.style.background : "rgba(0, 0, 0, 0.1)",
                boxShadow: power_on ? mp3_file.style.boxShadow : "inset 0 0 7px 0 rgba(0, 0, 0, 0.6)"
            }
        } />
    });
    return <div className="pads_wrapper">{pads}</div>
}

export {Screen, Pad, Pads};