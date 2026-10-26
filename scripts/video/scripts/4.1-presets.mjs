// How-to video 4.1: saving designs as presets.
import { all, click, view, openSection, setParam, closeSections } from '../helpers.mjs';

export default {
  id: '4.1-presets',
  answers: ['WordPower 42 with 5 rows'],
  trouble: [
    "If the app says the preset file is damaged, it was probably edited in a text editor. Restore " +
    "it from a copy; the app won't write over it, so your designs aren't lost.",
    "Keep a copy of the project folder somewhere safe. Every design lives in it.",
  ],
  steps: [
    { before: all(closeSections(), view('fit')), highlight: '#preset-input',
      page: "Each saved design is a preset. The box shows the one you're working on.",
      say: "Each design you save is called a preset, and they're all kept in one file in the project " +
           "folder. This box shows the one you're working on." },
    { before: click('#preset-dropdown-btn'), highlight: '#preset-list',
      page: "Click the arrow to choose another. Design default values is the starting point for a new one.",
      say: "Click the arrow to choose another. Design default values is the keyguard designer's own " +
           "starting point." },
    { before: all(click('#preset-dropdown-btn'),
        openSection('Grid Info'), setParam('number_of_rows', 5)),
      highlight: '#dirty-marker',
      page: "After a change, a red star means it isn't saved yet.",
      say: "Change something, and a red star appears beside the name. The change isn't saved yet." },
    { highlight: '#save-preset-btn',
      page: "Save preset keeps the change. Reset throws it away.",
      say: "Save preset keeps the change. Reset throws it away, and goes back to the design as it was saved." },
    { before: click('#add-preset-btn'), highlight: '#preset-input',
      page: "The plus saves the settings as a new preset, under a name you type. The minus deletes one.",
      say: "The plus saves the settings as a new preset: type a name and press Enter. The minus " +
           "deletes the preset you're on." },
    { highlight: '#preset-input',
      say: "To rename a preset, change its name in the box and press Enter." },
    { say: "If you close the tab while the red star shows, your browser asks Leave site first, so " +
           "you can stay and save. {next}" },
  ],
};
