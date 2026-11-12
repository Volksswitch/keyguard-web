// How-to video 7.2: inset keyguards. The sample (Documents/video-samples/inset/) is the
// WordPower 42 screenshot shrunk inside a white border, 120 pixels at each side and 90 at
// top and bottom, as TouchChat's keyguard inset does; its pixel layout is measured from the
// corner of the whole screenshot. A stand-in, so no client's design is shown (Ken, 11 Nov
// 2026). From the hub's Keyguard Inset Info paragraph: hide app region is for checking the
// inset sizes against the screenshot.
import { all, view, openSection, setParam, row, around, closeSections } from '../helpers.mjs';

export default {
  id: '7.2-inset',
  project: { dir: 'Documents/video-samples/inset', preset: 'WordPower 42 inset', skill: 'advanced' },
  trouble: [
    "If the cut-out doesn't match the shrunken app, measure the border again.",
    "Set hide app region and hide grid region back to no before you export.",
  ],
  steps: [
    { before: all(closeSections(), view('top')), highlight: '#viewport',
      page: "Some apps can shrink to leave a white border around the screen: a keyguard inset.",
      say: "Some AAC apps, such as TouchChat, can shrink to leave a white border around the screen. It's " +
           "called a keyguard inset. The border gives the keyguard a wider, sturdier edge." },
    { before: openSection('Keyguard Inset Info'), highlight: row('keyguard_inset_mode'),
      page: "In Keyguard Inset Info, set keyguard inset mode to yes.",
      say: "In Keyguard Inset Info, set keyguard inset mode to yes." },
    { ringBox: around(row('left_inset_size_in_px'), row('bottom_inset_size_in_px')),
      page: "Measure the border, in pixels or millimeters. Left is copied to the right, bottom to the top.",
      say: "Measure the border in the screenshot, in pixels or millimeters. The left inset is copied to " +
           "the right side, and the bottom to the top. The bottom edge is usually the easier one to find." },
    { before: all(setParam('hide_app_region', 'yes'), view('top')), highlight: '#viewport',
      page: "Set hide app region to yes. If the cut-out matches the shrunken app, the inset is right.",
      say: "To check the numbers, set hide app region to yes. The app's area is cut out of the keyguard. " +
           "If the cut-out matches the edges of the shrunken app, the inset is right." },
    { before: all(setParam('hide_app_region', 'no'), openSection('App Layout in px')),
      highlight: '.section[data-section="App Layout in px"]',
      page: "Measure the bars in pixels as always, from the corner of the whole screenshot.",
      say: "Measure the bars in pixels just as you always have, from the corner of the whole screenshot, " +
           "not the corner of the app." },
    { before: all(openSection('Grid Special Settings'), setParam('hide_grid_region', 'yes'), view('top')),
      highlight: '#viewport',
      say: "Hide grid region works the same way for the grid, and padding lines it up, just as on an " +
           "app that fills the screen." },
    { before: all(setParam('hide_grid_region', 'no'), view('top')), highlight: '#viewport',
      say: "Set it back to no, and every opening sits over its button. {next}" },
  ],
};
