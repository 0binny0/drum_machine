
import {mp3_files} from "./sound_files.js";
import {PowerContext} from "./context.jsx";

import {forwardRef, useContext, useEffect, useRef, useState} from "react";


function Screen({pad, sound_bank, volume}) {
    const power_on = useContext(PowerContext);
    return <section className={power_on ? "display highlight show_info": "display highlight_off"} aria-label="drum_machine_info">
        <p>Pad: {pad}</p><p>Sound Bank: {sound_bank}</p><p>Volume: {volume}</p>
    </section>
}

function Pad({id, src, style, onClick}) {
    return <button onClick={onClick} id={id} className="pad" style={style}>
        <audio src={src}></audio>
    </button>
}

const Pads = forwardRef(
    function Pads(props, ref) {
        const power_on = useContext(PowerContext);
        let loop = useRef(null);
        let counter_ref = useRef(0);

        useEffect(() => {
            // loops through the pads to highlight each pad for 1 second when the drum machine is on
            if (power_on) {
                loop.current = setTimeout(() => {
                    props.activeHighlight(ref.current.children[counter_ref.current].id);
                    ++counter_ref.current;
                    if (counter_ref.current > 8) {
                        counter_ref.current = 0;
                    }
                }, 2250);
            return () => clearTimeout(loop.current);
            }
        }, [power_on, props.highlight]);

        function handleAudio(e) {
            if (power_on) {
                clearTimeout(loop.current);
                let pad_index = [...ref.current.children].findIndex(
                    (pad) => pad.id === e.currentTarget.id
                );
                counter_ref.current = pad_index;
                const pad = ref.current.children[pad_index];
                const audio = new Audio(pad.firstElementChild.src);
                audio.volume = parseFloat(props.volume / 10);
                props.padHit(pad.id.slice(4).replaceAll("_", " "));
                audio.play()
                //Math.random() is used to re-render with a new setTimeout loop
            }
        }

        //mp3 files are selected based on what sound bank a user chooses
        // const colors = ["cyan", "snow", "magenta", "lightcyan"];
        const colors = ["magenta", "yellow", "orange"];
        const mp3s = props.sound_bank === "A" ? mp3_files[0]: mp3_files[1];
        const pads = mp3s.map((mp3_file, i) => {
            return <Pad onClick={handleAudio} key={crypto.randomUUID()} id={mp3_file.id} src={mp3_file.src} style={
                {
                    background: power_on ? colors[Math.floor(Math.random() * colors.length)] : "rgba(0, 0, 0, 0.1)",
                    boxShadow: power_on ? mp3_file.style.boxShadow : "inset 0 0 7px 0 rgba(0, 0, 0, 0.6)",
                    opacity: power_on && props.highlight !== mp3_file.id ? mp3_file.style.opacity : "1"
                }
            } />
        });
        return <div ref={ref} id="pad_interface" className="pads_wrapper">{pads}</div>
    }
);

function ButtonControls({changeSoundBank, changeVolume, switchPower}) {
    const power_on = useContext(PowerContext);
    return <div id="controls">
        <div className="volume_controls">
            <p className="volume_label">Volume</p>
            <button className="slate button_shadow" type="button" onClick={power_on ? changeVolume : null} aria-label="increase_volume" id="volume_up">
                <svg className="slate" viewBox="0 0 60 30">
                    <line x1="15" y1="25" x2="30" y2="10" stroke="darkgrey"/>
                    <line x1="30" y1="10" x2="45" y2="25" stroke="darkgrey"/>
                </svg>
            </button>
            <button className="slate button_shadow" type="button" onClick={power_on ? changeVolume : null} aria-label="decrease_volume" id="volume_down">
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
    const [volume, setVolume] = useState(5);
    const pads_ref = useRef(null);

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

    function handleVolumeChange(e) {
        let volume_level;
        if (e.currentTarget.id === "volume_up") {
            volume_level = volume + 1;
            if (volume_level > 10) {
                volume_level = 10;
            }
        } else {
            volume_level = volume - 1;
            if (volume_level < 0) {
                volume_level = 0;
            }
        }
        setVolume(volume_level);
    }

    return <>
        <PowerContext.Provider value={machineStatus}>
            <div className={machineStatus ? "drum_machine_wrapper power": "drum_machine_wrapper"}>
                <Screen pad={padName} sound_bank={soundBank} volume={volume}/>
                <Pads ref={pads_ref} padHit={setPadName} sound_bank={soundBank} highlight={highlight} activeHighlight={setHighlight} volume={volume}/>
                <ButtonControls changeSoundBank={handleSoundBankChange} changeVolume={handleVolumeChange} switchPower={handleMachineSwitch}/>
            </div>
        </PowerContext.Provider>
    </>
}

export {Screen, Pad, Pads, ButtonControls, DrumMachine};