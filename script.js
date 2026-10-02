/* =========================================================
   ASTERIA DIGITAL PIANO
   61 KEYS
   C2 → C7
   ========================================================= */


/* =========================================================
   AUDIO
   ========================================================= */

let audioContext = null;
let masterGain = null;


/* =========================================================
   SETTINGS
   ========================================================= */

let sustain = false;

let octaveShift = 0;

const activeNotes = new Map();

const pressedComputerKeys = new Set();


/* =========================================================
   NOTE DATA
   ========================================================= */

const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
];


const blackNotes = new Set([
    "C#",
    "D#",
    "F#",
    "G#",
    "A#"
]);


/* =========================================================
   COMPUTER KEYBOARD
   ========================================================= */

/*
   The central octave is mapped to the
   computer keyboard.

   White:
   A S D F G H J K L

   Black:
   W E T Y U O P
*/

const keyMap = {

    a: "C4",
    s: "D4",
    d: "E4",
    f: "F4",
    g: "G4",
    h: "A4",
    j: "B4",
    k: "C5",
    l: "D5",

    w: "C#4",
    e: "D#4",
    t: "F#4",
    y: "G#4",
    u: "A#4",
    o: "C#5",
    p: "D#5"
};


/* =========================================================
   AUDIO INITIALIZATION
   ========================================================= */

function initAudio() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        masterGain =
            audioContext.createGain();

        masterGain.gain.value = 0.72;

        masterGain.connect(
            audioContext.destination
        );
    }


    if (
        audioContext.state === "suspended"
    ) {

        audioContext.resume();
    }
}


/* =========================================================
   FREQUENCY
   ========================================================= */

function getFrequency(note, octave) {

    const noteIndex =
        noteNames.indexOf(note);


    const midi =
        (octave + 1) * 12 +
        noteIndex;


    return (
        440 *
        Math.pow(
            2,
            (midi - 69) / 12
        )
    );
}


/* =========================================================
   GENERATE 61 NOTES
   C2 → C7
   ========================================================= */

const allNotes = [];


for (
    let octave = 2;
    octave <= 6;
    octave++
) {

    for (
        const note of noteNames
    ) {

        allNotes.push({

            name: note,

            octave: octave,

            full:
                `${note}${octave}`

        });
    }
}


/* Last C7 */

allNotes.push({

    name: "C",

    octave: 7,

    full: "C7"

});


/* =========================================================
   PIANO CREATION
   ========================================================= */

const piano =
    document.getElementById(
        "piano-keyboard"
    );


