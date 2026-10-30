// How-to video 1.6: exporting for printing or cutting.
//
// The export buttons open the computer's Save As box, shown as the generic stand-in
// (file-dialog.mjs) with the name the app suggests: the design's name, then what it makes.
// The laser-cut step sets the type of keyguard the way a clinician would, so the picture
// shows the setting changed and the flat keyguard; the printing step sets it back.
import { all, view, openSection, setParam, row, around, closeSections, inDialog } from '../helpers.mjs';

const STL_BOX = { kind: 'save', name: 'WordPower 42 - keyguard.stl', type: 'STL file (*.stl)', faded: true };
const SVG_BOX = { kind: 'save', name: 'WordPower 42 - keyguard.svg', type: 'SVG file (*.svg)', faded: true };

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
      say: "For a 3D printer, click S T L." },
    { dialog: STL_BOX, highlight: inDialog('name'),
      page: "For a 3D printer, click STL. A Save As box opens in your project folder, with the design's name filled in.",
      say: "Your computer's Save As box opens, in your project folder, with the design's name already " +
           "filled in. It looks a little different on every computer. Click Save." },
    { highlight: '#export-stl-cgal',
      page: "If your slicer reports problems with the file, use STL star. It's slower, and more careful.",
      say: "If your slicer reports problems with the file, use S T L star. It makes the same file " +
           "the slower, more careful way, and can take a few minutes." },
    { before: all(openSection('Keyguard Basics'), setParam('type_of_keyguard', 'Laser-Cut')),
      highlight: row('type_of_keyguard'),
      page: "For a laser cutter, set the type of keyguard to Laser-Cut. The 3D view shows it as it will be cut.",
      say: "For a laser cutter, set the type of keyguard to Laser-Cut, so you see the keyguard as it " +
           "will be cut: flat, and as thick as the acrylic sheet." },
    { highlight: '#export-svg',
      page: "Then click SVG, for a flat drawing the cutter can follow.",
      say: "Then click S V G, for a flat drawing the cutter can follow." },
    { dialog: SVG_BOX, highlight: inDialog('ok'),
      say: "It's saved the same way. Check the name, and click Save." },
    { highlight: '#export-png',
      say: "P N G saves a picture of the view as it looks now, to show a colleague or a family." },
    { before: all(setParam('type_of_keyguard', '3D-Printed'), closeSections(), view('fit')), highlight: '#viewport',
      page: "Open the STL file in your slicer, print the keyguard, and try it on the tablet.",
      say: "Open the S T L file in your slicer, and print the keyguard. Most print with their " +
           "back on the build plate. Then try it on the tablet. Most keyguards take a couple of tries." },
    { say: "{next}" },
  ],
};
