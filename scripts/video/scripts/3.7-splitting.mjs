// How-to video 3.7: splitting a keyguard in two, for a printer too small for it.
import { all, click, view, openSection, setParam, row, openSettings, closeSettings } from '../helpers.mjs';

const gridSize = (x, y) => async (page) => {
  for (const [i, v] of [[0, x], [1, y]]) {
    const box = page.locator('#settings-panel input').nth(i);
    await box.fill(String(v));
    await box.press('Enter');
    await box.dispatchEvent('change');
  }
};

export default {
  id: '3.7-splitting',
  trouble: [
    "If the halves don't fit together, change tightness of dovetail joint: a larger number fits tighter.",
    "Set show split line back to no before you export.",
  ],
  steps: [
    { before: all(openSettings('grid'), gridSize(180, 180)), highlight: '#settings-panel',
      page: "Set the grid to your printer's build plate, in Settings, Grid.",
      say: "First, check whether the keyguard fits your printer. In Settings, Grid, enter the size " +
           "of your printer's build plate." },
    { before: all(closeSettings(), click('#view-grid'), view('top')), highlight: '#viewport',
      page: "Turn on the grid. If the keyguard is bigger than the grid, split it.",
      say: "Turn on the grid with its button. This keyguard is wider than a 180 millimeter plate, so " +
           "it needs to be split." },
    { before: all(openSection('Split Keyguard Info'), setParam('show_split_line', 'yes'), view('top')),
      highlight: '#viewport',
      page: "In Split Keyguard Info, show the split line, and move it with split line location.",
      say: "In Split Keyguard Info, set show split line to yes. Split line location moves it left or " +
           "right, so it runs between openings." },
    { before: all(setParam('split_line_type', 'dovetails'), view('top')), highlight: row('split_line_type'),
      page: "Choose dovetails, and the two halves lock together.",
      say: "Choose dovetails as the split line type, and the two halves lock together." },
    { before: all(setParam('show_split_line', 'no'), openSection('Keyguard Basics'),
        setParam('generate', 'first half of keyguard'), view('top')),
      highlight: row('generate'),
      page: "Set generate to the first half of keyguard and export, then the second half and export again.",
      say: "To print, set show split line back to no. Then set generate to the first half of keyguard, " +
           "and export it. Then choose the second half, and export again." },
    { before: all(setParam('generate', 'second half of keyguard'), view('top')), highlight: '#viewport',
      say: "Print both halves, and join them. {next}" },
  ],
};
