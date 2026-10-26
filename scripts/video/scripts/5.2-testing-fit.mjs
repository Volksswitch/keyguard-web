// How-to video 5.2: testing the fit. From the website pages "Testing the Fit of Your
// Keyguard" and "Handling Tight Fitting Cases": first two layers only prints a 0.4 mm mask
// to try on the tablet, and the tight-case settings add plastic to thin edges.
import { all, view, openSection, setParam, row, closeSections } from '../helpers.mjs';

export default {
  id: '5.2-testing-fit',
  trouble: [
    "Set first two layers only back to no before you print the real keyguard.",
  ],
  steps: [
    { before: all(closeSections(), view('top')), highlight: '#viewport',
      page: "Check the design against a screenshot before you print anything.",
      say: "Check the design against a screenshot first. That catches openings in the wrong place, " +
           "but it can't show how the keyguard fits the case." },
    { before: all(openSection('Special Actions and Settings'), setParam('first_two_layers_only', 'yes'), view('fit')),
      highlight: row('first_two_layers_only'),
      page: "Set first two layers only to yes, to print a thin mask that tests the fit.",
      say: "To test the fit without printing the whole keyguard, set first two layers only to yes. It " +
           "prints a thin, sturdy mask, 0.4 millimeters thick, in a fraction of the time." },
    { highlight: '#viewport',
      page: "Put the mask in the case, over the app, and check every opening and the fit.",
      say: "Put the mask in the case, over the app. Check that every opening sits over its button, and " +
           "that it fits the case opening." },
    { before: all(setParam('first_two_layers_only', 'no'), openSection('Tablet Case')),
      highlight: row('top_edge_compensation_for_tight_cases'),
      page: "For a case that hugs the screen, the tight case settings in Tablet Case thicken thin edges.",
      say: "If the case fits right against the screen, the keyguard's edges can come out thin. The tight " +
           "case settings, in Tablet Case, add plastic to each edge." },
    { highlight: '#save-preset-btn',
      page: "Change what's needed, save the preset, and print again.",
      say: "Change what's needed, save the preset, and print again. Set first two layers only back to " +
           "no for the real keyguard. {next}" },
  ],
};
