// How-to video 7.5: unequal case openings. The number is the measured gap itself, from the
// case opening's left (or bottom) edge to the screen's; 0 means centered (keyguard_v97.scad).
// The sample's centered gaps are 15.6 mm left and 3.6 mm bottom, so a bottom gap of 1 moves
// the openings down about 2.6 mm. From Ken's website page "Unbalanced Case Openings".
import { all, view, openSection, setParam, around, row, closeSections } from '../helpers.mjs';

export default {
  id: '7.5-unequal-case-openings',
  project: { dir: 'Documents/video-samples/advanced', skill: 'advanced' },
  trouble: [
    "These settings have no effect on a keyguard frame.",
    "Leave a side at 0 when the screen is centered that way.",
  ],
  steps: [
    { before: all(closeSections(), view('top')), highlight: '#viewport',
      page: "The keyguard designer assumes the screen sits in the middle of the case opening.",
      say: "The keyguard designer assumes the screen sits in the middle of the case opening. Some cases " +
           "don't hold it there: a stretched or loose case, or one that's made that way." },
    { before: openSection('Tablet Case'), ringBox: around(row('height_of_opening_in_case'), row('width_of_opening_in_case')),
      page: "Measure the gap from the case opening's left edge to the screen, and from its bottom edge.",
      say: "Measure the case opening as usual. Then measure two gaps: from the left edge of the case " +
           "opening to the left edge of the screen, and from the bottom edge of the case opening to the " +
           "bottom edge of the screen." },
    { before: openSection('Special Actions and Settings'),
      ringBox: around(row('unequal_left_side_of_case_opening'), row('unequal_bottom_side_of_case_opening')),
      page: "Type them in unequal left side and unequal bottom side of case opening.",
      say: "In Special Actions and Settings, type those gaps in unequal left side of case opening, and " +
           "unequal bottom side of case opening. Leave a side at zero when the screen is centered that way." },
    { before: all(setParam('unequal_bottom_side_of_case_opening', 1), view('top')), highlight: '#viewport',
      page: "Every opening moves with the screen. The keyguard stays the same size, so it still fits.",
      say: "Here, the gap at the bottom is only 1 millimeter, so the screen sits low in the case, and " +
           "every opening moves down with it. The keyguard stays the same size, so it still fits the case." },
    { ringBox: around(row('unequal_left_side_of_case'), row('unequal_bottom_side_of_case')),
      page: "Unequal left and bottom side of case are different: they only change clip-on strap clips.",
      say: "Unequal left side of case, and unequal bottom side of case, are different settings. They " +
           "describe the case's own outside edges, and only change the clips for clip-on straps. {next}" },
  ],
};
