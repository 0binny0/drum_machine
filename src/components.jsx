
import {mp3_files} from "./sound_files.js";
import {PowerContext} from "./context.jsx";

import {useContext, useEffect, useRef, useState} from "react";


function Screen({pad, sound_bank, volume}) {
    return <section className="display" aria-label="drum_machine_info">
        <p>Pad: {pad}</p>
        <p>Sound Bank: {sound_bank}</p>
        <p>Volume: {volume}</p>
    </section>
}

function Pad({id, src, style, onMouseDown}) {
    return <button onMouseDown={onMouseDown} id={id} className="pad" style={style}>
        <audio src={src}></audio>
    </button>
}

function Pads({sound_bank, highlight, activeHighlight}) {

    const power_on = useContext(PowerContext);
    let loop = useRef(null);
    let pads_ref = useRef(null);
    let counter_ref = useRef(0);
    //nextLoop is trigger a new loop upon a user mouse event
    let [nextLoop, setNextLoop] = useState(0);

    useEffect(() => {
        // loops through the pads to highlight each pad for 1 second when the drum machine is on
        if (power_on) {
            loop.current = setTimeout(() => {
                activeHighlight(pads_ref.current.children[counter_ref.current].id);
                ++counter_ref.current;
                if (counter_ref.current > 8) {
                    counter_ref.current = 0;
                }
            }, 400);
            return () => clearTimeout(loop.current);
        }
    }, [power_on, highlight, nextLoop]);

    function handle_stop_loop(e) {
        if (power_on) {
            clearTimeout(loop.current);
            let pad_index = [...pads_ref.current.children].findIndex(
                (pad) => pad.id === e.currentTarget.id
            );
            counter_ref.current = pad_index;
            const audio_clip = pads_ref.current.children[pad_index].firstElementChild;
            const audio = new Audio(audio_clip.src);
            setTimeout(() => audio.play(), 400);
            //Math.random() is used to re-render with a new setTimeout loop
            setNextLoop(Math.random());
        }
    }

    //mp3 files are selected based on what sound bank a user chooses
    const mp3s = sound_bank === "A" ? mp3_files[0]: mp3_files[1];
    const pads = mp3s.map((mp3_file, i) => {
        return <Pad onMouseDown={handle_stop_loop} key={crypto.randomUUID()} id={mp3_file.id} src={mp3_file.src} style={
            {
                background: power_on ? mp3_file.style.background : "rgba(0, 0, 0, 0.1)",
                boxShadow: power_on ? mp3_file.style.boxShadow : "inset 0 0 7px 0 rgba(0, 0, 0, 0.6)",
                opacity: power_on && highlight !== mp3_file.id ? mp3_file.style.opacity : "0.9"
            }
        } />
    });
    return <div ref={pads_ref} id="pad_interface" className="pads_wrapper">{pads}</div>
}

export {Screen, Pad, Pads};