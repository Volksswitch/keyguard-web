// How-to video 3.3: typing openings in pixels or millimeters, on the Custom Openings table.
// The sample design measures the screen in millimeters from the upper-left corner.
// This is where the unit of measure for the screen and its starting corner are explained, as
// a footnote (Ken, 30 Oct 2026): openings typed as numbers are the one place in the app they
// matter, with the openings and additions file. Video 2.5 has the whole story.
import { all, click, view, openOpenings, atView, sleep } from '../helpers.mjs';
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
      page: "Screen openings are in the unit of measure for the screen, from its starting corner. The heading says which.",
      say: "Screen openings are measured in the unit of measure for the screen, pixels or millimeters, " +
           "counted from its starting corner. Both are set in Free-form and Hybrid Keyguard Openings, " +
           "and the heading here says which. Set them before you type. If you change the unit later, " +
           "the openings are converted, so they stay put." },
    { before: click('.og-add[data-grid="screen"]'), highlight: lastRow,
      page: "Click + Add opening. A row appears for the new opening.",
      say: "Click plus Add opening. A row appears for the new opening." },
    { before: typeRow([14, 30, 3, 120, 70]), highlight: lastRow,
      page: "Type its height, width and corner radius, and the x and y of its center. Press Enter.",
      say: "Type its height, width and corner radius, then the x and y of its center. Press Enter, " +
           "and the keyguard updates." },
    // The ring is on the new opening: 120 by 70 millimeters lands there in the top view.
    { before: all(click('#openings-tabs [data-tab="eye"]'), view('top')), ringBox: atView(0.545, 0.455, 100, 60),
      say: "On the by eye tab, you can see it on the keyguard. Each opening is placed by its center. " +
           "For a circle, the height is the diameter." },
    { before: click('#openings-tabs [data-tab="table"]'), highlight: '.og-add[data-grid="case"]',
      page: "Case openings, beside the screen, are measured in millimeters from the case opening's lower-left corner.",
      say: "Case openings are for openings beside the screen. They're measured in millimeters, from " +
           "the lower-left corner of the case opening." },
    { highlight: '#openings-save',
      say: "Click Save, then Save preset, to keep them. {next}" },
  ],
};
