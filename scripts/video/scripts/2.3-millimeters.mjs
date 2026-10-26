// How-to video 2.3: measuring the app in millimeters, with a ruler on the screen. The sample
// design is measured this way: status bar 3 mm, message bar 6, command bar 9.
import { all, view, openSection, row, closeSections } from '../helpers.mjs';

export default {
  id: '2.3-millimeters',
  trouble: [
    "If the openings drift away from the buttons, check that the unit of measure is mm.",
  ],
  steps: [
    { before: all(closeSections(), openSection('App Layout in mm')), highlight: '.section[data-section="App Layout in mm"]',
      page: "Without a screenshot, measure the app on the screen with a ruler, and use App Layout in mm.",
      say: "Without a screenshot, you can measure the app on the tablet's screen with a ruler, in " +
           "millimeters. The numbers go in App Layout in mm." },
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
    { before: openSection('Free-form and Hybrid Keyguard Openings'), highlight: row('unit_of_measure_for_screen'),
      page: "Set the unit of measure for the screen to mm.",
      say: "Set the unit of measure for the screen to millimeters, so the app uses these numbers." },
    { before: all(closeSections(), view('top')), highlight: '#viewport',
      say: "A screenshot measured in pixels is more accurate, and can be shown under the keyguard to " +
           "check it. Use one when you can. {next}" },
  ],
};