function createPiano() {

    if (!piano) {

        return;
    }


    piano.innerHTML = "";


    /* -----------------------------------------
       WHITE KEY LAYER
    ------------------------------------------ */

    const whiteKeys =
        document.createElement(
            "div"
        );


    whiteKeys.className =
        "white-keys";


    piano.appendChild(
        whiteKeys
    );


    let whiteIndex = 0;


    /* -----------------------------------------
       CREATE WHITE KEYS
    ------------------------------------------ */

    allNotes.forEach(
        noteData => {

            if (
                blackNotes.has(
                    noteData.name
                )
            ) {

                return;
            }


            const key =
                document.createElement(
                    "div"
                );


            key.className =
                "white-key";


            key.dataset.note =
                noteData.full;


            key.dataset.name =
                noteData.name;


            key.dataset.octave =
                noteData.octave;


            /* ---------------------------------
               NOTE NAME
            ---------------------------------- */

            const noteLabel =
                document.createElement(
                    "span"
                );


            noteLabel.className =
                "note-name";


            noteLabel.textContent =
                noteData.name;


            key.appendChild(
                noteLabel
            );


            /* ---------------------------------
               COMPUTER KEY
            ---------------------------------- */

            const computerKey =
                Object.keys(
                    keyMap
                ).find(
                    keyName =>
                        keyMap[keyName] ===
                        noteData.full
                );


            if (computerKey) {

                const label =
                    document.createElement(
                        "span"
                    );


                label.className =
                    "computer-label";


                label.textContent =
                    computerKey.toUpperCase();


                key.appendChild(
                    label
                );
            }


            /* ---------------------------------
               OCTAVE MARKER
            ---------------------------------- */

            if (
                noteData.name === "C"
            ) {

                const octave =
                    document.createElement(
                        "span"
                    );


                octave.className =
                    "octave-mark";


                octave.textContent =
                    `C${noteData.octave}`;


                key.appendChild(
                    octave
                );
            }


            whiteKeys.appendChild(
                key
            );


            whiteIndex++;
        }
    );


    /* -----------------------------------------
       CREATE BLACK KEYS
    ------------------------------------------ */

    whiteIndex = 0;


    allNotes.forEach(
        noteData => {

            if (
                !blackNotes.has(
                    noteData.name
                )
            ) {

                whiteIndex++;

                return;
            }


            const key =
                document.createElement(
                    "div"
                );


            key.className =
                "black-key";


            key.dataset.note =
                noteData.full;


            key.dataset.name =
                noteData.name;


            key.dataset.octave =
                noteData.octave;


            /*
               IMPORTANT:

               We don't use a fixed pixel
               position.

               CSS variables control the
               key width on desktop/mobile.
            */

            key.style.left =
                `calc(
                    var(--white-key-width) * ${whiteIndex}
                    -
                    var(--black-key-width) / 2
                )`;


            /* Computer key */

            const computerKey =
                Object.keys(
                    keyMap
                ).find(
                    keyName =>
                        keyMap[keyName] ===
                        noteData.full
                );


            if (computerKey) {

                const label =
                    document.createElement(
                        "span"
                    );


                label.className =
                    "computer-label";


                label.textContent =
                    computerKey.toUpperCase();


                key.appendChild(
                    label
                );
            }


            piano.appendChild(
                key
            );
        }
    );


    attachPointerEvents();
}


/* =========================================================
   GET KEY
   ========================================================= */

function getKeyElement(note) {

    return document.querySelector(
        `[data-note="${note}"]`
    );
}


/* =========================================================
   PRESS VISUAL KEY
   ========================================================= */

function pressVisualKey(note) {

    const key =
        getKeyElement(note);


    if (key) {

        key.classList.add(
            "active"
        );
    }
}


/* =========================================================
   RELEASE VISUAL KEY
   ========================================================= */

function releaseVisualKey(note) {

    const key =
        getKeyElement(note);


    if (key) {

        key.classList.remove(
            "active"
        );
    }
}


/* =========================================================
   UPDATE NOW PLAYING
   ========================================================= */

function updateNowPlaying(
    note,
    frequency
) {

    const nowNote =
        document.getElementById(
            "now-note"
        );


    const nowFrequency =
        document.getElementById(
            "now-frequency"
        );


    if (nowNote) {

        nowNote.textContent =
            note;
    }


    if (nowFrequency) {

        nowFrequency.textContent =
            `${frequency.toFixed(2)} Hz`;
    }
}


/* =========================================================
   PLAY NOTE
   ========================================================= */

