// How-to video 3.8: engraved text and braille. Both are Advanced settings. Text goes on the
// keyguard itself; braille goes on cell inserts, small pieces that fit into a cell opening.
import { all, view, openSection, setParam, row, skill, closeSections } from '../helpers.mjs';

export default {
  id: '3.8-text-braille',
  project: { skill: 'advanced' },
  trouble: [
    "If these settings aren't in the list, set the skill level to Advanced.",
    "Separate braille words with a comma and no space.",
  ],
  steps: [
    { before: all(openSection('Engraved/Embossed Text'), setParam('text', 'TALK'), setParam('text_height', 8),
        setParam('slide_vertically', 50), view('fit')),
      highlight: row('text'),
      page: "At the Advanced skill level, type words in text, in Engraved/Embossed Text.",
      say: "At the Advanced skill level, you can put words on the keyguard. In Engraved and Embossed " +
           "Text, type them in text." },
    { highlight: '#viewport',
      page: "Text depth below zero cuts the text in; above zero raises it.",
      say: "A text depth below zero cuts the words in. Above zero, they're raised from the top surface." },
    { highlight: row('text_height'),
      say: "Text height sets their size in millimeters, and the alignment and slide settings place them." },
    { before: all(openSection('Cell Inserts'), setParam('Braille_text', 'yes'), openSection('Keyguard Basics', { only: false }),
        setParam('generate', 'cell insert'), view('fit')),
      highlight: '#viewport',
      page: "Braille goes on cell inserts. Type it in Braille text, then set generate to cell insert.",
      say: "Braille goes on cell inserts: small pieces that fit into a cell opening. Type the words " +
           "in Braille text, then set generate to cell insert." },
    { before: all(closeSections(), openSection('Cell Inserts')), highlight: '.section[data-section="Cell Inserts"]',
      say: "The other settings here place the braille, and set the insert's size and fit. {next}" },
  ],
};
