// How-to video 7.7: mounting with posts. From Ken's website page "Mounting with Posts": only
// for cases that have a keyguard mount of their own (PRC's Via Pro); measure the case opening
// from the inside edges of the maker's mount; "Take your time with this measurement." The
// sample's upper message bar is open, so the keyguard designer makes two short posts
// instead of one across the top (keyguard_v97.scad).
import { all, view, openSection, setParam, row, around, onKeyguard, closeSections } from '../helpers.mjs';

export default {
  id: '7.7-posts',
  project: { dir: 'Documents/video-samples/advanced', skill: 'advanced' },
  trouble: [
    "If no posts appear, check that have a case is yes in Tablet Case.",
    "A mini tab height above 0 needs supports turned on in your slicer.",
  ],
  steps: [
    { before: all(openSection('Mounting Method'), setParam('mounting_method', 'Posts'), view('fit')),
      highlight: row('mounting_method'),
      page: "For a case with its own keyguard mount, choose Posts in Mounting Method.",
      say: "Some AAC devices come in a case with a keyguard mount built in, such as P R C's Via Pro. The " +
           "keyguard snaps into it on posts. Choose Posts in Mounting Method." },
    { before: openSection('Tablet Case'), ringBox: around(row('height_of_opening_in_case'), row('width_of_opening_in_case')),
      page: "Measure the case opening from the inside edges of the maker's mount.",
      say: "Measure the case opening from the inside edges of the maker's mount." },
    { before: all(openSection('Posts Info'), view('top')),
      highlight: row('mount_to_top_of_opening_distance'),
      page: "Mount to top of opening distance: from the top of the case opening to the center of the posts.",
      say: "Mount to top of opening distance runs from the top edge of the case opening to the center of " +
           "where the posts snap in. The keyguard's top is trimmed there. Take your time with this " +
           "measurement, or the keyguard won't fit properly at the bottom." },
    { ringBox: around(row('post_diameter'), row('post_length')),
      page: "Copy the posts of the maker's keyguard, if you have one.",
      say: "If you have the maker's keyguard, copy its posts: their diameter and their length. A post as " +
           "thick as the keyguard is flush with both faces. Otherwise, print a test, and adjust." },
    { highlight: row('notch_in_post'),
      say: "Add a notch in the post if the maker's keyguard has one." },
    { before: all(setParam('add_mini_tabs', 'yes'), view('fit')), highlight: row('add_mini_tabs'),
      page: "Mini tabs hold the bottom edge. A height above 0 needs supports in your slicer.",
      say: "Mini tabs hold the bottom edge in the mount. A mini tab height above zero means turning on " +
           "supports when you slice it." },
    { before: all(closeSections(), view('top')), ringBox: onKeyguard([0, 0, 1, 0.1]),
      say: "With the message bar open, as here, there are two short posts instead of one long one. If they " +
           "end up on thin legs, compensation for tight cases adds plastic at the sides, but there's no " +
           "free lunch: you lose the ends of the message bar. {next}" },
  ],
};
