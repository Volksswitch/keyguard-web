// How-to video 7.11: variables in the openings and additions file. From the file's own
// notes ("CREATING YOUR OWN VARIABLES": a bump on each rail between columns, c1 = gw/nc and
// so on) and Ken's website page "Using Variables in the openings_and_additions.txt File":
// variables "continue to be correct even if you change tablets and app layouts." The file is
// edited in the computer's own text editor, which can't be captured, so a stand-in shows it
// (file-dialog.mjs, kind 'text'), and the video saves it as a clinician would; the app sees
// the change and redraws. The sample measures in millimeters from the upper-left corner, and
// its grid starts at the screen's left edge with no padding, so gw/nc is the first rail.
import { all, view, zoom, closeSections, writeProjectFile } from '../helpers.mjs';

const HEAD = '// ID, shape, height, width, corner,    x,    y, cut | build, anchor, surface, length, thickness, [edge_slopes], [special parms]';
const MINE = ['c1 = gw/nc;', 'c2 = c1*2;', 'c3 = c1*3;', 'c4 = c1*4;', 'c5 = c1*5;', 'c6 = c1*6;', 'mid = (gt+gb)/2;', ''];
const bump = (id, x) => `[  ${id}, "bump", 4, 0, 0, ${x}, mid, 0, "L", "T", 0, 0, [], [] ],`;
const OPENINGS = ['screen_openings=[', HEAD, ...[1, 2, 3, 4, 5, 6].map((n) => bump(n, `c${n}`)), '];', ''];
const REST = [
  'case_openings=[', HEAD,
  '[   0,   "r",      0,     0,      0,    0,    0,           0,    "L",     "T",      0,         0,            [],              [] ],',
  '];', '',
  'case_additions=[', '// ID, shape, height, width, corner,    x,    y, cut | build, [trim]',
  '[   0,   "r",      0,     0,      0,    0,    0,           0,     [] ],',
  '];', '',
  'tablet_openings=[', HEAD,
  '[   0,   "r",      0,     0,      0,    0,    0,           0,    "L",     "T",      0,         0,            [],              [] ],',
  '];', '',
];
const LINES = [...MINE, ...OPENINGS];
const FILE = [...LINES, ...REST].join('\n');

export default {
  id: '7.11-oa-variables',
  project: { dir: 'Documents/video-samples/advanced', skill: 'advanced' },
  trouble: [
    "Each line that makes a variable ends with a semicolon.",
    "If the Console warns that a name was overwritten, the keyguard designer already uses it. Choose another.",
  ],
  steps: [
    { before: all(closeSections(), view('top')), highlight: '#viewport',
      page: "The openings and additions file adds what the Customizer can't make.",
      say: "The openings and additions file adds things the Customizer can't make. Instead of working out " +
           "every position as a number, you can use variables." },
    { dialog: { kind: 'text', lines: LINES, mark: [1] }, highlight: '#vid-dialog [data-part="line-1"]',
      page: "The keyguard designer provides variables, such as gw, the grid's width, and nc, its columns.",
      say: "The keyguard designer provides many, listed in the file's own notes. g w is the grid's width, " +
           "and n c is its number of columns. The middle of the rail between the first two columns is the " +
           "grid's width divided by the number of columns." },
    { dialog: { kind: 'text', lines: LINES, mark: [1, 2, 3, 4, 5, 6, 7] },
      highlight: '#vid-dialog [data-part="text"]',
      page: "Make your own at the top of the file. Each line ends with a semicolon.",
      say: "Make your own at the top of the file, with short names, so the rows stay short. Here, c 1 to " +
           "c 6 are the six rails between columns, and mid is halfway down the grid. Each line ends with a " +
           "semicolon." },
    { dialog: { kind: 'text', lines: LINES, mark: [11, 12, 13, 14, 15, 16] },
      highlight: '#vid-dialog [data-part="text"]',
      page: "Use them in the rows, in place of numbers.",
      say: "Then use them in the rows, in place of numbers. Each of these puts a bump on a rail, to help " +
           "someone who can't see the keyguard find their way across it." },
    { before: all(writeProjectFile('openings_and_additions.txt', FILE), view('top'), zoom(3)), highlight: '#viewport',
      page: "Save the file. The app sees the change and redraws.",
      say: "Save the file. The app sees the change and redraws, with a bump on each rail." },
    { highlight: '#viewport',
      say: "Because the bumps are worked out from the grid, they stay on the rails if you change the number of " +
           "columns, or use the file for the same app on another tablet. Variables are in the unit of " +
           "measure for the screen. {next}" },
  ],
};
