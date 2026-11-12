// How-to video 7.9: measuring a case for clip-on straps. From Ken's website page "Mounting
// with Clip-on Straps": case width, height, thickness and case to screen depth go in Tablet
// Case; print two to four clips; "never rely solely on the clips to suspend the tablet."
// The clips' reach comes from the case's width or height less the opening (keyguard_v97.scad).
import { all, view, openSection, setParam, row, around, zoom } from '../helpers.mjs';

export default {
  id: '7.9-clip-on-straps',
  project: { dir: 'Documents/video-samples/advanced', skill: 'advanced' },
  trouble: [
    "For a tight case, use a wider clip, or tell the keyguard designer the case is a couple of millimeters wider than it is.",
    "Never rely on the clips alone to hold the tablet up.",
  ],
  steps: [
    { before: all(openSection('Mounting Method'), setParam('mounting_method', 'Clip-on Straps'), view('fit')),
      highlight: row('mounting_method'),
      page: "Clip-on straps: clips over the case's edges, joined by elastic bands behind it.",
      say: "Clip-on straps hold the keyguard with clips that hook over the edges of the case, joined by " +
           "elastic bands around the back. Choose Clip-on Straps in Mounting Method." },
    { before: openSection('Tablet Case'), ringBox: around(row('case_height'), row('case_thickness')),
      page: "The clips are sized from the case: measure its height, width and thickness.",
      say: "The clips are sized from the case itself. Measure the case's overall height and width, and " +
           "its thickness." },
    { highlight: row('case_to_screen_depth'),
      page: "And the case to screen depth: how far the screen sits below the case's front.",
      say: "And the case to screen depth: how far down the screen sits below the front of the case. The " +
           "case's corner radius doesn't matter for clips." },
    { before: openSection('Clip-on Straps Info'), highlight: '.section[data-section="Clip-on Straps Info"]',
      page: "Clip-on Straps Info sets where the clips go, how wide they are, and how far apart.",
      say: "Clip-on Straps Info sets where the clips go, how wide they are, and how far apart." },
    { before: all(openSection('Special Actions and Settings'), setParam('include_screenshot', 'no'),
        openSection('Keyguard Basics'), setParam('generate', 'horizontal clip'), view('fit'), zoom(6)),
      highlight: row('generate'),
      page: "Set generate to horizontal clip, and export. Print two to four.",
      say: "To make the clips, set generate to horizontal clip, and export it. Print two to four." },
    { before: all(openSection('Tablet Case'), setParam('case_width', 300), view('fit'), zoom(6)), highlight: '#viewport',
      say: "A wider case needs a clip with a longer reach, so measure carefully. A clip that's too short " +
           "won't reach the keyguard." },
    { before: all(setParam('case_width', 275), openSection('Special Actions and Settings'), setParam('include_screenshot', 'yes'),
        openSection('Keyguard Basics'), setParam('generate', 'keyguard'), view('fit')),
      highlight: '#viewport',
      say: "The clips hold the keyguard on the tablet. Never rely on them alone to hold the tablet up. {next}" },
  ],
};
