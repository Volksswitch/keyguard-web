// How-to video 7.8: keyguard frames. From Ken's website page "Keyguard Frame": a frame
// replaces a case's screen protector, whose opening is often only slightly larger than the
// screen, or makes keyguards quick to swap or flip up; measure the screen protector for the
// case opening settings; generate the frame and the keyguard one at a time. Tightness of fit
// follows keyguard_v97.scad (the value is added in millimeters); the website's "10 = 1 mm"
// is out of date (TODO.md).
import { all, view, openSection, setParam, row, around, scrollTo, closeSections } from '../helpers.mjs';

export default {
  id: '7.8-frame',
  project: { dir: 'Documents/video-samples/advanced', skill: 'advanced' },
  trouble: [
    "A keyguard can't be thicker than its frame.",
    "The unequal case opening settings have no effect on a keyguard frame.",
  ],
  steps: [
    { before: all(closeSections(), view('fit')), highlight: '#viewport',
      page: "A frame replaces a case's screen protector, and holds a smaller keyguard.",
      say: "Some cases have a screen protector whose opening is only a little bigger than the screen. A " +
           "keyguard to fit there would need a very thin, fragile edge. A keyguard frame replaces the screen " +
           "protector, and holds a smaller keyguard. A frame also makes keyguards quick to swap, or to flip up." },
    { before: openSection('Tablet Case'), ringBox: around(row('height_of_opening_in_case'), row('case_opening_corner_radius')),
      page: "Measure the screen protector, with its corner curve. That's the frame's outside.",
      say: "Measure the screen protector you're replacing, including the curve of its corners, and enter " +
           "it as the case opening. That becomes the outside of the frame." },
    { before: all(openSection('Keyguard Frame Info'), setParam('have_a_keyguard_frame', 'yes')),
      highlight: row('have_a_keyguard_frame'),
      say: "In Keyguard Frame Info, set have a keyguard frame to yes." },
    { before: all(openSection('Keyguard Basics'), setParam('generate', 'keyguard frame'),
        openSection('Keyguard Frame Info'), setParam('keyguard_height', 145), setParam('keyguard_width', 215),
        setParam('show_keyguard_with_frame', 'yes'), view('fit'), scrollTo(row('keyguard_width'))),
      ringBox: around(row('keyguard_height'), row('keyguard_width')),
      page: "In Keyguard Frame Info, set have a keyguard frame to yes, and size the keyguard inside it.",
      say: "Keyguard height and keyguard width size the keyguard inside it. Set generate to keyguard " +
           "frame, and show keyguard with frame to yes, to see both at once. A smaller keyguard leaves more " +
           "frame. Its openings stay over the screen, whatever its size." },
    { before: scrollTo(row('slide_keyguard_horizontally')),
      ringBox: around(row('slide_keyguard_horizontally'), row('slide_keyguard_vertically')),
      say: "Slide keyguard moves it within the frame. The openings stay over the screen." },
    { before: scrollTo(row('mount_keyguard_with')), highlight: row('mount_keyguard_with'),
      page: "Hold the keyguard with snap-in tabs, or with posts so it can flip up.",
      say: "The keyguard is held with snap-in tabs, or with posts, so it can flip up out of the way." },
    { before: scrollTo(row('keyguard_vertical_tightness_of_fit')),
      ringBox: around(row('keyguard_vertical_tightness_of_fit'), row('keyguard_horizontal_tightness_of_fit')),
      page: "Tightness of fit makes the keyguard a little taller or wider, in millimeters.",
      say: "If it's loose or tight in the frame, the two tightness of fit settings make the keyguard a " +
           "little taller or wider, in millimeters. A larger number fits tighter." },
    { before: all(setParam('show_keyguard_with_frame', 'no'), openSection('Keyguard Basics'),
        setParam('generate', 'keyguard'), view('fit')), highlight: row('generate'),
      page: "Export the frame and the keyguard one at a time, with generate.",
      say: "Export them one at a time: generate the keyguard frame and export it, then the keyguard, and " +
           "export again. {next}" },
  ],
};
