import React, {
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";

// import Modal from '../Modal';
// import PatchGraph from '../PatchGraph';
// import Arpeggiator from '../Arpeggiator';

// import {allNotesMap} from '../../synthesis/notes';

import Keys from "./components/Keys";

// import useKeys from './hooks/useKeys';

// import useComposeSynth from '../../synthesis/useComposeSynth';
// import wind from '../../synthesis/patches/wind.json';
// import bells from '../../synthesis/patches/bells.json';
// import fanfare from '../../synthesis/patches/fanfare.json';
// import fatBass from '../../synthesis/patches/fat-bass.json';
// import simpleFm from '../../synthesis/patches/simple-fm.json';
// import tb303 from '../../synthesis/patches/tb-303.json';
// import tesla from '../../synthesis/patches/tesla.json';
// import violin from '../../synthesis/patches/violin.json';
// import pew from '../../synthesis/patches/pew.json';
// import robot from '../../synthesis/patches/robot.json';
// import smurfShrek from '../../synthesis/patches/smurf-&-shrek.json';
// import space from '../../synthesis/patches/space.json';
// import useSynth from '../../synthesis/useSynth';

import keyStyles from "./components/Keys/styles.module.css";
import styles from "./styles.module.css";

const patches = [
  // ['tb303', tb303],
  // ['violin', violin],
  // ['bells', bells],
  // ['fanfare', fanfare],
  // ['fatBass', fatBass],
  // ['simpleFm', simpleFm],
  // ['tesla', tesla],
  // ['wind', wind],
  // ['pew', pew],
  // ['robot', robot],
  // ['smurfShrek', smurfShrek],
  // ['space', space],
];

// const [firstPatchDef] = patches;
// const intitialPatchName = firstPatchDef[0];

function Keyboard({ isPlaying, connect, analyser, audioContext }) {
  const onNotePressed = useCallback((e) => {}, []);

  const onNoteReleased = useCallback((e) => {}, []);

  // const [patchName, setPatchName] = useState(intitialPatchName);
  // const synth = useComposeSynth(audioContext, analyser);

  // const setIsPlayingCBs = useRef([]);
  // const [volume, setVolume] = useState(1);
  // const [isEditPatchModalOpen, setIsEditPatchModalOpen] = useState(false);
  // const [isArpVisible, setIsArpVisible] = useState(false);

  // const [, patch] = useMemo(
  //   () => patches.find(([name]) => name === patchName),
  //   [patchName],
  // );

  // const handleChangePatch = useCallback(event => {
  //   setPatchName(event.target.value);
  // }, []);

  // const handleChangeVolume = useCallback(e => setVolume(e.target.value), []);
  // const handleOpenEditPatchModal = useCallback(
  //   () => setIsEditPatchModalOpen(true),
  //   [],
  // );
  // const handleCloseEditPatchModal = useCallback(
  //   () => setIsEditPatchModalOpen(false),
  //   [],
  // );

  // const toggleIsArpVisible = useCallback(
  //   () => setIsArpVisible(isArpVisible => !isArpVisible),
  //   [],
  // );

  // const onNotePressed = useCallback(
  //   e => {
  //     if (e.buttons === 1) {
  //       const {note} = e.target.dataset;
  //       const frequency = allNotesMap[note];

  //       synth.playNote(frequency);

  //       e.target.classList.add(keyStyles.KeyPressed);
  //     }
  //   },
  //   [synth],
  // );

  // const onNoteReleased = useCallback(
  //   e => {
  //     const {note} = e.target.dataset;
  //     const frequency = allNotesMap[note];

  //     synth.stopNote(frequency);

  //     e.target.classList.remove(keyStyles.KeyPressed);
  //   },
  //   [synth],
  // );

  // const reconnect = useCallback(
  //   (...args) => {
  //     const [{sequencer}] = args;

  //     if (sequencer) {
  //       setIsPlayingCBs.current.push(sequencer);
  //     }
  //     connect(args);
  //   },
  //   [connect],
  // );

  // useKeys({onNotePressed, onNoteReleased});

  // useEffect(() => {
  //   setIsPlayingCBs.current.forEach(sequencer => {
  //     if (isArpVisible && isPlaying) {
  //       sequencer.start();
  //     } else {
  //       sequencer.stop();
  //     }
  //   });
  // }, [isPlaying, isArpVisible]);

  // useEffect(() => (synth.masterGain.gain.value = volume), [synth, volume]);
  // useEffect(() => synth.setPatch(patch), [patch]);

  return (
    //   <div className={styles.KeyboardContainer}>
    //     <h2>KEYBOARD</h2>

    //     <div className={styles.KeyboardBody}>
    //       <div>
    //         <label htmlFor="patch">Patch</label>
    //         <select id="patch" onChange={handleChangePatch} value={patchName}>
    //           {patches.map(([name]) => (
    //             <option key={name} value={name}>
    //               {name}
    //             </option>
    //           ))}
    //         </select>
    //         <button onClick={handleOpenEditPatchModal}>View</button>
    //         <Modal
    //           isOpen={isEditPatchModalOpen}
    //           onClose={handleCloseEditPatchModal}
    //         >
    //           <PatchGraph patch={patch} />
    //         </Modal>
    //       </div>
    //       <div className={styles.ParameterControls}>
    //         <div className={styles.ParameterControl}>
    //           <label>Volume</label>
    //           <input
    //             type="range"
    //             name="volume"
    //             step="0.1"
    //             min="0"
    //             max="1"
    //             value={volume}
    //             onChange={handleChangeVolume}
    //           />
    //           <div>{volume * 10}/10</div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className={styles.ArpeggiatorContainer}>
    //       <div className={styles.ArpeggiatorHeader}>
    //         <h3>Arpeggiator</h3>
    //         <button onClick={toggleIsArpVisible}>
    //           {isArpVisible ? 'Close' : 'Open'}
    //         </button>
    //       </div>
    //       <div
    //         className={
    //           isArpVisible ? styles.ArpeggiatorVisible : styles.ArpeggiatorHidden
    //         }
    //       >
    //         <Arpeggiator synth={synth} connect={reconnect} />
    //       </div>
    //     </div>
    <Keys onNotePressed={onNotePressed} onNoteReleased={onNoteReleased} />
    // </div>
  );
}

export { Keyboard };
