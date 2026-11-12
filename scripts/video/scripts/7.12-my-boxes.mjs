// How-to video 7.12: the "my" openings and additions boxes. The sample is the VocoChat
// design whose Back, Delete and Clear openings are in my screen openings
// (Documents/video-samples/braille/). The boxes are saved in the design's preset and travel
// with its exported .json; the openings and additions file is shared by every design in the
// folder and is sent separately. Rows in the boxes are added to the file's; the keyguard
// designer's own variables work in them, a clinician's own variables don't (keyguard_v97.scad
// reads them strictly). Custom Openings reads and writes my screen and my case openings.
import { all, view, openSection, row, around, scrollTo, openOpenings, closeOpenings, closeSections } from '../helpers.mjs';

const FILE = [
  'screen_openings=[',
  '// ID, shape, height, width, corner,    x,    y, cut | build, ...',
  '[   0,   "r",      0,     0,      0,    0,    0,           0,    "L",     "T",      0,         0,            [],              [] ],',
  '];',
  '',
  'case_openings=[',
  '// ID, shape, height, width, corner,    x,    y, cut | build, ...',
  '[   0,   "r",      0,     0,      0,    0,    0,           0,    "L",     "T",      0,         0,            [],              [] ],',
  '];',
];

export default {
  id: '7.12-my-boxes',
  project: { dir: 'Documents/video-samples/braille', preset: 'VocoChat', skill: 'advanced' },
  trouble: [
    "If the keyguard stops drawing after you change a box, read the Console: a name it doesn't recognize stops it until you fix it.",
    "Click Save preset to keep a change to a box.",
  ],
  steps: [
    { before: all(openSection('Special Actions and Settings'), scrollTo(row('my_case_openings'))),
      ringBox: around(row('my_screen_openings'), row('my_tablet_openings')),
      page: "The four my boxes take the same rows as the openings and additions file.",
      say: "Special Actions and Settings has four my boxes: my screen openings, my case openings, my case " +
           "additions, and my tablet openings. Each takes the same rows as the matching part of the " +
           "openings and additions file." },
    { highlight: row('my_screen_openings'),
      page: "Rows go in one after another, separated by commas.",
      say: "This design's Back, Delete and Clear openings are in my screen openings: one row each, " +
           "separated by commas." },
    { dialog: { kind: 'text', lines: FILE }, highlight: '#vid-dialog [data-part="text"]',
      page: "The openings and additions file is shared by every design in the folder.",
      say: "So why not the file? The openings and additions file sits in the project folder, and every " +
           "design in that folder shares it. The boxes are saved in the design's own preset, so they " +
           "belong to that one design." },
    { before: closeSections(), highlight: '#export-preset-btn',
      page: "The boxes travel with the design when you export it. The file has to be sent separately.",
      say: "And they travel with it. When you export the design to share it, its boxes go too. The file " +
           "would have to be sent separately." },
    { before: all(view('top'), openOpenings('eye')), highlight: '#openings-panel',
      page: "Custom Openings reads and writes my screen openings and my case openings.",
      say: "Custom Openings reads and writes my screen openings and my case openings. When you save there, " +
           "your shapes go into those boxes." },
    { before: closeOpenings(), highlight: '#save-preset-btn',
      page: "Rows in the boxes are added to the file's. Your own variables only work in the file.",
      say: "Rows in the boxes are added to anything in the file. The keyguard designer's own variables " +
           "work in them, but variables you make yourself only work in the file. Click Save preset to keep " +
           "a change. {next}" },
  ],
};
