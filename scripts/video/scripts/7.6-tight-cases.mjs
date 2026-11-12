// How-to video 7.6: tight cases, there's no free lunch. What the number means follows
// keyguard_v97.scad (Ken, 11 Nov 2026): a band of plastic measured in from the keyguard's
// edge, of which only the part beyond the existing gap reaches over the screen; nothing on
// the app moves, so the bar opening and the outer cells at that edge get smaller. Ken's
// website (hub, Tablet Case): "there's no free lunch. Adding plastic will make your keyguard
// more sturdy, but it will also result in losing access to active areas of your app." The
// website's "from the edge of the screen inward" is to be corrected (TODO.md).
import { all, view, openSection, setParam, around, row, closeUp, scrollTo, closeSections } from '../helpers.mjs';

export default {
  id: '7.6-tight-cases',
  project: { dir: 'Documents/video-samples/advanced', skill: 'advanced' },
  trouble: [
    "Use as little as the keyguard needs to be strong enough.",
  ],
  steps: [
    { before: all(closeSections(), view('top')), highlight: '#viewport',
      page: "When a case opening is barely bigger than the screen, the keyguard's edge there is thin.",
      say: "When a case opening is barely bigger than the screen, the keyguard's edge there is a thin " +
           "strip of plastic, and it can break." },
    { before: all(openSection('Tablet Case'), scrollTo(row('bottom_edge_compensation_for_tight_cases'))),
      ringBox: around(row('top_edge_compensation_for_tight_cases'), row('right_edge_compensation_for_tight_cases')),
      page: "In Tablet Case, compensation for tight cases adds plastic at one edge.",
      say: "In Tablet Case, the four compensation for tight cases settings add plastic at one edge each: " +
           "top, bottom, left and right." },
    { before: all(setParam('top_edge_compensation_for_tight_cases', 10), view('top')),
      highlight: row('top_edge_compensation_for_tight_cases'),
      page: "Each is a band of plastic, in millimeters, measured in from the keyguard's edge.",
      say: "Each one is a band of plastic, in millimeters, measured in from the edge of the keyguard. " +
           "The part of it that's already over the case adds nothing; the rest reaches over the screen. " +
           "Here, 10 at the top." },
    { before: closeUp(0.5, 0.2, 6), highlight: '#viewport',
      page: "There's no free lunch: nothing on the app moves, so the openings at that edge get smaller.",
      say: "But there's no free lunch. Nothing on the app moves, so the extra plastic comes out of the " +
           "openings at that edge. Here the message bar's opening is less than half as tall. With more, the top row of " +
           "cells gets smaller too. A stronger keyguard costs your student some of what they can see and reach." },
    { before: all(setParam('top_edge_compensation_for_tight_cases', 0), view('top')), highlight: '#viewport',
      say: "So use as little as the keyguard needs to be strong enough, and check the openings at that " +
           "edge against the screenshot. {next}" },
  ],
};
