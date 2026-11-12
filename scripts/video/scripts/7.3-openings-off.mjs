// How-to video 7.3: when the cell openings are off. From Ken's website: the User Manual's
// rule (drift across the screen = the layout; the whole grid shifted = the case) and the
// "Unbalanced Case Openings" page, "But it still doesn't match the layout of the grid!":
// copy the printed keyguard's miss by moving the screenshot, and the Console says what to
// set the unequal case opening values to.
import { all, view, openSection, setParam, row, closeSections } from '../helpers.mjs';

const ADV = { dir: 'Documents/video-samples/advanced', skill: 'advanced' };

export default {
  id: '7.3-openings-off',
  project: ADV,
  trouble: [
    "A screenshot from a different tablet, or the other orientation, won't line up.",
    "If the tablet slides around in its case, pad the case before you measure.",
  ],
  steps: [
    { before: all(closeSections(), view('top')), highlight: '#viewport',
      page: "How the openings miss their buttons tells you where to look.",
      say: "When the openings miss the app's buttons, how they miss tells you where to look. Check " +
           "against the screenshot first." },
    { before: all(openSection('Grid Special Settings'), setParam('left_padding', 12), view('top')),
      highlight: '#viewport',
      page: "If they drift further off across the screen, check the bars, padding, rows and columns.",
      say: "If the openings drift further off across the screen, the layout is wrong: the bar heights, " +
           "the padding, or the number of rows and columns. Here, too much left padding pushes each " +
           "column a little further off." },
    { before: all(setParam('left_padding', 0), openSection('App Layout in px')),
      highlight: '.section[data-section="App Layout in px"]',
      page: "Fill in only one of App Layout in px and App Layout in mm.",
      say: "Also check that only one of App Layout in px and App Layout in millimeters is filled in. " +
           "Any pixel value there wins over the millimeters." },
    { before: all(closeSections(), view('top')), highlight: '#viewport',
      page: "If they line up here, but the print is off by the same amount everywhere, look at the case.",
      say: "If they line up here, but the printed keyguard is off by the same amount everywhere, the " +
           "screen isn't sitting in the middle of the case opening. Measure the gaps between the screen " +
           "and the case opening again, on all four sides. If the tablet slides around in the case, pad it." },
    { before: all(openSection('Special Actions and Settings'), setParam('move_screenshot_horizontally', 4), view('top')),
      highlight: '#viewport',
      page: "In Special Actions and Settings, move the screenshot until it misses the way the print does.",
      say: "Still off? In Special Actions and Settings, move the screenshot until the openings miss their " +
           "buttons the same way the printed keyguard does." },
    { highlight: '#console-wrap',
      say: "The Console then says what to set unequal left side of case opening to." },
    { before: all(setParam('move_screenshot_horizontally', 0), setParam('unequal_left_side_of_case_opening', 19.6), view('top')),
      highlight: row('unequal_left_side_of_case_opening'),
      page: "Set unequal left side of case opening to what the Console says, and move the screenshot back to 0.",
      say: "Set it, and move the screenshot back to zero. The openings move, but the keyguard stays the " +
           "same size, so it still fits the case. Print it, and test the fit again. {next}" },
  ],
};
