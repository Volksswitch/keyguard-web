// How-to video 2.5: pixels or millimeters, and which numbers count (Ken, 30 Oct 2026: "a
// separate, more advanced video" on how the app handles units, and when the unit of measure
// for the screen and its starting corner need filling in). The rules, from keyguard.scad:
//
//   App Layout     any App Layout in px number above 0 -> every bar from the pixels, and
//                  App Layout in mm ignored (px_measurements). No mixing.
//   Grid Info      an opening's size in mm is used unless it is 0; only then its size in px
//                  (cell_w, cell_h), height and width each on its own. The mm sizes start at
//                  25, so a pixel size does nothing until its mm size is set to 0.
//   Keyguard inset mm if it isn't 0, otherwise px (inset_left, inset_bottom).
//   Everything else is millimeters.
//   unit_of_measure_for_screen and starting_corner_for_screen_measurements are read only for
//   openings placed by number: screen openings in Custom Openings (my_screen_openings) and in
//   openings_and_additions.txt. A unit change converts Custom Openings (app.html,
//   ogConvertScreenField); the file's numbers are left as written.
//
// The sample is the pixel version of WordPower 42 (Documents/video-samples/pixels/), so App
// Layout in px and the openings' pixel sizes are filled in, and their mm sizes are 0.
import { all, view, openSection, row, around, closeSections } from '../helpers.mjs';

const section = (name) => `.section[data-section="${name}"]`;

export default {
  id: '2.5-pixels-or-millimeters',
  project: { dir: 'Documents/video-samples/pixels', preset: 'WordPower 42 in pixels' },
  trouble: [
    "If an opening's size in pixels makes no difference, set its size in millimeters to 0.",
    "If the bars ignore your millimeter numbers, set every number in App Layout in px to 0.",
    "If openings from the openings and additions file move after a unit change, give them in the new unit.",
  ],
  steps: [
    { before: all(closeSections(), view('fit')), highlight: '#viewport',
      say: "Some settings can be given in pixels, measured from a screenshot, or in millimeters, measured " +
           "with a ruler. When both are filled in, the app uses one and ignores the other. Here's which." },
    { before: openSection('Tablet'), highlight: row('type_of_tablet'),
      say: "The app turns pixels into millimeters from the size of the tablet's screen. So the tablet " +
           "must be the right one, and the screenshot full size." },
    { before: openSection('App Layout in px'), highlight: section('App Layout in px'),
      page: "If any number in App Layout in px is above 0, every bar uses pixels, and App Layout in mm is ignored.",
      say: "For the app's bars: if any number in App Layout in pixels is more than 0, the app reads every " +
           "bar from the pixel numbers, and ignores App Layout in millimeters completely." },
    { before: openSection('App Layout in mm'), highlight: section('App Layout in mm'),
      say: "So the two can't be mixed, with one bar in pixels and another in millimeters. Fill in one " +
           "section, and leave the other at 0." },
    { before: openSection('Grid Info'), ringBox: around(row('cell_height_in_px'), row('cell_width_in_mm')),
      page: "An opening's size in mm is used unless it's 0. Only then is its size in px used.",
      say: "The size of each opening works the other way round. Its size in millimeters is used, unless " +
           "it's 0. Only then is its size in pixels used. The height and the width are each decided on " +
           "their own." },
    { ringBox: around(row('cell_height_in_mm'), row('cell_width_in_mm')),
      say: "In a new design, the millimeter sizes are 25, not 0. So a size in pixels does nothing until " +
           "you set its size in millimeters to 0, as here." },
    { before: openSection('Keyguard Inset Info'), ringBox: around(row('left_inset_size_in_px'), row('bottom_inset_size_in_mm')),
      say: "Keyguard inset sizes follow the same rule: millimeters, if they're filled in, otherwise pixels." },
    { before: openSection('Tablet Case'), highlight: section('Tablet Case'),
      say: "Every other size, from the case opening to the padding and the ridges, is always in millimeters." },
    { before: openSection('Free-form and Hybrid Keyguard Openings'), highlight: row('unit_of_measure_for_screen'),
      page: "The unit of measure for the screen is only for openings placed by number.",
      say: "None of this depends on the unit of measure for the screen. That setting is only for openings " +
           "you place by number: on the pixels or millimeters tab of Custom Openings, and in the openings " +
           "and additions file." },
    { highlight: row('starting_corner_for_screen_measurements'),
      page: "The starting corner is where those numbers count from.",
      say: "The starting corner says where those numbers count from. Graphics programs, like Paint, count " +
           "from the upper-left corner." },
    { highlight: section('Free-form and Hybrid Keyguard Openings'),
      say: "Set both before you place any openings. If you change the unit later, the openings in Custom " +
           "Openings are converted, so they stay put. Numbers in the openings and additions file aren't: " +
           "they're read in the new unit. {next}" },
  ],
};