function playNote(originalNote) {

    initAudio();


    const key =
        getKeyElement(
            originalNote
        );


    /*
       If this note already has an
       audio voice AND its physical key
       is still down, don't create
       another oscillator.
    */

    if (
        activeNotes.has(
            originalNote
        )
    ) {

        if (
            key &&
            key.classList.contains(
                "active"
            )
        ) {

            return;
        }


        /*
           If sustain kept the previous
           sound alive, stop that old
           voice before retriggering.
        */

        stopNote(
            originalNote
        );
    }


    const match =
        originalNote.match(
            /^([A-G]#?)([0-9])$/
        );


    if (!match) {

        return;
    }


    const noteName =
        match[1];


    const baseOctave =
        Number(
            match[2]
        );


    let octave =
        baseOctave +
        octaveShift;


    octave =
        Math.max(
            1,
            Math.min(
                7,
                octave
            )
        );


    const frequency =
        getFrequency(
            noteName,
            octave
        );


    const isBlack =
        blackNotes.has(
            noteName
        );


    const now =
        audioContext.currentTime;


    /* =====================================================
       MAIN OSCILLATOR
    ===================================================== */

    const oscillator =
        audioContext.createOscillator();


    const gain =
        audioContext.createGain();


    /* =====================================================
       HARMONIC
    ===================================================== */

    const harmonic =
        audioContext.createOscillator();


    const harmonicGain =
        audioContext.createGain();


    /*
       WHITE KEY TIMBRE
    */

    if (!isBlack) {

        oscillator.type =
            "triangle";


        oscillator.frequency.setValueAtTime(
            frequency,
            now
        );


        harmonic.type =
            "sine";


        harmonic.frequency.setValueAtTime(
            frequency * 2,
            now
        );


        gain.gain.setValueAtTime(
            0.0001,
            now
        );


        gain.gain.exponentialRampToValueAtTime(
            0.30,
            now + 0.012
        );


        gain.gain.exponentialRampToValueAtTime(
            0.075,
            now + 0.48
        );


        harmonicGain.gain.setValueAtTime(
            0.0001,
            now
        );


        harmonicGain.gain.exponentialRampToValueAtTime(
            0.05,
            now + 0.02
        );


        harmonicGain.gain.exponentialRampToValueAtTime(
            0.01,
            now + 0.5
        );

    }


    /*
       BLACK KEY TIMBRE

       Slightly brighter and more
       percussive so black keys don't
       feel identical.
    */

    else {

        oscillator.type =
            "triangle";


        oscillator.frequency.setValueAtTime(
            frequency,
            now
        );


        harmonic.type =
            "square";


        harmonic.frequency.setValueAtTime(
            frequency * 2,
            now
        );


        gain.gain.setValueAtTime(
            0.0001,
            now
        );


        gain.gain.exponentialRampToValueAtTime(
            0.28,
            now + 0.008
        );


        gain.gain.exponentialRampToValueAtTime(
            0.055,
            now + 0.32
        );


        harmonicGain.gain.setValueAtTime(
            0.0001,
            now
        );


        harmonicGain.gain.exponentialRampToValueAtTime(
            0.035,
            now + 0.008
        );


        harmonicGain.gain.exponentialRampToValueAtTime(
            0.006,
            now + 0.3
        );
    }


    /* =====================================================
       CONNECT
    ===================================================== */

    oscillator.connect(
        gain
    );


    harmonic.connect(
        harmonicGain
    );


    gain.connect(
        masterGain
    );


    harmonicGain.connect(
        masterGain
    );


    /* =====================================================
       START
    ===================================================== */

    oscillator.start(
        now
    );


    harmonic.start(
        now
    );


    /* =====================================================
       STORE
    ===================================================== */

    activeNotes.set(
        originalNote,
        {

            oscillator,

            harmonic,

            gain,

            harmonicGain,

            released: false

        }
    );


    /* =====================================================
       VISUAL
    ===================================================== */

    pressVisualKey(
        originalNote
    );


    /* =====================================================
       DISPLAY
    ===================================================== */

    updateNowPlaying(
        `${noteName}${octave}`,
        frequency
    );
}


/* =========================================================
   RELEASE NOTE
   ========================================================= */

function releaseNote(note) {

    /*
       VERY IMPORTANT:

       The visual key is ALWAYS released
       immediately.

       Sustain only affects audio.
    */

    releaseVisualKey(
        note
    );


    if (sustain) {

        return;
    }


    stopNote(
        note
    );
}


/* =========================================================
   STOP AUDIO
   ========================================================= */

function stopNote(note) {

    const active =
        activeNotes.get(
            note
        );


    if (!active) {

        return;
    }


    if (active.released) {

        return;
    }


    active.released =
        true;


    const now =
        audioContext.currentTime;


    /* -----------------------------------------
       MAIN RELEASE
    ------------------------------------------ */

    try {

        active.gain.cancelScheduledValues(
            now
        );


        active.gain.setValueAtTime(
            Math.max(
                active.gain.value,
                0.0001
            ),
            now
        );


        active.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.18
        );

    } catch (error) {

        console.warn(
            "Gain release error",
            error
        );
    }


    /* -----------------------------------------
       HARMONIC RELEASE
    ------------------------------------------ */

    try {

        active.harmonicGain.cancelScheduledValues(
            now
        );


        active.harmonicGain.setValueAtTime(
            Math.max(
                active.harmonicGain.value,
                0.0001
            ),
            now
        );


        active.harmonicGain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.16
        );

    } catch (error) {

        console.warn(
            "Harmonic release error",
            error
        );
    }


    /* -----------------------------------------
       STOP OSCILLATORS
    ------------------------------------------ */

    try {

        active.oscillator.stop(
            now + 0.2
        );

    } catch (error) {}


    try {

        active.harmonic.stop(
            now + 0.2
        );

    } catch (error) {}


    /*
       DELETE NOW.

       This is what allows the SAME key
       to immediately play again.
    */

    activeNotes.delete(
        note
    );
}


