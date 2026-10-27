// How-to video 6.1: when the app looks wrong.
import { all, click, view, openSection, setParam, openSettings, closeSettings, closeSections } from '../helpers.mjs';

export default {
  id: '6.1-looks-wrong',
  // The live address, so the report shows the released app and its address, and the
  // default skill level.
  base: 'live',
  project: { skill: null },
  trouble: [
    "If the Console says memory access out of bounds, click Reload the app and open the project again.",
  ],
  steps: [
    // A slip to show: a cell height of 81 for 18. The keyguard designer shrinks the cells to fit
    // and says so, and the openings no longer sit over the app's buttons.
    { before: all(openSection('Grid Info'), setParam('cell_height_in_mm', 81), closeSections(), view('fit')),
      highlight: '#console-wrap',
      page: "If the keyguard looks wrong, read the Console first.",
      say: "If the keyguard looks wrong, read the Console first. It usually names the setting, or the " +
           "line in the openings file, that the keyguard designer couldn't use. Here, a cell height " +
           "typed as 81 instead of 18 was too tall to fit, so it was changed." },
    { before: openSettings('trouble'), highlight: '#ts-problems',
      page: "In Settings, Troubleshooting, Recent problems lists the errors since the app opened.",
      say: "In Settings, Troubleshooting, Recent problems lists the errors since the app was opened, " +
           "and explains the common ones." },
    { highlight: '#about-reload-btn',
      page: "If the app seems stuck, click Reload the app, then open your project again.",
      say: "If the keyguard stops updating, or the app seems stuck, click Reload the app. It starts " +
           "fresh with the newest version. Then open your project again. Your design is safe in its folder." },
    { before: all(closeSettings(), click('#help-btn')), highlight: '#help-menu [data-help="known"]',
      page: "Known issues, in the Help menu, lists problems we already know about.",
      say: "Known issues, in the Help menu, lists the problems we already know about, with what to do." },
    { before: async (page) => { await page.keyboard.press('Escape'); },
      say: "If yours isn't there, tell us about it. {next}" },
  ],
};
