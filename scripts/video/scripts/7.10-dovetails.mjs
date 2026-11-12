// How-to video 7.10: getting the dovetails right. From Ken's website page "Splitting your
// keyguard into two pieces for easier printing": dovetails work best on rails at least 6 mm
// wide, and can be used on rails as thin as 4; slide the dovetails to fix slivers that are
// disconnected or hanging on by a thread; tightness changes only the second half; print a
// test joint once and write the value down. Video 3.7 has the basics.
import { all, view, openSection, setParam, row, closeUp, centerOn, pan, clearConsole } from '../helpers.mjs';

// The split line is drawn pink: the close-up slides it to the middle, lifts the top edge into
// view, then hides the line, which would cover the teeth. The view stays put while settings
// change, so the slide step needs no aiming of its own.
const atJoint = () => all(closeUp(0.54, 0.08, 16), centerOn([250, 170, 170], { axis: 'x' }),
  pan([0.5, 0.8], [0.5, 0.5]), openSection('Split Keyguard Info'), setParam('show_split_line', 'no'));

export default {
  id: '7.10-dovetails',
  project: { dir: 'Documents/video-samples/advanced', skill: 'advanced' },
  trouble: [
    "Lower tightness of dovetail joint if the halves won't push together; raise it if they're loose.",
    "Only the second half changes with tightness, so it's the only half to reprint.",
  ],
  steps: [
    { before: all(clearConsole(), openSection('Split Keyguard Info'), setParam('show_split_line', 'yes'),
        setParam('split_line_type', 'dovetails'), view('top')), highlight: '#viewport',
      page: "Show the split line with dovetails, and check where it falls.",
      say: "Video 3.7 shows how to split a keyguard. Here's how to get a dovetail joint right. Show the " +
           "split line, with dovetails." },
    { highlight: '#console-wrap',
      page: "The Console says how far the split is from each side, to compare with your printer.",
      say: "The Console says how far the split is from each side, to compare with your printer's build plate." },
    { highlight: row('split_line_location'),
      page: "Dovetails work best on a rail at least 6 millimeters wide, and as thin as 4.",
      say: "At zero, the split falls on a rail near the middle. Split line location moves it. Dovetails " +
           "work best on a rail at least 6 millimeters wide, and can be used on rails as thin as 4." },
    { before: all(openSection('Special Actions and Settings'), setParam('include_screenshot', 'no'),
        openSection('Keyguard Basics'), setParam('generate', 'first half of keyguard'),
        atJoint()), highlight: '#viewport',
      page: "Hide the split line, then look where the joint meets the edges and open bars.",
      say: "Set generate to the first half, and hide the split line again so it doesn't cover the teeth. " +
           "Look closely where the joint meets the top and bottom edges, and passes open bars. Watch for " +
           "a sliver of plastic that's cut loose, or hanging on by a thread." },
    { before: setParam('slide_dovetails', 1.5),
      highlight: row('slide_dovetails'),
      page: "Slide dovetails, or change dovetail width, until the sliver is gone.",
      say: "Slide dovetails moves the teeth along the joint, and dovetail width changes their size. Change " +
           "them until the sliver is gone." },
    { highlight: row('tightness_of_dovetail_joint'),
      page: "Tightness of dovetail joint changes only the second half, the only half to reprint.",
      say: "Tightness of dovetail joint changes only the second half, so it's the only half to reprint. " +
           "Lower it if the halves won't push together, and raise it if they're loose. A looser joint " +
           "leaves room for glue." },
    { before: all(openSection('Special Actions and Settings'), setParam('include_screenshot', 'yes'),
        openSection('Keyguard Basics'), setParam('generate', 'keyguard'), view('top')), highlight: '#viewport',
      say: "Print a small test joint first, and write down the tightness that fits. It holds for every " +
           "split keyguard from your printer. Two-part epoxy makes a strong joint. {next}" },
  ],
};
