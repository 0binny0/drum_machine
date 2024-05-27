
import {Screen, Pad, Pads, ButtonControls} from "../components.jsx";
import {mp3_files} from "../sound_files.js";
import {PowerContextRender} from "./test_config.jsx";

import {test, expect, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import {highlight_drum_pad} from "../helpers.js";

test(`Verify that the drum machine screen displays the current volume,
    name of the sound generated, and the sound bank the sound is stored under`, () => {
        render(<Screen sound={"Open HH"} sound_bank={"A"} volume={30}/>);
        const screen_section = screen.getByRole("region", {"name": "drum_machine_info"});
        const info = screen.getAllByRole("paragraph");
        info.forEach((paragraph) => {
                expect(screen_section).toContainElement(paragraph);
        })
    }
);

test("Verify that a pad contains a button to trigger a sound", () => {
    const {getByRole} = render(
        <Pad id="pad_purple" style={{background: "rgba(100, 0, 255, 40%)", boxShadow: "inset 0px 0px 5px 0px purple"}}/>
    );
    const pad = getByRole("button");
    expect(pad).toBeInTheDocument();
    expect(pad).toHaveClass("pad");
});


test("Verify that pads are styled with a color when the machine is on", () => {
    const providerProps = {value: true};
    const {getAllByRole} = PowerContextRender(<Pads sound_bank="A"/>, providerProps);
    const buttons = getAllByRole("button");
    //Appears to only accept rgb values
    //https://github.com/testing-library/jest-dom/issues/49
    expect(buttons[0]).toHaveAttribute("style", "background: rgb(225, 255, 240); box-shadow: inset 0px 0px 6px 2px darkgrey; opacity: 0.5;")
});

describe("", () => {

    test("Verify that buttons are accessible to control the volume and sounds of a drum machine", () => {
        const mock_setSoundBank = vi.fn();
        const mock_setVolume = vi.fn();
        const {getByRole} = render(
            <ButtonControls changeSoundBank={mock_setSoundBank} changeVolume={mock_setVolume} />
        );
        const volume_up = getByRole("button", {name: "increase_volume"});
        const volume_down = getByRole("button", {name: "decrease_volume"});
        const sound_bank = getByRole("button", {name: "change_sound_bank"});
        [volume_up, volume_down, sound_bank].forEach(button => {
            expect(button).toBeInTheDocument();
        })
    })

})
