const baseNotes = [
  ["C", 16.351597831287414],
  ["C#", 17.323914436054505],
  ["D", 18.354047994837973],
  ["D#", 19.445436482630058],
  ["E", 20.60172230705437],
  ["F", 21.826764464562743],
  ["F#", 23.12465141947715],
  ["G", 24.49971474885933],
  ["G#", 25.95654359874657],
  ["A", 27.5],
  ["A#", 29.13523509488062],
  ["B", 30.867706328507758],
];

const allNotesByOctave = [0, 1, 2, 3, 4, 5, 6].map((octave) =>
  baseNotes.map(([note, freq]) => [note, freq * Math.pow(2, octave)])
);

const allNotesMap = allNotesByOctave.reduce((acc, octave, index) => {
  return octave.reduce(
    (acc2, [note, freq]) => ({
      ...acc2,
      [`${note}-${index}`]: freq,
    }),
    acc
  );
}, {});

const keyNoteLookup = {
  65: "C3",
  87: "C_3",
  83: "D3",
  69: "D_3",
  68: "E3",
  70: "F3",
  84: "F_3",
  71: "G3",
  89: "G_3",
  72: "A3",
  85: "A_3",
  74: "B3",
  75: "C4",
  79: "C_4",
  76: "D4",
  80: "D_4",
  59: "E4",
};

export { baseNotes, keyNoteLookup, allNotesMap, allNotesByOctave };
