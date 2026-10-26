// How-to video 2.1: which tablet and case do you have? From the website pages "What iPad do
// I have?" and "Easy Measurement Tool". The tablet's back and a ruler on a case can't be
// photographed from here, so the video shows the settings they go into.
import { all, view, openSection, row, skill, closeSections } from '../helpers.mjs';

export default {
  id: '2.1-tablet-and-case',
  project: { preset: 'design default values', skill: 'beginner' },
  trouble: [
    "If your tablet isn't in the list, raise the skill level: higher levels list more tablets and AAC devices.",
    "If you're unsure of the corner radius, choose the larger number.",
  ],
  steps: [
    { before: all(closeSections(), openSection('Tablet'), view('fit')), highlight: row('type_of_tablet'),
      page: "Choose the tablet in the Tablet section.",
      say: "A keyguard is made for one tablet. Choose it in the Tablet section." },
    { highlight: row('type_of_tablet'),
      page: "Not sure which iPad it is? The model number, like A1432, is in the small print on its back.",
      say: "If you're not sure which iPad it is, look at the back. The model number, like A 1 4 3 2, is in " +
           "the small print, and Apple's website says which iPad it is." },
    { before: all(skill('intermediate'), openSection('Tablet')), highlight: row('type_of_tablet'),
      say: "At Beginner, the list holds iPads. Higher skill levels add AAC devices and other tablets, and " +
           "at Advanced, other tablet lets you enter the size of one that isn't listed." },
    { before: openSection('Tablet Case'), highlight: '.section[data-section="Tablet Case"]',
      page: "In Tablet Case, enter the height and width of the case opening, in millimeters.",
      say: "Then the case. Measure the window in the case that the screen shows through: its height and " +
           "width, in millimeters. Enter them in Tablet Case." },
    { highlight: row('height_of_opening_in_case'),
      page: "A ruler is hard to read across a case. The Easy Measurement Tool sits on the glass and spans the opening.",
      say: "A ruler laid across a case is hard to read, because the case stands above the glass. The Easy " +
           "Measurement Tool, on volksswitch.org, sits on the glass and stretches to fit the opening." },
    { highlight: row('case_opening_corner_radius'),
      page: "Measure the corner radius too. When in doubt, the larger number is safer.",
      say: "Measure how round the corners are, too. When you're in doubt, the larger number is safer." },
    { highlight: row('have_a_case'),
      say: "If the tablet has no case, set have a case to no. {next}" },
  ],
};
