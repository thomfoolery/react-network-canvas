import { useRef, useEffect } from "react";
import { keyNoteLookup } from "../../../synthesis/notes";

function useKeys({ onNotePressed, onNoteReleased }) {
  const keyMap = useRef({});

  useEffect(() => {
    function handleKeyDown(e) {
      const noteId = keyNoteLookup[e.keyCode];
      const target = document.querySelector(`#${noteId}`);
      if (target && !keyMap.current[noteId]) {
        keyMap.current[noteId] = true;
        onNotePressed({ target, buttons: 1 });
      }
    }

    function handleKeyUp(e) {
      const noteId = keyNoteLookup[e.keyCode];
      const target = document.querySelector(`#${noteId}`);
      if (target) {
        delete keyMap.current[noteId];
        onNoteReleased({ target });
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [onNotePressed, onNoteReleased]);
}

export default useKeys;
