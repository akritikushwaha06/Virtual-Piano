// ==========================================
// VIRTUAL PIANO
// ==========================================


// ------------------------------------------
// 1. GET HTML ELEMENTS
// ------------------------------------------

const pianoKeys = document.querySelectorAll(".key");

const volumeSlider = document.getElementById("volume");

const keyboardToggle = document.getElementById("keyboardToggle");


// ------------------------------------------
// 2. AUDIO SETTINGS
// ------------------------------------------

let audioContext = null;

let volume = 0.5;

let keyboardEnabled = true;


// ------------------------------------------
// 3. PIANO NOTE FREQUENCIES
// ------------------------------------------

const frequencies = {

    "C4": 261.63,
    "C#4": 277.18,

    "D4": 293.66,
    "D#4": 311.13,

    "E4": 329.63,

    "F4": 349.23,
    "F#4": 369.99,

    "G4": 392.00,
    "G#4": 415.30,

    "A4": 440.00,
    "A#4": 466.16,

    "B4": 493.88,

    "C5": 523.25,
    "C#5": 554.37,

    "D5": 587.33,
    "D#5": 622.25

};


// ------------------------------------------
// 4. KEYBOARD MAPPING
// ------------------------------------------

const keyboardMap = {

    "a": "C4",
    "w": "C#4",

    "s": "D4",
    "e": "D#4",

    "d": "E4",

    "f": "F4",
    "t": "F#4",

    "g": "G4",
    "y": "G#4",

    "h": "A4",
    "u": "A#4",

    "j": "B4",

    "k": "C5",
    "o": "C#5",

    "l": "D5",
    "p": "D#5"

};


// ------------------------------------------
// 5. CREATE AUDIO CONTEXT
// ------------------------------------------

function createAudioContext() {

    if (!audioContext) {

        audioContext =
            new (window.AudioContext ||
                window.webkitAudioContext)();

    }

    if (audioContext.state === "suspended") {

        audioContext.resume();

    }

}


// ------------------------------------------
// 6. PLAY NOTE
// ------------------------------------------

function playNote(note) {

    createAudioContext();


    const frequency = frequencies[note];


    if (!frequency) {
        return;
    }


    // Create oscillator

    const oscillator =
        audioContext.createOscillator();


    // Create volume control

    const gainNode =
        audioContext.createGain();


    // Piano-like sound

    oscillator.type = "triangle";


    oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
    );


    // Starting volume

    gainNode.gain.setValueAtTime(
        0,
        audioContext.currentTime
    );


    // Quick attack

    gainNode.gain.linearRampToValueAtTime(
        volume,
        audioContext.currentTime + 0.01
    );


    // Natural fade

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 1.5
    );


    // Connect audio

    oscillator.connect(gainNode);

    gainNode.connect(audioContext.destination);


    // Start and stop

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 1.5
    );

}


// ------------------------------------------
// 7. FIND KEY ELEMENT
// ------------------------------------------

function findKey(note) {

    return document.querySelector(
        `.key[data-note="${note}"]`
    );

}


// ------------------------------------------
// 8. ACTIVATE KEY
// ------------------------------------------

function activateKey(note) {

    const key = findKey(note);


    if (!key) {
        return;
    }


    key.classList.add("active");


    setTimeout(() => {

        key.classList.remove("active");

    }, 120);

}


// ------------------------------------------
// 9. PLAY KEY
// ------------------------------------------

function playKey(note) {

    playNote(note);

    activateKey(note);

}


// ------------------------------------------
// 10. MOUSE / TOUCH INPUT
// ------------------------------------------

pianoKeys.forEach(key => {


    key.addEventListener("mousedown", () => {

        const note = key.dataset.note;

        playKey(note);

    });


    key.addEventListener("touchstart", (event) => {

        event.preventDefault();

        const note = key.dataset.note;

        playKey(note);

    });


});


// ------------------------------------------
// 11. COMPUTER KEYBOARD
// ------------------------------------------

document.addEventListener("keydown", (event) => {


    if (!keyboardEnabled) {
        return;
    }


    // Ignore repeated keydown events

    if (event.repeat) {
        return;
    }


    const keyPressed =
        event.key.toLowerCase();


    const note =
        keyboardMap[keyPressed];


    if (!note) {
        return;
    }


    playKey(note);

});


// ------------------------------------------
// 12. VOLUME CONTROL
// ------------------------------------------

volumeSlider.addEventListener("input", () => {

    volume =
        Number(volumeSlider.value);

});


// ------------------------------------------
// 13. KEYBOARD ON/OFF
// ------------------------------------------

keyboardToggle.addEventListener("click", () => {


    keyboardEnabled =
        !keyboardEnabled;


    if (keyboardEnabled) {

        keyboardToggle.textContent =
            "Keyboard: ON";

    } else {

        keyboardToggle.textContent =
            "Keyboard: OFF";

    }

});