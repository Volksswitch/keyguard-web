// How-to video 2.3: measuring the app in millimeters, with a ruler on the screen. The sample
// design is measured this way: status bar 3 mm, message bar 6, command bar 9.
//
// The section's name is spoken as "App Layout in millimeters": the voice reads "mm" as a word.
// The unit of measure for the screen isn't set here (Ken, 30 Oct 2026): App Layout in mm is
// read in millimeters whatever it says, and that setting matters only for openings typed as
// numbers (video 2.5). What does stop the millimeters being used is a pixel number left in
// App Layout in px, so that is the trouble line.
import { all, view, openSection, row, closeSections } from '../helpers.mjs';

export default {
  id: '2.3-millimeters',
  trouble: [
    "If the bars don't line up, check that every number in App Layout in px is 0. A pixel number there is used instead of the millimeters.",
  ],
  steps: [
    { before: all(closeSections(), openSection('App Layout in mm')), highlight: '.section[data-section="App Layout in mm"]',
      page: "Without a screenshot, measure the app on the screen with a ruler, and use App Layout in mm.",
      say: "Without a screenshot, you can measure the app on the tablet's screen with a ruler, in " +
           "millimeters. The numbers go in App Layout in millimeters." },
    { highlight: row('status_bar_height'),
      page: "Measure how tall each bar is: the status bar, the message bar, the command bar.",
      say: "Measure how tall each bar is, top to bottom: the status bar, the message bar, and the " +
           "command bar. Here they're 3, 6 and 9 millimeters." },
    { highlight: row('lower_message_bar_height'),
      say: "A bar the app doesn't have is 0." },
    { before: openSection('Grid Info'), highlight: '.section[data-section="Grid Info"]',
      page: "In Grid Info, enter the rows and columns, and the height and width of each opening.",
      say: "In Grid Info, enter the rows and columns, and the height and width you want each opening " +
           "to be, in millimeters." },
    { before: all(closeSections(), view('top')), highlight: '#viewport',
      say: "A screenshot measured in pixels is more accurate, and can be shown under the keyguard to " +
           "check it. Use one when you can. {next}" },
  ],
};
