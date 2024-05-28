
import {mp3_files} from "./sound_files.js";
import {PowerContext} from "./context.jsx";

import {useContext, useEffect, useRef, useState} from "react";


function Screen({pad, sound_bank, volume}) {
    const power_on = useContext(PowerContext);
    return <section className={power_on ? "display highlight show_info": "display highlight_off"} aria-label="drum_machine_info">
        <p>Pad: {pad}</p><p>Sound Bank: {sound_bank}</p><p>Volume: {volume}</p>
    </section>
}

function Pad({id, src, style, onMouseDown}) {
    return <button onMouseDown={onMouseDown} id={id} className="pad" style={style}>
        <audio src={src}></audio>
    </button>
}

function Pads({padHit, sound_bank, highlight, activeHighlight}) {

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
            }, 3000);
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
            const pad = pads_ref.current.children[pad_index];
            const audio = new Audio(pad.firstElementChild.src);
            setTimeout(() => {
                padHit(pad.id.slice(4).replaceAll("_", " "));
                audio.play()
            }, 400);
            //Math.random() is used to re-render with a new setTimeout loop
            setNextLoop(Math.random());
        }
    }

    //mp3 files are selected based on what sound bank a user chooses
    // const colors = ["cyan", "snow", "magenta", "lightcyan"];
    const colors = ["magenta", "yellow", "orange"];
    const mp3s = sound_bank === "A" ? mp3_files[0]: mp3_files[1];
    const pads = mp3s.map((mp3_file, i) => {
        return <Pad onMouseDown={handle_stop_loop} key={crypto.randomUUID()} id={mp3_file.id} src={mp3_file.src} style={
            {
                background: power_on ? colors[Math.floor(Math.random() * colors.length)] : "rgba(0, 0, 0, 0.1)",
                boxShadow: power_on ? mp3_file.style.boxShadow : "inset 0 0 7px 0 rgba(0, 0, 0, 0.6)",
                opacity: power_on && highlight !== mp3_file.id ? mp3_file.style.opacity : "1"
            }
        } />
    });
    return <div ref={pads_ref} id="pad_interface" className="pads_wrapper">{pads}</div>
}

function ButtonControls({changeSoundBank, changeVolume, switchPower}) {
    const power_on = useContext(PowerContext);
    return <div id="controls">
        <div className="volume_controls">
            <p className="volume_label">Volume</p>
            <button className="slate button_shadow" type="button" onMouseDown={power_on ? changeVolume : null} aria-label="increase_volume" id="volume_up">
                <svg className="slate" viewBox="0 0 60 30">
                    <line x1="15" y1="25" x2="30" y2="10" stroke="darkgrey"/>
                    <line x1="30" y1="10" x2="45" y2="25" stroke="darkgrey"/>
                </svg>
            </button>
            <button className="slate button_shadow" type="button" onMouseDown={power_on ? changeVolume : null} aria-label="decrease_volume" id="volume_down">
                 <svg className="slate" viewBox="0 0 60 30">
                    <line x1="15" y1="10" x2="30" y2="25" stroke="darkgrey"/>
                    <line x1="30" y1="25" x2="45" y2="10" stroke="darkgrey"/>
                </svg>
            </button>
        </div>
        <button className="ctrl_button button_shadow" onClick={power_on ? changeSoundBank : null} type="button" aria-label='change_sound_bank'>Sound Bank</button>
        <button onClick={switchPower} className="ctrl_button">Power</button>
    </div>
}

function DrumMachine({props}) {
    // const power_on = useContext(PowerContext);
    const [machineStatus, setMachineStatus] = useState(true);
    const [soundBank, setSoundBank] = useState("A");
    const [highlight, setHighlight] = useState("");
    const [padName, setPadName] = useState("");

    function handleSoundBankChange() {
        if (soundBank === "A") {
            setSoundBank("B");
        } else if (soundBank === "B") {
            setSoundBank("A");
        }
    }

    function handleMachineSwitch() {
        if (machineStatus) {
            setMachineStatus(false);
        } else {
            setMachineStatus(true);
        }
    }

    return <>
        <PowerContext.Provider value={machineStatus}>
            <div className={machineStatus ? "drum_machine_wrapper power": "drum_machine_wrapper"}>
                <Screen pad={padName} sound_bank={soundBank}/>
                <Pads padHit={setPadName} sound_bank={soundBank} highlight={highlight} activeHighlight={setHighlight}/>
                <ButtonControls changeSoundBank={handleSoundBankChange} switchPower={handleMachineSwitch}/>
            </div>
        </PowerContext.Provider>
    </>
}

export {Screen, Pad, Pads, ButtonControls, DrumMachine};