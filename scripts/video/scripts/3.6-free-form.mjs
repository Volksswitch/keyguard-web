// How-to video 3.6: free-form and hybrid apps. The sample is the VocoChat page from Basic
// workshop exercise 5 (Documents/video-samples/hybrid/): a grid, plus Back, Delete and Clear
// down the right side, outside it. The grid settings are the exercise's own, in pixels; the
// three buttons were measured from the screenshot (2160 by 1620 pixels), centers and sizes.
import { all, click, view, openSection, row, openOpenings, closeSections, sleep } from '../helpers.mjs';
import { settled } from '../../lib/sample-project.mjs';

const BUTTONS = [            // height, width, corner radius, center x, center y, in pixels
  [344, 270, 30, 1991, 672],   // Back
  [344, 270, 30, 1991, 1045],  // Delete
  [344, 270, 30, 1991, 1417],  // Clear
];
const addRow = (vals) => async (page) => {
  await page.click('.og-add[data-grid="screen"]');
  await sleep(300);
  const inputs = page.locator('#og-screen tr:last-child input[type=number]');
  for (const [i, v] of vals.entries()) {
    await inputs.nth(i).fill(String(v));
    await inputs.nth(i).press('Enter');
    await sleep(150);
  }
  await settled(page, 1500);
};

export default {
  id: '3.6-free-form',
  project: { dir: 'Documents/video-samples/hybrid', preset: 'VocoChat' },
  trouble: [
    "If the openings land in the wrong place, check the unit of measure and the starting corner in Free-form and Hybrid Keyguard Openings.",
  ],
  steps: [
    { before: all(closeSections(), view('top')), highlight: '#viewport',
      page: "Some apps aren't a simple grid. A hybrid app has a grid, and buttons outside it.",
      say: "Some AAC apps aren't a simple grid. A free-form app's buttons can sit anywhere. A hybrid " +
           "app, like this one, has a grid, and buttons outside it." },
    { before: openSection('Grid Special Settings'), highlight: row('right_padding'),
      page: "Set up the grid as usual. Padding keeps it clear of the buttons outside it.",
      say: "Set up the grid part as usual. Here, right padding keeps the grid clear of the buttons down " +
           "the right side, which need openings of their own." },
    { before: all(closeSections(), view('top'), openOpenings('table'), addRow(BUTTONS[0])),
      highlight: '#og-screen tr:last-child',
      page: "Measure each button in the screenshot, in pixels, and type it in Custom Openings.",
      say: "Measure each of those buttons in the screenshot, in pixels: its height, its width, and where " +
           "its center is. Type them in Custom Openings, one row each." },
    { before: all(addRow(BUTTONS[1]), addRow(BUTTONS[2])), highlight: '#og-screen',
      say: "Add the rest the same way." },
    { before: all(click('#openings-tabs [data-tab="eye"]'), view('top')), highlight: '#viewport',
      page: "Check them on the by eye tab, and move any that are off. For a free-form app, that's most of the design.",
      say: "On the by eye tab, check each one over the screenshot, and drag any that are off. For a " +
           "free-form app, placing openings like this is most of the design." },
    { highlight: '#openings-save',
      say: "Save, then Save preset, to keep them. {next}" },
  ],
};
