
import {Screen, Pad} from "../components.jsx";

import {test, expect} from "vitest";
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