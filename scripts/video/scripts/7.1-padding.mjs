// How-to video 7.1: setting the padding by hiding the grid. The sample is the VocoChat page
// (Documents/video-samples/hybrid/), whose Back, Delete and Clear buttons down the right side
// are outside the grid, so the grid needs 31 mm of right padding. From Ken's website pages
// "Balanced and Unbalanced Grid Layouts" (To Pad or Not to Pad) and the hub's Grid Special
// Options: a balanced app has half as much space outside the grid as between its cells.
import { all, view, openSection, setParam, row, around, closeSections } from '../helpers.mjs';

export default {
  id: '7.1-padding',
  project: { dir: 'Documents/video-samples/hybrid', preset: 'VocoChat', skill: 'advanced' },
  trouble: [
    "If hide grid region isn't in the list, set the skill level to Advanced.",
    "Set hide grid region back to no before you export.",
  ],
  steps: [
    { before: all(closeSections(), view('top')), highlight: '#viewport',
      page: "A balanced app has half as much space outside its buttons as between them. Padding fixes one that isn't.",
      say: "The grid's rails should fall on the gaps between the app's buttons. That works when the app " +
           "is balanced: half as much space outside its outer buttons as between them. When an app is " +
           "out of balance, padding brings the grid back in line." },
    { before: all(openSection('Grid Special Settings'), setParam('hide_grid_region', 'yes'), view('top')),
      highlight: '#viewport',
      page: "In Grid Special Settings, set hide grid region to yes. The hole is the area the cells share.",
      say: "In Grid Special Settings, set hide grid region to yes, with the screenshot showing. The hole " +
           "it leaves is the area the cells are spread across." },
    { before: all(setParam('right_padding', 0), view('top')), highlight: '#viewport',
      say: "This app has a column of buttons down the right side that aren't part of the grid. With no " +
           "right padding, the hole runs right over them." },
    { before: all(setParam('right_padding', 31), view('top')), highlight: row('right_padding'),
      page: "Raise the padding until each edge of the hole sits half a gap outside the outer buttons.",
      say: "Right padding pulls the grid's right edge in. Raise it until the edge of the hole sits half a " +
           "gap past the grid's last column of buttons. Padding is always in millimeters." },
    { ringBox: around(row('top_padding'), row('right_padding')),
      say: "Do the same on each side that needs it. Padding moves only the grid. The bars and the " +
           "keyguard's outline stay where they are." },
    { before: all(setParam('hide_grid_region', 'no'), view('top')), highlight: '#viewport',
      page: "Set hide grid region back to no, and check each opening over its button.",
      say: "Then set hide grid region back to no. Each opening now sits over its button. The buttons " +
           "outside the grid get openings of their own, in Custom Openings. {next}" },
  ],
};
