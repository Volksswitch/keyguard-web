// How-to video 1.4: your first grid keyguard.
//
// It builds the sample keyguard from the design default values: the TouchChat WordPower 42
// exercise from the Basic workshop, an iPad 9th generation in a case, measured in
// millimeters. Every value typed here is the exercise's own solution.
//
// It doesn't set the unit of measure for the screen (Ken, 30 Oct 2026): that matters only for
// openings typed as numbers, in Custom Openings or the openings and additions file, and the
// bars and the grid use their own sections' units whatever it says. Video 2.5 explains.
import { all, view, openSection, setParam, param, row, click, closeSections } from '../helpers.mjs';

export default {
  id: '1.4-first-grid',
  project: { preset: 'design default values', skill: 'intermediate' },
  answers: ['WordPower 42 page 1'],
  trouble: [
    "If the keyguard doesn't change after you type a number, press Enter or click outside the box.",
    "If a section you need isn't in the list, set the skill level to Intermediate.",
  ],
  steps: [
    { before: all(closeSections(), view('fit')),
      say: "Let's design a keyguard for a page of an AAC app with six rows and seven columns. It's " +
           "on an iPad, 9th generation, in a case." },
    { before: openSection('Tablet'), highlight: '#cust-sections',
      page: "In Tablet, choose the tablet and the way it's held.",
      say: "Click a section's name to open it. In Tablet, choose the tablet, and whether it's held " +
           "upright, in portrait, or sideways, in landscape. This one is already right." },
    { before: all(openSection('Tablet Case'), setParam('height_of_opening_in_case', 163),
        setParam('width_of_opening_in_case', 239)),
      highlight: '.section[data-section="Tablet Case"]',
      page: "In Tablet Case, enter the case opening's height, width and corner radius, in millimeters.",
      say: "In Tablet Case, enter the size of the window in the case: here, 163 by 239 millimeters, " +
           "with corners of 5 millimeters." },
    { before: all(openSection('App Layout in mm'), setParam('status_bar_height', 3),
        setParam('upper_message_bar_height', 6), setParam('upper_command_bar_height', 9)),
      highlight: '.section[data-section="App Layout in mm"]',
      page: "In App Layout, enter the height of each of the app's bars.",
      say: "This app was measured with a ruler, in millimeters, so its bars go in App Layout in " +
           "millimeters. Enter how tall each one is. Here the status bar is 3 millimeters, the message " +
           "bar 6, and the command bar 9." },
    { before: all(openSection('Bar Info'), setParam('expose_upper_message_bar', 'yes')),
      highlight: row('expose_upper_message_bar'),
      page: "In Bar Info, choose which bars get an opening.",
      say: "In Bar Info, give the message bar an opening, so it can be tapped to speak the message." },
    { before: all(openSection('Grid Info'), setParam('number_of_rows', 6), setParam('number_of_columns', 7),
        setParam('cell_height_in_mm', 18), setParam('cell_corner_radius', 2)),
      highlight: '.section[data-section="Grid Info"]',
      page: "In Grid Info, enter the rows and columns, and the size of each opening.",
      say: "In Grid Info, enter six rows and seven columns, and the size of each opening." },
    { before: view('top'), highlight: '#viewport',
      say: "The keyguard now has the app's layout: the bars across the top, and a grid of openings " +
           "below them." },
    { before: click('#add-preset-btn'), highlight: '#preset-input',
      page: "To save it, click the plus beside the preset box, type a name and press Enter.",
      say: "To save it, click the plus beside the preset box, type a name, and press Enter." },
    { say: "Before you print it, check it against a screenshot. {next}" },
  ],
};
