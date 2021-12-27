import React from "react";

import { allNotesByOctave } from "./notes";

import styles from "./styles.module.css";

const octaves = allNotesByOctave.slice(2, 5);

function Keys({ onNotePressed, onNoteReleased }) {
  return (
    <div className={styles.Keys}>
      {octaves.map((notes, octave) => (
        <div key={octave} className={styles.KeysOctave}>
          {/* <div className={styles.KeysOctaveLabel}>Octave {octave}</div> */}
          <div className={styles.KeysOctaveNotes}>
            {notes.map(([key, frequency]) => (
              <button
                id={`${key}${octave}`.replace("#", "_")}
                key={`${key}-${octave}`}
                data-note={`${key}-${octave}`}
                data-frequency={frequency}
                onMouseDown={onNotePressed}
                onMouseEnter={onNotePressed}
                onMouseLeave={onNoteReleased}
                onMouseUp={onNoteReleased}
                className={
                  key.includes("#") ? styles.BlackKey : styles.WhiteKey
                }
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Keys;