/* =========================================================
   STOP EVERYTHING
   ========================================================= */

function stopEverything() {

    [
        ...activeNotes.keys()
    ].forEach(
        note => {

            releaseVisualKey(
                note
            );

            stopNote(
                note
            );
        }
    );
}


/* =========================================================
   POINTER EVENTS
   ========================================================= */

function attachPointerEvents() {

    const keys =
        document.querySelectorAll(
            ".white-key, .black-key"
        );


    keys.forEach(
        key => {

            /* -----------------------------------------
               POINTER DOWN
            ------------------------------------------ */

            key.addEventListener(
                "pointerdown",
                event => {

                    event.preventDefault();


                    const note =
                        key.dataset.note;


                    /*
                       Capture the pointer.

                       This prevents stuck keys if
                       the mouse/finger moves outside.
                    */

                    try {

                        key.setPointerCapture(
                            event.pointerId
                        );

                    } catch (error) {}


                    playNote(
                        note
                    );
                }
            );


            /* -----------------------------------------
               POINTER UP
            ------------------------------------------ */

            key.addEventListener(
                "pointerup",
                event => {

                    event.preventDefault();


                    const note =
                        key.dataset.note;


                    releaseNote(
                        note
                    );


                    try {

                        key.releasePointerCapture(
                            event.pointerId
                        );

                    } catch (error) {}
                }
            );


            /* -----------------------------------------
               POINTER CANCEL
            ------------------------------------------ */

            key.addEventListener(
                "pointercancel",
                () => {

                    releaseNote(
                        key.dataset.note
                    );
                }
            );


            /* -----------------------------------------
               POINTER LEAVE

               We DON'T release here.

               Pointer capture handles the
               eventual pointerup.
            ------------------------------------------ */
        }
    );
}


/* =========================================================
   COMPUTER KEYBOARD DOWN
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /* SPACE = SUSTAIN */

        if (
            event.code === "Space"
        ) {

            event.preventDefault();


            if (!sustain) {

                sustain =
                    true;


                const button =
                    document.getElementById(
                        "sustain-button"
                    );


                if (button) {

                    button.classList.add(
                        "active"
                    );
                }
            }


            return;
        }


        const pressed =
            event.key.toLowerCase();


        const note =
            keyMap[pressed];


        if (!note) {

            return;
        }


        /*
           Prevent browser auto-repeat.
        */

        if (
            event.repeat ||
            pressedComputerKeys.has(
                pressed
            )
        ) {

            return;
        }


        event.preventDefault();


        pressedComputerKeys.add(
            pressed
        );


        playNote(
            note
        );
    }
);


/* =========================================================
   COMPUTER KEYBOARD UP
   ========================================================= */

document.addEventListener(
    "keyup",
    event => {

        /* SPACE */

        if (
            event.code === "Space"
        ) {

            event.preventDefault();


            sustain =
                false;


            const button =
                document.getElementById(
                    "sustain-button"
                );


            if (button) {

                button.classList.remove(
                    "active"
                );
            }


            /*
               Release sustained sounds.
            */

            stopEverything();


            return;
        }


        const pressed =
            event.key.toLowerCase();


        const note =
            keyMap[pressed];


        if (!note) {

            return;
        }


        event.preventDefault();


        pressedComputerKeys.delete(
            pressed
        );


        /*
           Always visually release.
        */

        releaseVisualKey(
            note
        );


        if (!sustain) {

            stopNote(
                note
            );
        }
    }
);


/* =========================================================
   SUSTAIN BUTTON
   ========================================================= */

const sustainButton =
    document.getElementById(
        "sustain-button"
    );


