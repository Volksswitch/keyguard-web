// How-to video 1.6: exporting for printing or cutting.
//
// The export buttons open the browser's Save As box, which can't be photographed, so the
// video points at each button and says what it makes.
import { all, view, openSection, row, around, closeSections } from '../helpers.mjs';

export default {
  id: '1.6-exporting',
  trouble: [
    "If your slicer reports problems with the file, export again with STL star.",
    "A keyguard frame, and a keyguard that snaps into one, can't be laser-cut.",
  ],
  steps: [
    { before: all(closeSections(), view('fit')), ringBox: around('#export-stl', '#export-png'),
      say: "When the design is ready, save it as a file for your printer or your laser cutter, " +
           "with these buttons." },
    { highlight: '#export-stl',
      page: "For a 3D printer, click STL. A Save As box opens in your project folder, with the design's name filled in.",
      say: "For a 3D printer, click S T L. A Save As box opens in your project folder, with the " +
           "design's name already filled in." },
    { highlight: '#export-stl-cgal',
      page: "If your slicer reports problems with the file, use STL star. It's slower, and more careful.",
      say: "If your slicer reports problems with the file, use S T L star. It makes the same file " +
           "the slower, more careful way, and can take a few minutes." },
    { before: openSection('Keyguard Basics'), highlight: row('type_of_keyguard'),
      page: "For a laser cutter, set the type of keyguard to Laser-Cut, then click SVG.",
      say: "For a laser cutter, set the type of keyguard to Laser-Cut first. Then click S V G, " +
           "for a flat drawing the cutter can follow." },
    { highlight: '#export-png',
      say: "P N G saves a picture of the view as it looks now, to show a colleague or a family." },
    { before: all(closeSections(), view('fit')), highlight: '#viewport',
      page: "Open the STL file in your slicer, print the keyguard, and try it on the tablet.",
      say: "Open the S T L file in your slicer, and print the keyguard. Most print with their " +
           "back on the build plate. Then try it on the tablet. Most keyguards take a couple of tries." },
    { say: "{next}" },
  ],
};
