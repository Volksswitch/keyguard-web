// How-to video 3.3: typing openings in pixels or millimeters, on the Custom Openings table.
// The sample design measures the screen in millimeters from the upper-left corner.
import { all, click, view, openOpenings, closeOpenings, sleep } from '../helpers.mjs';
import { settled } from '../../lib/sample-project.mjs';

const lastRow = '#og-screen tr:last-child';
const typeRow = (vals) => async (page) => {
  const inputs = page.locator(`${lastRow} input[type=number]`);
  for (const [i, v] of vals.entries()) {
    if (v === null) continue;
    await inputs.nth(i).fill(String(v));
    await inputs.nth(i).press('Enter');
    await sleep(200);
  }
  await settled(page, 1500);
};

export default {
  id: '3.3-typing-openings',
  trouble: [
    "If a number stays tinted, it isn't applied yet. Press Enter, or click another box.",
    "If the opening lands in the wrong place, check which corner the heading says the measurements start from.",
  ],
  steps: [
    { before: all(view('top'), openOpenings('table')), highlight: '#openings-panel',
      page: "The pixels or millimeters tab lists your openings as numbers.",
      say: "The pixels or millimeters tab lists your openings as numbers. Use it to place an opening " +
           "exactly, or to check one you placed by eye." },
    { highlight: '#og-screen-units',
      say: "Screen openings use the same unit as the design. The heading says which corner the " +
           "measurements start from." },
    { before: click('.og-add[data-grid="screen"]'), highlight: lastRow,
      page: "Click + Add opening. A row appears for the new opening.",
      say: "Click plus Add opening. A row appears for the new opening." },
    { before: typeRow([14, 30, 3, 120, 70]), highlight: lastRow,
      page: "Type its height, width and corner radius, and the x and y of its center. Press Enter.",
      say: "Type its height, width and corner radius, then the x and y of its center. Press Enter, " +
           "and the keyguard updates." },
    { highlight: '#viewport',
      say: "Each opening is placed by its center. For a circle, the height is the diameter." },
    { highlight: '.og-add[data-grid="case"]',
      page: "Case openings, beside the screen, are measured in millimeters from the case opening's lower-left corner.",
      say: "Case openings are for openings beside the screen. They're measured in millimeters, from " +
           "the lower-left corner of the case opening." },
    { highlight: '#openings-save',
      say: "Click Save, then Save preset, to keep them. {next}" },
  ],
};