if (sustainButton) {

    sustainButton.addEventListener(
        "click",
        () => {

            sustain =
                !sustain;


            sustainButton.classList.toggle(
                "active",
                sustain
            );


            if (!sustain) {

                stopEverything();
            }
        }
    );
}


/* =========================================================
   VOLUME
   ========================================================= */

const volume =
    document.getElementById(
        "volume"
    );


if (volume) {

    volume.addEventListener(
        "input",
        event => {

            initAudio();


            masterGain.gain.value =
                Number(
                    event.target.value
                ) / 100;
        }
    );
}


/* =========================================================
   OCTAVE
   ========================================================= */

const octaveValue =
    document.getElementById(
        "octave-value"
    );


function updateOctaveDisplay() {

    if (!octaveValue) {

        return;
    }


    if (octaveShift > 0) {

        octaveValue.textContent =
            `+${octaveShift}`;

    } else {

        octaveValue.textContent =
            octaveShift;
    }
}


/* Octave down */

const octaveDown =
    document.getElementById(
        "octave-down"
    );


if (octaveDown) {

    octaveDown.addEventListener(
        "click",
        () => {

            if (
                octaveShift > -2
            ) {

                octaveShift--;

                updateOctaveDisplay();
            }
        }
    );
}


/* Octave up */

const octaveUp =
    document.getElementById(
        "octave-up"
    );


if (octaveUp) {

    octaveUp.addEventListener(
        "click",
        () => {

            if (
                octaveShift < 2
            ) {

                octaveShift++;

                updateOctaveDisplay();
            }
        }
    );
}


/* =========================================================
   GUIDE
   ========================================================= */

const guideButton =
    document.getElementById(
        "guide-button"
    );


if (guideButton) {

    guideButton.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "guide-visible"
            );


            guideButton.classList.toggle(
                "active"
            );
        }
    );
}


/* =========================================================
   BEGINNER LESSONS
   ========================================================= */

const lessons = {

    first: {

        notes: [
            "C4",
            "D4",
            "E4",
            "F4",
            "G4",
            "F4",
            "E4",
            "D4",
            "C4"
        ],

        speed: 650
    },


    joy: {

        notes: [
            "E4",
            "E4",
            "F4",
            "G4",
            "G4",
            "F4",
            "E4",
            "D4",
            "C4",
            "C4",
            "D4",
            "E4",
            "E4",
            "D4",
            "D4"
        ],

        speed: 520
    },


    scale: {

        notes: [
            "C4",
            "D4",
            "E4",
            "F4",
            "G4",
            "A4",
            "B4",
            "C5",
            "B4",
            "A4",
            "G4",
            "F4",
            "E4",
            "D4",
            "C4"
        ],

        speed: 420
    }
};


let selectedLesson =
    "first";

let lessonPlaying =
    false;

let lessonIndex =
    0;

let lessonTimer =
    null;


/* =========================================================
   LESSON ELEMENTS
   ========================================================= */

const lessonNote =
    document.getElementById(
        "lesson-note"
    );


const lessonCount =
    document.getElementById(
        "lesson-count"
    );


const lessonProgress =
    document.getElementById(
        "lesson-progress-fill"
    );


const lessonPlay =
    document.getElementById(
        "lesson-play"
    );


/* =========================================================
   UPDATE LESSON
   ========================================================= */

function updateLessonUI() {

    const lesson =
        lessons[selectedLesson];


    if (!lesson) {

        return;
    }


    const current =
        lesson.notes[
            lessonIndex
        ];


    if (lessonNote) {

        lessonNote.textContent =
            current || "C4";
    }


    if (lessonCount) {

        lessonCount.textContent =
            `${lessonIndex} / ${lesson.notes.length}`;
    }


    if (lessonProgress) {

        lessonProgress.style.width =
            `${(
                lessonIndex /
                lesson.notes.length
            ) * 100}%`;
    }
}


/* =========================================================
   SELECT LESSON
   ========================================================= */

document
    .querySelectorAll(
        ".lesson-card"
    )
    .forEach(
        card => {

            card.addEventListener(
                "click",
                () => {

                    stopLesson();


                    selectedLesson =
                        card.dataset.demo ||
                        "first";


                    document
                        .querySelectorAll(
                            ".lesson-card"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );
                            }
                        );


                    card.classList.add(
                        "active"
                    );


                    lessonIndex =
                        0;


                    updateLessonUI();
                }
            );
        }
    );


