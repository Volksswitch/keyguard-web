// How-to video 2.2: the app layout from a screenshot, in pixels. From the website page "Using
// App Screenshots to Determine the App Layout". The positions were read from the sample's
// screenshot (2160 by 1620 pixels): the status bar ends 33 pixels down, the message bar 98,
// and the command bar 186; a button is 187 pixels high and 260 wide. The pixel version of
// the design is in Documents/video-samples/pixels/, and the last steps check it against the
// screenshot.
//
// The unit of measure for the screen isn't mentioned (Ken, 30 Oct 2026): App Layout in px is
// read in pixels whatever it says. It matters only for openings typed as numbers (video 2.5).
// The openings' sizes in millimeters are 0 in the sample, or they'd be used instead of the
// pixel sizes, which is said here because a clinician following along needs it.
import { all, view, openSection, row, around, closeSections } from '../helpers.mjs';

const SHOT = 'Documents/manual-sample/WordPower 42 screenshot.png';
// The top of the same screenshot, 1400 by 420 pixels, so the three lines sit far enough
// apart to label (Documents/video-pictures/wordpower-top.png).
const STRIP = 'Documents/video-pictures/wordpower-top.png';
const lines = [
  { line: [0, 33, 1400, 33], label: 'bottom of status bar: 33', at: [820, 27] },
  { line: [0, 98, 1400, 98], label: 'bottom of upper message bar: 98', at: [820, 90] },
  { line: [0, 186, 1400, 186], label: 'bottom of upper command bar: 186', at: [820, 178] },
];

export default {
  id: '2.2-layout-from-screenshot',
  project: { dir: 'Documents/video-samples/pixels', preset: 'WordPower 42 in pixels' },
  trouble: [
    "If the openings don't line up, check that the screenshot wasn't made smaller on its way to your computer: an iPad 9th generation's is 2160 by 1620.",
    "If the app has no lower bars, set their tops to the screenshot's full height.",
  ],
  steps: [
    { image: SHOT,
      page: "Take a screenshot of the AAC app on the tablet, held the way the student holds it.",
      say: "A screenshot gives you the app's layout more accurately than a ruler. Open the app on the " +
           "tablet, hold it the way the student does, and take a screenshot." },
    { image: SHOT,
      say: "Send it to your computer, and check it's still full size. An iPad 9th generation's " +
           "screenshot is 2160 pixels wide and 1620 high." },
    { image: STRIP, marks: lines,
      page: "In a graphics program such as Paint, read how many pixels down each bar ends.",
      say: "Open it in a graphics program, such as Paint, that shows where the pointer is, in pixels. " +
           "Point at the bottom of each bar, and note how far down it is." },
    { image: STRIP, marks: lines,
      say: "Here, the status bar ends 33 pixels down, the message bar 98, and the command bar 186." },
    { before: all(closeSections(), openSection('App Layout in px')), highlight: '.section[data-section="App Layout in px"]',
      page: "Enter the numbers in App Layout in px. With no lower bars, their tops are the full height.",
      say: "Enter those numbers in App Layout in pixels. This app has no bars at the bottom, so their " +
           "tops are the screenshot's full height, 1620." },
    { before: openSection('Grid Info'), ringBox: around(row('cell_height_in_px'), row('cell_width_in_mm')),
      page: "Grid Info takes each opening's size in pixels too. Set its sizes in mm to 0, or they're used instead.",
      say: "In Grid Info, you can give each opening's height and width in pixels too, measured from a " +
           "button in the screenshot. Set the sizes in millimeters to 0. Otherwise they're used instead." },
    { before: all(closeSections(), view('top')), highlight: '#viewport',
      page: "With the screenshot under the keyguard, check that the bars line up.",
      say: "Put the screenshot in the project folder and show it under the keyguard. The openings line " +
           "up with the bars. {next}" },
  ],
};
