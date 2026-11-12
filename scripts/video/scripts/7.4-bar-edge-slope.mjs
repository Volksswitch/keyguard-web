// How-to video 7.4: what bar edge slope affects. It slopes one edge of an open message bar,
// the edge against a covered command bar (keyguard_v97.scad passes it as the bottom-edge
// slope of three bar openings only). Ken's website page "Changing the Slope of a
// Message/Command Bar Edge" also names command-bar edges; Ken chose to teach what the
// keyguard designer does now (11 Nov 2026), and the page is to be corrected (TODO.md).
// The sample has a 3 mm status bar, an open 6 mm message bar and a covered 9 mm command bar.
import { all, view, openSection, setParam, row, closeUp } from '../helpers.mjs';

// A close look at the message bar, tipped so the sloped edge faces the viewer. The screenshot
// is off for this video, so the plastic's shape shows plainly.
const tilted = () => closeUp(0.5, 0.08, 11, -0.2);

export default {
  id: '7.4-bar-edge-slope',
  project: { dir: 'Documents/video-samples/advanced', skill: 'advanced' },
  trouble: [
    "If the slope cuts into the rail above the grid, make it steeper, or check the covered command bar's height.",
  ],
  steps: [
    { before: all(openSection('Special Actions and Settings'), setParam('include_screenshot', 'no'),
        openSection('Bar Info'), setParam('bar_edge_slope', 90), tilted()), highlight: row('bar_edge_slope'),
      page: "Bar edge slope tilts one edge of an open message bar. At 90 it goes straight down.",
      say: "Bar edge slope tilts one edge of an open message bar: the edge beside a covered command bar. " +
           "At 90, that edge goes straight down." },
    { before: all(setParam('bar_edge_slope', 30), tilted()), highlight: '#viewport',
      page: "A smaller angle slopes it, so the message shows more and a finger reaches it more easily.",
      say: "A smaller angle slopes it away from the message, so more of the message shows, and a finger " +
           "reaches it more easily, without making the bar any taller. This design uses 30." },
    { highlight: row('expose_upper_message_bar'),
      page: "It works only on a message bar's edge beside a covered command bar.",
      say: "It only works on the bottom edge of an upper message bar, or the top edge of a lower one, " +
           "and only when the command bar beside it is covered. The status bar, the command bars, and two " +
           "open bars side by side keep straight edges." },
    { before: all(openSection('App Layout in mm'), setParam('upper_command_bar_height', 3), tilted()),
      highlight: '#viewport',
      page: "The slope needs room: the lower the angle, the taller the covered command bar must be.",
      say: "The slope needs room. The lower the angle, the taller the covered command bar must be. On a " +
           "short one, like this, the slope eats into the rail above the grid." },
    { before: all(setParam('upper_command_bar_height', 9), view('fit')), highlight: '#cust-sections',
      say: "Cells and the home button have slopes of their own: cell edge slope, in Grid Special " +
           "Settings, and home button edge slope, in Tablet. {next}" },
  ],
};
