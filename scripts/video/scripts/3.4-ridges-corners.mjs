// How-to video 3.4: ridges and rounded corners.
// Ridges around cells come from Grid Special Settings; a ridge anywhere and a rounded corner
// come from Custom Openings. A corner can only be rounded if it's square, so the case
// opening's corner radius is set to 0 first, which squares the keyguard's outer corners.
import { all, click, view, openSection, setParam, row, openOpenings, closeOpenings, drag,
  atView, onKeyguard, zoom } from '../helpers.mjs';
import { settled } from '../../lib/sample-project.mjs';

const clickCorner = async (page) => {
  const b = await onKeyguard()(page);
  await page.mouse.click(b.x + 5, b.y + 5);
  await settled(page, 1500);
};

export default {
  id: '3.4-ridges-corners',
  trouble: [
    "If nothing is ringed after + Rounded corner, the design has no square corners to round.",
    "If ridge settings aren't in the list, set the skill level to Intermediate.",
  ],
  steps: [
    { before: all(openSection('Grid Special Settings'), setParam('add_a_ridge_around_these_cells', '25'), view('fit'), zoom(5)),
      highlight: row('add_a_ridge_around_these_cells'),
      page: "To put a raised ridge around a cell, list it in add a ridge around these cells.",
      say: "A raised ridge gives a finger something to find by touch. To put one around a cell, list " +
           "the cell's number in add a ridge around these cells." },
    // The ring is on the ridge around cell 25, "eat", where it lands in this zoomed view.
    { ringBox: atView(0.498, 0.488, 100, 60),
      say: "Height of ridge and thickness of ridge set its size, in millimeters." },
    // Dragged along the plain border under the bottom row, where a ridge shows clearly (a
    // clicked one is 10 millimeters long, and was lost on a cell's picture).
    { before: all(view('top'), openOpenings('eye'), click('#oge-add-ridge'), drag([0.25, 0.943], [0.55, 0.943])),
      ringBox: atView(0.40, 0.943, 340, 44),
      page: "In Custom Openings, click + Ridge, then click the keyguard. Drag instead to set its length and direction.",
      say: "To put a ridge anywhere, open Custom Openings, click plus Ridge, then click on the " +
           "keyguard. Drag instead, and you set its length and direction, in steps of 45 degrees." },
    { before: all(closeOpenings(), openSection('Tablet Case'), setParam('case_opening_corner_radius', 0), view('top'),
        openOpenings('eye'), click('#oge-add-arc')),
      highlight: '#oge-add-arc',
      page: "Click + Rounded corner, and every square corner is ringed.",
      say: "A square corner can be rounded off. Click plus Rounded corner, and every square corner " +
           "is ringed." },
    { before: clickCorner, ringBox: async (page) => { const b = await onKeyguard()(page); return { x: b.x - 10, y: b.y - 10, w: 70, h: 70 }; },
      page: "Click a ringed corner to round it by 2 millimeters, or drag from it to choose how much.",
      say: "Click one to round it by 2 millimeters, or drag from it along an edge to choose how much. " +
           "Its yellow dot changes it afterwards." },
    { highlight: '#openings-save',
      say: "Save, then Save preset, to keep them. {next}" },
  ],
};
