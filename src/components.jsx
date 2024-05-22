
function Screen({pad, sound_bank, volume}) {
    return <section className="display" aria-label="drum_machine_info">
        <p aria-label="title_of_sound_played">Pad: {pad}</p>
        <p aria-label="selected_sound_bank">Sound Bank: {sound_bank}</p>
        <p aria-label="volume_level">Volume: {volume}</p>
    </section>
}

export {Screen};