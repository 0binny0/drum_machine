
function Screen({pad, sound_bank, volume}) {
    return <section className="display" aria-label="drum_machine_info">
        <p>Pad: {pad}</p>
        <p>Sound Bank: {sound_bank}</p>
        <p>Volume: {volume}</p>
    </section>
}

export {Screen};