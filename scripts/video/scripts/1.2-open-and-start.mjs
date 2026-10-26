// How-to video 1.2: opening the app and starting a project.
//
// It starts from the app as a first-time visitor sees it. The browser's folder picker and
// its permission question can't be photographed (they belong to the browser, not the
// page), so the narration describes them over the Open Project button. The empty folder is
// handed to the app the way sample-project.mjs does, and from there the app does its own
// work: it offers to set the folder up, and opens the project.
import { all, click, folder, ready, around } from '../helpers.mjs';

export default {
  id: '1.2-open-and-start',
  project: { none: true },
  trouble: [
    "If nothing happens when you click Open Project, or the app asks you to use Chrome or " +
    "Edge, you're in another browser. Safari and Firefox can't open a project folder.",
    "If the browser asks again for access to the folder, choose Allow, or Allow on every visit.",
  ],
  steps: [
    { page: "Open keyguard.volksswitch.org in Chrome or Edge. There's nothing to install.",
      say: "Open the Keyguard Designer in Chrome or Edge, at keyguard dot volksswitch dot org. " +
           "There's nothing to install, and no account to make." },
    { say: "You can install it from the browser, too, so it opens in its own window. Look for the " +
           "install icon at the end of the address bar." },
    { highlight: '#open-project-btn',
      page: "Make a new, empty folder, then click Open Project.",
      say: "Your work lives in a project folder on your computer. Make a new, empty folder first. " +
           "Then click Open Project." },
    { highlight: '#open-project-btn',
      say: "Your browser asks you to choose the folder, then asks whether the app may edit the " +
           "files in it. Allow it. If the browser offers Allow on every visit, choose that, and " +
           "it won't ask again." },
    { before: all(folder({ empty: true }), click('#open-project-btn')), highlight: '#setup-modal',
      page: "The folder is empty, so the app offers to set it up. Click Set it up.",
      say: "The folder is empty, so the app offers to set it up. It names the folder, so you can " +
           "catch one chosen by mistake. Click Set it up." },
    { before: all(click('#setup-go'), ready({ preset: null, skill: null })), highlight: '#project-folder-label',
      page: "The app adds the keyguard designer file and a file for extra openings, then opens the project.",
      say: "The app adds the keyguard designer file, and a file for extra openings. It never " +
           "replaces anything already in the folder. Then it opens the project." },
    { highlight: '#viewport',
      say: "The keyguard you see is the design default values: a simple grid keyguard to start from." },
    { highlight: '#open-project-btn',
      page: "Next time, the app remembers the folder. Click the same button to open it again.",
      say: "Next time, the app remembers the folder. Click this button to open it again, or to " +
           "switch to another project." },
    { say: "Put the screenshots of the AAC app in this folder too. The app finds them on its own. {next}" },
  ],
};
