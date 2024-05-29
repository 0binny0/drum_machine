
import {Screen, Pad, Pads, ButtonControls, DrumMachine} from "../components.jsx";
import {PowerContextRender} from "./test_config.jsx";

import {test, expect, vi, beforeEach, afterEach, describe} from "vitest";
import {fireEvent} from "@testing-library/dom";
import {render, screen} from "@testing-library/react";
import {userEvent} from "@testing-library/user-event";

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


test("Verify that pads are styled when the machine is on", () => {
    const providerProps = {value: true};
    const {getAllByRole} = PowerContextRender(<Pads sound_bank="A"/>, providerProps);
    const buttons = getAllByRole("button");
    //Appears to only accept rgb values
    //https://github.com/testing-library/jest-dom/issues/49
    expect(buttons[0]).toHaveAttribute("style");
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
    });

    test("Verify that a callback is invoked when clicking the sound bank button", async () => {
        const mock_setSoundBank = vi.fn();
        const mock_setVolume = vi.fn();
        const user = userEvent.setup();
        const {getByRole} = PowerContextRender(
            <ButtonControls changeSoundBank={mock_setSoundBank} changeVolume={mock_setVolume} />, {value: true}
        );
        await user.click(getByRole("button", {name: "change_sound_bank"}));
        expect(mock_setSoundBank).toHaveBeenCalled();
    });

    test("Verify that the volume will be increased by 1 when clicking the increase volume button", async () => {
        const user = userEvent.setup();
        const {getByRole, getAllByRole} = render(<DrumMachine />);
        await user.click(getByRole("button", {name: "increase_volume"}));
        const volume_level = getAllByRole("paragraph")[2];
        expect(volume_level).toHaveTextContent("Volume: 6");
    });



})
