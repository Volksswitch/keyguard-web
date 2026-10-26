// How-to video 3.2: placing openings by eye, in Custom Openings.
// The new opening appears in the middle of the screen, which is the middle of the 3D view
// when it looks straight down; it is 10 mm across.
import { all, click, view, openOpenings, closeOpenings, drag, atView, key } from '../helpers.mjs';

export default {
  id: '3.2-by-eye',
  trouble: [
    "If dragging turns the keyguard instead of moving the opening, start the drag on the opening itself.",
    "If the by eye tab won't place openings in pixels, accept the keyguard designer update when " +
    "it's offered, or set the unit of measure to millimeters.",
  ],
  steps: [
    { before: all(view('top'), openOpenings('eye')), highlight: '#openings-panel',
      page: "Click Custom Openings in the toolbar. The by eye tab lets you draw on the keyguard.",
      say: "Custom Openings adds openings the grid can't make. Click its button in the toolbar. On " +
           "the by eye tab, you draw them right on the keyguard." },
    { before: click('#oge-add-rect'), ringBox: atView(0.5, 0.5, 70, 70),
      page: "Click + Rectangle or + Circle. A new opening, 10 millimeters across, appears in the middle.",
      say: "Click plus Rectangle, or plus Circle. A new opening, 10 millimeters across, appears in the " +
           "middle of the screen." },
    { before: drag([0.5, 0.5], [0.66, 0.36]), ringBox: atView(0.66, 0.36, 70, 70),
      page: "Drag it where you want it. The keyguard is re-cut when you let go.",
      say: "Drag it where you want it. The opening follows the pointer, and the keyguard is re-cut " +
           "when you let go." },
    { ringBox: atView(0.66, 0.36, 70, 70),
      say: "Drag the white handles to make it bigger or smaller, and the yellow dot to round its corners." },
    { before: key('ArrowLeft', 3), ringBox: atView(0.645, 0.36, 70, 70),
      say: "The arrow keys nudge it one millimeter at a time, or ten with Shift held. Control Z " +
           "takes back the last change." },
    { before: all(click('#help-btn'), click('#help-menu [data-help="moves"]')), highlight: '#moves-modal',
      page: "The Help menu's Custom Openings moves card lists every move: Shift-click, Ctrl-drag to copy, and more.",
      say: "More moves, like Shift-click to move several at once, or Control and drag to make a copy, " +
           "are on the moves card in the Help menu." },
    { before: async (page) => { await page.keyboard.press('Escape'); }, highlight: '#openings-save',
      page: "Click Save to put the openings in the design, then Save preset to keep it.",
      say: "Click Save to put the openings in the design. Then click Save preset, to keep them." },
    { before: closeOpenings({ save: true }), highlight: '#save-preset-btn',
      say: "Until you do, the red star beside the design's name says there's a change to save. {next}" },
  ],
};
