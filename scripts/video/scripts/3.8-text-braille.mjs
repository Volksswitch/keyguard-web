// How-to video 3.8: engraved text and braille. Both are Advanced settings. Text goes on the
// keyguard itself; braille goes on cell inserts, small pieces that fit into a cell opening.
import { all, view, openSection, setParam, row, closeSections, onKeyguard, clearConsole } from '../helpers.mjs';

// The words go on the solid border below the grid: in the case region, at the bottom.
const onBorder = onKeyguard([0.33, 0.86, 0.34, 0.14]);

// The VocoChat sample with its Back, Delete and Clear openings in place
// (Documents/video-samples/braille/), not WordPower 42: its cells are tall enough for braille
// above a finger opening. WordPower's 18 millimeter cells aren't, and the dots stood off the
// insert's edge. Even here the braille is brought 2 millimeters from the opening, not 5, to fit.
export default {
  id: '3.8-text-braille',
  project: { dir: 'Documents/video-samples/braille', preset: 'VocoChat', skill: 'advanced' },
  trouble: [
    "If these settings aren't in the list, set the skill level to Advanced.",
    "Separate braille words with a comma and no space.",
    "If the braille stands off the edge of the insert, the cells are too small for it: make the " +
    "opening smaller, move the braille closer to it, or put the braille beside it.",
  ],
  steps: [
    { before: all(openSection('Special Actions and Settings'), setParam('include_screenshot', 'no'),
        openSection('Engraved/Embossed Text'), setParam('text', 'TALK'), setParam('text_height', 5),
        setParam('keyguard_region', 'case region'), setParam('text_vertical_alignment', 'bottom'),
        setParam('slide_horizontally', 50), setParam('slide_vertically', 1), view('top'), clearConsole()),
      highlight: row('text'),
      page: "At the Advanced skill level, type words in text, in Engraved/Embossed Text.",
      say: "At the Advanced skill level, you can put words on the keyguard. In Engraved and Embossed " +
           "Text, type them in text." },
    { ringBox: onBorder,
      page: "Text depth below zero cuts the text in; above zero raises it.",
      say: "A text depth below zero cuts the words in. Above zero, they're raised from the top surface." },
    { highlight: row('text_height'),
      say: "Text height sets their size in millimeters. Keyguard region, the alignment and the slide " +
           "settings place them: here, on the border below the grid." },
    { before: all(openSection('Cell Inserts'), setParam('Braille_text', 'yes'), setParam('Braille_to_opening_distance', 2), openSection('Keyguard Basics', { only: false }),
        setParam('generate', 'cell insert'), view('fit'), clearConsole()),
      highlight: '#viewport',
      page: "Braille goes on cell inserts. Type it in Braille text, then set generate to cell insert.",
      say: "Braille goes on cell inserts: small pieces that fit into a cell opening. Type the words " +
           "in Braille text, then set generate to cell insert." },
    { before: all(closeSections(), openSection('Cell Inserts')), highlight: '.section[data-section="Cell Inserts"]',
      say: "The other settings here place the braille, and set the insert's size and fit. {next}" },
  ],
};
