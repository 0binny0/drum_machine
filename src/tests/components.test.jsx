
import {Screen, Pad, Pads} from "../components.jsx";
import {mp3_files} from "../sound_files.js";
import {PowerContextRender} from "./test_config.jsx";

import {test, expect, vi} from "vitest";
import {render, screen} from "@testing-library/react";

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
    expect(buttons[0]).toHaveAttribute("style", "background: rgb(100, 0, 255); box-shadow: inset 0px 0px 5px 0px purple;")
});