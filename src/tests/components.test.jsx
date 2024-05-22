
import {Screen} from "../components.jsx";

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