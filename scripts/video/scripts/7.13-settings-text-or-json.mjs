// How-to video 7.13: settings as text, or as a .json file. From Ken's website page "Sharing
// Your Customizer Settings": the Console listing shows only settings changed from their
// defaults, and the other person has to type them in; an exported preset is opened or
// imported with "no typing necessary." Video 4.1 shows sharing step by step.
import { all, view, openSection, setParam, row, around, closeSections, clearConsole } from '../helpers.mjs';

export default {
  id: '7.13-settings-text-or-json',
  project: { dir: 'Documents/video-samples/advanced', skill: 'advanced' },
  trouble: [
    "Set generate back to keyguard before you export a keyguard.",
    "Many designs are named after students. Check the name before you share a file outside your team.",
  ],
  steps: [
    { before: all(clearConsole(), openSection('Keyguard Basics'), setParam('generate', 'Customizer settings')),
      highlight: row('generate'),
      page: "Set generate to Customizer settings to list the design's settings.",
      say: "There are two ways to write a design down. The first: set generate to Customizer settings." },
    { before: (page) => page.locator('#console').evaluate((e) => { e.scrollTop = 0; }), highlight: '#console-wrap',
      page: "The Console lists every setting changed from its default.",
      say: "Nothing is made. Instead, the Console lists every setting you've changed from its default, " +
           "section by section." },
    { ringBox: around('#copy-btn', '#save-btn'),
      page: "Copy it, or save it as a text file. Easy to read, but it has to be typed back in.",
      say: "Copy it, or save it as a text file. It's easy to read, to check, or to paste into an email. " +
           "But anyone who wants to use it has to type each setting back in by hand." },
    { before: all(setParam('generate', 'keyguard'), closeSections(), view('fit')), highlight: '#export-preset-btn',
      page: "Or export the design as a .json file: every setting, and the my boxes.",
      say: "The second: export the design as a JSON file, with this button. It holds every setting, " +
           "and the my boxes, in a file the app can open." },
    { highlight: '#import-preset-btn',
      page: "Someone else adds it to their presets with this button. No typing.",
      say: "Someone else adds it to their own presets with this button. No typing." },
    { highlight: '#viewport',
      say: "Use the text when a person needs to read the settings. Use the JSON file when someone " +
           "needs to use the design. Either way, send the openings and additions file and the screenshot " +
           "too, if the design uses them. {next}" },
  ],
};
