// How-to video 5.1: printing on its face. From the website page "Printing Your Keyguard on
// Its Face": a keyguard normally prints with its back on the build plate; face down gives a
// smoother top, and suits a sloped edge, but only when the top surface is flat.
import { all, view, openSection, setParam, row, closeSections } from '../helpers.mjs';

// The screenshot is turned off first: seen from below, it would show through mirrored.
const noScreenshot = all(openSection('Special Actions and Settings'), setParam('include_screenshot', 'no'));

export default {
  id: '5.1-printing',
  trouble: [
    "If a face-down print comes loose from the plate, the rails may be too narrow to hold it. Print it back down instead.",
  ],
  steps: [
    { before: all(noScreenshot, closeSections(), view('bottom')), highlight: '#viewport',
      page: "Most keyguards print with their back on the build plate.",
      say: "Most keyguards print with their back on the printer's build plate. That needs little or no " +
           "support material, and holds the print to the plate well." },
    { before: view('top'), highlight: '#viewport',
      page: "Printing face down gives a smoother top, and suits a keyguard with a sloped edge.",
      say: "Printing it face down, with the top on the plate, gives a smoother top, especially on a " +
           "smooth build sheet. It also suits a keyguard with a sloped edge." },
    { before: openSection('Keyguard Basics'), highlight: row('screen_area_thickness'),
      page: "Face down only works if the top is flat: the screen area as thick as the keyguard.",
      say: "Face down only works if the top is flat. The screen area thickness has to match the " +
           "keyguard thickness." },
    { before: openSection('Special Actions and Settings'), highlight: row('cell_edge_chamfer'),
      page: "The rails between openings need to be wide, with chamfered edges, to hold to the plate.",
      say: "The rails between the openings need to be wide enough, with chamfered edges, to hold to " +
           "the plate." },
    { before: all(closeSections(), view('fit')), highlight: '#viewport',
      page: "Nothing raised on top: no ridges, no raised tabs, no clip-on strap pedestals.",
      say: "And nothing can stand up from the top: no ridges, no raised tabs, and no clip-on strap " +
           "pedestals." },
    { say: "If your keyguard passes, turn it over in your slicer before you slice it. {next}" },
  ],
};
