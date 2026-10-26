// How-to video 4.4: showing more settings, with the skill level.
import { all, view, skill, closeSections, openSettings, closeSettings } from '../helpers.mjs';

export default {
  id: '4.4-skill-levels',
  project: { skill: 'beginner' },
  trouble: [
    "If a setting a video or the manual mentions isn't in the list, raise the skill level.",
  ],
  steps: [
    { before: all(closeSections(), view('fit')), highlight: '#skill-select',
      page: "The skill level decides how many settings the Customizer shows.",
      say: "The skill level decides how many settings the Customizer shows." },
    { highlight: '#cust-sections',
      page: "Beginner shows the settings for a basic grid keyguard.",
      say: "Beginner shows the settings a basic grid keyguard needs." },
    { before: skill('intermediate'), highlight: '#cust-sections',
      page: "Intermediate adds the screenshot, pixel measurements, mounting and split keyguards.",
      say: "Intermediate adds the screenshot, pixel measurements, more grid settings, mounting and " +
           "split keyguards." },
    { before: skill('advanced'), highlight: '#cust-sections',
      page: "Advanced shows every setting, including frames, cell inserts and engraved text.",
      say: "Advanced shows every setting, including frames, cell inserts and engraved text." },
    { before: openSettings('general'), highlight: '#settings-panel',
      say: "You can set it here too, in Settings, General." },
    { before: closeSettings(), highlight: '#skill-select',
      say: "The skill level only changes what you see. A design keeps every value, whatever the level. {next}" },
  ],
};