/* =========================================================
   START LESSON
   ========================================================= */

function startLesson() {

    stopLesson();


    lessonPlaying =
        true;


    lessonIndex =
        0;


    if (lessonPlay) {

        lessonPlay.textContent =
            "■ Stop lesson";
    }


    playLessonNote();
}


/* =========================================================
   LESSON NOTE
   ========================================================= */

function playLessonNote() {

    if (!lessonPlaying) {

        return;
    }


    const lesson =
        lessons[selectedLesson];


    if (
        lessonIndex >=
        lesson.notes.length
    ) {

        finishLesson();

        return;
    }


    const note =
        lesson.notes[
            lessonIndex
        ];


    if (lessonNote) {

        lessonNote.textContent =
            note;
    }


    if (lessonCount) {

        lessonCount.textContent =
            `${lessonIndex + 1} / ${lesson.notes.length}`;
    }


    if (lessonProgress) {

        lessonProgress.style.width =
            `${(
                (lessonIndex + 1) /
                lesson.notes.length
            ) * 100}%`;
    }


    /*
       Play.
    */

    playNote(
        note
    );


    /*
       Release.

       This prevents lesson keys from
       remaining visually pressed.
    */

    lessonTimer =
        setTimeout(
            () => {

                releaseVisualKey(
                    note
                );


                stopNote(
                    note
                );


                lessonIndex++;


                playLessonNote();

            },
            lesson.speed
        );
}


/* =========================================================
   FINISH LESSON
   ========================================================= */

function finishLesson() {

    lessonPlaying =
        false;


    if (lessonTimer) {

        clearTimeout(
            lessonTimer
        );

        lessonTimer =
            null;
    }


    stopEverything();


    if (lessonPlay) {

        lessonPlay.textContent =
            "▶ Start lesson";
    }


    if (lessonNote) {

        lessonNote.textContent =
            "✓";
    }


    const lesson =
        lessons[selectedLesson];


    if (lessonCount) {

        lessonCount.textContent =
            `${lesson.notes.length} / ${lesson.notes.length}`;
    }


    if (lessonProgress) {

        lessonProgress.style.width =
            "100%";
    }
}


/* =========================================================
   STOP LESSON
   ========================================================= */

function stopLesson() {

    lessonPlaying =
        false;


    if (lessonTimer) {

        clearTimeout(
            lessonTimer
        );

        lessonTimer =
            null;
    }


    stopEverything();


    lessonIndex =
        0;


    if (lessonPlay) {

        lessonPlay.textContent =
            "▶ Start lesson";
    }


    if (lessonProgress) {

        lessonProgress.style.width =
            "0%";
    }


    if (lessonCount) {

        lessonCount.textContent =
            "0 / 0";
    }


    if (lessonNote) {

        lessonNote.textContent =
            "C4";
    }
}


/* =========================================================
   LESSON PLAY BUTTON
   ========================================================= */

if (lessonPlay) {

    lessonPlay.addEventListener(
        "click",
        () => {

            if (lessonPlaying) {

                stopLesson();

            } else {

                startLesson();
            }
        }
    );
}


/* =========================================================
   HERO DEMO
   ========================================================= */

const heroDemo =
    document.getElementById(
        "hero-demo"
    );


if (heroDemo) {

    heroDemo.addEventListener(
        "click",
        () => {

            const learn =
                document.getElementById(
                    "learn"
                );


            if (learn) {

                learn.scrollIntoView({
                    behavior: "smooth"
                });
            }


            setTimeout(
                () => {

                    startLesson();

                },
                650
            );
        }
    );
}


/* =========================================================
   WINDOW BLUR SAFETY
   ========================================================= */

window.addEventListener(
    "blur",
    () => {

        pressedComputerKeys.clear();


        sustain =
            false;


        if (sustainButton) {

            sustainButton.classList.remove(
                "active"
            );
        }


        stopEverything();
    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

createPiano();

updateOctaveDisplay();

updateLessonUI();


console.log(
    "Asteria Digital Piano — 61 keys ready."
);